import { Directive, ElementRef, HostListener, inject, InjectionToken, signal } from '@angular/core';

export const FIELD_INPUT = new InjectionToken<FieldInputDirective>('FieldInputDirective');

@Directive({
    selector: '[appFieldInput]',
    standalone: true,
    providers: [{ provide: FIELD_INPUT, useExisting: FieldInputDirective }]
})
export class FieldInputDirective {
    readonly _elRef = inject(ElementRef);

    readonly _isFocused = signal(false);

    public get isFocused(): boolean {
        return this._isFocused();
    }

    public setId(id: string): void {
        this._elRef.nativeElement.id = id;
    }

    @HostListener('focus', ['$event']) onFocus(): void {
        this._isFocused.set(true);
    }

    @HostListener('blur', ['$event']) onblur(): void {
        this._isFocused.set(false);
    }
}
