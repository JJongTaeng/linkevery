import { DefaultTheme } from 'styled-components';
const color = {
  white: '#ffffff',
  blue100: '#1234ff',
  blue800: '#abcdff',
  grey100: '#272727',
  grey200: '#444444',
  grey400: '#cccccc',
  grey800: '#efefef',
};

const size = {
  xl: 24,
  lg: 20,
  md: 16,
  sm: 12,
};

export const theme: DefaultTheme = {
  color,
  size,
};

export type ColorsTypes = typeof color;
export type SizeTypes = typeof size;
