import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { FormFieldErrorsComponent } from './form-field-errors.component';

describe('Component: FormFieldErrors', () => {
    let component: FormFieldErrorsComponent;
    let fixture: ComponentFixture<FormFieldErrorsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormFieldErrorsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormFieldErrorsComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('control', new FormControl(null));
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeDefined();
    });

    it('should return message for "required" validator', () => {
        const control = new FormControl('', Validators.required);
        control.markAsTouched();
        fixture.componentRef.setInput('control', control);
        fixture.detectChanges();

        expect(component.errorMessages()).toContain('Field is required');
        expect(fixture.nativeElement.querySelector('.form-error')).not.toBeNull();
    });

    it('should return message for "min" rule', () => {
        const control = new FormControl(1, Validators.min(5));
        control.markAsTouched();
        fixture.componentRef.setInput('control', control);

        fixture.detectChanges();

        expect(component.errorMessages()).toContain('Min value is 5');
        expect(fixture.nativeElement.querySelector('.form-error')).not.toBeNull();
    });
});
