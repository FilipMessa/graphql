// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
} from 'graphql';
import distance from 'gps-distance';
import { toGlobalId } from 'graphql-relay';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import GraphQLPrice from '../../../common/types/outputs/Price';
import GraphQLHotelPhoto from './HotelPhoto';
import GraphQLHotelReview from './HotelReview';
import GraphQLHotelRating from './HotelRating';
import type { HotelType } from '../../dataloaders/flow/HotelType';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';

export default new GraphQLObjectType({
  name: 'AllHotelAvailabilityHotel',
  description:
    'Information about hotel availability during selected time period.',
  fields: {
    id: globalIdField(),

    price: {
      type: GraphQLPrice,
      description:
        'Total price for all guests and nights and in the hotel. (including VAT)',
      resolve: ({ price, currencyCode }: HotelType) => ({
        amount: price,
        currency: currencyCode,
      }),
    },
    name: {
      type: GraphQLString,
      resolve: ({ name }) => name,
    },
    review: {
      type: GraphQLHotelReview,
      resolve: ({ review }) => review,
    },
    rating: {
      type: GraphQLHotelRating,
      resolve: async (
        { id }: HotelType,
        _: mixed,
        { dataLoader }: GraphqlContextType,
      ) => {
        const hotelExtras = await dataLoader.hotel.hotelsAvailabilityExtras.load(
          parseInt(id),
        );

        return hotelExtras.rating;
      },
    },
    distanceFromCenter: {
      description: 'Hotel distance from the center in Km.',
      type: GraphQLFloat,
      resolve: async (
        { id }: HotelType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        const {
          cityId,
          location,
        } = await dataLoader.hotel.hotelsAvailabilityExtras.load(parseInt(id));

        const city = await dataLoader.city.load(cityId);

        if (location && city && city.location) {
          return Math.abs(
            distance(
              location.latitude,
              location.longitude,
              city.location.latitude,
              city.location.longitude,
            ),
          ).toFixed(3);
        } else {
          return null;
        }
      },
    },
    mainPhoto: {
      description: 'Main photo of the hotel.',
      type: GraphQLHotelPhoto,
      resolve: async (
        { id }: HotelType,
        _: mixed,
        { dataLoader }: GraphqlContextType,
      ) => {
        const { photos } = await dataLoader.hotel.hotelsAvailabilityExtras.load(
          parseInt(id),
        );
        return photos[0]; // just the first one
      },
    },
    hotelId: {
      description: 'Id of hotel',
      type: GraphQLID,
      // When we query for availableHotel it will check that the id is of hotel
      resolve: ({ id }: HotelType): string => toGlobalId('hotel', id),
    },
  },
});
