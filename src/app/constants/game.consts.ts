export enum CellState {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
    BLUE = 'blue'
}

export const FIELD_SIZE = 100;
export const WIN_SCORE = 10;

export const DEFAULT_CELLS = Array(FIELD_SIZE).fill(CellState.BLUE);
