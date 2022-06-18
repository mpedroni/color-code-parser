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
    return 'rgb(255, 255, 255)';
  }
}

class RgbColor extends Color {
  constructor(colorCode: string) {
    super(colorCode);
  }

  rgb(): string {
    return super.colorCode;
  }
}
