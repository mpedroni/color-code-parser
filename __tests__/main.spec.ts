class Color {
  private code;

  constructor(code: string) {
    const hexPattern = /^#[Aa-fF0-9]{3,6}$/g;
    const rgbPatterns = [
      // has ^rgb(...)$ substring
      (code: string) => !!code.match(/^rgb\(.+\)$/),
      // matches exactly 3 positive numbers
      (code: string) =>
        code.replaceAll(' ', '').match(/[(,][0-9]+/g)?.length === 3,
      // matches exactly 3 numbers between 0 and 255
      (code: string) =>
        code
          .replaceAll(' ', '')
          .match(/\b([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\b/g)?.length === 3,
    ];

    const isValidHex = code.match(hexPattern);
    let isValidRgb = true;

    for (const pattern of rgbPatterns) {
      if (!pattern(code)) {
        isValidRgb = false;
        break;
      }
    }

    if (!isValidHex && !isValidRgb) throw new Error('Invalid color code');

    this.code = code;
  }
}

test('should throws an error when the color code is invalid', () => {
  expect(new Color('#ffffff')).toBeTruthy();
  expect(new Color('#0f0')).toBeTruthy();
  expect(new Color('#424242')).toBeTruthy();
  expect(() => {
    new Color('#f0f0f0f');
  }).toThrowError();
  expect(() => {
    new Color('#f2');
  }).toThrowError();
  expect(() => {
    new Color('#f');
  }).toThrowError();
  expect(() => {
    new Color('a7a7a7');
  }).toThrowError();

  expect(new Color('rgb(255, 255, 255)')).toBeTruthy();
  expect(new Color('rgb(255,255,255)')).toBeTruthy();
  expect(new Color('rgb(0, 73, 255)')).toBeTruthy();
  expect(() => {
    new Color('rgb(256, 256, 256)');
  }).toThrowError();
  expect(() => {
    new Color('rgb(256, 256)');
  }).toThrowError();
  expect(() => {
    new Color('rgb(0, 0, -1)');
  }).toThrowError();
  expect(() => {
    new Color('rgb(0, 0, -1)');
  }).toThrowError();
});
