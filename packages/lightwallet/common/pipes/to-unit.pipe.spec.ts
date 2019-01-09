import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { ToUnitPipe } from '@merit/common/pipes/to-unit.pipe';
import { Events } from 'ionic-angular';
import { EventsMock, StorageMock } from 'ionic-mocks-jest';

@Component({
  template: `
    <div #test1>{{ 1e8 | toUnit }}</div>
  `,
})
class TestComponent {
  @ViewChild('test1')
  test1: ElementRef;
}

describe('Pipes.ToUnit', () => {
  let comp: TestComponent, instance: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToUnitPipe, TestComponent],
      imports: [CommonProvidersModule.forRoot()],
      providers: [
        { provide: Storage, useFactory: () => StorageMock.instance() },
        { provide: Events, useFactory: () => EventsMock.instance() },
      ],
    }).compileComponents();
    instance = TestBed.createComponent(TestComponent);
    comp = instance.componentInstance;
    instance.detectChanges();
  });

  it('should convert micros to fiat amount', () => {
    const el: HTMLElement = comp.test1.nativeElement;
    expect(el.innerHTML).toBe('1.00');
  });
});
