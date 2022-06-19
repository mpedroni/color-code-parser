import { HexParser } from './codes/hex';
import { RgbParser } from './codes/rgb';
import { Color, RgbComponents } from './@types';
import { InvalidColorCodeError } from './errors';
import { ColorParser } from './parser';

export class ColorFactory {
  private static hex: ColorParser = new HexParser();
  private static rgb: ColorParser = new RgbParser();

  private static handlers: ColorParser[] = [this.hex, this.rgb];

  static build(colorCode: string): Color {
    const handler = this.getColorCodeHandler(colorCode);
    return new ColorImpl(handler.parse(colorCode));
  }

  private static getColorCodeHandler(colorCode: string): ColorParser {
    const handler = this.handlers.find(h => h.validate(colorCode));

    if (!handler) throw new InvalidColorCodeError(colorCode);

    return handler;
  }
}

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
