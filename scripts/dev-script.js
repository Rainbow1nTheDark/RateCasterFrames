import "dotenv/config";
import { spawn } from "node:child_process";
import isPortReachable from "is-port-reachable";

console.log("Running Environment", process.env.NODE_ENV);

function snakeCaseToTitleCase(snakeCase) {
  return snakeCase
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getOpenPort(port) {
  const isReachable = await isPortReachable(port, { host: "localhost" });

  if (isReachable) {
    return getOpenPort(Math.floor(Math.random() * (30000 - 3001 + 1)) + 3001);
  }

  return port;
}

const nextPort = await getOpenPort(3000);
const debuggerPort = await getOpenPort(3010);
let command = "npm";
let args = ["run", "dev:monorepo"];

// Set the debugger hub URL only for development
if (process.env.NODE_ENV !== 'production') {
  process.env.DEBUGGER_HUB_HTTP_URL = `http://localhost:${debuggerPort}/hub`;
}

// Set APP_URL only if it's not already set and we're not in production
if (!process.env.APP_URL && process.env.NODE_ENV !== 'production') {
  process.env.APP_URL = `http://localhost:${nextPort}`;
}

if (!process.env.FJS_MONOREPO && process.env.NODE_ENV !== 'production') {
  const url = process.env.APP_URL || `http://localhost:${nextPort}`;

  command = "concurrently";
  args = [
    "--kill-others",
    `"next dev -p ${nextPort}"`,
    `"frames --port ${debuggerPort} --url ${url} ${process.env.FARCASTER_DEVELOPER_FID ? `--fid '${process.env.FARCASTER_DEVELOPER_FID}'` : ""} ${process.env.FARCASTER_DEVELOPER_MNEMONIC ? `--fdm '${process.env.FARCASTER_DEVELOPER_MNEMONIC}'` : ""} "`,
  ];
}

// Only spawn the child process if we're not in production
if (process.env.NODE_ENV !== 'production') {
  const child = spawn(command, args, { stdio: "inherit", shell: true });

  child.on("error", (error) => {
    console.error(`spawn error: ${error}`);
  });
} else {
  console.log("Running in production mode. Dev script not executed.");
}