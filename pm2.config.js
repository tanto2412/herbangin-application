module.exports = {
  apps: [
    // Vite React.js App
    {
      name: 'Herbangin Client',
      script: 'node_modules/vite/bin/vite.js',
      cwd: 'client',
      args: '--port 80',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
      },
    },
    // Express.js Server
    {
      name: 'Herbangin Server',
      script: 'src/server.js',
      cwd: 'server',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        ERROR_FILE: 'error.log',
        FE_HOSTNAME: 'http://localhost',
        PORT: 3000,
        SECRET_KEY: 'herbangin_2024',
      },
    },
  ],
}

// SIG // Begin signature block
// SIG // MIIFfwYJKoZIhvcNAQcCoIIFcDCCBWwCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFKh36NUVsbY2
// SIG // MKZd0wFjQ7efhVxRoIIDHjCCAxowggICoAMCAQICEB6N
// SIG // ToxmF+yDR/n0CGjK1zowDQYJKoZIhvcNAQELBQAwGDEW
// SIG // MBQGA1UEAwwNTXlDZXJ0aWZpY2F0ZTAeFw0yNDAzMDIw
// SIG // MzUzNDdaFw0yNTAzMDIwNDEzNDdaMBgxFjAUBgNVBAMM
// SIG // DU15Q2VydGlmaWNhdGUwggEiMA0GCSqGSIb3DQEBAQUA
// SIG // A4IBDwAwggEKAoIBAQDx41en6myh0DjAGBIJ/vSzlzM3
// SIG // EEf2Rt+1EkJ1u/W5cUbRGy96FNrtDnxGZVX3CIqXCPZb
// SIG // 66x/urDEExOdYmWhEK5yWM7O9zvFfAhJy5ZO/+HGhNGi
// SIG // IqXvzdWAUKbcFIw13l3l0oN3WR/DVJSZ+XuXeFJgMnDI
// SIG // vYwEeGATK++/Nns93MBmTyI/dc/pkEy5EYSORtL5m66G
// SIG // iTPZtTb40myuN8wxQd2GmoQN+bcqx0BqHX5LzYFk1SSG
// SIG // xyE9hm645A4LRqxLT75wSFeHiDUDPDnsRFHYwk+v2Fgj
// SIG // trGrOD8GpGzasngJ4HYRjfYF0RaAxjVp2THwc67sDJ8R
// SIG // ciaIBWSdAgMBAAGjYDBeMA4GA1UdDwEB/wQEAwIHgDAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDAzAYBgNVHREEETAPgg1N
// SIG // eUNlcnRpZmljYXRlMB0GA1UdDgQWBBRt7T4jeWlE/ukv
// SIG // QQgboW+iSxQJVzANBgkqhkiG9w0BAQsFAAOCAQEARmo5
// SIG // 0bdjgrvtZLXCJOgFmclIQqN+GULMUMgNmeW/RZDzhw/r
// SIG // 400nrMDKpihpnhMjsfy9TZHlBqrW/8H/x3eOrY809IoD
// SIG // 2S8K/ltcsFMLwM6RI58M+qRtVV9hXZDFdeeB6NvrV33l
// SIG // FVddCRYeiDrEYDnZXK/evP3frE3eO09HscpwaKnBMOd0
// SIG // ojwkwz9YmJZzJEaPJ3FmAgiFIH3r/X9RqBwWJEcmBxM9
// SIG // iwOfe5CxGaOZ1mIAakEUeUUHEiXLFm1Sk6kOo/k8Msoj
// SIG // 5AyTQ5TiIOT9/BFqkHIOBv+X7omoxspKD1M2ezmW0c9R
// SIG // ag+5QayGoh/c9g840dvy6ixi55IyTDGCAc0wggHJAgEB
// SIG // MCwwGDEWMBQGA1UEAwwNTXlDZXJ0aWZpY2F0ZQIQHo1O
// SIG // jGYX7INH+fQIaMrXOjAJBgUrDgMCGgUAoHgwGAYKKwYB
// SIG // BAGCNwIBDDEKMAigAoAAoQKAADAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUOF9vQt8O
// SIG // reosSK/5pJKcG0G2vcUwDQYJKoZIhvcNAQEBBQAEggEA
// SIG // kv0jLTxmaE+kXoqk1Ynvn95VqjKhE8E2E+Klc119KIu1
// SIG // 3u4QGS5Q0fgVK/n6Tndmr+P+sV31pDoBawWjkHJUrWWl
// SIG // jEEpnevi7ysHvbiKqa4NiaiLvov5T+oTIrf0JZStZM0y
// SIG // hTA0yKCYRUaU5PsCl7duwocami3FTNx1nbQL+6H5blgx
// SIG // UR08XE19/5fmbe4BdPVJ+piZWe9RGgyDmIM2hDQw3iQ3
// SIG // xFcZ0FmvoAvapjVU7f6YbO+9yqGwEdLnkVwyQClOenKn
// SIG // D+FIUhLCsmV/bdh9slbWlAZa6ixvhv9Gm1NTXFaFGp+5
// SIG // 70vFirmnHFjEAewN533w8ptbjux1oCwIYA==
// SIG // End signature block
