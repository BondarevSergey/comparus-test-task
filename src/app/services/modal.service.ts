import { Injectable, signal, Type } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    public component = signal<Type<any> | null>(null);
    public data = signal<any>(null);

    private resolve: ((value?: any) => void) | null = null;

    public open(component: Type<any>, data?: any): Promise<any> {
        return new Promise((resolve) => {
            this.data.set(data);
            this.component.set(component);
            this.resolve = resolve;
        });
    }

    public close(result?: any): void {
        this.component.set(null);
        this.data.set(null);

        this.resolve?.(result);
        this.resolve = null;
    }
}
