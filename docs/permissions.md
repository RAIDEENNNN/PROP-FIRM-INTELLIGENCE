# User Role Permissions

| Capability | Visitor | Free Trader | Pro Trader | Business | Admin | Super Admin |
|---|---:|---:|---:|---:|---:|---:|
| View public pages | Yes | Yes | Yes | Yes | Yes | Yes |
| Search prop firms | Yes | Yes | Yes | Yes | Yes | Yes |
| Use calculators | Yes | Yes | Yes | Yes | Yes | Yes |
| View full spread matrix | Preview | Preview | Yes | Yes | Yes | Yes |
| Create account | Yes | N/A | N/A | N/A | N/A | N/A |
| Save firms/watchlist | No | Limited | Yes | Team | Yes | Yes |
| Create alerts | No | Limited | Yes | Team | Yes | Yes |
| Submit reviews | No | Yes | Yes | Yes | Yes | Yes |
| Upload payout proof | No | Yes | Yes | Yes | Yes | Yes |
| Access dashboard | No | Basic | Full | Team | Full | Full |
| AI recommendations | No | Basic | Personalized | Team | Yes | Yes |
| Export reports | No | No | Limited | Yes | Yes | Yes |
| API access | No | No | No | Yes | Yes | Yes |
| Manage firms | No | No | No | No | Yes | Yes |
| Moderate reviews | No | No | No | No | Yes | Yes |
| Manage payments | No | No | No | No | Limited | Yes |
| Manage admins | No | No | No | No | No | Yes |
| View audit logs | No | No | No | No | Yes | Yes |

## Security rules

- Admin routes must require authentication and admin role.
- Payment and subscription data must only be accessible to the owning user or admin.
- Reviews and payout proofs must be moderated before public display.
- Rule changes must be logged in `AuditLog`.
- API access should use scoped API keys in a later phase.
