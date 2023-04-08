import { DefaultTheme } from 'styled-components';
const color = {
  white: '#ffffff',
  grey100: '#272727',
  grey200: '#444444',
  grey400: '#cccccc',
  grey800: '#efefef',
};

export const theme: DefaultTheme = {
  color,
};

export type ColorsTypes = typeof color;
