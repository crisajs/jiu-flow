import logo from "@/assets/x-logo.png";

export function XLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="X Brazilian Jiu-Jitsu School"
      className={`${className} object-contain invert`}
      draggable={false}
    />
  );
}
