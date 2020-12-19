import { render } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { CurrencyExchangeInput } from "./CurrencyExchangeInput";

it("should avoid exponential notation", () => {
  const { getByRole } = render(
    <Provider store={store}>
      <CurrencyExchangeInput />
    </Provider>
  );
  const input = getByRole("spinbutton");
  user.type(input, "12345e34");
  expect(input).toHaveValue(1234534);
});

it.each`
  input             | value
  ${"1{backspace}"} | ${null}
  ${"0"}            | ${0}
`("should have $value as value when user types $input", ({ input, value }) => {
  const { getByRole } = render(
    <Provider store={store}>
      <CurrencyExchangeInput />
    </Provider>
  );
  const field = getByRole("spinbutton");
  user.type(field, input);
  expect(field).toHaveValue(value);
});
