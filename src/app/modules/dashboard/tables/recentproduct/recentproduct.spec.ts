import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recentproduct } from './recentproduct';

describe('Recentproduct', () => {
  let component: Recentproduct;
  let fixture: ComponentFixture<Recentproduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recentproduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recentproduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
