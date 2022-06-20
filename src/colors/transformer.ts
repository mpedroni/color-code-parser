import { RgbComponents } from './@types';

export interface ColorCodeTransformer {
  validate(colorCode: string): boolean;
  getRgbComponentsInDecimal(colorCode: string): RgbComponents<number>;
}
