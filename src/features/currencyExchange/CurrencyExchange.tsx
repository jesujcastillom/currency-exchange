import React from "react";
import {
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
  return (
    <div>
      <label>
        From
        <CurrencySelect
          value={source}
          onChange={setSourceCurrency}
          options={options}
        />
      </label>
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
