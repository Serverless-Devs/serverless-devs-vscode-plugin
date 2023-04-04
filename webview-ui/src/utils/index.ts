import { get } from "lodash";

export { vscode } from './vscode';
export const sleep = (ms: number = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

export function generateRandom() {
  return Math.random().toString(36).substring(2, 6);
}

export function getLanguage() {
  return get(window, 'SERVERLESS_DEVS_CONFIG.lang', 'en');
}


