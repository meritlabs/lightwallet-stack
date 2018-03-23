import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Renderer2,
  Type
} from '@angular/core';

export interface IDynamicComponent {
  destroy: Function;
  dismiss?(): void;
  setConfig(config: any): void;
}

@Injectable()
export class DOMController {
  rnd: Renderer2;

  constructor(private appRef: ApplicationRef,
              private cfr: ComponentFactoryResolver,
              private injector: Injector) {}

  create<T extends IDynamicComponent>(component: Type<T>, config: any, parentElement?: HTMLElement) {
    const componentRef = this.cfr.resolveComponentFactory(component).create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.rnd.appendChild(parentElement || document.body, domElement);
    const instance: T = componentRef.instance;

    instance.setConfig(config);
    instance.destroy = () => this.appRef.detachView(componentRef.hostView);

    return instance;
  }
}
