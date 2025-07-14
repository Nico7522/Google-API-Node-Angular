import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailsFilter } from './mails-filter';

describe('MailsFilter', () => {
  let component: MailsFilter;
  let fixture: ComponentFixture<MailsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
