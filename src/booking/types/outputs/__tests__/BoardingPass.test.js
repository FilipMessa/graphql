// @flow

import { DateTime } from 'luxon';
import BoardingPass from '../BoardingPass';
import { evaluateResolver } from '../../../../common/services/TestingTools';

const now = DateTime.utc();

const availabilityStatus = BoardingPass.getFields().availabilityStatus;

describe('Boarding pass', () => {
  it('should have valid fields', () => {
    expect(BoardingPass.getFields()).toMatchSnapshot();
  });

  it('resolves empty array correctly', () => {
    const pkpasses = BoardingPass.getFields().pkpasses;
    expect(
      evaluateResolver(pkpasses, {
        pkpasses: [],
      }),
    ).toBe(null);
  });

  it('should return availability status AVAILABLE if the boarding pass is present', () => {
    expect(
      evaluateResolver(availabilityStatus, {
        availableAt: '2018-09-08',
        boardingPassUrl: 'url',
      }),
    ).toBe('available');
  });

  it('should return availability status AT_AIRPORT if the availableAt and boardingPassUrl fields are null', () => {
    expect(
      evaluateResolver(availabilityStatus, {
        availableAt: null,
        boardingPassUrl: null,
      }),
    ).toBe('at_airport');
  });

  it('should return availability status IN_FUTURE if the availableAt field is a future date', () => {
    expect(
      evaluateResolver(availabilityStatus, {
        availableAt: now.plus({ days: 14 }),
        boardingPassUrl: null,
      }),
    ).toBe('in_future');
  });

  it('should return availability status OTHER if the availableAt field is a past day and the boarding pass is not present', () => {
    expect(
      evaluateResolver(availabilityStatus, {
        availableAt: now.minus({ days: 14 }),
        boardingPassUrl: null,
      }),
    ).toBe('other');
  });

  it('should return availability status OTHER if the availableAt field is undefined', () => {
    expect(
      evaluateResolver(availabilityStatus, {
        availableAt: undefined,
        boardingPassUrl: null,
      }),
    ).toBe('other');
  });
});
