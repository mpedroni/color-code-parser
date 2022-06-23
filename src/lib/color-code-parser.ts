import { Color, RgbComponents } from '../colors/@types';
import { HexTransformer } from '../colors/codes/hex';
import { HslTransformer } from '../colors/codes/hsl';
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
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }

  hex(): string {
    const { r, g, b } = this.getRgbComponentsInHex();
    return '#' + r + g + b;
  }

  // https://www.rapidtables.com/convert/color/rgb-to-hsl.html
  hsl(): string {
    let { r, g, b } = this.color;

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const getL = () => (max + min) / 2;
    const getH = () => {
      if (delta === 0) return 0;

      const rgb: { [component: number]: () => number } = {
        [r]: () => {
          const h = 60 * ((g - b) / delta);
          return h < 0 ? h + 360 : h;
        },
        [g]: () => 60 * ((b - r) / delta + 2),
        [b]: () => 60 * ((r - g) / delta + 4),
      };

      const h = rgb[max]();

      return Math.round(h);
    };

    const getS = () => {
      if (delta === 0) return 0;
      return delta / (1 - Math.abs(2 * getL() - 1));
    };

    const h = getH();
    const s = this.decimalToPercentual(getS());
    const l = this.decimalToPercentual(getL());

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  private decimalToPercentual(n: number): number {
    return Math.round(n * 100 * 2) / 2;
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
  new HslTransformer(),
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
