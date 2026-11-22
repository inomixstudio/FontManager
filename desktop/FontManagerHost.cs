using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace FontManagerDesktop
{
    internal static class NativeWindowHelpers
    {
        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr handle);

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr handle, int command);

        /// <summary>Cari instans lain yang punya jendela dan aktifkan.</summary>
        internal static bool ActivateExistingInstance()
        {
            Process current = Process.GetCurrentProcess();
            foreach (Process process in Process.GetProcessesByName(current.ProcessName))
            {
                try
                {
                    if (process.Id == current.Id) continue;
                    IntPtr handle = process.MainWindowHandle;
                    if (handle == IntPtr.Zero) continue;
                    ShowWindow(handle, 9);
                    SetForegroundWindow(handle);
                    return true;
                }
                catch { }
                finally { process.Dispose(); }
            }
            return false;
        }

        /// <summary>
        /// Instans tanpa jendela yang sudah berjalan cukup lama dianggap macet
        /// (mis. servernya mati atau inisialisasi gagal). Instans seperti itu
        /// memegang mutex satu-instans sehingga peluncuran berikutnya tidak
        /// pernah membuka jendela — bersihkan agar aplikasi bisa dijalankan lagi.
        /// </summary>
        internal static int TerminateStaleInstances(int minimumAgeSeconds)
        {
            Process current = Process.GetCurrentProcess();
            int terminated = 0;
            foreach (Process process in Process.GetProcessesByName(current.ProcessName))
            {
                try
                {
                    if (process.Id == current.Id) continue;
                    if (process.MainWindowHandle != IntPtr.Zero) continue;
                    double ageSeconds = (DateTime.Now - process.StartTime).TotalSeconds;
                    if (ageSeconds < minimumAgeSeconds) continue;
                    process.Kill();
                    process.WaitForExit(3000);
                    terminated++;
                }
                catch { }
                finally { process.Dispose(); }
            }
            return terminated;
        }
    }

    internal static class Program
    {
        [STAThread]
        private static void Main(string[] args)
        {
            ServicePointManager.Expect100Continue = false;
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            AppLog.AttachUnhandledHandlers();

            string url = args.Length == 0 ? null : args[0];

            // Mutex satu-instans. Bila instans lain sudah ada, aktifkan jendelanya.
            // Bila instans itu macet tanpa jendela (pernah terjadi setelah server
            // mati mendadak), hentikan dan ambil alih agar aplikasi tidak pernah
            // "tidak mau terbuka" lagi.
            Mutex singleInstance = null;
            bool ownsMutex = false;
            for (int attempt = 0; attempt < 12 && !ownsMutex; attempt++)
            {
                Mutex candidate = new Mutex(true, "FontManager.Desktop.SingleInstance", out ownsMutex);
                if (ownsMutex)
                {
                    singleInstance = candidate;
                    break;
                }
                candidate.Dispose();

                // Beri kesempatan instans yang baru mulai untuk menampilkan jendela.
                if (NativeWindowHelpers.ActivateExistingInstance())
                {
                    return;
                }
                Thread.Sleep(400);

                // Setelah ~2 detik tanpa jendela, anggap instans lain macet.
                if (attempt >= 5 && NativeWindowHelpers.TerminateStaleInstances(2) > 0)
                {
                    Thread.Sleep(400);
                }
            }

            if (!ownsMutex)
            {
                AppLog.Write("Tidak dapat memperoleh mutex satu-instans; keluar.");
                return;
            }

            try
            {
                Application.Run(new MainForm(url));
            }
            catch (Exception error)
            {
                AppLog.Write("Kesalahan fatal: " + error);
                MessageBox.Show(error.Message, "Font Manager tidak dapat dijalankan", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                if (singleInstance != null) singleInstance.ReleaseMutex();
                GC.KeepAlive(singleInstance);
            }
        }
    }

    /// <summary>Log sederhana agar kegagalan peluncuran bisa didiagnosis.</summary>
    internal static class AppLog
    {
        internal static readonly string FilePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "FontManager",
            "error.log");

        internal static void Write(string message)
        {
            try
            {
                string directory = Path.GetDirectoryName(FilePath);
                if (!String.IsNullOrEmpty(directory)) Directory.CreateDirectory(directory);
                File.AppendAllText(
                    FilePath,
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "  " + message + Environment.NewLine);
            }
            catch { }
        }

        internal static void AttachUnhandledHandlers()
        {
            Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
            Application.ThreadException += (sender, e) => Write("UI exception: " + e.Exception);
            AppDomain.CurrentDomain.UnhandledException += (sender, e) => Write("Unhandled: " + e.ExceptionObject);
        }
    }

    internal sealed class MainForm : Form
    {
        private readonly WebView2 webView;
        private readonly Label loadingLabel;
        private readonly string attachedUrl;
        private Uri appUri;
        private Process serverProcess;
        private bool ownsServer;
        private string serverOutput = "";

        internal MainForm(string url)
        {
            attachedUrl = IsLocalAppUrl(url) ? url.TrimEnd('/') : null;
            if (attachedUrl != null) appUri = new Uri(attachedUrl + "/");
            Text = "Font Manager";
            try
            {
                Icon appIcon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
                if (appIcon != null) Icon = appIcon;
            }
            catch { }
            StartPosition = FormStartPosition.CenterScreen;
            MinimumSize = new Size(900, 620);
            Size = new Size(1440, 940);
            BackColor = Color.FromArgb(10, 12, 17);
            AutoScaleMode = AutoScaleMode.Dpi;

            loadingLabel = new Label();
            loadingLabel.Dock = DockStyle.Fill;
            loadingLabel.TextAlign = ContentAlignment.MiddleCenter;
            loadingLabel.ForeColor = Color.FromArgb(126, 134, 154);
            loadingLabel.BackColor = BackColor;
            loadingLabel.Font = new Font("Segoe UI", 10.5f);
            loadingLabel.Text = "Menyiapkan Font Manager…";
            Controls.Add(loadingLabel);

            webView = new WebView2();
            webView.Dock = DockStyle.Fill;
            webView.BackColor = BackColor;
            webView.Visible = false;
            Controls.Add(webView);
            webView.BringToFront();

            WindowState = FormWindowState.Normal;
            ShowInTaskbar = true;
            Shown += OnShown;
            FormClosed += OnFormClosed;
        }

        private async void OnShown(object sender, EventArgs e)
        {
            try
            {
                Show();
                Activate();
                string url = attachedUrl;
                if (url == null)
                {
                    SetLoading("Menjalankan server lokal…");
                    url = await StartServerAsync();
                }
                SetLoading("Memuat antarmuka…");
                await InitializeWebViewAsync(url);
                Show();
                Activate();
            }
            catch (Exception error)
            {
                string details = error.Message;
                if (!String.IsNullOrWhiteSpace(serverOutput))
                {
                    details += Environment.NewLine + Environment.NewLine + serverOutput;
                }
                AppLog.Write("Gagal menjalankan aplikasi: " + details);
                MessageBox.Show(this, details, "Font Manager tidak dapat dijalankan", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Close();
            }
        }

        /// <summary>
        /// Bila server lokal berhenti mendadak, jendela akan menampilkan halaman
        /// kosong tanpa penjelasan. Tutup aplikasi dengan pesan jelas agar tidak
        /// menyisakan instans tanpa jendela yang menghalangi peluncuran berikutnya.
        /// </summary>
        private void OnServerExited(object sender, EventArgs e)
        {
            if (IsDisposed) return;
            try
            {
                BeginInvoke(new Action(() =>
                {
                    if (IsDisposed) return;
                    AppLog.Write("Server lokal berhenti mendadak." + Environment.NewLine + serverOutput);
                    MessageBox.Show(
                        this,
                        "Server lokal berhenti. Jalankan Font Manager kembali." +
                            (String.IsNullOrWhiteSpace(serverOutput) ? "" : Environment.NewLine + Environment.NewLine + serverOutput),
                        "Font Manager berhenti",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error);
                    Close();
                }));
            }
            catch { }
        }

        private void SetLoading(string message)
        {
            if (loadingLabel.IsDisposed) return;
            if (loadingLabel.InvokeRequired)
            {
                loadingLabel.BeginInvoke(new Action(() => loadingLabel.Text = message));
                return;
            }
            loadingLabel.Text = message;
        }

        private async Task<string> StartServerAsync()
        {
            string appDirectory = GetAppDirectory();
            string serverFile = Path.Combine(appDirectory, "server.js");
            if (!File.Exists(serverFile))
            {
                throw new FileNotFoundException("File server.js tidak ditemukan di folder aplikasi.", serverFile);
            }

            int requestedPort = GetAvailablePort();
            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = "node.exe";
            startInfo.Arguments = "\"" + serverFile + "\"";
            startInfo.WorkingDirectory = appDirectory;
            startInfo.UseShellExecute = false;
            startInfo.CreateNoWindow = true;
            startInfo.RedirectStandardOutput = true;
            startInfo.RedirectStandardError = true;
            startInfo.EnvironmentVariables["FM_NO_OPEN"] = "1";
            startInfo.EnvironmentVariables["PORT"] = requestedPort.ToString();
            startInfo.EnvironmentVariables["FM_PARENT_PID"] = Process.GetCurrentProcess().Id.ToString();

            try
            {
                serverProcess = Process.Start(startInfo);
            }
            catch (Exception error)
            {
                throw new InvalidOperationException("Tidak dapat menjalankan Node.js. Pastikan Node.js 18 atau lebih baru sudah terpasang. " + error.Message, error);
            }

            ownsServer = true;
            serverProcess.OutputDataReceived += CaptureServerOutput;
            serverProcess.ErrorDataReceived += CaptureServerOutput;
            serverProcess.EnableRaisingEvents = true;
            serverProcess.Exited += OnServerExited;
            serverProcess.BeginOutputReadLine();
            serverProcess.BeginErrorReadLine();

            int attempts = 0;
            while (attempts < 240)
            {
                if (serverProcess.HasExited)
                {
                    throw new InvalidOperationException("Server Font Manager berhenti saat mulai (kode " + serverProcess.ExitCode + ").");
                }

                for (int port = requestedPort; port < requestedPort + 12; port++)
                {
                    string readyUrl = await CheckServerAsync(port);
                    if (readyUrl != null) return readyUrl;
                }

                await Task.Delay(250);
                attempts++;
            }

            throw new TimeoutException("Server lokal tidak siap setelah 60 detik.");
        }

        private void CaptureServerOutput(object sender, DataReceivedEventArgs e)
        {
            if (String.IsNullOrWhiteSpace(e.Data)) return;
            lock (this)
            {
                serverOutput = (serverOutput + e.Data + Environment.NewLine);
                if (serverOutput.Length > 3000) serverOutput = serverOutput.Substring(serverOutput.Length - 3000);
            }
        }

        private static async Task<string> CheckServerAsync(int port)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:" + port + "/api/status");
            request.Method = "GET";
            request.Timeout = 500;
            request.ReadWriteTimeout = 500;
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync())
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    string body = await reader.ReadToEndAsync();
                    Match match = Regex.Match(body, "\\\"port\\\"\\s*:\\s*(\\d+)");
                    if (response.StatusCode == HttpStatusCode.OK && match.Success)
                    {
                        return "http://127.0.0.1:" + match.Groups[1].Value;
                    }
                }
            }
            catch (WebException) { }
            catch (IOException) { }
            return null;
        }

        private async Task InitializeWebViewAsync(string url)
        {
            string userData = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "FontManager",
                "WebView2");
            Directory.CreateDirectory(userData);

            CoreWebView2EnvironmentOptions options = new CoreWebView2EnvironmentOptions(
                "--disable-extensions --disable-background-networking --no-first-run");
            options.AreBrowserExtensionsEnabled = false;
            CoreWebView2Environment environment = await CoreWebView2Environment.CreateAsync(null, userData, options);
            await webView.EnsureCoreWebView2Async(environment);

            CoreWebView2Settings settings = webView.CoreWebView2.Settings;
            settings.AreDevToolsEnabled = false;
            settings.IsStatusBarEnabled = false;
            settings.IsGeneralAutofillEnabled = false;
            settings.IsPasswordAutosaveEnabled = false;

            appUri = new Uri(url + "/");
            webView.CoreWebView2.NavigationStarting += OnNavigationStarting;
            webView.CoreWebView2.NavigationCompleted += OnNavigationCompleted;
            webView.CoreWebView2.NewWindowRequested += OnNewWindowRequested;
            webView.CoreWebView2.Navigate(appUri.AbsoluteUri);
        }

        private void OnNavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (e.IsSuccess)
            {
                Text = "Font Manager";
                webView.Visible = true;
                webView.BringToFront();
                loadingLabel.Visible = false;
                webView.Focus();
            }
        }

        private void OnNavigationStarting(object sender, CoreWebView2NavigationStartingEventArgs e)
        {
            if (IsAllowedNavigation(e.Uri)) return;
            e.Cancel = true;
            OpenExternal(e.Uri);
        }

        private void OnNewWindowRequested(object sender, CoreWebView2NewWindowRequestedEventArgs e)
        {
            e.Handled = true;
            OpenExternal(e.Uri);
        }

        private bool IsAllowedNavigation(string value)
        {
            Uri uri;
            if (!Uri.TryCreate(value, UriKind.Absolute, out uri)) return false;
            return appUri != null &&
                (uri.Host == "127.0.0.1" || uri.Host == "localhost") &&
                uri.Port == appUri.Port &&
                uri.Scheme == Uri.UriSchemeHttp;
        }

        private static bool IsLocalAppUrl(string value)
        {
            Uri uri;
            return Uri.TryCreate(value, UriKind.Absolute, out uri) &&
                uri.Scheme == Uri.UriSchemeHttp &&
                (uri.Host == "127.0.0.1" || uri.Host == "localhost");
        }

        private static void OpenExternal(string value)
        {
            Uri uri;
            if (!Uri.TryCreate(value, UriKind.Absolute, out uri)) return;
            if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps) return;
            try
            {
                Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute = true });
            }
            catch { }
        }

        private static int GetAvailablePort()
        {
            TcpListener listener = new TcpListener(IPAddress.Loopback, 0);
            listener.Start();
            int port = ((IPEndPoint)listener.LocalEndpoint).Port;
            listener.Stop();
            return port;
        }

        private static string GetAppDirectory()
        {
            DirectoryInfo directory = new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory);
            while (directory != null)
            {
                if (File.Exists(Path.Combine(directory.FullName, "server.js"))) return directory.FullName;
                directory = directory.Parent;
            }
            return AppDomain.CurrentDomain.BaseDirectory;
        }

        private void OnFormClosed(object sender, FormClosedEventArgs e)
        {
            if (!ownsServer || serverProcess == null) return;
            try
            {
                if (!serverProcess.HasExited) serverProcess.Kill();
                serverProcess.Dispose();
            }
            catch { }
        }
    }
}
