// @flow

import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';
import idx from 'idx';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import GraphQLHotelFacility from './HotelFacility';
import GraphQLHotelRoom from './HotelRoom';
import GraphQLHotelPhoto from './HotelPhoto';
import GraphQLHotelRating from './HotelRating';
import GraphQLCoordinates from '../../../location/types/outputs/Coordinates';
import { connectionFromArray } from '../../../common/services/ArrayConnection';

import type { HotelExtendedType } from '../../dataloaders/flow/HotelExtendedType';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import hotelCommonFields, { getDistanceFromCenter } from './HotelCommonFields';

export default new GraphQLObjectType({
  name: 'Hotel',
  description: 'General information about the hotel.',
  fields: {
    id: globalIdField('hotel', ({ id }: HotelExtendedType): string => id),

    ...hotelCommonFields,

    originalId: {
      description:
        'Original (low level ID of the hotel). You are probably looking for "id" field.',
      deprecationReason:
        'Use field "id" instead. This field is used only because of compatibility reasons with old APIs.',
      type: GraphQLString,
      resolve: ({ id }: HotelExtendedType): string => id,
    },

    cityName: {
      type: GraphQLString,
      resolve: ({ cityName }: HotelExtendedType) => cityName,
    },

    whitelabelUrl: {
      description: 'URL to our whitelabel page of this hotel.',
      type: GraphQLString,
      resolve: ({ whitelabelUrl }: HotelExtendedType) => whitelabelUrl,
    },

    summary: {
      description: 'Main description (summary) of the hotel.',
      type: GraphQLString,
      resolve: ({ summary }: HotelExtendedType) => summary,
    },

    mainPhoto: {
      description: 'Main photo of the hotel.',
      type: GraphQLHotelPhoto,
      resolve: async ({ photos }: HotelExtendedType) => {
        return photos[0]; // just the first one
      },
    },

    coordinates: {
      description: 'Location of the hotel.',
      type: GraphQLCoordinates,
      resolve: async (
        ancestor: HotelExtendedType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        const { location } = await dataLoader.hotel.byID.load({
          hotelId: ancestor.id,
          language: idx(ancestor, _ => _.args.language),
        });
        return {
          lat: location.latitude,
          lng: location.longitude,
        };
      },
    },

    rating: {
      // see: https://en.wikipedia.org/wiki/Hotel_rating
      description: 'The star rating of the hotel.',
      type: GraphQLHotelRating,
      resolve: ({ rating }: HotelExtendedType) => rating,
    },

    facilities: {
      description: 'All facilities available in the hotel.',
      type: connectionDefinitions({
        nodeType: GraphQLHotelFacility,
      }).connectionType,
      args: connectionArgs,
      resolve: async (
        ancestor: HotelExtendedType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        const { facilities } = await dataLoader.hotel.byID.load({
          hotelId: ancestor.id,
          language: idx(ancestor, _ => _.args.language),
        });
        return connectionFromArray(facilities, args);
      },
    },

    rooms: {
      description: 'All rooms available in the hotel.',
      type: connectionDefinitions({
        nodeType: GraphQLHotelRoom,
      }).connectionType,
      args: connectionArgs,
      resolve: async ({ rooms }: HotelExtendedType, args: Object) => {
        return connectionFromArray(rooms, args);
      },
    },

    photos: {
      description: 'All available photos of the hotel.',
      type: connectionDefinitions({
        nodeType: GraphQLHotelPhoto,
      }).connectionType,
      args: connectionArgs,
      resolve: async ({ photos }: HotelExtendedType, args: Object) => {
        return connectionFromArray(photos, args);
      },
    },

    distanceFromCenter: {
      description: 'Hotel distance from the center in Km.',
      type: GraphQLFloat,
      resolve: async (
        ancestor: HotelExtendedType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        const { location, cityId } = await dataLoader.hotel.byID.load({
          hotelId: ancestor.id,
          language: idx(ancestor, _ => _.args.language),
        });

        const distance = await getDistanceFromCenter(
          dataLoader.city,
          cityId,
          location,
        );

        return distance;
      },
    },
  },
});
