import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setAmount } from "./currencyExchangeSlice";
import styles from "./CurrencyExchangeInput.module.scss";

export const CurrencyExchangeInput = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAmount(Number(value)));
  }, [value, dispatch]);
  return (
    <input
      className={styles.input}
      type="number"
      value={value}
      onChange={({ target }) => {
        setValue(target.value);
      }}
      onKeyDown={(e) => /^e$/i.test(e.key) && e.preventDefault()}
    />
  );
};
