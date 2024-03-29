import i18n from '@/i18n';
import SlidePanel from '@alicloud/console-components-slide-panel';

const MySlidePanel = (props) => {
  return (
    <SlidePanel width="large" okText={i18n('webview.common.confirm')} cancelText={i18n('webview.common.cancel')} processingText={i18n('webview.common.processing')} {...props} />
  );
};

export default MySlidePanel;
