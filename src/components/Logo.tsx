import logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <Link to="/" className="inline-flex items-center">
      <img src={logo} alt="HeyBaby AI" className={className} />
    </Link>
  );
}
