import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { PasswordPromptComponent } from './password-prompt.component';

describe('Password Prompt', () => {
  let instance: ComponentFixture<PasswordPromptComponent>, de: DebugElement, comp: PasswordPromptComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordPromptComponent, BackdropComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();

    instance = TestBed.createComponent(PasswordPromptComponent);
    comp = instance.componentInstance;
    comp.init({
      title: 'Enter password',
      validators: [Validators.required],
      asyncValidators: [],
    });
    instance.detectChanges();
    de = instance.debugElement;
  });

  it('should display a password prompt dialog', () => {
    expect(de.nativeElement).toBeDefined();
  });

  it('should display a title', () => {
    expect(de.nativeElement.querySelector('h2.title').innerHTML).toContain('Enter password');
  });

  it('should display a password input', () => {
    expect(de.nativeElement.querySelector('input[type=password]')).toBeDefined();
  });

  it('should validate password input', () => {
    expect(comp.formData.valid).toBeFalsy();
    expect(comp.password.valid).toBeFalsy();

    comp.password.setValue('a');
    instance.detectChanges();
    expect(comp.formData.valid).toBeTruthy();
    expect(comp.password.valid).toBeTruthy();

    comp.password.setValue('');
    instance.detectChanges();
    expect(comp.formData.valid).toBeFalsy();
    expect(comp.password.valid).toBeFalsy();
    expect(comp.password.hasError('required')).toBeTruthy();
  });

  it('should display a backdrop element', () => {
    const backdropEl: HTMLElement = de.nativeElement.querySelector('app-backdrop');
    expect(backdropEl).toBeDefined();
  });

  it('should dismiss the component when clicking on backdrop', () => {
    const spy = jest.spyOn(comp as any, '_dismiss');
    const backdropEl: HTMLElement = de.nativeElement.querySelector('app-backdrop');
    backdropEl.click();
    instance.detectChanges();
    expect(spy).toHaveBeenCalledWith();
  });
});
