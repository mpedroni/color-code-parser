export class InvalidColorCodeError extends Error {
  constructor(colorCode: string) {
    super();
    this.message = `Couldn't identify the color code type of '${colorCode}'`;
    this.name = 'InvalidColorCode';
  }
}
