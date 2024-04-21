import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/style/theme';
import React from 'react';
import { HashRouter } from 'react-router-dom';

const preview: Preview = {
  decorators: [
    (Story: any) => (
      <HashRouter>
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </HashRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
