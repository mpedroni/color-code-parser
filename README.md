# color-code-parser

This project is a simple color code parser (RGB <-> HEX) that was developed using Test-Driven Development and has only study purposes

## Features & requisites

- [x] Support conversions RGB <-> HEX
- [x] Detect invalid color codes
- [x] Should be extensible (easy addition of another color code)
- [x] Must support at least 3 color codes (hex, rgb and hsl)
- [x] Must have 100% code coverage

## Installation

After cloning the repo, go to the installation directory and run `yarn` or `npm install` to install the project dependencies.

## How to use

The lib entry point is the file in `/src/lib/color-code-parser.ts`. You can see how to use it in the test file `/__tests__/color-code-parser.spec.ts`.
Basically, you create an `Color` instance passing a color code in any supported notation, like `const color = Color.new('#222222')` or `const color = Color.new('rgb(34, 34, 34)')`, and can get the same color represented by the supported notations:

```ts
const white = Color.new('#fff');

white.hex(); // => #ffffff
white.rgb(); // => rgb(255, 255, 255)
white.hsl(); // => hsl(0, 0%, 100%)
```
