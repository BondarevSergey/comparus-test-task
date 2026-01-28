import { inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { Winner } from '../../models/game.model';

export abstract class AbstractGame {
    readonly _modalService = inject(ModalService);

    /**
     * Time limit for getting a cell by player
     */
    public timeLimit = new FormControl(1000, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(500)]
    });

    /**
     * Method to restart the game
     */
    abstract restartCallBack(): void;

    /**
     * Open modal with the game result
     */
    protected async openModal(winner: Winner): Promise<void> {
        const { ResultModalComponent } = await import('../../common/components/result-modal/result-modal.component');
        this._modalService.open(ResultModalComponent, { winner }).then((result: boolean) => {
            if (result) {
                this.restartCallBack();
            }
        });
    }
}
