import { Tooltip } from "@mui/material";
import type { LucideProps } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<LucideProps>;
  color?: "primary" | "secondary" | "black";
  title?: string;
}

export default function ButtonIcon({
  icon: Icon,
  color = "black",
  title = "",
  ...props
}: Props) {
  const colorClass = () => {
    switch (color) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      default:
        return "text-black";
    }
  };

  return (
    <Tooltip title={title} placement="top">
      <button
        {...props}
        className={`p-2 rounded-lg hover:bg-slate-200 transition-colors ${props.className}`}
      >
        <Icon size={20} className={colorClass()} />
      </button>
    </Tooltip>
  );
}
