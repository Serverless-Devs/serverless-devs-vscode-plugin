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

export const getAppParams = async (data) => {
  const response = await axios.post(
    `https://registry.devsapp.cn/package/param?lang=${lang}`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  return get(response, 'data.Response', {});
};
