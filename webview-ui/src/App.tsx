import { vscode } from './utilities/vscode';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import './styles/basic.less';
import A from './components/A';
import B from './components/B';

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
      <A />
      <B />
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
    </main>
  );
}

export default App;
