// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';

import LocationGraphQLType from '../../../../location/types/outputs/Location';

export default new GraphQLObjectType({
  name: 'TransportationServiceRelevantLocations',
  fields: {
    location: {
      type: LocationGraphQLType,
    },
    whitelabelURL: {
      type: GraphQLString,
      resolve: (): string => 'https://kiwi.rideways.com/',
    },
    date: {
      type: GraphQLDate,
    },
  },
});
