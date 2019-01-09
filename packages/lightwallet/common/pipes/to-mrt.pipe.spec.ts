import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToMrtPipe } from '@merit/common/pipes/to-mrt.pipe';
import { RateService } from '@merit/common/services/rate.service';

@Component({
  template: `
    <div #test1>{{ 123e6 | toMRT }}</div>
    <div #test2>{{ 123e6 | toMRT:null:true }}</div>
    <div #test3>{{ 123e6 | toMRT:1 }}</div>
    <div #test4>{{ 123e6 | toMRT:2 }}</div>
  `,
})
class TestComponent {
  @ViewChild('test1')
  test1: ElementRef;
  @ViewChild('test2')
  test2: ElementRef;
  @ViewChild('test3')
  test3: ElementRef;
  @ViewChild('test4')
  test4: ElementRef;
}

describe('Pipes.ToMRT', () => {
  let comp: TestComponent, instance: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToMrtPipe, TestComponent],
      providers: [RateService],
    }).compileComponents();
    instance = TestBed.createComponent(TestComponent);
    comp = instance.componentInstance;
    instance.detectChanges();
  });

  it('should convert micros to merit', () => {
    const el: HTMLElement = comp.test1.nativeElement;
    expect(el.innerHTML).toBe('1.23 MRT');
  });

  it('should hide unit', () => {
    const el: HTMLElement = comp.test2.nativeElement;
    expect(el.innerHTML).toBe('1.23');
  });

  it('should limit digits to 1', () => {
    const el: HTMLElement = comp.test3.nativeElement;
    expect(el.innerHTML).toBe('1 MRT');
  });

  it('should limit digits to 2', () => {
    const el: HTMLElement = comp.test4.nativeElement;
    expect(el.innerHTML).toBe('1.2 MRT');
  });
});
