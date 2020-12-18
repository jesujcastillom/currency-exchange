import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";

interface CurrencyState {
  currency: string;
}

interface CurrencyExchangeState {
  source: CurrencyState;
  target: CurrencyState;
  options: string[];
}

const initialState: CurrencyExchangeState = {
  source: {
    currency: "",
  },
  target: {
    currency: "",
  },
  options: [],
};

export const currencyExchangeSlice = createSlice({
  name: "currencyExchange",
  initialState,
  reducers: {
    setSource: (
      state: CurrencyExchangeState,
      action: PayloadAction<string>
    ) => {
      state.source.currency = action.payload;
    },
    setTarget: (
      state: CurrencyExchangeState,
      action: PayloadAction<string>
    ) => {
      state.target.currency = action.payload;
    },
    setOptions: (
      state: CurrencyExchangeState,
      action: PayloadAction<string[]>
    ) => {
      state.options = action.payload;
    },
  },
});

export const { setSource, setTarget } = currencyExchangeSlice.actions;

//#region selectors

export const selectSourceCurrency = (state: RootState) =>
  state.currencyExchange.source.currency;

export const selectTargetCurrency = (state: RootState) =>
  state.currencyExchange.target.currency;

export const selectCurrencies = (state: RootState) =>
  state.currencyExchange.options;

//#endregion

//#region thunks
export const loadOptions = (): AppThunk => (dispatch) => {
  fetch("https://api.exchangeratesapi.io/latest")
    .then((r) => r.json())
    .then(({ base: baseOption, rates }) => {
      const targetOptions = Object.keys(rates);
      dispatch(
        currencyExchangeSlice.actions.setOptions([baseOption, ...targetOptions])
      );
    });
};
//#endregion

export default currencyExchangeSlice.reducer;
