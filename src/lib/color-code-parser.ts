import { ColorFactory } from '../colors/factory';

export default abstract class {
  static new(colorCode: string) {
    return ColorFactory.build(colorCode);
  }
}
