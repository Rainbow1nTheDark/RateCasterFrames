import { createFrames } from "frames.js/next";
import { appURL } from "../utils";

type State = {
  counter: number;
};

export const frames = createFrames<State>({
  basePath: `${appURL()}/frames`,
  initialState: { counter: 0 },
  // debug: process.env.NODE_ENV === "development",
});
