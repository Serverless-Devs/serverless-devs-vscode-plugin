import en from './locales/en'
import zh from './locales/zh'
import * as core from '@serverless-devs/core';

import { getLanguage } from '../utils';
const { template } = core;

const langMap = {
    en,
    zh,
}

const i18n = (key: string, args?: Record<string, any>) => {
    const lang = getLanguage();
    const data = langMap[lang];
    const value = data[key]
    if (!value) return key;
    return args ? template(value)(args) : value;
}

export default i18n;

