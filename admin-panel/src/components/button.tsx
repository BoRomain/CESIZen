import { type LucideProps } from "lucide-react";
import Loading from "./loading";

interface Props {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  type?: "button" | "submit";
}

export default function Button({
  text,
  onClick = () => console.log("clicked"),
  disabled = false,
  loading = false,
  className = "",
  variant = "primary",
  icon: Icon,
  type = "button",
}: Props) {
  const palette = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    danger: "bg-danger",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${disabled || loading ? "bg-gray-400 opacity-70" : palette[variant]} 
      relative font-bold px-4 py-2 flex items-center rounded-xl text-background_container shadow ${className} 
      transition ${!(disabled || loading) && "hover:opacity-80"}`}
      type={type}
    >
      {Icon && (
        <span className={`flex mr-1 ${loading && "opacity-0"}`}>
          <Icon className="size-5" />
        </span>
      )}

      {text && <span className={`${loading && "opacity-0"}`}>{text}</span>}

      {loading && (
        <div>
          <Loading className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
    </button>
  );
}
