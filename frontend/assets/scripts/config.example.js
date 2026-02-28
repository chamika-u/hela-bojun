// Hela Bojun – Admin Configuration Template
// Copy this file to config.js and fill in your credentials.
//   cp assets/scripts/config.example.js assets/scripts/config.js
// To generate a SHA-256 password hash run:
//   echo -n "yourpassword" | sha256sum
// Never commit config.js to version control.
//
// ⚠️  DEMO credentials — change these before deploying to production!
//   Username : admin
//   Password : admin123
//   The hash below is SHA-256("admin123")

window.APP_CONFIG = {
    adminUsername: 'admin',
    adminPasswordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};
