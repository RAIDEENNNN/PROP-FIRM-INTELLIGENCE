import { AdminDiagnostics } from "../../../components/AdminDiagnostics";
import { noindexMetadata } from "../../../lib/seo";

export const metadata = noindexMetadata("Developer diagnostics | FundedScope", "Private FundedScope diagnostics for admins.", "/admin/diagnostics");

export default function AdminDiagnosticsPage() {
  return <AdminDiagnostics />;
}
