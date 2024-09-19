import { createFrames } from "frames.js/next";

type State = {
  counter: number;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: { counter: 0 },
  baseUrl: process.env.APP_URL || "http://frames.ratecaster.xyz",
  // debug: process.env.NODE_ENV === "development",
});
