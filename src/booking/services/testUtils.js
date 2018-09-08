// @flow

import { CoveredBy } from '../../flight/types/enums/CoveredBy';

export const createLeg = (
  milliseconds: number,
  guarantee: ?$Values<typeof CoveredBy> = 'CARRIER',
) => ({
  arrival: {
    when: {
      utc: new Date(milliseconds),
    },
  },
  guarantee,
});
