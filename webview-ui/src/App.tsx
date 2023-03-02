import './styles/index.less';
import HelloWorld from './components/hello-world';
import GlobalSettings from './components/global-settings';
import { get } from 'lodash';

function App() {
  const SERVERLESS_DEVS_CONFIG = get(window, 'SERVERLESS_DEVS_CONFIG');
  const componentName: string = get(SERVERLESS_DEVS_CONFIG, 'componentName', 'GlobalSettings');
  const Comp = () => {
    if (componentName === 'HelloWorld') {
      return <HelloWorld />;
    }
    if (componentName === 'GlobalSettings') {
      return <GlobalSettings />;
    }
    return <div>Not Found</div>;
  };

  return (
    <>
      <pre>{JSON.stringify(SERVERLESS_DEVS_CONFIG, null, 2)}</pre>
      <Comp />
    </>
  );
}

export default App;
