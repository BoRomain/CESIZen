import { type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
  padding?: number;
}

export default function Box({ children, className = "", padding = 2 }: Props) {
  return (
    <div
      className={`rounded-2xl shadow-lg bg-background_box ${className}`}
      style={{ padding: `${padding}rem` }}
    >
      {children}
    </div>
  );
}
