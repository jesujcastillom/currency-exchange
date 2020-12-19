import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";

interface CurrencyState {
  currency: string;
}

interface RateInfoState {
  base: string;
  date: string;
  rates: { [key: string]: number };
}

interface CurrencyExchangeState {
  source: CurrencyState;
  target: CurrencyState;
  amount?: number;
  rateInformation: RateInfoState;
}

const initialState: CurrencyExchangeState = {
  source: {
    currency: "",
  },
  target: {
    currency: "",
  },
  rateInformation: {
    base: "",
    date: "",
    rates: {},
  },
};

const currencyExchangeSlice = createSlice({
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
    setAmount: (
      state: CurrencyExchangeState,
      { payload: value }: PayloadAction<number>
    ) => {
      state.amount = value;
    },
    setRateInformation: (
      state: CurrencyExchangeState,
      { payload }: PayloadAction<RateInfoState>
    ) => {
      state.rateInformation = payload;
      state.source.currency = state.target.currency = payload.base;
    },
  },
});

export const {
  setSource,
  setTarget,
  setAmount,
} = currencyExchangeSlice.actions;

//#region selectors

export const selectSourceCurrency = (state: RootState) =>
  state.currencyExchange.source.currency;

export const selectTargetCurrency = (state: RootState) =>
  state.currencyExchange.target.currency;

export const selectCurrencies = (state: RootState) => [
  state.currencyExchange.rateInformation.base,
  ...Object.keys(state.currencyExchange.rateInformation.rates),
];

export const selectAmount = (target: string) => ({
  currencyExchange,
}: RootState) => {
  const { currency: source } = currencyExchange.source;
  const { amount } = currencyExchange;

  if (!source || !target || typeof amount !== "number") return;

  if (source === target) return amount;

  const { base, rates } = currencyExchange.rateInformation;
  if (target === base) return amount / rates[source];

  const rate = base === source ? rates[target] : rates[target] / rates[source];
  return amount * rate;
};

//#endregion

//#region thunks
export const loadOptions = (): AppThunk => (dispatch) => {
  fetch("https://api.exchangeratesapi.io/latest")
    .then((r) => r.json())
    .then((rateInformation: RateInfoState) => {
      dispatch(
        currencyExchangeSlice.actions.setRateInformation(rateInformation)
      );
    });
};
//#endregion

export default currencyExchangeSlice.reducer;
