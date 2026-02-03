import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../services/modal.service';
import { DEFAULT_CELLS } from '../../common/constants/game.consts';
import { CellState } from '../../models/game.model';

import { SignalsGameComponent } from './signals-game.component';

describe('Component: SignalsGame', () => {
    let component: SignalsGameComponent;
    let fixture: ComponentFixture<SignalsGameComponent>;

    const ModalMockService = jasmine.createSpyObj('ModalService', ['open']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignalsGameComponent],
            providers: [
                {
                    provide: ModalService,
                    useValue: ModalMockService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SignalsGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeDefined();
    });

    it('should have no winners on the start', () => {
        expect(component['winner']()).toBeNull();
    });

    it('should set player as a winner on score update', () => {
        component.playerScore.set(10);
        expect(component['winner']()).toBe('player');
    });

    it('should set computer as a winner on score update', () => {
        component.computerScore.set(10);
        expect(component['winner']()).toBe('computer');
    });

    it('should start game on restartCallback', () => {
        const startSpy = spyOn(component, 'startGame');

        component.restartCallBack();
        expect(startSpy).toHaveBeenCalled();
    });

    it('should reset params and call startRound on startGame', () => {
        const roundSpy = spyOn<any>(component, 'startRound');

        component.startGame();
        expect(roundSpy).toHaveBeenCalled();
        expect(component.cells()).toEqual(DEFAULT_CELLS);
        expect(component['activeCellIndex']()).toBeNull();
        expect(component.playerScore()).toEqual(0);
        expect(component.computerScore()).toEqual(0);
    });

    it('should do nothing on user click by inactive cell', () => {
        const roundSpy = spyOn<any>(component, 'startRound');
        const clearSpy = spyOn<any>(component, 'clearTimer');

        component['activeCellIndex'].set(44);

        component.userClickByCell(31);
        expect(roundSpy).not.toHaveBeenCalled();
        expect(clearSpy).not.toHaveBeenCalled();
    });

    it('should update user score on user click by active cell', () => {
        const roundSpy = spyOn<any>(component, 'startRound');
        const clearSpy = spyOn<any>(component, 'clearTimer');

        component.cells.set(DEFAULT_CELLS);
        component['activeCellIndex'].set(12);

        component.userClickByCell(12);

        expect(clearSpy).toHaveBeenCalled();

        expect(component.cells()[12]).toContain(CellState.GREEN);
        expect(component.playerScore()).toEqual(1);
        expect(component['activeCellIndex']()).toBeNull();

        expect(roundSpy).toHaveBeenCalled();
    });

    it('should update computer score when time is out', () => {
        const roundSpy = spyOn<any>(component, 'startRound');

        component.cells.set(DEFAULT_CELLS);
        component['activeCellIndex'].set(12);

        component['handleTimeout']();

        expect(component.cells()[12]).toContain(CellState.RED);
        expect(component.computerScore()).toEqual(1);
        expect(component['activeCellIndex']()).toBeNull();
        expect(roundSpy).toHaveBeenCalled();
    });

    it('should open modal with winner', () => {
        const openSpy = spyOn<any>(component, 'openModal');

        component.playerScore.set(10);

        component['startRound']();
        expect(openSpy).toHaveBeenCalledWith('player');
    });

    it('should set one yellow cell', () => {
        component.cells.set(DEFAULT_CELLS);

        component['startRound']();
        expect(component.cells()).toContain(CellState.YELLOW);
        expect(component['activeCellIndex']()).not.toBeNull();
        expect(component['timeout']).not.toBeNull();
    });

    it('should clear timeout', () => {
        component['timeout'] = setTimeout(() => void 0, 10000);

        component['clearTimer']();
        expect(component['timeout']).toBeNull();
    });
});
