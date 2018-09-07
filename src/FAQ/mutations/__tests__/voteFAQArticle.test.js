// @flow

import { toGlobalId } from 'graphql-relay';
import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import articleMockData from '../../datasets/FAQArticle-41.json';

const goodId = '41';
const globalId = toGlobalId('FAQArticle', goodId);

beforeEach(() => {
  RestApiMock.onGet(
    `https://api.skypicker.com/knowledgebase/api/v1/articles/${goodId}`,
  ).replyWithData(articleMockData);
});

const voteMutation = `
  mutation($articleId: ID!, $vote: VoteType) {
    voteFAQArticle(id: $articleId, vote: $vote) {
      id
    }
  }
`;

describe('voteFAQArticle mutation', () => {
  it('should vote article up', async () => {
    RestApiMock.onPost(
      `https://api.skypicker.com/knowledgebase/api/v1/articles/${goodId}/vote`,
    ).replyWithData({ message: 'yummy' });

    expect(
      await graphql(voteMutation, { articleId: globalId, vote: 'up' }),
    ).toMatchSnapshot();
  });

  it('should vote article down', async () => {
    RestApiMock.onPost(
      `https://api.skypicker.com/knowledgebase/api/v1/articles/${goodId}/vote`,
    ).replyWithData({ message: 'yummy' });

    expect(
      await graphql(voteMutation, { articleId: globalId, vote: 'down' }),
    ).toMatchSnapshot();
  });

  it('should not vote when payload is invalid', async () => {
    RestApiMock.onPost(
      `https://api.skypicker.com/knowledgebase/api/v1/articles/${goodId}/vote`,
    ).replyWithData({ message: 'invalid post body' });

    expect(
      await graphql(voteMutation, {
        articleId: globalId,
        vote: 'invalidString',
      }),
    ).toMatchSnapshot();
  });
});
