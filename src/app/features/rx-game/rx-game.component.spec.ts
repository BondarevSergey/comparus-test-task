import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModalService } from '../../services/modal.service';
import { FIELD_SIZE, initialState } from '../../common/constants/game.consts';
import { CellState, GameState } from '../../models/game.model';

import { RxGameComponent } from './rx-game.component';

describe('Component: RxGame', () => {
    let component: RxGameComponent;
    let fixture: ComponentFixture<RxGameComponent>;

    const ModalMockService = jasmine.createSpyObj('ModalService', ['open']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RxGameComponent],
            providers: [
                {
                    provide: ModalService,
                    useValue: ModalMockService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RxGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeDefined();
    });

    it('should show number of sell related to game$', () => {
        expect(fixture.nativeElement.querySelectorAll('.game__cell')?.length).toEqual(FIELD_SIZE);
    });

    it('should start game on restartCallback', () => {
        const startSpy = spyOn(component.start$, 'next');

        component.restartCallBack();
        expect(startSpy).toHaveBeenCalled();
    });

    it('should restart game on success result from modal', fakeAsync(() => {
        ModalMockService.open.and.returnValue(Promise.resolve(true));
        const restartSpy = spyOn(component, 'restartCallBack');

        component['openModal']('computer');
        tick();
        expect(restartSpy).toHaveBeenCalled();
    }));

    it('should open modal with player as winner', () => {
        const openSpy = spyOn<any>(component, 'openModal');

        const res = component['checkWinner']({
            ...initialState,
            playerScore: 10
        });

        expect(openSpy).toHaveBeenCalledWith('player');
        expect(res).toBe(false);
    });

    it('should open modal with computer as winner', () => {
        const openSpy = spyOn<any>(component, 'openModal');

        const res = component['checkWinner']({
            ...initialState,
            computerScore: 10
        });

        expect(openSpy).toHaveBeenCalledWith('computer');
        expect(res).toBe(false);
    });

    it('should NOT open modal', () => {
        const openSpy = spyOn<any>(component, 'openModal');

        const res = component['checkWinner'](initialState);

        expect(openSpy).not.toHaveBeenCalled();
        expect(res).toBe(true);
    });

    it('should to increase computer score', fakeAsync(() => {
        const resultStates: GameState[] = [];

        component['round$'](initialState).subscribe((s) => resultStates.push(s));

        tick(1000);

        const missState = resultStates[1];
        expect(missState.computerScore).toBe(1);
        expect(missState.playerScore).toBe(0);
        expect(missState.activeCellIndex).toBeNull();
        expect(missState.cells).toContain(CellState.RED);
    }));

    it('should to increase user score', fakeAsync(() => {
        spyOn<any>(component, 'getRandomCellIndex').and.returnValue(4);

        const states: GameState[] = [];

        component['round$'](initialState).subscribe((s) => states.push(s));

        expect(states[0].activeCellIndex).toBe(4);

        component['cellClick$'].next(4);
        tick();

        expect(states.length).toBe(2);

        const hitState = states[1];
        expect(hitState.playerScore).toBe(initialState.playerScore + 1);
        expect(hitState.activeCellIndex).toBeNull();
    }));
});
