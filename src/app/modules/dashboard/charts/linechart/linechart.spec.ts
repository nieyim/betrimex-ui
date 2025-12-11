import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Linechart } from './linechart';

describe('Linechart', () => {
  let component: Linechart;
  let fixture: ComponentFixture<Linechart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Linechart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Linechart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
