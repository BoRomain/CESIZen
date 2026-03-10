import { TextareaHTMLAttributes } from "react";

export default function TextArea({
  text,
  className,
  ...props
}: { text: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label>{text}</label>
      <textarea
        className={`bg-slate-200/60 p-2 rounded-lg focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
