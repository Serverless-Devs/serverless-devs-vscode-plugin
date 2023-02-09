import { vscode } from './utilities/vscode';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import './styles/index.less';

function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: 'hello',
      text: 'Hey there partner! 🤠',
    });
  }

  return (
    <main>
      <h1 className="ml-16">Hello World!</h1>
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
    </main>
  );
}

export default App;
