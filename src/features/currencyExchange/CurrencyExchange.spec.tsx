import { render, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";

import { storeBuilder } from "../../app/store";

import { CurrencyExchange } from "./CurrencyExchange";

it("should load all the options", async () => {
  const { getByRole } = render(
    <Provider store={storeBuilder()}>
      <CurrencyExchange />
    </Provider>
  );

  // Both select elements are in the DOM
  const sourcePicker = getByRole("combobox", { name: /from/i });
  const targetPicker = getByRole("combobox", { name: /to/i });

  await waitFor(() => {
    // Options loaded
    expect(
      within(sourcePicker).queryByRole("option", { name: /eur/i })
    ).toBeInTheDocument();
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

// TODO: Add empty amount/source/target case
it.each`
  amount     | source   | target   | result
  ${"12345"} | ${"HKD"} | ${"EUR"} | ${12345 / 9.4939}
  ${"12345"} | ${"EUR"} | ${"EUR"} | ${12345}
  ${"12345"} | ${"CAD"} | ${"USD"} | ${(12345 * 1.2246) / 1.5546}
  ${"12345"} | ${"EUR"} | ${"USD"} | ${12345 * 1.2246}
`(
  "should calculate $result for $amount $source -> $target having EUR as base",
  async ({ amount, source, target, result }) => {
    const { getByRole, getByText } = render(
      <Provider store={storeBuilder()}>
        <CurrencyExchange />
      </Provider>
    );

    // Both select elements are in the DOM
    const sourcePicker = getByRole("combobox", { name: /from/i });
    const targetPicker = getByRole("combobox", { name: /to/i });

    await waitFor(() => {
      // Options loaded
      expect(
        within(sourcePicker).queryByRole("option", { name: /eur/i })
      ).toBeInTheDocument();
    });

    user.selectOptions(sourcePicker, source);
    user.selectOptions(targetPicker, target);
    user.type(getByRole("spinbutton"), amount);

    expect(getByText(result)).toBeInTheDocument();
  }
);
