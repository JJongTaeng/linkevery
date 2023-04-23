import { DefaultTheme } from 'styled-components';
const color = {
  white: '#ffffff',
  primary100: '#2e2a63',
  primary200: '#47419c',
  primary400: '#c7b9ed',
  primary800: '#f9f7fc',
  grey100: '#3c3a42',
  grey800: '#dddae6',
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
