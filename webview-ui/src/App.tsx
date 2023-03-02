import './styles/basic.less';
import HelloWorld from './components/HelloWorld';
import GlobalSettings from './components/GlobalSettings';
import { get } from 'lodash';

function App() {
  const componentName = get(window, 'SERVERLESS_DEVS_CONFIG.componentName', 'HelloWorld');
  if (componentName === 'HelloWorld') {
    return <HelloWorld />;
  }
  if (componentName === 'GlobalSettings') {
    return <GlobalSettings />;
  }
  return <div>Not Found</div>;
}

export default App;
