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

interface ColorParser {
  parse(colorCode: string): RgbComponents<number>;
}

class HexParser implements ColorParser {
  private colorCode: string = '';

  parse(colorCode: string): RgbComponents<number> {
    this.colorCode = colorCode.replace('#', '');
    return this.getRgbComponentsInDecimal();
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

class RgbParser implements ColorParser {
  private colorCode: string = '';

  parse(colorCode: string): RgbComponents<number> {
    this.colorCode = colorCode.replace('#', '');
    return this.getRgbComponentsInDecimal();
  }

  private getRgbComponentsInDecimal(): RgbComponents<number> {
    const rgb = this.colorCode.match(/([0-9]{1,3})/g) as RegExpExecArray;
    const [r, g, b] = rgb.map(Number);

    return { r, g, b };
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

interface ColorHandler {
  validator: ColorValidator;
  parser: ColorParser;
}

export class ColorBuilder {
  private static hex: ColorHandler = {
    validator: new HexColorValidator(),
    parser: new HexParser(),
  };
  private static rgb: ColorHandler = {
    validator: new RgbColorValidator(),
    parser: new RgbParser(),
  };

  private static handlers: ColorHandler[] = [this.hex, this.rgb];

  static build(colorCode: string): Color {
    const handler = this.handlers.find(({ validator }) =>
      validator.validate(colorCode),
    );

    if (!handler)
      throw new Error(
        `Couldn't identify the type of color code '${colorCode}'`,
      );

    return new ColorImpl(handler.parser.parse(colorCode));
  }
}

export abstract class Color {
  protected color: RgbComponents<number>;
  constructor(color: RgbComponents<number>) {
    this.color = color;
  }

  static new(colorCode: string) {
    return ColorBuilder.build(colorCode);
  }

  abstract hex(): string;
  abstract rgb(): string;
}
export class ColorImpl extends Color {
  constructor(color: RgbComponents<number>) {
    super(color);
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

type RgbComponents<T> = {
  r: T;
  g: T;
  b: T;
};
