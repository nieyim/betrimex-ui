import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coconutai } from './coconutai';

describe('Coconutai', () => {
  let component: Coconutai;
  let fixture: ComponentFixture<Coconutai>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coconutai]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coconutai);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
