import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForAllComponent } from './for-all.component';

describe('ForAllComponent', () => {
  let component: ForAllComponent;
  let fixture: ComponentFixture<ForAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
