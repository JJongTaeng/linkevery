import TagManger from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: 'GTM-MR4B7C37',
};
if (import.meta.env.PROD) {
  TagManger.initialize(tagManagerArgs);
} else {
  window.dataLayer = [];
}
