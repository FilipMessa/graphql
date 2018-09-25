// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import { findUpcomingLeg } from '../../../services/AllBookingsFilters';
import type { BookingsItem } from '../../../Booking';

export default ({ booking }: {| +booking: BookingsItem |}) => {
  const upcomingLeg = findUpcomingLeg(booking.legs, 'KIWICOM');

  if (!upcomingLeg) {
    return false;
  }

  if (shouldShowGuarantee(upcomingLeg)) {
    return true;
  }

  // allow guarantee chat also if there is any preceding flight...

  // ... for one way booking
  if (booking.type === 'BookingOneWay') {
    const precedingLeg = findPrecedingLeg(booking.legs, upcomingLeg);

    if (precedingLeg && shouldShowGuarantee(precedingLeg)) {
      return true;
    }
  }

  // ... for return booking
  if (booking.type === 'BookingReturn' && booking.inbound && booking.outbound) {
    const legs = upcomingLeg.isReturn
      ? booking.inbound.legs
      : booking.outbound.legs;
    const precedingLeg = findPrecedingLeg(legs, upcomingLeg);

    if (precedingLeg && shouldShowGuarantee(precedingLeg)) {
      return true;
    }
  }

  // ... for multicity booking
  if (booking.type === 'BookingMulticity' && booking.trips) {
    const isAllowed = booking.trips.find(trip => {
      const precedingLeg = findPrecedingLeg(trip.legs, upcomingLeg);

      return precedingLeg && shouldShowGuarantee(precedingLeg);
    });

    if (isAllowed) {
      return true;
    }
  }

  return false;
};

const findPrecedingLeg = (legs, upcomingLeg) => {
  const index = legs.findIndex(({ id }) => id === upcomingLeg.id);

  if (index > 0) {
    return legs[index - 1];
  }

  return null;
};

const shouldShowGuarantee = leg => {
  const THRESHOLD = 4; // how many hours in advance it's allowed
  const departureTime = idx(leg, _ => _.departure.when.utc);
  const arrivalTime = idx(leg, _ => _.arrival.when.utc);
  const hoursBeforeDeparture = departureTime
    ? DateTime.fromJSDate(new Date(departureTime), { zone: 'utc' }).diffNow(
        'hours',
      ).hours
    : null;
  const hoursBeforeArrival = arrivalTime
    ? DateTime.fromJSDate(new Date(arrivalTime), { zone: 'utc' }).diffNow(
        'hours',
      ).hours
    : null;
  return Boolean(
    hoursBeforeDeparture &&
      hoursBeforeArrival &&
      THRESHOLD > hoursBeforeDeparture &&
      hoursBeforeArrival > 0,
  );
};
