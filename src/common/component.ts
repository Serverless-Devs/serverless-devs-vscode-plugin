import * as core from '@serverless-devs/core';
import * as path from 'path';

const { rimraf, getYamlContent, fse: fs } = core;
const sPath = core.getRootHome();
const componentsPath = path.join(sPath, 'components');
const devsappPath = path.join(componentsPath, 'devsapp.cn');

async function getComponent(filePath: string) {
  const data = await getYamlContent(path.join(filePath, 'publish.yaml'));
  if (data && data.Type === 'Component') {
    data.isComponent = true;
    return data;
  }
  return {
    isComponent: false,
  };
}

async function getFolderSize(rootItemPath: string) {
  const fileSizes = new Map();
  await processItem(rootItemPath);
  async function processItem(itemPath: string) {
    const stats = fs.lstatSync(itemPath);
    if (typeof stats !== 'object') return;
    fileSizes.set(stats.ino, stats.size);
    if (stats.isDirectory()) {
      const directoryItems = fs.readdirSync(itemPath);
      if (typeof directoryItems !== 'object') return;
      await Promise.all(directoryItems.map(directoryItem => processItem(path.join(itemPath, directoryItem))));
    }
  }
  const folderSize = Array.from(fileSizes.values()).reduce((total, fileSize) => total + fileSize, 0);
  return folderSize;
}

export async function getComponentWithAll() {
  const serverlessRows = [];
  if (fs.existsSync(devsappPath)) {
    const devsappDirs = fs.readdirSync(devsappPath);
    for (const fileName of devsappDirs) {
      if (fileName === 'devsapp') {
        const devsappSubPath = path.join(devsappPath, fileName);
        const devsappSubDirs = fs.readdirSync(devsappSubPath);
        for (const devsappFileName of devsappSubDirs) {
          const filePath = path.join(devsappSubPath, devsappFileName);
          const data = await getComponent(filePath);
          if (data.isComponent) {
            const size = await getFolderSize(filePath);
            serverlessRows.push({
              Component: `devsapp/${devsappFileName}`,
              Version: data.Version,
              Size: `${(size / 1000 / 1000).toFixed(2)} MB`,
              Description: data.Description,
            });
          }
        }
      } else {
        const filePath = path.join(devsappPath, fileName);
        const data = await getComponent(filePath);
        if (data.isComponent) {
          const size = await getFolderSize(filePath);
          serverlessRows.push({
            Component: data.Name,
            Version: data.Version,
            Size: `${(size / 1000 / 1000).toFixed(2)} MB`,
            Description: data.Description,
          });
        }
      }
    }
  }
  return serverlessRows;
}

export async function deleteComponent(name?: string) {
  const filePath = name ? path.join(devsappPath, name) : componentsPath;
  if (fs.existsSync(filePath)) {
    rimraf.sync(filePath);
    return true;
  }
  throw new Error(`component path does not exist.`);
}