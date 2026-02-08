import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioDisplay } from './bio-display';

describe('BioDisplay', () => {
  let component: BioDisplay;
  let fixture: ComponentFixture<BioDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BioDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BioDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
