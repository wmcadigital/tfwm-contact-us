import { getResponseDays } from './EnquiryForm/components';

describe('getResponseDays', () => {
  test('treats paper ticket as a Swift branch journey with 5 working days', () => {
    expect(getResponseDays('step-paper-ticket')).toBe(5);
  });

  test('keeps corporate ticketing at 10 working days', () => {
    expect(getResponseDays('step-corporate-ticketing')).toBe(10);
  });

  test('keeps older person and disabled person help at 30 working days', () => {
    expect(getResponseDays('step-help-olderpass-application')).toBe(30);
    expect(getResponseDays('step-help-disabledpass-application')).toBe(30);
  });
});
