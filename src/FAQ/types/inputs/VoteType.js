// @flow

import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'VoteType',
  values: {
    up: { value: 'up' },
    down: { value: 'down' },
  },
});
