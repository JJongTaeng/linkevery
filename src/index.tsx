import 'reflect-metadata';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppComponent from './App';
import './index.css';
import { App } from './service/app/App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store';
import { theme } from './style/theme';
import { container } from 'tsyringe';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: theme.color.primary200,
            },
          }}
        >
          <AppComponent />
        </ConfigProvider>
      </ThemeProvider>
    </HashRouter>
  </Provider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
