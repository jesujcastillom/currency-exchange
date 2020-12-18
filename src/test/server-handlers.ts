import { rest } from "msw";

import latest from "./data/latest.json";

const handlers = [
  rest.get("https://api.exchangeratesapi.io/latest", (_, res, ctx) =>
    res(ctx.json(latest))
  ),
];

export { handlers };
