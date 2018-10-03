// @flow

import type { HotelFacilities } from './HotelFacilities';
import type { RoomsConfiguration } from './RoomsConfiguration';

type OrderByEnum =
  | 'distance'
  | 'popularity'
  | 'price'
  | 'ranking'
  | 'review_score'
  | 'stars';

type SharedSearchParameters = {|
  checkin: Date,
  checkout: Date,
  roomsConfiguration: RoomsConfiguration,
  orderBy: OrderByEnum,
  stars?: number[],
  minPrice?: number,
  maxPrice?: number,
  currency?: string,
  hotelFacilities?: HotelFacilities,
  minScore?: number,
  freeCancellation?: boolean,
  rows?: number,
  offset?: number,
  language?: string,
|};

type SearchByHotelId = {|
  hotelId: string,
  ...SharedSearchParameters,
|};

type SearchByCityId = {|
  cityId: string,
  ...SharedSearchParameters,
|};

type SearchByCoordinates = {|
  latitude: number,
  longitude: number,
  ...SharedSearchParameters,
|};

export type SearchParameters =
  | SearchByHotelId
  | SearchByCityId
  | SearchByCoordinates;
