import * as fs from "fs";
import * as path from "path";
import * as core from "@serverless-devs/core";
import { ext } from "../extensionVariables";
import { TEMPLTE_FILE } from "../constants";

export async function autoMark(appPath: string) {
  const spath = getYamlPath(appPath);
  if (await checkYaml(spath)) {
    const filePath = path.join(appPath, TEMPLTE_FILE);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}));
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!Array.isArray(data["marked-yamls"])) {
      data["marked-yamls"] = [];
    }

    if (data["marked-yamls"].length > 0) return;
    data["marked-yamls"].push({
      path: path.relative(ext.cwd, spath),
      alias: "默认环境",
    });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    ext.localResource.refresh();
  }
}

async function checkYaml(filePath: string) {
  try {
    // 方法执行成功说明yaml文件符合devs规范
    await core.transforYamlPath(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

function getYamlPath(appPath: string) {
  const yamlPath = path.join(appPath, "s.yaml");
  if (fs.existsSync(yamlPath)) {
    return yamlPath;
  }
  const ymlPath = path.join(appPath, "s.yml");
  if (fs.existsSync(ymlPath)) {
    return ymlPath;
  }
}
