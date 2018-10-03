// @flow

import { GraphQLInputObjectType } from 'graphql';
import Currency from '../../../common/types/enums/Currency';
import OrderBy from '../enums/OrderByEnum';

export default new GraphQLInputObjectType({
  name: 'AvailableHotelOptionsInput',
  fields: {
    currency: {
      type: Currency,
      description: 'Three-letters ISO 4217 currency code, e.g. EUR or USD',
    },
    orderBy: {
      type: OrderBy,
      description: 'Order results by this input type',
    },
  },
});
