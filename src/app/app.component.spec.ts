import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalHostComponent } from './common/components/modal-host/modal-host.component';
import { SignalsGameComponent } from './features/signals-game/signals-game.component';
import { RxGameComponent } from './features/rx-game/rx-game.component';

import { AppComponent } from './app.component';

@Component({
    selector: 'app-modal-host',
    template: '',
    standalone: true
})
class ModalHostMockComponent {}

@Component({
    selector: 'app-signals-game',
    template: '',
    standalone: true
})
class SignalsGameMockComponent {}

@Component({
    selector: 'app-rx-game',
    template: '',
    standalone: true
})
class RxGameMockComponent {}

describe('Component: App', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent]
        })
            .overrideComponent(AppComponent, {
                remove: { imports: [ModalHostComponent, SignalsGameComponent, RxGameComponent] },
                add: {
                    imports: [ModalHostMockComponent, SignalsGameMockComponent, RxGameMockComponent]
                }
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeDefined();
    });

    it('should show default UI', () => {
        const signalGame = fixture.nativeElement.querySelector('app-signals-game');
        const rxGame = fixture.nativeElement.querySelector('app-rx-game');

        expect(component.implementation()).toBe('signals');
        expect(signalGame).toBeDefined();
        expect(rxGame).toBeNull();
    });

    it('should only active link has active class', () => {
        const link = fixture.nativeElement.querySelector('.underline-text');
        expect(link.textContent).toContain('SignalR');
    });

    it('should change UI on change signal', () => {
        component.implementation.set('rxjs');
        fixture.detectChanges();

        const signalGame = fixture.nativeElement.querySelector('app-signals-game');
        const rxGame = fixture.nativeElement.querySelector('app-rx-game');

        expect(signalGame).toBeNull();
        expect(rxGame).toBeDefined();
    });
});
