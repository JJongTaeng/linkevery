import { css, CSSProp, DefaultTheme } from 'styled-components';

interface MediaTest {
  mobile: (literals: TemplateStringsArray, ...args: string[]) => CSSProp;
  tablet: (literals: TemplateStringsArray, ...args: string[]) => CSSProp;
  desktop: (literals: TemplateStringsArray, ...args: string[]) => CSSProp;
}

const color = {
  white: '#ffffff',
  dark100: '#060607',
  dark200: '#4E5058',
  primary100: '#D8D9DD',
  primary200: '#E3E5E8',
  primary400: '#F2F3F5',
  primary800: '#FFFFFF',

  blue400: '#5865F2',

  red400: '#DA373C',
  red800: '#EB459F',

  grey100: '#3c3a42',
  grey400: '#8c8c8c',
  grey800: '#dddae6',
  borderColor: 'rgba(128, 132, 142, 0.24)',
};

export const mediaSize = {
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
