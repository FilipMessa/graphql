// @flow

import { GraphQLNonNull } from 'graphql';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import FAQCategory from './../types/outputs/FAQCategory';
import FAQSection from '../types/enums/FAQSection';

export default {
  type: FAQCategory,
  description: 'Retrieve category by section.',
  args: {
    section: {
      type: new GraphQLNonNull(FAQSection),
      description: `Fetch FAQ category by section according to current customer's booking status.`,
    },
  },
  resolve: async (
    ancestor: mixed,
    { section }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    return dataLoader.FAQCategories.loadOneBySection(section);
  },
};
