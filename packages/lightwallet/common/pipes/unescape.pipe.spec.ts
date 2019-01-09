import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnescapePipe } from '@merit/common/pipes/unescape.pipe';

@Component({
  template: `
    <div #test1>{{ '%40' | unescape }}</div>
  `,
})
class TestComponent {
  @ViewChild('test1')
  test1: ElementRef;
}

describe('Pipes.Unescape', () => {
  let comp: TestComponent, instance: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnescapePipe, TestComponent],
    }).compileComponents();
    instance = TestBed.createComponent(TestComponent);
    comp = instance.componentInstance;
    instance.detectChanges();
  });

  it('should unescape @ symbol', () => {
    const el: HTMLElement = comp.test1.nativeElement;
    expect(el.innerHTML).toBe('@');
  });
});
