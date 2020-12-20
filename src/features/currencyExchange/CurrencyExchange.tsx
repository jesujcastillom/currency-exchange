import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CurrencyExchangeAmountOutput } from "./CurrencyExchangeAmountOutput";
import { CurrencyExchangeInput } from "./CurrencyExchangeInput";
import {
  addTarget,
  selectSourceCurrency,
  selectTargets,
  setSource,
} from "./currencyExchangeSlice";
import { CurrencySelect } from "./CurrencySelect";
import { useCurrencyOptions } from "./hooks/useCurrencyOptions";
import { useCurrencySelection } from "./hooks/useCurrencySelection";

export const CurrencyExchange = () => {
  const dispatch = useDispatch();
  const [source, setSourceCurrency] = useCurrencySelection(
    selectSourceCurrency,
    setSource
  );
  const options = useCurrencyOptions();
  const targets = useSelector(selectTargets);
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
      {targets.map((id) => (
        <CurrencyExchangeAmountOutput
          key={id}
          options={options}
          id={id}
          isRemovable={targets.length > 1}
        />
      ))}
      <button
        onClick={() => {
          dispatch(addTarget());
        }}
        disabled={targets.length === options.length}
      >
        Add conversion rate
      </button>
    </div>
  );
};
