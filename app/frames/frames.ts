import { createFrames } from "frames.js/next";

type State = {
  counter: number;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: { counter: 0 },
  baseUrl: process.env.NODE_ENV === 'production' ? (process.env.APP_URL || "http://frames.ratecaster.xyz") : undefined,
  // debug: process.env.NODE_ENV === "development",
});
