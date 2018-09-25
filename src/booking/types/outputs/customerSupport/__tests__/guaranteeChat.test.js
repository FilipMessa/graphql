// @flow

import MockDate from 'mockdate';
import { DateTime } from 'luxon';

import guaranteeChat from '../guaranteeChat';
import { createLeg } from '../../../../services/testUtils';

const now = DateTime.utc();
const inThreeHours = now.plus({ hours: 3 });
const nextDay = now.plus({ days: 1 });
const dayAgo = now.minus({ days: 1 });
const twoDaysAgo = now.minus({ days: 2 });

describe('BookingCustomerSupport.hasGuaranteeChat', () => {
  beforeEach(() => MockDate.set(now));

  afterEach(() => MockDate.reset());

  it('should be allowed for upcoming leg with guarantee', () => {
    const upcomingLeg = createLeg(inThreeHours, true);
    const booking = {
      type: 'BookingOneWay',
      upcomingLeg,
      legs: [upcomingLeg],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(true);
  });

  it('should not be allowed for upcoming leg with no guarantee', () => {
    const upcomingLeg = createLeg(inThreeHours, false);
    const booking = {
      type: 'BookingOneWay',
      upcomingLeg,
      legs: [upcomingLeg],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(false);
  });

  it('should not be allowed for upcoming leg with departure in more than 4 hours', () => {
    const upcomingLeg = createLeg(nextDay, true);
    const booking = {
      type: 'BookingOneWay',
      upcomingLeg,
      legs: [upcomingLeg],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(false);
  });

  it('should be allowed for leg preceding the leg with guarantee', () => {
    const upcomingLeg = createLeg(nextDay, true);
    const booking = {
      type: 'BookingOneWay',
      upcomingLeg,
      legs: [createLeg(inThreeHours, false), upcomingLeg],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(true);
  });

  it('should work for return bookings', () => {
    const upcomingLeg = {
      ...createLeg(nextDay, true),
      isReturn: true,
    };
    const preceding = {
      ...createLeg(inThreeHours, false),
      isReturn: true,
    };
    const booking = {
      type: 'BookingReturn',
      upcomingLeg,
      inbound: {
        legs: [preceding, upcomingLeg],
      },
      outbound: {
        legs: [createLeg(twoDaysAgo, true), createLeg(dayAgo, true)],
      },
      legs: [
        createLeg(twoDaysAgo, true),
        createLeg(dayAgo, true),
        preceding,
        upcomingLeg,
      ],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(true);
  });

  it('should work for multicity bookings', () => {
    const upcomingLeg = createLeg(nextDay, true);
    const preceding = createLeg(inThreeHours, false);
    const booking = {
      type: 'BookingMulticity',
      upcomingLeg,
      trips: [
        {
          legs: [createLeg(twoDaysAgo, true), createLeg(dayAgo, true)],
        },
        {
          legs: [preceding, upcomingLeg],
        },
      ],
      legs: [
        createLeg(twoDaysAgo, true),
        createLeg(dayAgo, true),
        preceding,
        upcomingLeg,
      ],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(true);
  });

  it('should not take legs from different trips into account', () => {
    const upcomingLeg = createLeg(nextDay, true);
    const preceding = createLeg(inThreeHours, false);
    const booking = {
      type: 'BookingMulticity',
      upcomingLeg,
      trips: [
        {
          legs: [createLeg(twoDaysAgo, true), createLeg(dayAgo, true)],
        },
        {
          legs: [preceding],
        },
        {
          legs: [upcomingLeg],
        },
      ],
      legs: [
        createLeg(twoDaysAgo, true),
        createLeg(dayAgo, true),
        preceding,
        upcomingLeg,
      ],
    };
    // $FlowExpectedError: full booking not needed for this test
    expect(guaranteeChat({ booking })).toBe(false);
  });
});
