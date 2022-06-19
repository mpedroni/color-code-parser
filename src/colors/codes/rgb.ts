import { RgbComponents } from '../@types';
import { ColorParser } from '../parser';

export class RgbParser implements ColorParser {
  private colorCode: string = '';

  parse(colorCode: string): RgbComponents<number> {
    this.colorCode = colorCode.replace('#', '');
    return this.getRgbComponentsInDecimal();
  }

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

  private getRgbComponentsInDecimal(): RgbComponents<number> {
    const rgb = this.colorCode.match(/([0-9]{1,3})/g) as RegExpExecArray;
    const [r, g, b] = rgb.map(Number);

    return { r, g, b };
  }
}
