import { render, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";

import { storeBuilder } from "../../app/store";

import { CurrencyExchange } from "./CurrencyExchange";

it("should load all the options", async () => {
  const { getByRole, queryByRole } = render(
    <Provider store={storeBuilder()}>
      <CurrencyExchange />
    </Provider>
  );

  await waitFor(() => {
    expect(queryByRole("combobox", { name: /to/i })).toBeInTheDocument();
  });

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
  ${"12345"} | ${"HKD"} | ${"EUR"} | ${(12345 / 9.4939).toFixed(4)}
  ${"12345"} | ${"EUR"} | ${"EUR"} | ${(12345).toFixed(4)}
  ${"12345"} | ${"CAD"} | ${"USD"} | ${((12345 * 1.2246) / 1.5546).toFixed(4)}
  ${"12345"} | ${"EUR"} | ${"USD"} | ${(12345 * 1.2246).toFixed(4)}
`(
  "should calculate $result for $amount $source -> $target having EUR as base",
  async ({ amount, source, target, result }) => {
    const { getByRole, getByText, queryByRole } = render(
      <Provider store={storeBuilder()}>
        <CurrencyExchange />
      </Provider>
    );

    await waitFor(() => {
      expect(queryByRole("combobox", { name: /to/i })).toBeInTheDocument();
    });

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

it("should convert to multiple rates", async () => {
  const { getByRole, getByText, queryByRole, getAllByRole } = render(
    <Provider store={storeBuilder()}>
      <CurrencyExchange />
    </Provider>
  );

  await waitFor(() => {
    expect(queryByRole("combobox", { name: /to/i })).toBeInTheDocument();
  });

  const addCurrencyButton = getByRole("button", { name: /add conversion/i });
  user.click(addCurrencyButton);

  const targetSelects = getAllByRole("combobox", { name: /to/i });
  // Target currency added
  expect(targetSelects).toHaveLength(2);
  expect(getAllByRole("button", { name: /remove/i })).toHaveLength(2);

  const [firstSelect, secondSelect] = targetSelects;
  user.selectOptions(firstSelect, "USD");
  user.selectOptions(secondSelect, "CAD");
  user.type(getByRole("spinbutton"), "12345");

  expect(getByText((12345 * 1.2246).toFixed(4))).toBeInTheDocument();
  expect(getByText((12345 * 1.5546).toFixed(4))).toBeInTheDocument();
});
it("should be able to remove target currency row if there's more than one target", async () => {
  const { getByRole, queryByRole, getAllByRole, queryByDisplayValue } = render(
    <Provider store={storeBuilder()}>
      <CurrencyExchange />
    </Provider>
  );

  await waitFor(() => {
    expect(queryByRole("combobox", { name: /to/i })).toBeInTheDocument();
  });

  user.selectOptions(getByRole("combobox", { name: /to/i }), "DKK");
  expect(queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();

  const addCurrencyButton = getByRole("button", { name: /add conversion/i });
  user.click(addCurrencyButton);

  const [firstCurrencyRemoveButton] = getAllByRole("button", {
    name: /remove/i,
  });
  user.click(firstCurrencyRemoveButton);

  expect(queryByDisplayValue("DKK")).not.toBeInTheDocument();

  // This should be the one just added, and this makes sure there's only one
  expect(getByRole("combobox", { name: /to/i })).toBeInTheDocument();
  // The original second select remove button should have been removed from the
  // DOM since it's the only select available now
  expect(queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
});

it("should not be able to remove if only one target currency is present", async () => {
  const { getByRole, queryByRole, getAllByRole } = render(
    <Provider store={storeBuilder()}>
      <CurrencyExchange />
    </Provider>
  );

  await waitFor(() => {
    expect(queryByRole("combobox", { name: /to/i })).toBeInTheDocument();
  });

  user.selectOptions(getByRole("combobox", { name: /to/i }), "DKK");
  expect(queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();

  const addCurrencyButton = getByRole("button", { name: /add conversion/i });
  user.click(addCurrencyButton);

  const removeButton = getAllByRole("button", {
    name: /remove/i,
  })[Math.round(Math.random())];

  user.click(removeButton);
  expect(queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
});
