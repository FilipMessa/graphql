// @flow

import BookingContactDetails from '../BookingContactDetails';

it('BookingContactDetails type should have valid fields', () => {
  expect(BookingContactDetails.getFields()).toMatchSnapshot();
});
