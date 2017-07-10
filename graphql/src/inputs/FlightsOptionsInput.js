// @flow

import { GraphQLInputObjectType } from 'graphql';
import GraphQLCurrency from '../outputs/Currency';
import GraphQLLocale from '../inputs/Locale';

export default new GraphQLInputObjectType({
  name: 'FlightsOptionsInput',
  fields: {
    currency: {
      type: GraphQLCurrency,
      description: 'An ISO-4217 currency code.',
    },
    locale: {
      type: GraphQLLocale,
    },
  },
});
