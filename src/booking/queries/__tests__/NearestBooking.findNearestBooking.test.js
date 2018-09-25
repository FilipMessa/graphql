// @flow

import MockDate from 'mockdate';
import { DateTime } from 'luxon';

import { findNearestBooking } from '../NearestBooking';
import { createLeg } from '../../services/testUtils';

const now = DateTime.utc().plus({ milliseconds: 1000 });
MockDate.set(now);

describe('findNearestBooking', () => {
  const bookings = [
    {
      legs: [
        createLeg(now.minus({ milliseconds: 100 })),
        createLeg(now.plus({ milliseconds: 500 })),
        createLeg(now.plus({ milliseconds: 600 })),
      ],
    },
    {
      legs: [
        createLeg(now.plus({ milliseconds: 150 })),
        createLeg(now.plus({ milliseconds: 200 })),
      ],
    },
  ];
  const pastBookings = [
    {
      legs: [
        createLeg(now.minus({ milliseconds: 900 })),
        createLeg(now.minus({ milliseconds: 800 })),
        createLeg(now.minus({ milliseconds: 100 })),
      ],
    },
    {
      legs: [
        createLeg(now.minus({ milliseconds: 500 })),
        createLeg(now.minus({ milliseconds: 400 })),
      ],
    },
  ];

  it('should find nearest booking', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(bookings);

    expect(nearest).toBe(bookings[0]);
  });

  it('should find nearest future booking', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(bookings, true);

    expect(nearest).toBe(bookings[1]);
  });

  it('should not find future booking in list of past bookings', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(pastBookings, true);

    expect(nearest).toBe(null);
  });

  it('should find nearest past booking', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(pastBookings);

    expect(nearest).toBe(pastBookings[0]);
  });
});
