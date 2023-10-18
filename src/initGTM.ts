import TagManger from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: 'GTM-MR4B7C37',
};

if (!(process.env.NODE_ENV === 'development')) {
  TagManger.initialize(tagManagerArgs);
} else {
  window.dataLayer = [];
}
