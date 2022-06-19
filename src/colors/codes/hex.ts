import { RgbComponents } from '../@types';
import { ColorParser } from '../parser';

export class HexParser implements ColorParser {
  private colorCode: string = '';

  parse(colorCode: string): RgbComponents<number> {
    this.colorCode = colorCode.replace('#', '');
    return this.getRgbComponentsInDecimal();
  }

  validate(colorCode: string): boolean {
    colorCode = colorCode.replaceAll(' ', '');
    const hexColorCodeRegex = /^#[a-f0-9]{3,6}$/gi;

    return !!colorCode.match(hexColorCodeRegex);
  }

  private getRgbComponentsInDecimal(): RgbComponents<number> {
    const { r, g, b } = this.getRgbComponentsInHex();

    return {
      r: this.hexToDecimal(r),
      g: this.hexToDecimal(g),
      b: this.hexToDecimal(b),
    };
  }

  private getRgbComponentsInHex(): RgbComponents<string> {
    const pattern = this.isShortNotation() ? /[a-f0-9]{1}/gi : /[a-f0-9]{2}/gi;

    const [r, g, b] = this.colorCode.match(pattern) as RegExpExecArray;

    return this.isShortNotation()
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

  private isShortNotation(): boolean {
    return this.colorCode.length === 3;
  }
}
