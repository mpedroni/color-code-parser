export interface Color {
  hex(): string;
  rgb(): string;
  hsl(): string;
}

export type RgbComponents<T> = {
  r: T;
  g: T;
  b: T;
};
