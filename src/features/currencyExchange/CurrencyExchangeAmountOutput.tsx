import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeTarget,
  selectAmount,
  selectTargetCurrency,
  setTarget,
} from "./currencyExchangeSlice";
import { CurrencySelect } from "./CurrencySelect";
import { useCurrencySelection } from "./hooks/useCurrencySelection";

interface Props {
  options: string[];
  id: string;
  isRemovable: boolean;
}

export const CurrencyExchangeAmountOutput = ({
  options,
  id,
  isRemovable,
}: Props) => {
  const dispatch = useDispatch();
  const [target, setTargetCurrency] = useCurrencySelection(
    selectTargetCurrency(id),
    setTarget
  );
  const amount = useSelector(selectAmount(target));
  return (
    <div>
      {amount}
      <label>
        To
        <CurrencySelect
          value={target}
          onChange={(newTarget) => {
            setTargetCurrency({ id, value: newTarget });
          }}
          options={options}
        />
      </label>
      {isRemovable ? (
        <button
          onClick={() => {
            dispatch(removeTarget(id));
          }}
        >
          Remove currency
        </button>
      ) : null}
    </div>
  );
};
