import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrencies, loadOptions } from "../currencyExchangeSlice";

export const useCurrencyOptions = () => {
  const options = useSelector(selectCurrencies);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadOptions());
  }, [dispatch]);
  return options;
};
