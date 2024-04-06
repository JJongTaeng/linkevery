import 'reflect-metadata';
import 'antd/dist/reset.css';
import './initGTM';
import './index.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { store } from 'store/store';
import { initContainer } from 'container';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/theme.ts';
import { ConfigProvider } from 'antd';
import AppComponent from './App.tsx';
import LobbyPage from './pages/LobbyPage/LobbyPage.tsx';
import RoomPage from './pages/RoomPage/RoomPage.tsx';
import ScreenSharePage from './pages/ScreenSharePage/ScreenSharePage.tsx';

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
        path: '/screen/:roomName',
        element: <ScreenSharePage />,
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
