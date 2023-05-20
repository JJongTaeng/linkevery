import { CSSProp, DefaultTheme, css } from 'styled-components';

interface MediaTest {
  mobile: (literals: TemplateStringsArray, ...args: string[]) => CSSProp;
  tablet: (literals: TemplateStringsArray, ...args: string[]) => CSSProp;
  desktop: (literals: TemplateStringsArray, ...args: string[]) => CSSProp;
}

const color = {
  white: '#ffffff',
  primary100: '#2e2a63',
  primary200: '#47419c',
  primary400: '#c7b9ed',
  primary800: '#f9f7fc',
  grey100: '#3c3a42',
  grey800: '#dddae6',
};

const mediaSize = {
  mobile: 580,
  tablet: 768,
  desktop: 1284,
};

const media: MediaTest = {
  mobile: (literals, ...args) => css`
    @media only screen and (max-width: ${mediaSize.mobile}px) {
      ${css(literals, ...args)}
    }
  `,
  tablet: (literals, ...args) => css`
    @media only screen and (max-width: ${mediaSize.tablet}px) {
      ${css(literals, ...args)}
    }
  `,
  desktop: (literals, ...args) => css`
    @media only screen and (max-width: ${mediaSize.desktop}px) {
      ${css(literals, ...args)}
    }
  `,
};

const size = {
  xxl: 40,
  xl: 24,
  lg: 20,
  md: 16,
  sm: 12,
};

const boxShadow = '0 0 8px 4px rgba(0, 0, 0, 0.1)';

export const theme: DefaultTheme = {
  color,
  size,
  media,
  boxShadow,
};

export type ColorsTypes = typeof color;
export type SizeTypes = typeof size;
export type MediaTypes = typeof media;
