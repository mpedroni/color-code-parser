import { RgbComponents } from './@types';

export interface ColorParser {
  validate(colorCode: string): boolean;
  parse(colorCode: string): RgbComponents<number>;
}
