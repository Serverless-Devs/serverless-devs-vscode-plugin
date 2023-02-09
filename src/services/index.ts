import * as core from '@serverless-devs/core';

export async function getComponentInfo(name: string) {
  return await core.request('https://registry.devsapp.cn/package/content', {
    method: 'post',
    body: { name },
    form: true,
  });
}
