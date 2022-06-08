import * as path from "path";
import * as fs from "fs";
import { ext } from "../extensionVariables";
import { TEMPLTE_FILE } from "../constants";

export { getHtmlForWebview } from "./getHtmlForWebview";
export { MultiStepInput } from "./multiStepInput";
export { ItemData, TreeItem } from "./treeItem";

export function getQuickCommandList() {
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Array.isArray(data["quick-commands"]) ? data["quick-commands"] : [];
}
