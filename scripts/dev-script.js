import "dotenv/config";
import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import isPortReachable from "is-port-reachable";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

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

// Set APP_URL if it's not already set
if (!process.env.APP_URL) {
  process.env.APP_URL = `http://localhost:${nextPort}`;
}

// this sets hub url for debugger
process.env.DEBUGGER_HUB_HTTP_URL = `http://localhost:${debuggerPort}/hub`;

if (!process.env.FJS_MONOREPO) {
  const url = process.env.APP_URL;

  command = "concurrently";
  args = [
    "--kill-others",
    `"next dev -p ${nextPort}"`,
    `"frames --port ${debuggerPort} --url ${url} ${process.env.FARCASTER_DEVELOPER_FID ? `--fid '${process.env.FARCASTER_DEVELOPER_FID}'` : ""} ${process.env.FARCASTER_DEVELOPER_MNEMONIC ? `--fdm '${process.env.FARCASTER_DEVELOPER_MNEMONIC}'` : ""} "`,
  ];
}

// Spawn the child process
const child = spawn(command, args, { stdio: "inherit", shell: true });

child.on("error", (error) => {
  console.error(`spawn error: ${error}`);
});