import { CompanyLogo } from "./CompanyLogo";

type BrokerLogoProps = {
  name: string;
  domain: string;
  fallback: string;
  className?: string;
};

export function BrokerLogo({ name, domain, fallback, className = "h-10 w-10" }: BrokerLogoProps) {
  return <CompanyLogo name={name} domain={domain} fallback={fallback} className={className} accentClass="from-sky-400 to-violet" />;
}
