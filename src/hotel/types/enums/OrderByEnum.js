// @flow

import { GraphQLEnumType } from 'graphql';

const values = {
  DISTANCE: {
    value: 'distance',
  },
  POPULARITY: {
    value: 'popularity',
  },
  PRICE: {
    value: 'price',
  },
  RANKING: {
    value: 'ranking',
  },
  REVIEW_SCORE: {
    value: 'review_score',
  },
  STARS: {
    value: 'stars',
  },
};

export default new GraphQLEnumType({
  name: 'OrderBy',
  values,
});
