import Color from '../src/lib/color-code-parser';
import type { Color as ColorType } from '../src/colors/@types';

describe('Color code validations', () => {
  describe('hex representation', () => {
    it('should accept the 6-digit format', () => {
      expect(Color.new('#f3a567')).toBeTruthy();
      expect(Color.new('#0e3d54')).toBeTruthy();
    });

    it('should accept the 3-digit format', () => {
      expect(Color.new('#0f0')).toBeTruthy();
      expect(Color.new('#a4e')).toBeTruthy();
    });

    it('should be case insensitive', () => {
      expect(Color.new('#FFF')).toBeTruthy();
      expect(Color.new('#fff')).toBeTruthy();
    });

    it('should throws an error when the color code is invalid', () => {
      expect(() => {
        Color.new('#f0f0f0f');
      }).toThrowError();
      expect(() => {
        Color.new('#ggg');
      }).toThrowError();
      expect(() => {
        Color.new('#f2');
      }).toThrowError();
      expect(() => {
        Color.new('#f');
      }).toThrowError();
      expect(() => {
        Color.new('a7a7a7');
      }).toThrowError();
    });
  });

  describe('rgb representation', () => {
    it('should accept with or without spaces format', () => {
      expect(Color.new('rgb(255, 255, 255)')).toBeTruthy();
      expect(Color.new('rgb(255,255,255)')).toBeTruthy();
      expect(Color.new('rgb(0, 73,255)')).toBeTruthy();
    });

    it('should throws an error when the color code is invalid', () => {
      expect(() => {
        Color.new('rgb(256, 256, 256)');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(256, 256)');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(0, 0, -1)');
      }).toThrowError();
      expect(() => {
        Color.new('rgb()');
      }).toThrowError();
      expect(() => {
        Color.new('rgb 255, 0, 255');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(40, 40, 40)a');
      }).toThrowError();
    });
  });
});

describe('Color parsing', () => {
  let white: ColorType;
  let black: ColorType;
  let gray: ColorType;
  let cyan: ColorType;

  describe('HEX to', () => {
    beforeEach(() => {
      white = Color.new('#fff');
      black = Color.new('#000000');
      gray = Color.new('#222');
      cyan = Color.new('#0e7490');
    });

    test('RGB', () => {
      expect(white.rgb()).toBe('rgb(255, 255, 255)');
      expect(black.rgb()).toBe('rgb(0, 0, 0)');
      expect(gray.rgb()).toBe('rgb(34, 34, 34)');
      expect(cyan.rgb()).toBe('rgb(14, 116, 144)');
    });

    test('HEX', () => {
      expect(white.hex()).toBe('#ffffff');
      expect(black.hex()).toBe('#000000');
      expect(gray.hex()).toBe('#222222');
      expect(cyan.hex()).toBe('#0e7490');
    });
  });

  describe('RGB to', () => {
    beforeEach(() => {
      white = Color.new('rgb(255, 255, 255)');
      black = Color.new('rgb(0, 0, 0)');
      gray = Color.new('rgb(34, 34, 34)');
      cyan = Color.new('rgb(14, 116, 144)');
    });

    test('HEX', () => {
      expect(white.hex()).toBe('#ffffff');
      expect(black.hex()).toBe('#000000');
      expect(gray.hex()).toBe('#222222');
      expect(cyan.hex()).toBe('#0e7490');
    });

    test('RGB', () => {
      expect(white.rgb()).toBe('rgb(255, 255, 255)');
      expect(black.rgb()).toBe('rgb(0, 0, 0)');
      expect(gray.rgb()).toBe('rgb(34, 34, 34)');
      expect(cyan.rgb()).toBe('rgb(14, 116, 144)');
    });
  });
});
