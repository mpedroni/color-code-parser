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

  describe('hsl', () => {
    it('should be able to create a color from hsl representation', () => {
      expect(Color.new('hsl(0, 0%, 50%)')).toBeTruthy();
    });

    it('should accept with and without spaces format', () => {
      expect(Color.new('hsl(0,0%,50%)')).toBeTruthy();
    });

    it('should throws an error if any hsl component is out of range', () => {
      expect(() => {
        Color.new('hsl(-1, 0%, 50%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(360, 0%, 50%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, -1%, 50%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 101%, 50%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 0%, -1%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 0%, 101%)');
      }).toThrowError();
    });

    it('should throws an error when the color code is invalid', () => {
      expect(() => {
        Color.new('hsl 0, 5%, 10%');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0 0% 100%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 0%, 100%)aa');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0%, 0%, 100%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 0, 100%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 5%, 100)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 5%, 1a0%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(0, 5a%, 10%)');
      }).toThrowError();
      expect(() => {
        Color.new('hsl(abc, 5%, 10%)');
      }).toThrowError();
    });
  });
});

describe('Color parsing', () => {
  const colors = [
    { hex: '#ffffff', rgb: 'rgb(255, 255, 255)', hsl: 'hsl(0, 0%, 100%)' },
    { hex: '#7a8f0e', rgb: 'rgb(122, 143, 14)', hsl: 'hsl(70, 82%, 31%)' },
    { hex: '#0e8f4f', rgb: 'rgb(14, 143, 79)', hsl: 'hsl(150, 82%, 31%)' },
    { hex: '#640e8f', rgb: 'rgb(100, 14, 143)', hsl: 'hsl(280, 82%, 31%)' },
    { hex: '#8f0e2e', rgb: 'rgb(143, 14, 46)', hsl: 'hsl(345, 82%, 31%)' },
    { hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)' },
    { hex: '#222222', rgb: 'rgb(34, 34, 34)', hsl: 'hsl(0, 0%, 13.5%)' },
    { hex: '#0e738f', rgb: 'rgb(14, 115, 143)', hsl: 'hsl(193, 82%, 31%)' },
    { hex: '#918a63', rgb: 'rgb(145, 138, 99)', hsl: 'hsl(51, 19%, 48%)' },
  ];

  describe('HEX to', () => {
    test('RGB', () => {
      for (const color of colors) {
        const rgb = Color.new(color.hex).rgb();
        expect(rgb).toBe(color.rgb);
      }
    });

    test('HSL', () => {
      for (const color of colors) {
        const hsl = Color.new(color.hex).hsl();
        expect(hsl).toBe(color.hsl);
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

    test('HSL', () => {
      for (const color of colors) {
        const hsl = Color.new(color.rgb).hsl();
        expect(hsl).toBe(color.hsl);
      }
    });

    test('RGB', () => {
      for (const color of colors) {
        const rgb = Color.new(color.rgb).rgb();
        expect(rgb).toBe(color.rgb);
      }
    });
  });

  describe('HSL to', () => {
    test('HEX', () => {
      for (const color of colors) {
        const hex = Color.new(color.hsl).hex();
        expect(hex).toBe(color.hex);
      }
    });

    test('RGB', () => {
      for (const color of colors) {
        const rgb = Color.new(color.hsl).rgb();
        expect(rgb).toBe(color.rgb);
      }
    });
    test('HSL', () => {
      for (const color of colors) {
        const hsl = Color.new(color.hsl).hsl();
        expect(hsl).toBe(color.hsl);
      }
    });
  });
});
