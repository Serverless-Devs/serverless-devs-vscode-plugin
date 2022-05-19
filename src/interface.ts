import { QuickPickItem } from "vscode";

export interface IPickItem extends QuickPickItem {
  value: string;
}

export interface State {
  title: string;
  step: number;
  totalSteps: number;
  pickItem: IPickItem;
  name: string;
  value: string;
}
