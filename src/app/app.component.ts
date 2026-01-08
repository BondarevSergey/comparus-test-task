import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormFieldComponent } from './common/form-field/form-field.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldInputDirective } from './common/form-field/directives/field-input.directive';
import { FormFieldErrorsComponent } from './common/form-field-errors/form-field-errors.component';
import { CellState, DEFAULT_CELLS, WIN_SCORE } from './constants/game.consts';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [FormsModule, FormFieldComponent, FieldInputDirective, ReactiveFormsModule, FormFieldErrorsComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AppComponent {
    public timeLimit = new FormControl(1000, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(500)]
    });

    public cells = signal<CellState[]>(DEFAULT_CELLS);
    public playerScore = signal(0);
    public computerScore = signal(0);
    public isRunning = signal(false);

    private activeCellIndex = signal<number | null>(null);
    private timeout: ReturnType<typeof setTimeout> | null = null;

    /**
     * Start the new game
     * reset all game params
     */
    public startGame(): void {
        if (this.timeLimit.invalid) {
            return;
        }

        this.clearTimer();

        this.cells.set(DEFAULT_CELLS);
        this.activeCellIndex.set(null);
        this.playerScore.set(0);
        this.computerScore.set(0);
        this.isRunning.set(true);

        this.startRound();
    }

    /**
     * Action on user click by cell
     * @param index iof clicked element
     */
    public userClickByCell(index: number): void {
        if (!this.isRunning() || this.activeCellIndex() !== index) {
            return;
        }

        this.clearTimer();

        this.cells.update((field) => {
            const updated = [...field];
            updated[index] = CellState.GREEN;
            return updated;
        });

        this.playerScore.update((v) => v++);
        this.activeCellIndex.set(null);

        this.startRound();
    }

    /**
     * Action on timeout
     */
    private handleTimeout(): void {
        this.cells.update((field) => {
            const updated = [...field];
            updated[this.activeCellIndex()!] = CellState.RED;
            return updated;
        });

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
        if (!this.isRunning() || this.playerScore() === WIN_SCORE || this.computerScore() === WIN_SCORE) {
            this.isRunning.set(false);
            return;
        }

        const blueIndexes = this.cells().reduce(
            (acc: number[], cell, index) => (cell === CellState.BLUE ? [...acc, index] : acc),
            []
        );

        const randomIndex = blueIndexes[Math.floor(Math.random() * blueIndexes.length)];

        this.activeCellIndex.set(randomIndex);

        this.cells.update((cell) => {
            const copy = [...cell];
            copy[randomIndex] = CellState.YELLOW;
            return copy;
        });

        this.timeout = setTimeout(() => this.handleTimeout(), this.timeLimit.value);
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
