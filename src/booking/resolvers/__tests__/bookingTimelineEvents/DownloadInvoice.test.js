// @flow

import generateDownloadInvoiceEvent from '../../bookingTimeline/downloadInvoice';
import { booking } from '../../TestData';

describe('generateDownloadInvoiceEvent', () => {
  it('returns DownloadInvoice event', () => {
    expect(
      generateDownloadInvoiceEvent({
        ...booking,
        assets: {
          ...booking.assets,
          invoiceUrl: '',
        },
      }),
    ).toMatchSnapshot();
  });
});
