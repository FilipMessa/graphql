// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import dynamicPackages from '../../datasets/dynamicPackages.json';

jest.mock('../../../location/dataloaders/Location', () => {
  return jest.fn().mockImplementation(() => {
    return {
      loadById: async () => ({
        country: {
          code: 'GB',
        },
      }),
    };
  });
});

beforeEach(() => {
  RestApiMock.onPost(
    'http://packagesmetasearch.api.external.logitravel.com/availability/get/',
  ).replyWithData(dynamicPackages);
});

describe('Dynamic packages', () => {
  test('getting all dynamic packages', async () => {
    const resultsQuery = `{
      allDynamicPackages(simpleSearch: {
          fromAirport: "TXL",
          toAirport: "MAD",
          outboundFlights: ["OK123"],
          inboundFlights: ["OK123"],
          date: "2018-09-20",
          returnDate: "2018-09-30",
          passengers: {adults: 2, infants: 2}
        },
        currency: EUR,
        first: 3
      ) {
        edges {
          node {
            id
            price {
              amount
              currency
            }
            hotel {
              id
              name
              mainPhoto {
                highResUrl
              }
              rating {
                stars
              }
              review {
                score
              }
              summary
            }
            whitelabelUrl
          }
        }
      }
    }
    `;

    expect(await graphql(resultsQuery)).toMatchSnapshot();
  });
});
