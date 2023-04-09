import { ColorsTypes, SizeTypes } from './theme';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: ColorsTypes;
    size: SizeTypes;
  }
}
