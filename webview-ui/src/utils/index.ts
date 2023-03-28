export { vscode } from './vscode';

export const sleep = (ms: number = 10000) => new Promise((resolve) => setTimeout(resolve, ms));
