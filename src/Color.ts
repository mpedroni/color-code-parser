interface ColorCodeValidator {
  validate(colorCode: string): boolean;
}

class HexColorCodeValidator implements ColorCodeValidator {
  validate(colorCode: string): boolean {
    colorCode = colorCode.replaceAll(' ', '');
    const hexColorCodeRegex = /^#[Aa-fF0-9]{3,6}$/g;

    return !!colorCode.match(hexColorCodeRegex);
  }
}

class RgbColorCodeValidator implements ColorCodeValidator {
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
  private static hexValidator: ColorCodeValidator = new HexColorCodeValidator();
  private static rgbValidator: ColorCodeValidator = new RgbColorCodeValidator();

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

class HexColor extends Color {
  constructor(colorCode: string) {
    super(colorCode);
  }

  rgb(): string {
    const { r, g, b } = this.getRgbPortions();

    return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`;
  }

  private getRgbPortions(): { r: string; g: string; b: string } {
    const colorCode = this.colorCode.replace('#', '');

    if (colorCode.length === 3) {
      const rgb = colorCode.match(/[a-f0-9]{1}/gi) as RegExpExecArray;

      const [r, g, b] = rgb;

      return {
        r: r + r,
        g: g + g,
        b: b + b,
      };
    }

    const rgb = colorCode.match(/[a-f0-9]{2}/gi) as RegExpExecArray;

    const [r, g, b] = rgb;

    return {
      r,
      g,
      b,
    };
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
