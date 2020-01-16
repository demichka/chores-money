import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoresPageComponent } from './chores-page.component';

describe('ChoresPageComponent', () => {
  let component: ChoresPageComponent;
  let fixture: ComponentFixture<ChoresPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoresPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoresPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
