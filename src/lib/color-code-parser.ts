import { Color, RgbComponents } from '../colors/@types';
import { HexTransformer } from '../colors/codes/hex';
import { RgbTransformer } from '../colors/codes/rgb';
import { InvalidColorCodeError } from '../colors/errors';
import { ColorCodeTransformer } from '../colors/transformer';

class ColorImpl implements Color {
  private color: RgbComponents<number>;

  constructor(color: RgbComponents<number>) {
    this.color = color;
  }

  rgb(): string {
    const { r, g, b } = this.color;
    return `rgb(${r}, ${g}, ${b})`;
  }

  hex(): string {
    const { r, g, b } = this.getRgbComponentsInHex();
    return '#' + r + g + b;
  }

  private getRgbComponentsInHex(): RgbComponents<string> {
    const { r, g, b } = this.color;

    return {
      r: this.decimalToHex(r),
      g: this.decimalToHex(g),
      b: this.decimalToHex(b),
    };
  }

  private decimalToHex(decimal: number): string {
    return decimal.toString(16).padStart(2, '0');
  }
}

const transformers: ColorCodeTransformer[] = [
  new HexTransformer(),
  new RgbTransformer(),
];
export abstract class ColorCodeParser {
  static transformers = transformers;

  static new(colorCode: string): Color {
    const handler = this.getColorCodeHandler(colorCode);
    return new ColorImpl(handler.getRgbComponentsInDecimal(colorCode));
  }

  private static getColorCodeHandler(colorCode: string): ColorCodeTransformer {
    const transformer = this.transformers.find(t => t.validate(colorCode));

    if (!transformer) throw new InvalidColorCodeError(colorCode);

    return transformer;
  }
}

export default ColorCodeParser;
