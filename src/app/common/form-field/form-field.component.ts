import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, Input } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName } from '@angular/forms';
import { FIELD_INPUT, FieldInputDirective } from './directives/field-input.directive';

let nextUniqueId = 0;

@Component({
    selector: 'app-form-field',
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    host: {
        '[class.focused]': `_formFieldRef.isFocused`,
        '[class.filled]': `_control?.value`,
        '[class.invalid]': `_control?.invalid && _control?.touched`,
        '[class.disabled]': `_control?.disabled`
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class FormFieldComponent implements AfterContentInit {
    @Input() public label = '';

    @ContentChild(FIELD_INPUT, { static: false }) _formFieldRef!: FieldInputDirective;

    @ContentChild(FormControlName, { static: false })
    formControlName?: FormControlName;
    @ContentChild(FormControlDirective, { static: false })
    formControl?: FormControlDirective;

    protected _control: FormControl<any> | undefined;

    protected readonly _controlId = `form-field-control-${nextUniqueId++}`;

    ngAfterContentInit(): void {
        this._control = this.formControlName?.control || this.formControl?.control;

        if (!this._formFieldRef) {
            throw new Error('input must have a appFieldInput directive');
        }
        this._formFieldRef.setId(this._controlId);
    }
}
