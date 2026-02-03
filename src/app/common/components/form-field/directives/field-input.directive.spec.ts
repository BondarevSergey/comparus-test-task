import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInputDirective } from './field-input.directive';

@Component({
    template: `<input appFieldInput type="text" />`
})
class HostComponent {
    @ViewChild(FieldInputDirective, { static: true }) fieldInputDirective!: FieldInputDirective;
}

describe('Directive: FieldInputDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    let hostComponent: HostComponent;
    let inputElement: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FieldInputDirective],
            declarations: [HostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        fixture.detectChanges();
        inputElement = fixture.nativeElement.querySelector('input[appFieldInput]') as HTMLInputElement;
    });

    it('should create an instance', () => {
        expect(hostComponent.fieldInputDirective).toBeTruthy();
    });

    it('should have isFocused false by default', () => {
        expect(hostComponent.fieldInputDirective.isFocused).toBeFalse();
    });

    it('should set id on the native element when setId is called', () => {
        hostComponent.fieldInputDirective.setId('test-id');

        expect(inputElement.id).toBe('test-id');
    });

    it('should set isFocused to true on focus event', () => {
        inputElement.dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();

        expect(hostComponent.fieldInputDirective.isFocused).toBeTrue();
    });

    it('should set isFocused to false on blur event', () => {
        // First focus
        inputElement.dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();
        expect(hostComponent.fieldInputDirective.isFocused).toBeTrue();

        // Then blur
        inputElement.dispatchEvent(new FocusEvent('blur'));
        fixture.detectChanges();

        expect(hostComponent.fieldInputDirective.isFocused).toBeFalse();
    });
});

