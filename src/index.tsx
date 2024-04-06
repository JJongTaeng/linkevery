import 'reflect-metadata';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import AppComponent from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store';
import { theme } from './style/theme';
import { initContainer } from './container';
import { ThemeProvider } from 'styled-components';
import './initGTM';
import RoomPage from './pages/RoomPage/RoomPage';
import LobbyPage from './pages/LobbyPage/LobbyPage';

initContainer();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

export const router = createHashRouter([
  {
    path: '/',
    element: (
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
    ),
    children: [
      {
        path: '/',
        element: <LobbyPage />,
      },
      {
        path: '/:roomName',
        element: <RoomPage />,
      },
    ],
  },
]);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
