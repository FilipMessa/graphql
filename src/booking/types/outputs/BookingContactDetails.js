// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import Passenger from './Passenger';

export default new GraphQLObjectType({
  name: 'BookingContactDetails',
  description: 'Contact details related to the booking',
  fields: {
    phone: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    passenger: {
      type: Passenger,
      description: 'Documentation and information about the passanger.',
    },
  },
});
