import './styles/index.less';
import HelloWorld from './components/hello-world';
import GlobalSettings from './components/global-settings';
import CredentialList from './components/credential-list';
import ComponentList from './components/component-list';
import CreateApp from './components/create-app';
import { get } from 'lodash';

function App() {
  const SERVERLESS_DEVS_CONFIG = get(window, 'SERVERLESS_DEVS_CONFIG');
  const componentName: string = get(SERVERLESS_DEVS_CONFIG, 'componentName', 'CreateApp');
  const data: any = get(SERVERLESS_DEVS_CONFIG, 'data', {});

  const Comp = () => {
    if (componentName === 'HelloWorld') {
      return <HelloWorld />;
    }
    if (componentName === 'GlobalSettings') {
      return <GlobalSettings {...data} />;
    }
    if (componentName === 'CredentialList') {
      return <CredentialList {...data} />;
    }
    if (componentName === 'ComponentList') {
      return <ComponentList {...data} />;
    }
    if (componentName === 'CreateApp') {
      return <CreateApp {...data} />;
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
