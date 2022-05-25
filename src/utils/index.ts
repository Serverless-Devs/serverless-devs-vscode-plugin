import * as path from "path";
import { ext } from "../extensionVariables";
import * as core from "@serverless-devs/core";
import * as vscode from "vscode";

export function setArgs(args: string[]) {
  process.env["serverless_devs_temp_argv"] = JSON.stringify(
    process.argv.slice(2).concat(args)
  );
}

export function setEnvs(key: string, value: string) {
  process.env[key] = value;
}

export async function getYaml() {
  if (!ext.cwd) return;
  const spath = path.join(ext.cwd, "s.yaml");
  return await core.getYamlContent(spath);
}

export function getUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  pathList: string[]
) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}
