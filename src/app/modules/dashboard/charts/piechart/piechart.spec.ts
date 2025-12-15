import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Piechart } from './piechart';

describe('Piechart', () => {
  let component: Piechart;
  let fixture: ComponentFixture<Piechart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Piechart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Piechart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
