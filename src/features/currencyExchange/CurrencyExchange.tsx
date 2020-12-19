import React from "react";
import { useSelector } from "react-redux";
import { CurrencyExchangeInput } from "./CurrencyExchangeInput";
import {
  selectAmount,
  selectSourceCurrency,
  selectTargetCurrency,
  setSource,
  setTarget,
} from "./currencyExchangeSlice";
import { CurrencySelect } from "./CurrencySelect";
import { useCurrencyOptions } from "./hooks/useCurrencyOptions";
import { useCurrencySelection } from "./hooks/useCurrencySelection";

export const CurrencyExchange = () => {
  const [source, setSourceCurrency] = useCurrencySelection(
    selectSourceCurrency,
    setSource
  );
  const [target, setTargetCurrency] = useCurrencySelection(
    selectTargetCurrency,
    setTarget
  );
  const options = useCurrencyOptions();
  const result = useSelector(selectAmount(target));
  return (
    <div>
      <CurrencyExchangeInput />
      <label>
        From
        <CurrencySelect
          value={source}
          onChange={setSourceCurrency}
          options={options}
        />
      </label>
      <span>{result}</span>
      <label>
        To
        <CurrencySelect
          value={target}
          onChange={setTargetCurrency}
          options={options}
        />
      </label>
    </div>
  );
};
