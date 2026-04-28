import logo from "@/assets/heybaby-logo.png";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img
      src={logo}
      alt="Hey Baby — A smarter way to name your baby"
      className="h-10 w-auto object-contain"
    />
  </div>
);
