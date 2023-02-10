import React from 'react';
import { vscode } from '../utilities/vscode';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import AliReadme from '@serverless-cd/ali-readme';
import { Button } from '@alicloud/console-components';

function HelloWorld() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: 'hello',
      text: 'Hey there partner! 🤠',
    });
  }
  return (
    <main>
      <h1 className="ml-16">This is a React app running in a VS Code webview. 123</h1>
      <pre>{JSON.stringify((window as any).SERVERLESS_DEVS_CONFIG, null, 2)}</pre>
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
      <AliReadme appName="png-compress" onCreate={() => {}}>
        <Button className="m-200" type="primary">
          查看详情
        </Button>
      </AliReadme>
    </main>
  );
}

export default HelloWorld;
