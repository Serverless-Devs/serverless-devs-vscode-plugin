import axios from 'axios';
import * as core from '@serverless-devs/core';
const { lodash: _ } = core;

export async function getComponentInfo(name: string) {
  const res = await axios.post('https://registry.devsapp.cn/package/content',
    { name },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  );
  return _.get(res, 'data.Response')
}
