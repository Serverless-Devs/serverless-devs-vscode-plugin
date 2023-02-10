import './styles/basic.less';
import HelloWorld from './components/HelloWorld';
import { get } from 'lodash';

function App() {
  const componentName = get(window, 'SERVERLESS_DEVS_CONFIG.componentName', 'HelloWorld');
  if (componentName === 'HelloWorld') {
    return <HelloWorld />;
  }
  return <div>Not Found</div>;
}

export default App;
