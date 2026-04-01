import { InputAdornment, TextField as MuiTextField } from "@mui/material";

interface Props {
  text?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement,
    Element
  >;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  placeholder?: string;
  endAdornment?: React.ReactNode;
}

export default function TextField({
  text = "",
  value,
  type = "text",
  onChange,
  disabled = false,
  placeholder,
  endAdornment,
}: Props) {
  return (
    <MuiTextField
      label={text}
      value={value}
      type={type}
      onChange={onChange}
      disabled={disabled}
      size="small"
      placeholder={placeholder}
      slotProps={{
        input: {
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null,
        },
        inputLabel: {
          className: "[.Mui-focused]:text-primary!",
        },
      }}
      className="[&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-primary!"
      sx={{
        "& .MuiInputBase-input": {
          fontFamily: '"Inter", sans-serif',
        },
        "& .MuiInputLabel-root": {
          fontFamily: '"Inter", sans-serif',
        },
      }}
    />
  );
}
