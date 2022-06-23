import { RgbComponents } from '../@types';
import { ColorCodeTransformer } from '../transformer';

type HslComponents = {
  h: number;
  s: number;
  l: number;
};

export class HslTransformer implements ColorCodeTransformer {
  getRgbComponentsInDecimal(colorCode: string): RgbComponents<number> {
    const hslComponents = this.getHslComponents(colorCode);

    const rgb = this.hslComponentsToRgbComponents(hslComponents);
    return rgb;
  }

  private getHslComponents(colorCode: string): HslComponents {
    const [h, s, l] = colorCode.match(/([^a-z,()]+)/g) as RegExpMatchArray;

    return {
      h: Number(h),
      s: this.percentualToNumber(s),
      l: this.percentualToNumber(l),
    };
  }

  // https://www.rapidtables.com/convert/color/hsl-to-rgb.html
  private hslComponentsToRgbComponents(
    hsl: HslComponents,
  ): RgbComponents<number> {
    const { h, s, l } = hsl;

    const C = (1 - Math.abs(2 * l - 1)) * s;
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - C / 2;

    const getArrangement = (hue: number): number[] => {
      if (hue < 60) return [C, X, 0];
      if (hue < 120) return [X, C, 0];
      if (hue < 180) return [0, C, X];
      if (hue < 240) return [0, X, C];
      if (hue < 300) return [X, 0, C];
      return [C, 0, X];
    };

    const arrangementToRgbComponents = (
      arrangement: number[],
    ): RgbComponents<number> => {
      let [r, g, b] = arrangement;

      r = (r + m) * 255;
      g = (g + m) * 255;
      b = (b + m) * 255;

      return {
        r: Math.floor(r),
        g: Math.floor(g),
        b: Math.floor(b),
      };
    };

    const arrangement = getArrangement(h);
    const rgb = arrangementToRgbComponents(arrangement);

    return rgb;
  }

  private percentualToNumber(percentual: string): number {
    return Number(percentual.replace('%', '')) / 100;
  }

  validate(colorCode: string): boolean {
    colorCode = colorCode.replaceAll(' ', '');

    const hasHslDelimiters = () => !!colorCode.match(/^hsl\(.+\)$/);

    return hasHslDelimiters() && this.validateHslComponents(colorCode);
  }

  private validateHslComponents(colorCode: string): boolean {
    const [h, s, l] = colorCode.match(/([^a-z,()]+)/gi) as RegExpMatchArray;

    const isPercentualValue = (v: string) => {
      if (!v.includes('%')) return false;

      const n = Number(v.replace('%', ''));

      return n >= 0 && n <= 100;
    };

    const isValidH = () => {
      return Number(h) >= 0 && Number(h) < 360;
    };
    const isValidS = () => isPercentualValue(s);
    const isValidL = () => isPercentualValue(l);

    return isValidH() && isValidS() && isValidL();
  }
}
