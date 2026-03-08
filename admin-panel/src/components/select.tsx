import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
} from "@mui/material";

interface Props {
  text?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  options?: { value: string; label: string }[];
}

export default function Select({
  text = "",
  value = "",
  onChange,
  disabled = false,
  options = [],
}: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <FormControl size="small" fullWidth>
      {text && <InputLabel className="[.Mui-focused]:text-primary!">{text}</InputLabel>}
      <MuiSelect
        label={text}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="[&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-primary!"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
