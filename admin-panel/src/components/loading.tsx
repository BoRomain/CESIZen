interface Props {
  size?: number;
  className?: string;
}

export default function Loading({ size = 1.6, className = "" }: Props) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-4 border-solid border-t-transparent ${className}`}
        style={{ width: `${size}rem`, height: `${size}rem` }}
      ></div>
    </div>
  );
}
