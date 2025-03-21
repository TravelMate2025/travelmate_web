import spinner from "../src/assets/spinner.svg";

interface SpinnerProps {
  size?: string;
  color?: string;
  borderWidth?: string;
}

export default function Spinner({ size = "40px", color = "#2563EB", borderWidth = "8px" }: SpinnerProps) {
  return (
    <img 
      src={spinner} 
      alt="Loading..."
      style={{
        width: size,
        height: size,
        color: color, // Inherited by SVG
        "--stroke-width": borderWidth, // Custom stroke width
      } as React.CSSProperties}
      className="animate-spin"
    />
  );
}
