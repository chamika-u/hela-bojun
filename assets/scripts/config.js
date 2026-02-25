// Hela Bojun – Admin Configuration
// Default demo credentials: username = admin, password = admin123
// To change the password, replace adminPasswordHash with the SHA-256 hash of your new password.
//   Linux/macOS: echo -n "yournewpassword" | sha256sum
//   Windows PowerShell: (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes("yournewpassword"))) -Algorithm SHA256).Hash.ToLower()

window.APP_CONFIG = {
    adminUsername: 'admin',
    adminPasswordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};
