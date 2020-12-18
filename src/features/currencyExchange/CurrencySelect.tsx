import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export const CurrencySelect = ({ value, options, onChange }: Props) => {
  return (
    <select
      value={value}
      onChange={({ target }) => {
        onChange(target.value);
      }}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
};
