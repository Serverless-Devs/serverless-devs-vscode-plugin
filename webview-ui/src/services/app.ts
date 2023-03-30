import axios from 'axios';
import { get } from 'lodash';

const lang = get(window, 'SERVERLESS_DEVS_CONFIG.lang', 'zh');

export const getApps = async (params = { type: 'fc', lang }) => {
  const response = await axios.get(`https://registry.devsapp.cn/console/applications`, { params });
  return get(response, 'data.Response', []);
};

export const getTabs = async (params = { type: 'fc', lang }) => {
  const response = await axios.get(`https://registry.devsapp.cn/console/tabs`, { params });
  return get(response, 'data.Response', []);
};
