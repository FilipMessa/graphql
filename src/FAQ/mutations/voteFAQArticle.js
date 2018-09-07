// @flow

import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import { post } from '../../common/services/HttpRequest';
import { ProxiedError } from '../../common/services/errors/ProxiedError';
import supportedLanguages from '../supportedLanguages';
import FAQArticle from '../types/outputs/FAQArticle';
import VoteType from '../types/inputs/VoteType';
import type { FAQArticleDetail as FAQArticleType } from '../dataloaders/FAQArticle';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

const successfulResponse = { message: 'yummy' };

export default {
  type: FAQArticle,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of FAQ article to receive vote.',
    },
    vote: {
      type: VoteType,
      description: 'Type of vote for article (up/down)',
    },
  },
  resolve: async (
    _: mixed,
    { id, vote }: Object,
    { dataLoader, locale }: GraphqlContextType,
  ): Promise<FAQArticleType> => {
    const numericVote = vote.toString() === 'up' ? 1 : -1;
    const payload = {
      vote: numericVote,
    };
    const { id: originalId, type } = fromGlobalId(id);

    if (type !== 'FAQArticle') {
      throw new Error(
        `FAQArticle ID mishmash. You cannot query FAQ with ID ` +
          `'${id}' because this ID is not ID of the FAQArticle. ` +
          `Please use opaque ID of the FAQArticle.`,
      );
    }

    let language = locale.language;
    if (supportedLanguages[language] !== true) {
      language = 'en';
    }

    const voteUrl = `https://api.skypicker.com/knowledgebase/api/v1/articles/${originalId}/vote`;
    const header = {
      'Accept-Language': language,
    };
    const response = await post(voteUrl, payload, header);

    if (response.message !== successfulResponse.message) {
      throw new ProxiedError(
        response.message ? response.message : 'Article voting failed',
        response.error_code ? response.error_code : '-1',
        voteUrl,
      );
    }

    return dataLoader.FAQArticle.load({ originalId });
  },
};
