// @flow

import type { PhotoType as HotelPhotoType } from './PhotoType';

export type HotelsAvailabilityExtrasType = {|
  +rating: number,
  +cityId: string,
  +photos: HotelPhotoType[],
  +location: {|
    +longitude: string,
    +latitude: string,
  |},
|};
