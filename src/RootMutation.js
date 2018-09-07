// @flow

import { GraphQLObjectType } from 'graphql';

import Login from './identity/mutations/Login';
import ResetPassword from './identity/mutations/ResetPassword';
import UpdatePassenger from './booking/mutations/UpdatePassenger';
import RefundInsurance from './booking/mutations/RefundInsurance';
import voteFAQArticle from './FAQ/mutations/voteFAQArticle';
import addFAQArticleComment from './FAQ/mutations/addFAQArticleComment';

export default new GraphQLObjectType({
  name: 'RootMutation',
  description: 'Root Mutation.',
  fields: {
    login: Login,
    resetPassword: ResetPassword,
    updatePassenger: UpdatePassenger,
    refundInsurance: RefundInsurance,
    voteFAQArticle,
    addFAQArticleComment,
  },
});
