interface ColorValidator {
  validate(colorCode: string): boolean;
}

class HexColorValidator implements ColorValidator {
  validate(colorCode: string): boolean {
    colorCode = colorCode.replaceAll(' ', '');
    const hexColorCodeRegex = /^#[a-f0-9]{3,6}$/gi;

    return !!colorCode.match(hexColorCodeRegex);
  }
}

class RgbColorValidator implements ColorValidator {
  validate(colorCode: string): boolean {
    colorCode = colorCode.replaceAll(' ', '');

    const hasRgbDelimiters = () => !!colorCode.match(/^rgb\(.+\)$/);
    const hasExactlyThreePositiveNumbers = () =>
      colorCode.match(/[(,][0-9]+/g)?.length === 3;
    const hasExactlyThreeNumbersBetweenZeroAnd255 = () =>
      colorCode.match(/\b([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\b/g)?.length ===
      3;

    return (
      hasRgbDelimiters() &&
      hasExactlyThreePositiveNumbers() &&
      hasExactlyThreeNumbersBetweenZeroAnd255()
    );
  }
}

export class ColorBuilder {
  private static hexValidator: ColorValidator = new HexColorValidator();
  private static rgbValidator: ColorValidator = new RgbColorValidator();

  static build(colorCode: string): Color {
    if (ColorBuilder.hexValidator.validate(colorCode))
      return new HexColor(colorCode);
    if (ColorBuilder.rgbValidator.validate(colorCode))
      return new RgbColor(colorCode);

    throw new Error(`Couldn't identify the type of color code '${colorCode}'`);
  }
}

export abstract class Color {
  protected colorCode: string;

  constructor(colorCode: string) {
    this.colorCode = colorCode;
  }

  static new(colorCode: string) {
    return ColorBuilder.build(colorCode);
  }

  abstract rgb(): string;
}

type RgbComponents<T> = {
  r: T;
  g: T;
  b: T;
};

class HexColor extends Color {
  constructor(colorCode: string) {
    const parsedColorCode = colorCode.replace('#', '');
    super(parsedColorCode);
  }

  rgb(): string {
    const { r, g, b } = this.getRgbColorComponentsInDecimal();
    return `rgb(${r}, ${g}, ${b})`;
  }

  private getRgbColorComponentsInDecimal(): RgbComponents<number> {
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

class RgbColor extends Color {
  constructor(colorCode: string) {
    super(colorCode);
  }

  rgb(): string {
    return this.colorCode;
  }
}
