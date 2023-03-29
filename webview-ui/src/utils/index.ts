export { vscode } from './vscode';

export const sleep = (ms: number = 3000) => new Promise((resolve) => setTimeout(resolve, ms));
