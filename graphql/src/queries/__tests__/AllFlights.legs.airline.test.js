// @flow

import { executeQuery } from '../../services/TestingTools';

describe('all flights query with legs airline', () => {
  it('should return array of flight legs with airline', async () => {
    const allFlightsSearchQuery = `
    query ($input: FlightsSearchInput!) {
      allFlights(search: $input) {
        legs {
          airline {
            name
            code
            logoUrl
            isLowCost
          }
        }
      }
    }`;
    const variables = {
      input: {
        from: 'PRG',
        to: 'MEX',
        dateFrom: '2017-08-08',
        dateTo: '2017-09-08',
      },
    };
    expect(
      await executeQuery(allFlightsSearchQuery, variables),
    ).toMatchSnapshot();
  });
});
