export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <img
      src="/logo.png"
      alt="HeyBaby AI"
      className="h-16 w-auto object-contain"
    />
  </div>
);
