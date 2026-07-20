import { WelcomeExperience } from "../../components/WelcomeExperience";
import { noindexMetadata } from "../../lib/seo";

export const metadata = noindexMetadata("Welcome | FundedScope", "FundedScope private welcome screen.", "/welcome");

export default function WelcomePage() {
  return <WelcomeExperience />;
}
