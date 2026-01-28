import { fillCellItemByIndex, getRandomCellIndex } from './game.helpers';
import { CellState } from '../../models/game.model';

describe('Helpers: Game', () => {
    it('should return array with recolored element by index', () => {
        const result = fillCellItemByIndex(Array(10).fill(CellState.BLUE), 0, CellState.RED);

        expect(result[0]).toContain(CellState.RED);
    });

    it('should return index of element in expected range', () => {
        const testedArray = [...Array(5).fill(CellState.BLUE), ...Array(15).fill(CellState.RED)];
        const index = getRandomCellIndex(testedArray);

        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThanOrEqual(4);
    });
});
