// @flow

import { GraphQLString } from 'graphql';
import distance from 'gps-distance';

import type { HotelExtendedType } from '../../dataloaders/flow/HotelExtendedType';
import GraphQLAddress from '../../../common/types/outputs/Address';
import type { Address } from '../../../common/types/outputs/Address';
import GraphQLHotelReview from './HotelReview';

export const getDistanceFromCenter = async (
  dataLoader: Object,
  cityId: string,
  location: {| +latitude: string, +longitude: string |},
) => {
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
  }
  return null;
};

export default {
  name: {
    description: 'Name of the hotel.',
    type: GraphQLString,
    resolve: ({ name }: HotelExtendedType) => name,
  },
  address: {
    type: GraphQLAddress,
    resolve: ({ address }: HotelExtendedType): Address => {
      return {
        street: address.street,
        city: address.city,
        zip: address.zip,
      };
    },
  },
  review: {
    type: GraphQLHotelReview,
    resolve: ({ review }: HotelExtendedType) => review,
  },
};
