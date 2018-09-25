// @flow

import { GraphQLObjectType, GraphQLBoolean } from 'graphql';

import guaranteeChat from './guaranteeChat';

export default new GraphQLObjectType({
  name: 'BookingCustomerSupport',
  fields: {
    hasGuaranteeChat: {
      type: GraphQLBoolean,
      description:
        'Is Guarantee Chat allowed to provide direct contact to customer service.',
      resolve: guaranteeChat,
    },
  },
});
