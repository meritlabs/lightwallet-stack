import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastNotificationComponent } from './toast-notification.component';

describe('Toast notification', () => {
  let instance: ComponentFixture<ToastNotificationComponent>, de: DebugElement, comp: ToastNotificationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastNotificationComponent],
    }).compileComponents();

    instance = TestBed.createComponent(ToastNotificationComponent);
    comp = instance.componentInstance;
    comp.init({
      title: 'Test title',
      message: 'Test message',
    });
    instance.detectChanges();
    de = instance.debugElement;
  });

  it('should create a toast message component', () => {
    expect(instance.nativeElement).toBeDefined();
  });

  it('should have a title', () => {
    expect(de.nativeElement.querySelector('.title').innerHTML).toContain('Test title');
  });

  it('should have a message', () => {
    expect(de.nativeElement.querySelector('.content').innerHTML).toContain('Test message');
  });

  it('should have a close button', () => {
    expect(de.nativeElement.querySelector('.close')).toBeDefined();
  });

  it('close button should dismiss toast', () => {
    const spy = spyOn(comp, 'dismiss');
    de.nativeElement.querySelector('.close').click();
    instance.detectChanges();
    expect(spy).toHaveBeenCalledWith(true);
  });
});
