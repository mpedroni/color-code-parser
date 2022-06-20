import Color from '../src/lib/color-code-parser';

describe('Color code validations', () => {
  describe('hex', () => {
    it('should accept 6-digit notation', () => {
      expect(Color.new('#222222').hex()).toBeTruthy();
    });

    it('should accept 3-digit notation', () => {
      expect(Color.new('#222').hex()).toBeTruthy();
    });

    it('should be case insensitive', () => {
      expect(Color.new('#aaaaaa').hex()).toBeTruthy();
      expect(Color.new('#AAA').hex()).toBeTruthy();
      expect(Color.new('#AfA').hex()).toBeTruthy();
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

  describe('rgb', () => {
    it('should accept with and without spaces format', () => {
      expect(Color.new('rgb(42, 42, 42)')).toBeTruthy();
      expect(Color.new('rgb(42,42,42)')).toBeTruthy();
      expect(Color.new('rgb( 42,42, 42)')).toBeTruthy();
    });

    it('should throws an error if any of RGB component is out of range 0-255', () => {
      expect(() => {
        Color.new('rgb(0, 256, 0)');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(0, 0, -1)');
      }).toThrowError();
    });

    it('should throws an error if any of RGB component is missing', () => {
      expect(() => {
        Color.new('rgb(256, 256)');
      }).toThrowError();
      expect(() => {
        Color.new('rgb()');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(40)');
      }).toThrowError();
    });

    it('should throws an error when the color code is invalid', () => {
      expect(() => {
        Color.new('rgb 255, 0, 255');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(40, 40, 40)a');
      }).toThrowError();
      expect(() => {
        Color.new('rgb(abc, a40, 40)');
      }).toThrowError();
    });
  });
});

describe('Color parsing', () => {
  const colors = [
    { hex: '#ffffff', rgb: 'rgb(255, 255, 255)' },
    { hex: '#000000', rgb: 'rgb(0, 0, 0)' },
    { hex: '#222222', rgb: 'rgb(34, 34, 34)' },
    { hex: '#0e7490', rgb: 'rgb(14, 116, 144)' },
  ];

  describe('HEX to', () => {
    test('RGB', () => {
      for (const color of colors) {
        const rgb = Color.new(color.hex).rgb();
        expect(rgb).toBe(color.rgb);
      }
    });

    test('HEX', () => {
      for (const color of colors) {
        const hex = Color.new(color.hex).hex();
        expect(hex).toBe(color.hex);
      }
    });
  });

  describe('RGB to', () => {
    test('HEX', () => {
      for (const color of colors) {
        const hex = Color.new(color.rgb).hex();
        expect(hex).toBe(color.hex);
      }
    });

    test('RGB', () => {
      for (const color of colors) {
        const rgb = Color.new(color.rgb).rgb();
        expect(rgb).toBe(color.rgb);
      }
    });
  });
});
