// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import type { LocationAreaType } from '../Entities';

export default new GraphQLObjectType({
  name: 'LocationArea',
  fields: {
    locationId: {
      type: GraphQLString,
      resolve: ({ locationId }: LocationAreaType): string => locationId,
    },
    name: {
      type: GraphQLString,
      resolve: ({ name }: LocationAreaType): string => name,
    },
    code: {
      type: GraphQLString,
      resolve: ({ code }: LocationAreaType): string => code,
    },
    slug: {
      type: GraphQLString,
      resolve: ({ slug }: LocationAreaType): string => slug,
    },
  },
});