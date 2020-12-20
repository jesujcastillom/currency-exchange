import React from "react";
import styles from "./CurrencySelect.module.scss";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

export const CurrencySelect = ({ label, value, options, onChange }: Props) => {
  return (
    <select
      value={value}
      onChange={({ target }) => {
        onChange(target.value);
      }}
      className={styles.select}
      aria-label={label}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
};
