# Supabase Auth Email Branding

Configure this in Supabase Dashboard, not in application source code.

## Sender

- Sender name: `FundedScope`
- Sender email: `hello@myfundedscope.com`
- Subject: `Confirm your FundedScope account`

## Confirmation Template

```html
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;padding:0;background:#070812;font-family:Arial,sans-serif;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#f8f7ff;border-radius:28px;overflow:hidden;">
        <tr>
          <td align="center" style="padding:42px 28px 20px;">
            <img src="https://myfundedscope.com/brand/fundedscope-logo.png" width="72" height="72" alt="FundedScope" style="display:block;width:72px;height:72px;border-radius:18px;margin:0 auto 18px;background:#05050a;" />
            <div style="font-size:34px;line-height:1.1;font-weight:800;color:#9b6cff;">FundedScope</div>
            <div style="margin-top:8px;font-size:16px;color:#777986;">Your trading intelligence platform.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px;">
            <h1 style="margin:0 0 18px;font-size:30px;line-height:1.2;color:#171821;">Verify your FundedScope account</h1>
            <p style="margin:0;color:#5f6270;font-size:17px;line-height:1.65;">
              Your account has been created. Verify your email address to complete registration and begin setting up your Trading DNA.
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:26px 32px;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#9b6cff;color:#111217;text-decoration:none;font-size:17px;font-weight:800;padding:16px 34px;border-radius:14px;">
              Verify email
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 34px;">
            <p style="margin:0;color:#8a8d99;font-size:15px;line-height:1.6;">If you did not create a FundedScope account, you can safely ignore this email.</p>
            <p style="margin:24px 0 0;color:#a6a8b4;font-size:13px;">© FundedScope · <a href="https://myfundedscope.com" style="color:#5897e8;">myfundedscope.com</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

Paste this into Supabase Dashboard → Authentication → Emails → Confirm signup. If Gmail still shows no image, verify that `https://myfundedscope.com/brand/fundedscope-logo.png` opens publicly and that Gmail image loading is enabled.

## Redirect URLs

- Local confirmation: `http://localhost:3000/profile`
- Local reset password: `http://localhost:3000/reset-password`
- Production confirmation: `https://myfundedscope.com/profile`
- Production reset password: `https://myfundedscope.com/reset-password`
