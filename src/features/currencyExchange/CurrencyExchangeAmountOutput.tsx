import React from "react";
import { useSelector } from "react-redux";
import { selectAmount } from "./currencyExchangeSlice";

interface Props {
  currency: string;
}

export const CurrencyExchangeAmountOutput = ({ currency }: Props) => {
  const amount = useSelector(selectAmount(currency));
  return <span>{amount}</span>;
};
