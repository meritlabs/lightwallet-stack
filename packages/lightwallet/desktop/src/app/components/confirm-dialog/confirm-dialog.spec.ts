import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { DOMController } from '../dom.controller';
import { ConfirmDialogControllerService } from './confirm-dialog-controller.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('Confirm Dialog', () => {

  let instance: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent, BackdropComponent]
    }).compileComponents();

    instance = TestBed.createComponent(ConfirmDialogComponent);
    instance.componentInstance.init({
      title: 'Test title',
      message: 'Test message',
      buttons: [
        {
          text: 'Ok',
          class: 'primary'
        },
        {
          text: 'Cancel'
        }
      ]
    });
    instance.detectChanges();
  });

  it('should create a confirm dialog', () => {
    expect(instance.nativeElement).toBeDefined();
  });

  it('should display a title', () => {
    const titleEl: HTMLElement = instance.nativeElement.querySelector('h2.title');
    expect(titleEl).toBeDefined();
    expect(titleEl.innerHTML).toBe('Test title');
  });

  it('should display a message', () => {
    const messageEl: HTMLElement = instance.nativeElement.querySelector('.message');
    expect(messageEl).toBeDefined();
    expect(messageEl.innerHTML).toBe('Test message');
  });

  it('should display buttons', () => {
    const controlsEl: HTMLElement = instance.nativeElement.querySelector('.controls');
    expect(controlsEl).toBeDefined();

    const buttons: NodeListOf<HTMLElement> = controlsEl.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].classList.contains('primary')).toBeTruthy();
    expect(buttons[0].innerHTML).toContain('Ok');

    expect(buttons[1].classList.contains('primary')).toBeFalsy();
    expect(buttons[1].innerHTML).toContain('Cancel');
  });

});
