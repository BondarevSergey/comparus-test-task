import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModalService } from '../../services/modal.service';
import { CellState, Winner } from '../../models/game.model';

import { AbstractGame } from './abstract-game';

class TestGame extends AbstractGame {
    override restartCallBack(): void {}
}

describe('AbstractGame', () => {
    let game: TestGame;
    let modalService: jasmine.SpyObj<ModalService>;

    beforeEach(async () => {
        modalService = jasmine.createSpyObj('ModalService', ['open']);

        await TestBed.configureTestingModule({
            providers: [
                {
                    provide: ModalService,
                    useValue: modalService
                }
            ]
        }).compileComponents();

        game = TestBed.runInInjectionContext(() => new TestGame());
    });

    it('should create an instance', () => {
        expect(game).toBeDefined();
    });

    describe('timeLimit', () => {
        it('should have default value of 1000', () => {
            expect(game.timeLimit.value).toBe(1000);
        });

        it('should be required', () => {
            game.timeLimit.setValue(null as any);
            expect(game.timeLimit.hasError('required')).toBe(true);
        });

        it('should have min validator of 500', () => {
            game.timeLimit.setValue(499);
            expect(game.timeLimit.hasError('min')).toBe(true);

            game.timeLimit.setValue(500);
            expect(game.timeLimit.hasError('min')).toBe(false);
        });
    });

    describe('openModal', () => {
        it('should open modal with winner and call restartCallBack when result is true', fakeAsync(() => {
            modalService.open.and.returnValue(Promise.resolve(true));
            const restartSpy = spyOn(game, 'restartCallBack');

            game['openModal']('player' as Winner);
            tick();

            expect(modalService.open).toHaveBeenCalled();
            expect(restartSpy).toHaveBeenCalled();
        }));

        it('should open modal and NOT call restartCallBack when result is false', fakeAsync(() => {
            modalService.open.and.returnValue(Promise.resolve(false));
            const restartSpy = spyOn(game, 'restartCallBack');

            game['openModal']('computer' as Winner);
            tick();

            expect(modalService.open).toHaveBeenCalled();
            expect(restartSpy).not.toHaveBeenCalled();
        }));

        it('should dynamically import ResultModalComponent and pass winner to modal', fakeAsync(() => {
            modalService.open.and.returnValue(Promise.resolve());

            game['openModal']('player' as Winner);
            tick();

            const callArgs = modalService.open.calls.mostRecent().args;
            expect(callArgs[1]).toEqual({ winner: 'player' });
        }));
    });

    describe('fillCellItemByIndex', () => {
        it('should return new array with updated cell at index', () => {
            const cells: CellState[] = [CellState.BLUE, CellState.BLUE, CellState.BLUE];
            const result = game['fillCellItemByIndex'](cells, 1, CellState.RED);

            expect(result).not.toBe(cells);
            expect(result[0]).toBe(CellState.BLUE);
            expect(result[1]).toBe(CellState.RED);
            expect(result[2]).toBe(CellState.BLUE);
        });

        it('should not mutate the original array', () => {
            const cells: CellState[] = [CellState.BLUE, CellState.GREEN];
            const originalFirst = cells[0];
            const originalSecond = cells[1];

            game['fillCellItemByIndex'](cells, 0, CellState.RED);

            expect(cells[0]).toBe(originalFirst);
            expect(cells[1]).toBe(originalSecond);
        });

        it('should update first and last index correctly', () => {
            const cells: CellState[] = [CellState.BLUE, CellState.BLUE, CellState.BLUE];

            const resultFirst = game['fillCellItemByIndex'](cells, 0, CellState.YELLOW);
            expect(resultFirst[0]).toBe(CellState.YELLOW);

            const resultLast = game['fillCellItemByIndex'](cells, 2, CellState.GREEN);
            expect(resultLast[2]).toBe(CellState.GREEN);
        });
    });

    describe('getRandomCellIndex', () => {
        it('should return index of a blue cell', () => {
            const cells: CellState[] = [
                CellState.RED,
                CellState.BLUE,
                CellState.GREEN,
                CellState.RED,
                CellState.YELLOW
            ];

            const index = game['getRandomCellIndex'](cells);

            expect(index).toBe(1);
            expect(cells[index]).toBe(CellState.BLUE);
        });

        it('should return index within valid range when multiple blue cells exist', () => {
            const cells: CellState[] = [
                CellState.BLUE,
                CellState.BLUE,
                CellState.BLUE,
                CellState.RED,
                CellState.RED
            ];

            const blueIndexes = [0, 1, 2];
            const index = game['getRandomCellIndex'](cells);

            expect(blueIndexes).toContain(index);
            expect(cells[index]).toBe(CellState.BLUE);
        });

        it('should return 0 when only first cell is blue', () => {
            const cells: CellState[] = [CellState.BLUE, CellState.RED, CellState.RED];

            const index = game['getRandomCellIndex'](cells);

            expect(index).toBe(0);
        });

        it('should return last blue index when only last cell is blue', () => {
            const cells: CellState[] = [CellState.RED, CellState.RED, CellState.BLUE];

            const index = game['getRandomCellIndex'](cells);

            expect(index).toBe(2);
        });
    });
});
