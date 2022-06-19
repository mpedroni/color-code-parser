export interface Color {
  hex(): string;
  rgb(): string;
}

export type RgbComponents<T> = {
  r: T;
  g: T;
  b: T;
};
