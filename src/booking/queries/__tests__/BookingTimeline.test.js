// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import BookingTimeline from '../BookingTimeline';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707251 from '../../datasets/booking-2707251.json';

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData(
    AllBookingsDataset,
  );
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707251?simple_token=b206db64-718f-4608-babb-0b8abe6e1b9d',
  ).replyWithData(Booking2707251);

  ['CDG', 'LGW'].forEach(iata => {
    RestApiMock.onGet(
      config.restApiEndpoint.allLocations({
        type: 'id',
        id: iata,
        locale: 'en-US',
      }),
    ).replyWithData({
      locations: [
        {
          id: 'MOCKED',
          city: {
            name: 'Mocked City Name',
          },
        },
      ],
    });
  });
});

describe('single booking timeline query', () => {
  it('should be of BookingTimeline type', () => {
    expect(BookingTimeline.type.toString()).toBe('BookingTimeline');
  });

  it('should not accept database id', async () => {
    const databaseIdQuery = `{
      bookingTimeline(id: 2707251) {
        __typename
      }
    }`;
    expect(await graphql(databaseIdQuery)).toMatchSnapshot();
  });

  it('should work with opaque Booking id', async () => {
    const query = `{
      bookingTimeline(id: "Qm9va2luZzoyNzA3MjUx") {
        events {
          __typename
          ... on BookedFlight{
            timestamp
          }
          ... on BookingConfirmed{
            timestamp
          }
          ... on PaymentConfirmed {
            timestamp
          }
          ... on  DownloadReceipt{
            timestamp
            receiptUrl
          }
          ... on  DownloadETicket{
            timestamp
            ticketUrl
          }
          ... on   LeaveForAirport{
            timestamp
          }
          ... on  AirportArrival{
            timestamp
            location {
              airport {
                city {
                  locationId
                  name
                  slug
                }
              }
            }
          }
          ... on Boarding{
            timestamp
            gate
          }
          ... on  Departure{
            timestamp
            location {
              airport {
                city {
                  locationId
                  name
                  slug
                }
              }
            }
          }
          ... on  Arrival{
            timestamp
            location {
              airport {
                city {
                  locationId
                  name
                  slug
                }
              }
            }
          }
          ... on  TransportFromAirport{
            timestamp
          }
        }
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });
});
