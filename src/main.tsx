import 'reflect-metadata';
import 'antd/dist/reset.css';
import './initGTM';
import './index.css';

import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { theme } from 'style/theme.ts';

import { store } from 'store/store';
import { initContainer } from 'container';
import { ThemeProvider } from 'styled-components';

import RoomPage from 'pages/RoomPage/RoomPage';
import LobbyPage from 'pages/LobbyPage/LobbyPage';
import AppComponent from 'App';

initContainer();
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
