import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { GameResult } from '../../../models/game.model';

@Component({
    selector: 'app-result-modal',
    templateUrl: './result-modal.component.html',
    styleUrl: './result-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ResultModalComponent {
    readonly _modalService = inject(ModalService);

    public data = input<GameResult>();

    public close(result?: boolean) {
        this._modalService.close(result);
    }
}
