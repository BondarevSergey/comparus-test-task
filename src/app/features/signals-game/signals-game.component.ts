import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldErrorsComponent } from '../../common/components/form-field-errors/form-field-errors.component';
import { FormFieldComponent } from '../../common/components/form-field/form-field.component';
import { FieldInputDirective } from '../../common/components/form-field/directives/field-input.directive';
import { AbstractGame } from '../../common/abstract-classes/abstract-game';
import { fillCellItemByIndex, getRandomCellIndex } from '../../common/helpers/game.helpers';
import { DEFAULT_CELLS, WIN_SCORE } from '../../common/constants/game.consts';
import { CellState, Winner } from '../../models/game.model';

@Component({
    selector: 'app-signals-game',
    templateUrl: './signals-game.component.html',
    styleUrl: './signals-game.component.scss',
    imports: [ReactiveFormsModule, FieldInputDirective, FormFieldComponent, FormFieldErrorsComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SignalsGameComponent extends AbstractGame {
    public cells = signal<CellState[]>(DEFAULT_CELLS);
    public playerScore = signal(0);
    public computerScore = signal(0);

    private activeCellIndex = signal<number | null>(null);
    private timeout: ReturnType<typeof setTimeout> | null = null;

    private winner = computed<Winner | null>(() => {
        if (this.playerScore() >= WIN_SCORE) return 'player';
        if (this.computerScore() >= WIN_SCORE) return 'computer';
        return null;
    });

    public restartCallBack(): void {
        this.startGame();
    }

    /**
     * Start the new game
     * reset all game params
     */
    public startGame(): void {
        this.clearTimer();

        this.cells.set(DEFAULT_CELLS);
        this.activeCellIndex.set(null);
        this.playerScore.set(0);
        this.computerScore.set(0);

        this.startRound();
    }

    /**
     * Action on user click by cell
     * @param index of clicked element
     */
    public userClickByCell(index: number): void {
        if (this.activeCellIndex() === null || this.activeCellIndex() !== index) {
            return;
        }

        this.clearTimer();

        this.cells.update((cells) => fillCellItemByIndex(cells, index, CellState.GREEN));
        this.playerScore.update((v) => v + 1);
        this.activeCellIndex.set(null);

        this.startRound();
    }

    /**
     * Action on timeout
     */
    private handleTimeout(): void {
        this.cells.update((cells) => fillCellItemByIndex(cells, this.activeCellIndex()!, CellState.RED));
        this.computerScore.update((v) => v + 1);
        this.activeCellIndex.set(null);

        this.startRound();
    }

    /**
     * Start the new round
     * Randomly select a cell to change to yellow
     * Set timeout for this cell
     */
    private startRound(): void {
        if (this.winner()) {
            void this.openModal(this.winner()!);
            return;
        }

        const randomIndex = getRandomCellIndex(this.cells());

        this.activeCellIndex.set(randomIndex);
        this.cells.update((cells) => fillCellItemByIndex(cells, randomIndex, CellState.YELLOW));

        this.timeout = setTimeout(() => this.handleTimeout(), this.timeLimit.valid ? this.timeLimit.value : 1000);
    }

    /**
     * Clear timeout
     */
    private clearTimer(): void {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}
