// @flow

import { GraphQLEnumType } from 'graphql';
import { DateTime } from 'luxon';

const AVAILABLE = 'available';
const IN_FUTURE = 'in_future';
const AT_AIRPORT = 'at_airport';
const OTHER = 'other';

export const boardingPassStatusResolver = (
  availableAt: ?string,
  boardingPassUrl: mixed,
): string => {
  if (boardingPassUrl) {
    return AVAILABLE;
  }

  if (availableAt === null) {
    return AT_AIRPORT;
  }

  if (availableAt && DateTime.fromISO(availableAt) > DateTime.utc()) {
    return IN_FUTURE;
  }

  return OTHER;
};

export default new GraphQLEnumType({
  name: 'availabilityStatus',
  values: {
    AVAILABLE: { value: AVAILABLE },
    IN_FUTURE: { value: IN_FUTURE },
    AT_AIRPORT: { value: AT_AIRPORT },
    OTHER: { value: OTHER },
  },
});
