export type Grid = string[][];

export interface Payment {
  payment: string;
  amount: string;
  grid: Grid;
  code: number;
}
