import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as core from "@serverless-devs/core";
import { ext } from "../../../extensionVariables";
import { TEMPLTE_FILE } from "../../../constants";

export async function writeQuickCommandList(params) {
  const { quickCommandList, itemData } = params;
  const stroreKey = itemData.contextValue === "app" ? "app" : itemData.label;
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (Array.isArray(data["quick-commands"])) {
    const findObj = data["quick-commands"].find(
      (item) => item.path === itemData.spath
    );
    if (findObj) {
      data["quick-commands"] = data["quick-commands"].map((item) => {
        if (item.path === itemData.spath) {
          item[stroreKey] = quickCommandList;
        }
        return item;
      });
    } else {
      data["quick-commands"].push({
        path: itemData.spath,
        [stroreKey]: quickCommandList,
      });
    }
  } else {
    data["quick-commands"] = [
      {
        path: itemData.spath,
        [stroreKey]: quickCommandList,
      },
    ];
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function writeShortcuts(params) {
  const { shortcuts, itemData } = params;
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (Array.isArray(data["quick-commands"])) {
    const findObj = data["quick-commands"].find(
      (item) => item.path === itemData.spath
    );
    if (findObj) {
      data["quick-commands"] = data["quick-commands"].map((item) => {
        if (item.path === itemData.spath) {
          item.$shortcuts = shortcuts;
        }
        return item;
      });
    } else {
      data["quick-commands"].push({
        path: itemData.spath,
        $shortcuts: shortcuts,
      });
    }
  } else {
    data["quick-commands"] = [
      {
        path: itemData.spath,
        $shortcuts: shortcuts,
      },
    ];
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
