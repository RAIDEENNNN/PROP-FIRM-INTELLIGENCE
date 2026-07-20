import { AdminWorkspace } from "../../components/AdminWorkspace";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Admin workspace | FundedScope", "Private FundedScope administration workspace.", "/admin");

export default function AdminPage() {
  return <AdminWorkspace />;
}
