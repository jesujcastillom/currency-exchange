import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export const useCurrencySelection = <
  P extends { id: string; value: string } | string
>(
  selector: (state: RootState) => string,
  updateAction: ActionCreatorWithPayload<P>
): [string, (value: P) => void] => {
  const value = useSelector(selector);
  const dispatch = useDispatch();
  const setValue = (newValue: P) => {
    dispatch(updateAction(newValue));
  };
  return [value, setValue];
};
