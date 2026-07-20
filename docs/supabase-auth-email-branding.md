# Supabase Auth Email Branding

Configure this in Supabase Dashboard, not in application source code.

## Sender

- Sender name: `FundedScope`
- Sender email: `hello@myfundedscope.com`
- Subject: `Confirm your FundedScope account`

## Confirmation Template

```html
<div style="margin:0;padding:0;background:#070812;color:#f8fafc;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <img src="https://myfundedscope.com/brand/fundedscope-logo.png" width="72" height="72" alt="FundedScope" style="display:block;border-radius:18px;margin-bottom:28px;" />
    <h1 style="margin:0 0 12px;font-size:30px;line-height:1.1;color:#ffffff;">Confirm your FundedScope account</h1>
    <p style="margin:0 0 24px;color:#cbd5e1;font-size:16px;line-height:1.6;">
      Welcome to FundedScope. Verify your email address to unlock your dashboard, Trader DNA, saved comparisons, watchlists and alerts.
    </p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#38d7ff;color:#05050a;text-decoration:none;font-weight:800;padding:14px 22px;border-radius:14px;">
      Confirm Email
    </a>
    <p style="margin:28px 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">
      If you did not create this account, you can safely ignore this email.
    </p>
    <p style="margin:18px 0 0;color:#64748b;font-size:13px;">Need help? support@myfundedscope.com</p>
  </div>
</div>
```

## Redirect URLs

- Local confirmation: `http://localhost:3000/profile`
- Local reset password: `http://localhost:3000/reset-password`
- Production confirmation: `https://myfundedscope.com/profile`
- Production reset password: `https://myfundedscope.com/reset-password`
