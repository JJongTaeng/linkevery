import { DefaultTheme } from 'styled-components';
const color = {
  grey100: '#272727',
  grey200: '#333333',
  grey800: '#efefef',
};

export const theme: DefaultTheme = {
  color,
};

export type ColorsTypes = typeof color;
