import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';

class TestComponent {}

describe('ModalService', () => {
    let service: ModalService;

    beforeEach(() => {
        service = TestBed.inject(ModalService);
    });

    it('should create an instance', () => {
        expect(service).toBeDefined();
    });

    it('should set component and data on open', () => {
        service.open(TestComponent, { id: 1 });

        expect(service.component()).toBe(TestComponent);
        expect(service.data()).toEqual({ id: 1 });
    });

    it('should reset component and data on close', () => {
        service.open(TestComponent, { test: true });

        service.close();

        expect(service.component()).toBeNull();
        expect(service.data()).toBeNull();
    });

    it('should resolve promise when close is called', async () => {
        const promise = service.open(TestComponent);

        service.close('RESULT');

        const result = await promise;

        expect(result).toBe('RESULT');
    });
});
