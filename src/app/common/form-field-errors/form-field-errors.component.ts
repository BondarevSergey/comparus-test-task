import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-form-field-errors',
    templateUrl: './form-field-errors.component.html',
    styleUrls: ['./form-field-errors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class FormFieldErrorsComponent {
    public control = input.required<AbstractControl>();
    public errorMessages = computed(() => {
        const errors = this.control().errors;

        return errors
            ? Object.keys(errors).reduce((acc: string[], error: string) => {
                  switch (error) {
                      case 'required':
                          acc.push('Field is required');
                          break;
                      case 'min':
                          acc.push(`Min value is` + ` ${errors?.['min']?.min}`);
                          break;
                  }
                  return acc;
              }, [])
            : [];
    });
}
