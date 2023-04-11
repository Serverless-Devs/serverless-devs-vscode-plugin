import { get } from "lodash";
import { Dialog } from '@alicloud/console-components';
import i18n from '@/i18n';

export { vscode } from './vscode';
export const sleep = (ms: number = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

export function generateRandom() {
  return Math.random().toString(36).substring(2, 6);
}

export function getLanguage() {
  return get(window, 'SERVERLESS_DEVS_CONFIG.lang', 'en');
}


export const alert = (props) => {
  return Dialog.alert({
    okProps: {
      children: i18n('webview.common.confirm'),
    },
    cancelProps: {
      children: i18n('webview.common.cancel'),
    },
    ...props,
  });
}

