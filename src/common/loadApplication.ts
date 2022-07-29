import * as path from 'path';
import * as fs from 'fs-extra';
import _, { get, sortBy } from 'lodash';
import * as rimraf from 'rimraf';
import { RegistryEnum } from '@serverless-devs/core/dist/common/constant';
import parse from '@serverless-devs/core/dist/common/load/parse';
import request from '@serverless-devs/core/dist/common/request';
import yaml from 'js-yaml';
import { downloadRequest, getYamlContent, setConfig, zip } from '@serverless-devs/core';
var artTemplate = require('art-template');

interface IParams {
  source: string; // 应用名称
  target: string; // 下载目录路径
  appName: string; // 目录名称
  access: string; // s.yaml文件里的密钥
}

async function tryfun(f: Promise<any>) {
  try {
    return await f;
  } catch (error) {
    // ignore error, 不抛出错误，需要寻找不同的源
  }
}

function getYamlPath(prePath: string, name: string) {
  const S_PATH1 = path.join(prePath, `${name}.yaml`);
  if (fs.existsSync(S_PATH1)) return S_PATH1;
  const S_PATH2 = path.join(prePath, `${name}.yml`);
  if (fs.existsSync(S_PATH2)) return S_PATH2;
};

async function isYamlFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${filePath} file was not found.`);
  }
  const arr = ['.yaml', '.yml'];
  if (!arr.includes(path.extname(filePath))) {
    throw new Error(`${filePath} file should be yaml or yml file.`);
  }
  try {
    await yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (error /* YAMLException */) {
    const filename = path.basename(filePath);
    let message = `${filename} format is incorrect`;
    if (error.message) message += `: ${error.message}`;
    throw new Error(
      JSON.stringify({
        message,
        tips: `Please check the configuration of ${filename}}`,
      }),
    );
  }
}

class LoadApplication {
  private config: IParams;
  private publishYamlData: any;
  private applicationPath: any;
  constructor(config: IParams) {
    this.config = config;
  }

  async loadServerless() {
    const source = `./${this.config.source}`;
    const [provider, appName] = source.split('/');
    if (!appName) return;
    let zipball_url: string;
    const result = await request(`${RegistryEnum.serverless}/${appName}/releases`);
    if (!get(result[0], 'zipball_url')) return;
    zipball_url = result[0].zipball_url;
    const applicationPath = path.resolve(this.config.target, this.config.appName);
    return this.handleDecompressFile({
      zipball_url,
      applicationPath,
      appName
    });
  }

  async handleDecompressFile({ zipball_url, applicationPath, appName }) {
    const isExists = this.checkFileExists(applicationPath);
    if (!isExists) return applicationPath;
    const temporaryPath = `${applicationPath}${new Date().getTime()}`;
    await downloadRequest(zipball_url, temporaryPath, {
      extract: true,
    });
    const publishYamlData = await getYamlContent(path.join(temporaryPath, 'package/publish.yaml'));
    if (publishYamlData) {
      fs.copySync(`${temporaryPath}/package/src`, applicationPath);
      rimraf.sync(temporaryPath);
      this.publishYamlData = publishYamlData;
      this.applicationPath = applicationPath;
    } else {
      fs.moveSync(`${temporaryPath}`, applicationPath);
    }
  }

  async checkFileExists(filePath: string) {
    if (process.env.skipPrompt) return true;
    return fs.existsSync(filePath) ? false : true;
  }

  async getSconfig() {
    const properties = get(this.publishYamlData, 'Parameters.properties');
    const requiredList = get(this.publishYamlData, 'Parameters.required');
    const promptList = [];
    if (properties) {
      let rangeList = [];
      for (const key in properties) {
        const ele = properties[key];
        ele['_key'] = key;
        rangeList.push(ele);
      }
      // 过滤掉非必需的property
      const filterRangeList = rangeList.filter(
        o => requiredList.indexOf(o._key) > -1
      );
      rangeList = sortBy(filterRangeList, (o) => o['x-range']);
      for (const item of rangeList) {
        promptList.push( {
          title: item.title,
          type: item.type,
          name: item._key,
          default: item.default,
          choices: item.enum || undefined 
        });
      }
      return promptList;
    }
  }
  async setSconfigToLocal(requireConfig: any) {
    const spath = getYamlPath(this.applicationPath, 's');
    let result: any = {};
    if (this.config.access) {result.access = this.config.access;}
    requireConfig.forEach(element => {
      result[element.name] = element.input;
    });
    artTemplate.defaults.extname = path.extname(spath);
    let newData = artTemplate(spath, result);
    fs.writeFileSync(spath, newData, 'utf-8');
    await isYamlFile(spath);
    newData = parse({ appName: this.config.appName }, newData);
    fs.writeFileSync(spath, newData, 'utf-8');
  }
}

export default LoadApplication;