<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - MightyShare</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@500;600;700&display=swap');

        * { box-sizing: border-box; }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px 0 40px;
            line-height: 1.6;
            color: #374151;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(30, 58, 138, 0.12);
        }

        /* ── Header ── */
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #111827 100%);
            padding: 36px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
        }
        .header-logo-wrap {
            position: relative;
            z-index: 1;
        }
        .header-logo-wrap img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: 2px solid rgba(34, 211, 238, 0.4);
            display: block;
            margin: 0 auto 14px;
            object-fit: cover;
        }
        .brand-name {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.3px;
            margin: 0 0 6px;
            line-height: 1;
        }
        .brand-name .mighty { color: #ffffff; }
        .brand-name .share  { color: #f472b6; }
        .header-tagline {
            color: #bfdbfe;
            font-size: 13px;
            margin: 0;
            letter-spacing: 0.3px;
        }

        /* ── Content ── */
        .content {
            padding: 40px 36px;
        }
        .content h1 {
            margin: 0 0 16px;
            color: #111827;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.3;
        }
        .content p {
            margin: 0 0 16px;
            color: #4b5563;
            font-size: 15px;
        }

        /* ── CTA Button ── */
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            margin-top: 24px;
            box-shadow: 0 4px 18px rgba(236, 72, 153, 0.38);
            letter-spacing: 0.2px;
        }

        /* ── Details Table ── */
        .details-table {
            width: 100%;
            margin-top: 24px;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        .details-table th, .details-table td {
            padding: 13px 16px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .details-table tr:last-child th,
        .details-table tr:last-child td {
            border-bottom: none;
        }
        .details-table th {
            background-color: #f8faff;
            color: #1e3a8a;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            width: 42%;
            border-right: 2px solid #e0e7ff;
        }
        .details-table td {
            color: #111827;
            font-weight: 500;
            font-size: 14px;
        }
        .details-table tr:hover td,
        .details-table tr:hover th {
            background-color: #f8faff;
        }

        /* ── Info / Alert Boxes ── */
        .info-box {
            background-color: #eff6ff;
            border-left: 4px solid #22d3ee;
            padding: 14px 16px;
            border-radius: 8px;
            margin: 24px 0;
        }
        .info-box p { margin: 0; font-size: 13px; color: #1e3a8a; }

        .warning-box {
            background-color: #fff7ed;
            border-left: 4px solid #f59e0b;
            padding: 14px 16px;
            border-radius: 8px;
            margin: 24px 0;
        }
        .warning-box p { margin: 0; font-size: 13px; color: #92400e; }

        .success-badge {
            display: inline-block;
            background: linear-gradient(135deg, #d1fae5, #a7f3d0);
            color: #065f46;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 99px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        /* ── Footer ── */
        .footer {
            background: linear-gradient(135deg, #1e3a8a 0%, #111827 100%);
            padding: 28px 30px;
            text-align: center;
        }
        .footer p {
            margin: 6px 0;
            font-size: 12px;
            color: #93c5fd;
        }
        .footer .footer-brand {
            font-weight: 700;
            font-size: 14px;
            color: #ffffff;
            margin-bottom: 4px;
        }
        .footer a {
            color: #f472b6;
            text-decoration: none;
        }
        .footer-divider {
            border: none;
            border-top: 1px solid rgba(255,255,255,0.1);
            margin: 14px 0;
        }

        @media only screen and (max-width: 620px) {
            body { padding: 10px 0 30px; }
            .container { border-radius: 0; }
            .content { padding: 28px 20px; }
            .header { padding: 28px 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-logo-wrap">
                <img src="{{ config('app.url') }}/images/logo.jpg" alt="MightyShare Logo">
                <p class="brand-name">
                    <span class="mighty">Mighty</span><span class="share">Share</span>
                </p>
                <p class="header-tagline">Your Trusted Thrift Partner</p>
            </div>
        </div>

        <div class="content">
            @yield('content')
        </div>

        <div class="footer">
            <p class="footer-brand">MightyShare</p>
            <p>Secure &bull; Reliable &bull; Growing Together</p>
            <hr class="footer-divider">
            <p>&copy; {{ date('Y') }} MightyShare. All rights reserved.</p>
            <p>You're receiving this as a registered member of MightyShare.</p>
            <p><a href="{{ config('app.url') }}">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
