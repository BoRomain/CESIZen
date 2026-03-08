import { Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";

interface Props {
  text?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  text = "",
  checked,
  onChange,
  disabled = false,
  className = "",
}: Props) {
  return (
    <FormControlLabel
      label={text}
      disabled={disabled}
      control={
        <MuiCheckbox
          checked={checked}
          onChange={onChange}
          size="small"
          className="text-primary! [&.Mui-checked]:text-primary!"
        />
      }
      className={`select-none ${className}`}
    />
  );
}
