import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import currencyExchange from "../features/currencyExchange/currencyExchangeSlice";

export const store = configureStore({
  reducer: {
    currencyExchange,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
