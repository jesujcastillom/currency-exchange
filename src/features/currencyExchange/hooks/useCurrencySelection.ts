import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export const useCurrencySelection = (
  selector: (state: RootState) => string,
  updateAction: ActionCreatorWithPayload<string, string>
): [string, (value: string) => void] => {
  const value = useSelector(selector);
  const dispatch = useDispatch();
  const setValue = (newValue: string) => {
    dispatch(updateAction(newValue));
  };
  return [value, setValue];
};
