// @flow

import MockDate from 'mockdate';
import { DateTime } from 'luxon';

import { findUpcomingLeg } from '../AllBookingsFilters';
import { createLeg } from '../testUtils';

const now = DateTime.utc().plus({ milliseconds: 1000 });
MockDate.set(now);

describe('BookingInterface.upcomingLeg', () => {
  it('should return upcoming Leg', () => {
    const legs = [
      createLeg(now.plus({ milliseconds: 20 })),
      createLeg(now.plus({ milliseconds: 10 })),
      createLeg(now.plus({ milliseconds: 50 })),
    ];
    // $FlowExpectedError: full booking not needed for this test
    expect(findUpcomingLeg(legs)).toHaveProperty(
      'arrival.when.utc',
      now.plus({ milliseconds: 10 }).toJSDate(),
    );
  });

  it('should return nothing for past booking', () => {
    const legs = [
      createLeg(now.minus({ milliseconds: 80 })),
      createLeg(now.minus({ milliseconds: 90 })),
      createLeg(now.minus({ milliseconds: 50 })),
    ];
    // $FlowExpectedError: full booking not needed for this test
    expect(findUpcomingLeg(legs)).toBeFalsy();
  });

  it('should filter out upcoming leg by guarantee', () => {
    const legs = [
      createLeg(now.plus({ milliseconds: 10 })),
      createLeg(now.plus({ milliseconds: 50 }), true),
    ];
    // $FlowExpectedError: full booking not needed for this test
    expect(findUpcomingLeg(legs, 'KIWICOM')).toHaveProperty(
      'arrival.when.utc',
      now.plus({ milliseconds: 50 }).toJSDate(),
    );
  });
});
