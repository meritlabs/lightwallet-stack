import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressPipe } from '@merit/common/pipes/address.pipe';

const ADDRESS = 'mNAxzEYp7HcQCdMqstzftS548SSYx5PvWd';
const ALIAS = 'ibby-demo-mac';

@Component({
  template: `
    <div #test1>{{ 'mNAxzEYp7HcQCdMqstzftS548SSYx5PvWd' | address }}</div>
    <div #test2>{{ 'mNAxzEYp7HcQCdMqstzftS548SSYx5PvWd' | address:5 }}</div>
    <div #test3>{{ 'mNAxzEYp7HcQCdMqstzftS548SSYx5PvWd' | address:5:true }}</div>
    <div #test4>{{ 'ibby-demo-mac' | address }}</div>
    <div #test5>{{ '@ibby-demo-mac' | address }}</div>
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
  @ViewChild('test5')
  test5: ElementRef;
}

describe('Pipes.Address', () => {
  let comp: TestComponent, instance: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressPipe, TestComponent],
    }).compileComponents();
    instance = TestBed.createComponent(TestComponent);
    comp = instance.componentInstance;
    instance.detectChanges();
  });

  it('should show the full address', () => {
    const el: HTMLElement = comp.test1.nativeElement;
    expect(el.innerHTML).toBe(ADDRESS);
  });

  it('should limit the address to 5 characters', () => {
    const el: HTMLElement = comp.test2.nativeElement;
    expect(el.innerHTML).toBe(ADDRESS.slice(0, 5));
  });

  it('should limit the address to 5 characters and add ellipsis', () => {
    const el: HTMLElement = comp.test3.nativeElement;
    expect(el.innerHTML).toBe(ADDRESS.slice(0, 5) + '...');
  });

  it('should detect an alias without @ sign', () => {
    const el: HTMLElement = comp.test4.nativeElement;
    expect(el.innerHTML).toBe('@' + ALIAS);
  });

  it('should detect an alias with @ sign', () => {
    const el: HTMLElement = comp.test5.nativeElement;
    expect(el.innerHTML).toBe('@' + ALIAS);
  });
});
