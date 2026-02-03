import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FieldInputDirective } from './directives/field-input.directive';
import { FormFieldComponent } from './form-field.component';

@Component({
    template: `
        <form [formGroup]="form">
            <app-form-field [label]="label">
                <input appFieldInput type="text" formControlName="field" />
            </app-form-field>
        </form>
    `
})
class HostComponent {
    public label = 'Test label';

    public form = new FormGroup({
        field: new FormControl<string | null>('', { validators: [Validators.required] })
    });

    @ViewChild(FieldInputDirective, { static: false }) fieldInputDirective!: FieldInputDirective;
}

describe('Component: FormField', () => {
    let fixture: ComponentFixture<HostComponent>;
    let hostComponent: HostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormFieldComponent, FieldInputDirective],
            declarations: [HostComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    function getFormFieldNativeElement(): HTMLElement {
        return fixture.nativeElement.querySelector('app-form-field') as HTMLElement;
    }

    it('should create form-field inside host component', () => {
        const formFieldEl = getFormFieldNativeElement();
        expect(formFieldEl).toBeTruthy();
    });

    it('should render label when provided', () => {
        const labelEl = getFormFieldNativeElement().querySelector('.form-field-label');

        expect(labelEl).not.toBeNull();
        expect(labelEl!.textContent).toContain('Test label');
    });

    it('should set matching id and for attributes for input and label', () => {
        const formFieldEl = getFormFieldNativeElement();
        const labelEl = formFieldEl.querySelector('.form-field-label');
        const inputEl = formFieldEl.querySelector('input[appFieldInput]');

        expect(labelEl).not.toBeNull();
        expect(inputEl).not.toBeNull();

        expect(labelEl!.getAttribute('for')).toBeTruthy();
        expect(inputEl!.id).toBe(labelEl!.getAttribute('for')!);
    });

    it('should add "filled" class when control has value', () => {
        const formFieldEl = getFormFieldNativeElement();

        expect(formFieldEl.classList.contains('filled')).toBeFalse();

        hostComponent.form.get('field')!.setValue('some value');
        fixture.detectChanges();

        expect(formFieldEl.classList.contains('filled')).toBeTrue();
    });

    it('should add "invalid" class when control is invalid and touched', () => {
        const formFieldEl = getFormFieldNativeElement();

        expect(formFieldEl.classList.contains('invalid')).toBeFalse();

        const control = hostComponent.form.get('field')!;
        control.markAsTouched();
        control.updateValueAndValidity();
        fixture.detectChanges();

        expect(formFieldEl.classList.contains('invalid')).toBeTrue();
    });

    it('should add "disabled" class when control is disabled', () => {
        const formFieldEl = getFormFieldNativeElement();

        expect(formFieldEl.classList.contains('disabled')).toBeFalse();

        hostComponent.form.get('field')!.disable();
        fixture.detectChanges();

        expect(formFieldEl.classList.contains('disabled')).toBeTrue();
    });

    it('should add "focused" class when input is focused', () => {
        const formFieldEl = getFormFieldNativeElement();

        expect(formFieldEl.classList.contains('focused')).toBeFalse();

        hostComponent.fieldInputDirective._isFocused.set(true);
        fixture.detectChanges();

        expect(formFieldEl.classList.contains('focused')).toBeTrue();
    });
});
