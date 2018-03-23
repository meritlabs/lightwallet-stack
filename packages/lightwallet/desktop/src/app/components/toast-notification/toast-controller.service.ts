import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import {
  INotificationMessage,
  ToastNotificationComponent
} from '@merit/desktop/app/components/toast-notification/toast-notification.component';

@Injectable()
export class ToastControllerService {
  constructor(private appRef: ApplicationRef,
              private cfr: ComponentFactoryResolver,
              private injector: Injector) {}

  create(message: INotificationMessage): ToastNotificationComponent {
    const componentRef = this.cfr.resolveComponentFactory(ToastNotificationComponent).create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);
    componentRef.instance.message = message;
    componentRef.instance.show = true;
    componentRef.instance.destroy = () => this.appRef.detachView(componentRef.hostView);
    return componentRef.instance;
  }
}
