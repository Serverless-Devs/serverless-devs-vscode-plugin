import './styles/basic.less';
import HelloWorld from './components/HelloWorld';
import { get } from 'lodash';
// light
// import '@alicloud/console-components/dist/wind.css';
// dark
import '@alicloud/console-components/dist/xconsole-dark.css';

function App() {
  const componentName = get(window, 'SERVERLESS_DEVS_CONFIG.componentName', 'HelloWorld');
  if (componentName === 'HelloWorld') {
    return <HelloWorld />;
  }
  return <div>Not Found</div>;
}

export default App;
