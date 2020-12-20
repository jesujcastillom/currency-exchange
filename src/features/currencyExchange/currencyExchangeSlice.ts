import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { AppThunk, RootState } from "../../app/store";

interface CurrencyState {
  [key: string]: string;
}

interface RateInfoState {
  base: string;
  date: string;
  rates: { [key: string]: number };
}

interface CurrencyExchangeState {
  source: CurrencyState;
  targets: CurrencyState;
  amount?: number;
  rateInformation: RateInfoState;
}

const initialState: CurrencyExchangeState = {
  source: {
    currency: "",
  },
  targets: {},
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
      { payload }: PayloadAction<{ id: string; value: string }>
    ) => {
      state.targets[payload.id] = payload.value;
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
      state.source.currency = payload.base;
      state.targets = {
        [uuid()]: payload.base,
      };
    },
    addTarget: (state: CurrencyExchangeState) => {
      const usedCurrencies = new Set([
        state.source.currency,
        ...Object.keys(state.targets),
      ]);
      const nextUnusedCurrency = selectCurrencies({
        currencyExchange: state,
      }).find((currency) => !usedCurrencies.has(currency));
      state.targets[uuid()] = nextUnusedCurrency ?? state.rateInformation.base;
    },
    removeTarget: (
      state: CurrencyExchangeState,
      { payload }: PayloadAction<string>
    ) => {
      const { [payload]: _, ...targetsWithoutPayloadProp } = state.targets;
      state.targets = targetsWithoutPayloadProp;
    },
  },
});

//#region actions
export const {
  setSource,
  setTarget,
  setAmount,
  addTarget,
  removeTarget,
} = currencyExchangeSlice.actions;
//#endregion

//#region selectors

export const selectSourceCurrency = (
  state: Pick<RootState, "currencyExchange">
) => state.currencyExchange.source.currency;

export const selectTargetCurrency = (target: string) => (
  state: Pick<RootState, "currencyExchange">
) => state.currencyExchange.targets[target];

export const selectCurrencies = (state: Pick<RootState, "currencyExchange">) =>
  [
    state.currencyExchange.rateInformation.base,
    ...Object.keys(state.currencyExchange.rateInformation.rates),
  ].sort();

export const selectTargets = (state: Pick<RootState, "currencyExchange">) =>
  Object.keys(state.currencyExchange.targets);

export const selectAmount = (target: string) => ({
  currencyExchange,
}: RootState) => {
  const { currency: source } = currencyExchange.source;
  const { amount } = currencyExchange;

  if (!source || !target || typeof amount !== "number") return;

  if (source === target) return amount;

  const { base, rates } = currencyExchange.rateInformation;

  if (target === base) return amount / rates[source];
  if (base === source) return amount * rates[target];

  return (amount * rates[target]) / rates[source];
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
