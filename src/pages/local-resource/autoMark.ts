import * as fs from "fs";
import * as path from "path";
import * as core from "@serverless-devs/core";
import { ext } from "../../extensionVariables";
import { TEMPLTE_FILE } from "../../constants";

export async function autoMark(appPath: string) {
  const filePath = path.join(appPath, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    const spaths = await getYamlPath(appPath);
    fs.writeFileSync(filePath, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!Array.isArray(data["marked-yamls"])) {
      data["marked-yamls"] = [];
    }
    for (const spath of spaths) {
      if (await checkYaml(spath)) {
        data["marked-yamls"].push({
          path: path.relative(ext.cwd, spath),
          alias: "默认环境",
        });
      }
    }
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

async function getYamlPath(appPath: string): Promise<string[]> {
  try {
    const yamlList: string[] = new Array();
    await fileSearch(appPath, yamlList);
    return yamlList;
  } catch (e) {
    console.error(e);
  }
}

async function fileSearch(dirPath: string, yamlList: string[]) {
  const files = await fsReadDir(dirPath);
  const regexp = new RegExp(/^s(.*?)[.yaml|.yml]$/);
  const promises = files.map(file => {
    return fsStat(path.join(dirPath, file));
  });
  const datas = await Promise.all(promises).then(stats => {
    for (let i = 0; i < files.length; i += 1) {
      files[i] = path.join(dirPath, files[i]);
    }
    return { stats, files };
  });
  for (const stat of datas.stats) {
    const index = datas.stats.indexOf(stat);
    const fullFileame = datas.files[index];
    const filename = fullFileame.split('/').pop();
    if (stat.isDirectory()) {
      await fileSearch(datas.files[index], yamlList);
    }
    if (stat.isFile() && regexp.test(filename)) {
      console.log(fullFileame);
      yamlList.push(fullFileame);
    }
  }
  // datas.stats.forEach(stat => {
  //   const index = datas.stats.indexOf(stat);
  //   const fullFileame = datas.files[index];
  //   const filename = fullFileame.split('/').pop();
  //   if (stat.isDirectory()) {
  //     fileSearch(datas.files[index], yamlList);
  //   }
  //   if (stat.isFile() && regexp.test(filename)) {
  //     console.log(fullFileame);
  //     yamlList.push(fullFileame);
  //   }
  // });
}

function fsReadDir(dir: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

function fsStat(path: string) {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) reject(err);
      resolve(stat);
    });
  });
}