// @flow

import resolver from '../BookingTimeline';
import { booking } from '../TestData';

describe('resolver', () => {
  it('matches the snapshot', () => {
    expect(resolver(booking)).toMatchSnapshot();
  });

  test("DownloadBoardingPassEvent should have timestamp 5 minutes earlier than BoardingEvent's", () => {
    const result = resolver(booking);

    const boardingEvent = result.find(
      event => event.type === 'BoardingTimelineEvent',
    );
    const downloadBPEvent = result.find(
      event => event.type === 'DownloadBoardingPassTimelineEvent',
    );

    if (boardingEvent && downloadBPEvent) {
      expect(boardingEvent.timestamp - downloadBPEvent.timestamp).toBe(
        5 * 60 * 1000,
      );
    }
  });
});
