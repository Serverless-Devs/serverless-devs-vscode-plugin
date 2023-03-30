import { QuickPickItem } from 'vscode';

export interface IPickItem extends QuickPickItem {
  value: string;
}

export interface IMultiStepInputState {
  title: string;
  step: number;
  totalSteps: number;
  pickItem: IPickItem;
  name: string;
  value: string;
}

export enum CreateAppType {
  template = 'template',
  registry = 'registry',
}
