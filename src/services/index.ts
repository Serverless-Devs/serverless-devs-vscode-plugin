import * as core from '@serverless-devs/core';

export async function getComponentInfo(name: string) {
  // TODO: 替换 core.request
  return await core.request('https://registry.devsapp.cn/package/content', {
    method: 'post',
    body: { name },
    form: true,
  });
}
