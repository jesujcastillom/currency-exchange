import { render, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";

import { store } from "../../app/store";

import { CurrencyExchange } from "./CurrencyExchange";

it("should load all the options", async () => {
  const { getByRole } = render(
    <Provider store={store}>
      <CurrencyExchange />
    </Provider>
  );

  // Both select elements are in the DOM
  const sourcePicker = getByRole("combobox", { name: /from/i });
  const targetPicker = getByRole("combobox", { name: /to/i });

  await waitFor(() => {
    // Options loaded
    expect(within(sourcePicker).queryAllByRole("option")).not.toHaveLength(0);
  });

  const sourcePickerOptions = within(sourcePicker).getAllByRole("option");
  const targetPickerOptions = within(targetPicker).getAllByRole("option");

  const { textContent: sourceOption } = sourcePickerOptions[
    Math.floor(Math.random() * sourcePickerOptions.length)
  ];
  const { textContent: targetOption } = targetPickerOptions[
    Math.floor(Math.random() * targetPickerOptions.length)
  ];

  user.selectOptions(sourcePicker, sourceOption ?? "");
  user.selectOptions(targetPicker, targetOption ?? "");

  expect(sourcePicker).toHaveValue(sourceOption);
  expect(targetPicker).toHaveValue(targetOption);
});

it.todo(
  "should result the same as amount if user picks the same currency for source and target"
);
