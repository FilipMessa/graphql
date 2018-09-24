// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import categories from '../../datasets/categories.json';

describe('FAQSection', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/categories/3',
    ).replyWithData(categories);
  });

  it('should return single FAQ category by section', async () => {
    const resultsQuery = `{ 
      FAQSection(section: UPCOMING_BOOKING) {
        id
        originalId
        title
        subcategories {
          id
        }
        FAQs {
          id
          title
        }
      }
    }`;
    expect(await graphql(resultsQuery)).toMatchSnapshot();
  });
});
