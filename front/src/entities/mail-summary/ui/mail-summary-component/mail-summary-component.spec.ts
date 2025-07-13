import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSummaryComponent } from './mail-summary-component';

describe('MailSummaryComponent', () => {
  let component: MailSummaryComponent;
  let fixture: ComponentFixture<MailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
