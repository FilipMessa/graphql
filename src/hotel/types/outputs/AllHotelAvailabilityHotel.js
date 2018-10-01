// @flow

import { GraphQLObjectType, GraphQLFloat, GraphQLID } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import GraphQLPrice from '../../../common/types/outputs/Price';
import GraphQLHotelPhoto from './HotelPhoto';
import GraphQLHotelRating from './HotelRating';
import type { HotelType } from '../../dataloaders/flow/HotelType';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import GraphQLCoordinates from '../../../location/types/outputs/Coordinates';
import hotelCommonFields, { getDistanceFromCenter } from './HotelCommonFields';

export default new GraphQLObjectType({
  name: 'AllHotelAvailabilityHotel',
  description:
    'Information about hotel availability during selected time period.',
  fields: {
    id: globalIdField(),
    ...hotelCommonFields,
    price: {
      type: GraphQLPrice,
      description:
        'Total price for all guests and nights and in the hotel. (including VAT)',
      resolve: ({ price, currencyCode }: HotelType) => ({
        amount: price,
        currency: currencyCode,
      }),
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

        const distance = await getDistanceFromCenter(
          dataLoader,
          cityId,
          location,
        );
        return distance;
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
    coordinates: {
      description: 'Location of the hotel.',
      type: GraphQLCoordinates,
      resolve: async (
        { id }: HotelType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        const {
          location,
        } = await dataLoader.hotel.hotelsAvailabilityExtras.load(parseInt(id));
        return {
          lat: location.latitude,
          lng: location.longitude,
        };
      },
    },
  },
});
