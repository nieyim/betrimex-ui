import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coconutcount } from './coconutcounter';

describe('Coconutcount', () => {
  let component: Coconutcount;
  let fixture: ComponentFixture<Coconutcount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coconutcount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coconutcount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
