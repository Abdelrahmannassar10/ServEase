export default () => ({
  port: process.env.PORT,

  db: {
    url: process.env.DB_URL,
  },

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  JWT_SECRET: process.env.JWT_SECRET,

  EMAIL_TEMPLATES: {
    /**
     * OTP – Customer registration
     * Usage: EMAIL_TEMPLATES.customerRegister.subject
     *        EMAIL_TEMPLATES.customerRegister.body(otp)
     */
    customerRegister: {
      subject: 'Verify your email — ServEase',
      body: (otp: string): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
  ${sharedStyles()}
</head>
<body>
  ${wrapper(`
    ${header('🎉', 'Account Verification', '#4f46e5', '#06b6d4')}
    <tr><td class="eb">
      <p class="lead">Welcome! Verify your account</p>
      <p class="txt">
        Thanks for signing up as a <strong>customer</strong>.
        Use the code below to confirm your email address.
        It expires in <strong>10 minutes</strong>.
      </p>
      ${otpBox(otp)}
      ${ctaButton('Verify now →', '#1e293b')}
      <p class="txt hint">Didn't create an account? You can safely ignore this email.</p>
    </td></tr>
    ${footer()}
  `)}
</body>
</html>`,
    },

    /**
     * OTP – Provider registration
     * Usage: EMAIL_TEMPLATES.providerRegister.body(otp)
     */
    providerRegister: {
      subject: 'Confirm your provider email — ServEase',
      body: (otp: string): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Provider email verification</title>
  ${sharedStyles()}
</head>
<body>
  ${wrapper(`
    ${header('🏪', 'Provider Verification', '#0f766e', '#0284c7')}
    <tr><td class="eb">
      <p class="lead">Welcome, Provider!</p>
      <p class="txt">
        You're registering as a <strong>service provider</strong> on ServEase.
        Please verify your email to activate your dashboard, analytics, and
        customer-management tools.
      </p>
      <div class="info-strip green">
        <strong>Provider accounts</strong> give you access to the service
        dashboard, analytics, and customer management.
      </div>
      ${otpBox(otp, '#a7f3d0', '#065f46')}
      ${ctaButton('Activate provider account →', '#16a34a')}
      <p class="txt hint">Code expires in 10 minutes.</p>
    </td></tr>
    ${footer()}
  `)}
</body>
</html>`,
    },

    /**
     * OTP – Resend (any role)
     * Usage: EMAIL_TEMPLATES.resendOtp.body(otp)
     */
    resendOtp: {
      subject: 'New verification code — ServEase',
      body: (otp: string): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New verification code</title>
  ${sharedStyles()}
</head>
<body>
  ${wrapper(`
    ${header('🔄', 'New Code Sent', '#7c3aed', '#a855f7')}
    <tr><td class="eb">
      <p class="lead">Here's your new code</p>
      <p class="txt">
        You requested a new verification code.
        The previous code has been <strong>invalidated</strong>.
        This code is valid for <strong>10 minutes</strong>.
      </p>
      <div class="info-strip purple">
        ⚠️&nbsp; If you didn't request a new code, someone else may be trying
        to access your account.
        <a href="#" style="color:#7c3aed">Secure your account</a>.
      </div>
      ${otpBox(otp, '#d8b4fe', '#581c87')}
      ${ctaButton('Verify now →', '#7c3aed')}
    </td></tr>
    ${footer()}
  `)}
</body>
</html>`,
    },

    /**
     * OTP – Forgot / reset password
     * Usage: EMAIL_TEMPLATES.forgotPassword.body(otp)
     */

    forgotPassword: {
      subject: 'Reset your password — ServEase',
      body: (otp: string): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
  ${sharedStyles()}
</head>
<body>
  ${wrapper(`
    ${header('🔑', 'Password Reset', '#b45309', '#d97706')}
    <tr><td class="eb">
      <p class="lead">Reset your password</p>
      <p class="txt">
        We received a request to reset the password for your account.
        Enter the code below on the reset page.
        It will expire in <strong>10 minutes</strong>.
      </p>
      ${otpBox(otp, '#fcd34d', '#78350f')}
      ${ctaButton('Reset password →', '#b45309')}
      <div class="info-strip amber">
        <strong>Didn't request this?</strong> Your password has <em>not</em>
        been changed. Ignore this email or
        <a href="#" style="color:#b45309">contact support</a> if concerned.
      </div>
    </td></tr>
    ${footer()}
  `)}
</body>
</html>`,
    },

    /**
     * Rejection notice – includes a human-readable cause string
     * Usage: EMAIL_TEMPLATES.rejectEmail.body('Your documents could not be verified.')
     */
    rejectEmail: {
      subject: 'Important notice about your account — ServEase',
      body: (cause: string): string => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account notice</title>
  ${sharedStyles()}
</head>
<body>
  ${wrapper(`
    ${header('⛔', 'Account Notice', '#991b1b', '#dc2626')}
    <tr><td class="eb">
      <p class="lead">Your account could not be verified</p>
      <p class="txt">
        We're sorry, but we were unable to complete the verification process
        for your account. Please review the reason below.
      </p>
      <div style="
        background:#fef2f2;
        border:1.5px solid #fecaca;
        border-radius:10px;
        padding:18px 20px;
        margin:18px 0;
      ">
        <div style="font-size:13px;font-weight:600;color:#991b1b;margin-bottom:8px;
          text-transform:uppercase;letter-spacing:.5px;">
          ❌ Rejection reason
        </div>
        <div style="font-size:14px;color:#7f1d1d;line-height:1.6;">${cause}</div>
      </div>
      <p class="txt">
        If you believe this is a mistake or need further assistance,
        please reach out to our support team.
      </p>
      ${ctaButton('Contact support →', '#dc2626')}
      <p class="txt hint">
        You may attempt re-registration once the issue has been resolved.
      </p>
    </td></tr>
    ${footer()}
  `)}
</body>
</html>`,
    },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Private template helpers  (not exported – used only above)
// ─────────────────────────────────────────────────────────────────────────────

function sharedStyles(): string {
  return `
  <style>
    body,table,td{
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,
        'Helvetica Neue',Arial,sans-serif;
    }
    img{border:0;display:block;outline:none;text-decoration:none;}
    a{color:inherit;text-decoration:none;}

    .ew{width:100%;background-color:#f1f5f9;padding:30px 0;}
    .ec{max-width:600px;margin:0 auto;background:#ffffff;
        border-radius:10px;overflow:hidden;
        box-shadow:0 6px 18px rgba(11,23,39,.08);}

    .eh{padding:24px 32px;text-align:center;}
    .eh-icon{font-size:36px;margin-bottom:8px;}
    .brand{font-weight:700;font-size:20px;color:#fff;letter-spacing:.2px;}
    .brand-sub{color:rgba(255,255,255,.8);font-size:13px;margin-top:4px;}

    .eb{padding:28px 32px;color:#0f172a;}
    .lead{font-size:18px;font-weight:600;margin:0 0 12px;color:#0f172a;}
    .txt{font-size:14px;line-height:1.6;color:#475569;margin:0 0 16px;}
    .hint{font-size:13px;color:#64748b;text-align:center;}

    .otp-box{
      display:inline-block;padding:16px 28px;
      background:#f8fafc;border-radius:10px;
      font-size:30px;letter-spacing:6px;font-weight:700;color:#1e293b;
      border:1.5px dashed #cbd5e1;
    }

    .cta-btn{
      display:inline-block;padding:12px 24px;
      border-radius:8px;color:#fff;font-weight:600;font-size:14px;
      text-decoration:none;
    }

    .info-strip{
      border-radius:0 8px 8px 0;
      padding:12px 16px;margin:0 0 18px;
      font-size:13px;line-height:1.6;
    }
    .info-strip.green{
      background:#f0fdf4;border-left:3px solid #16a34a;color:#15803d;
    }
    .info-strip.purple{
      background:#faf5ff;border-left:3px solid #a855f7;color:#6b21a8;
    }
    .info-strip.amber{
      background:#fff7ed;border-left:3px solid #f59e0b;color:#92400e;
    }

    .ef{padding:20px 32px;font-size:12px;color:#94a3b8;background:#f8fafc;}

    @media only screen and (max-width:420px){
      .eh,.eb{padding:18px 16px;}
      .otp-box{font-size:22px;padding:14px 20px;}
    }
  </style>`;
}

function wrapper(rows: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="ew">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="ec">
        ${rows}
      </table>
    </td></tr>
  </table>`;
}

function header(
  icon: string,
  subtitle: string,
  accent1: string,
  accent2: string,
): string {
  return `
  <tr>
    <td class="eh" style="background:linear-gradient(90deg,${accent1},${accent2});">
      <div class="eh-icon">${icon}</div>
      <div class="brand">ServEase</div>
      <div class="brand-sub">${subtitle}</div>
    </td>
  </tr>`;
}

function otpBox(
  otp: string,
  borderColor = '#cbd5e1',
  color = '#1e293b',
): string {
  return `
  <div style="text-align:center;margin:22px 0;">
    <div class="otp-box"
      style="border-color:${borderColor};color:${color};">
      ${otp}
    </div>
  </div>`;
}

function ctaButton(label: string, bg: string): string {
  return `
  <div style="text-align:center;margin:18px 0 22px;">
    <a href="#" class="cta-btn" style="background:${bg};color:#fff;">${label}</a>
  </div>`;
}

function footer(): string {
  const year = new Date().getFullYear();
  return `
  <tr>
    <td style="padding:0 32px;">
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
    </td>
  </tr>
  <tr>
    <td class="ef">
      <table role="presentation" width="100%">
        <tr>
          <td style="vertical-align:top;padding-right:12px;">
            <strong style="color:#334155;">Need help?</strong>
            <div style="margin-top:5px;">
              Contact our <a href="#" style="color:#4f46e5;">support team</a>.
            </div>
          </td>
          <td style="vertical-align:top;text-align:right;">
            <div>© ${year} ServEase</div>
            <div style="margin-top:5px;">
              <a href="#" style="color:#4f46e5;">Unsubscribe</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}
