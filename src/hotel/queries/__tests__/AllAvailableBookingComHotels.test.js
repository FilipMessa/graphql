// @flow

import {
  graphql,
  BookingComApiMock,
} from '../../../common/services/TestingTools';
import AllHotelsDataset from '../../datasets/all.json';
import PriceMaxDataset from '../../datasets/priceMax.json';
import PriceMinDataset from '../../datasets/priceMin.json';
import HotelsAvailabilityExtras from '../../datasets/hotelsAvailabilityExtras.json';
import CitiesDataset from '../../datasets/cities.json';

beforeEach(() => {
  BookingComApiMock.onGet(
    'https://distribution-xml.booking.com/2.0/json/hotelAvailability?extras=hotel_details&order_by=popularity&radius=50&latitude=45.4654&longitude=9.1859&checkin=2017-11-16&checkout=2017-11-23&rows=50&room1=A%2CA%2C4%2C6&room2=A%2C2',
  ).replyWithData(AllHotelsDataset);
  BookingComApiMock.onGet(
    'https://distribution-xml.booking.com/2.0/json/hotelAvailability?order_by=price&radius=50&latitude=45.4654&longitude=9.1859&checkin=2017-11-16&checkout=2017-11-23&rows=1&room1=A%2CA%2C4%2C6&room2=A%2C2&order_dir=asc&offset=0',
  ).replyWithData(PriceMaxDataset);
  BookingComApiMock.onGet(
    'https://distribution-xml.booking.com/2.0/json/hotelAvailability?order_by=price&radius=50&latitude=45.4654&longitude=9.1859&checkin=2017-11-16&checkout=2017-11-23&rows=1&room1=A%2CA%2C4%2C6&room2=A%2C2&order_dir=desc&offset=0',
  ).replyWithData(PriceMinDataset);
  BookingComApiMock.onGet(
    'https://distribution-xml.booking.com/2.0/json/hotels?extras=hotel_info%2Chotel_photos&hotel_ids=25215%2C248539&language=en-us',
  ).replyWithData(HotelsAvailabilityExtras);
  BookingComApiMock.onGet(
    'https://distribution-xml.booking.com/2.0/json/cities?extras=location&city_ids=-126278%2C900048081',
  ).replyWithData(CitiesDataset);
});

describe('all hotels query', () => {
  it('should work for full query', async () => {
    expect(
      await graphql(`
        {
          allAvailableBookingComHotels(
            search: {
              latitude: 45.4654
              longitude: 9.1859
              checkin: "2017-11-16"
              checkout: "2017-11-23"
              roomsConfiguration: [
                { adultsCount: 2, children: [{ age: 4 }, { age: 6 }] }
                { adultsCount: 1, children: [{ age: 2 }] }
              ]
            }
          ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              node {
                id
                hotelId
                name
                price {
                  amount
                  currency
                }
                review {
                  score
                  description
                  count
                }
                rating {
                  stars
                  categoryName
                }
                distanceFromCenter
                mainPhoto {
                  lowResUrl
                }
              }
            }
            cityName
            stats {
              minPrice
              maxPrice
            }
          }
        }
      `),
    ).toMatchSnapshot();
  });
});
