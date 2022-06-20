import { RgbComponents } from '../@types';
import { ColorCodeTransformer } from '../transformer';

export class HexTransformer implements ColorCodeTransformer {
  getRgbComponentsInDecimal(colorCode: string): RgbComponents<number> {
    const { r, g, b } = this.getRgbComponentsInHex(colorCode);

    return {
      r: this.hexToDecimal(r),
      g: this.hexToDecimal(g),
      b: this.hexToDecimal(b),
    };
  }

  validate(colorCode: string): boolean {
    const hexColorCodeRegex = /^#[a-f0-9]{3,6}$/gi;
    return !!colorCode.match(hexColorCodeRegex);
  }

  private getRgbComponentsInHex(colorCode: string): RgbComponents<string> {
    colorCode = colorCode.replace('#', '');

    const pattern = this.isShortNotation(colorCode)
      ? /[a-f0-9]{1}/gi
      : /[a-f0-9]{2}/gi;

    const [r, g, b] = colorCode.match(pattern) as RegExpExecArray;

    return this.isShortNotation(colorCode)
      ? {
          r: r + r,
          g: g + g,
          b: b + b,
        }
      : { r, g, b };
  }

  private hexToDecimal(hex: string) {
    return parseInt(hex, 16);
  }

  private isShortNotation(colorCode: string): boolean {
    return colorCode.length === 3;
  }
}
