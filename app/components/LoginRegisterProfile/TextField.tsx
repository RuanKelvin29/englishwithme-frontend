import React from "react";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className={`textfield-wrapper ${disabled ? "disabled" : ""}`}>
      <label className="textfield-label">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        className="textfield-input"
        required
      />
    </div>
  );
};

export default TextField;