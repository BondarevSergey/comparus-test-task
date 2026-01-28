import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../services/modal.service';

import { ResultModalComponent } from './result-modal.component';

describe('Component: ResultModal', () => {
    let component: ResultModalComponent;
    let fixture: ComponentFixture<ResultModalComponent>;

    let ModalMockService: jasmine.SpyObj<ModalService>;

    beforeEach(() => {
        ModalMockService = jasmine.createSpyObj('ModalService', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResultModalComponent],
            providers: [
                {
                    provide: ModalService,
                    useValue: ModalMockService
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResultModalComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('data', { winner: 'player' });
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeDefined();
    });

    it('should show winner on view', () => {
        const link = fixture.nativeElement.querySelector('h2');
        expect(link.textContent).toContain('player wins!');
    });

    it('should send result to service on close method', () => {
        component.close(true);
        expect(ModalMockService.close).toHaveBeenCalledWith(true);
    });
});
