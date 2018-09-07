// @flow

import generateDownloadBoardingPassEvent from '../../bookingTimeline/downloadBoardingPass';
import { leg } from '../../TestData';

describe('generateDownloadBoardingPassEvent', () => {
  it('returns DownloadBoardingPass event', () => {
    expect(generateDownloadBoardingPassEvent(leg)).toMatchSnapshot();
  });
});
