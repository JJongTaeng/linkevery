import 'styled-components';
import { ColorsTypes, MediaTypes, SizeTypes } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: ColorsTypes;
    size: SizeTypes;
    media: MediaTypes;
    boxShadow: string;
  }
}
