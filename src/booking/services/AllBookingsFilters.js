// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { BookingsItem } from '../Booking';
import type { Leg } from '../../flight/Flight';
import { CoveredBy } from '../../flight/types/enums/CoveredBy';

export function groupBookings(bookings: $ReadOnlyArray<BookingsItem>) {
  return bookings.reduce(
    (acc, curVal) => {
      if (isPastBooking(curVal) === true) {
        acc.past.push(curVal);
      } else {
        acc.future.push(curVal);
      }
      return acc;
    },
    {
      future: [],
      past: [],
    },
  );
}

export function filterOnlyBookings(
  timeFrame: 'future' | 'past',
  bookings: $ReadOnlyArray<BookingsItem>,
) {
  const bookingGroups = groupBookings(bookings);

  if (timeFrame === 'future') {
    return bookingGroups.future;
  }
  return bookingGroups.past;
}

/**
 * Past booking is booking where every arrival date of every leg is in past
 * (considering local time).
 */
export function isPastBooking(singleBooking: BookingsItem) {
  const when = singleBooking.arrival.when;
  if (!when) {
    return true;
  }

  return (
    DateTime.fromJSDate(when.utc, {
      zone: 'utc',
    })
      .diffNow('milliseconds')
      .toObject().milliseconds < 0
  );
}

export function findUpcomingLeg(
  legs: Leg[],
  guarantee: ?$Values<typeof CoveredBy>,
) {
  return [...legs]
    .filter(leg => {
      const date = idx(leg, _ => _.arrival.when.utc);
      const isFuture = date
        ? DateTime.fromJSDate(date, { zone: 'utc' }).diffNow('milliseconds')
            .milliseconds > 0
        : false;

      return guarantee ? leg.guarantee === guarantee && isFuture : isFuture;
    })
    .sort((legA, legB) => {
      const dateA = idx(legA, _ => _.arrival.when.utc);
      const dateB = idx(legB, _ => _.arrival.when.utc);

      return dateA && dateB ? dateA - dateB : 0;
    })
    .shift();
}
