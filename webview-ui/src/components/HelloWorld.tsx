import React from 'react';
import { vscode } from '../utilities/vscode';
import AliReadme from '@serverless-cd/ali-readme';
import { Button, Select, Input } from '@alicloud/console-components';

function HelloWorld() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: 'hello',
      text: 'Hey there partner! 🤠',
    });
  }
  return (
    <main>
      <h1 className="ml-16">This is a React app running in a VS Code webview.</h1>
      <pre>{JSON.stringify((window as any).SERVERLESS_DEVS_CONFIG, null, 2)}</pre>
      <Select dataSource={[1, 2]} />
      <Input />
      <Button className="mr-16" type="primary" onClick={handleHowdyClick}>
        测试
      </Button>
      <AliReadme appName="png-compress" onCreate={() => {}}>
        <Button type="primary">查看详情</Button>
      </AliReadme>
    </main>
  );
}

export default HelloWorld;
