// @flow

import { get } from '../services/BookingComRequest';
import { queryWithParameters } from '../../../config/application';
import OptimisticDataloader from '../../common/services/OptimisticDataloader';
import sanitizePhotos from './PhotoSanitizer';
import { localeToBookingComLanguage } from '../../common/types/enums/LocaleValues';

import type { HotelsAvailabilityExtrasType } from './flow/HotelsAvailabilityExtras';

/**
 * This data-loader loads extra information for all hotels by their ID.
 *
 * @see https://distribution-xml.booking.com/2.0/json/hotels?hotel_ids=25215&extras=hotel_info,hotel_photos
 */
export default function createHotelsAvailabilityExtras(locale: string) {
  return new OptimisticDataloader(
    async (
      hotelIds: $ReadOnlyArray<number>,
    ): Promise<Array<HotelsAvailabilityExtrasType | Error>> => {
      const language = localeToBookingComLanguage(locale);
      const response = await get(createUrl(hotelIds, language));

      const hotels = response.result.map(hotelData => {
        return sanitizeHotelExtras(hotelData);
      });

      return hotels;
    },
  );
}

function createUrl(hotelIds: $ReadOnlyArray<number>, language: ?string) {
  const params = {
    extras: 'hotel_info,hotel_photos',
    hotel_ids: hotelIds.join(','),
    language,
  };

  return queryWithParameters(
    'https://distribution-xml.booking.com/2.0/json/hotels',
    params,
  );
}

function sanitizeHotelExtras(hotelData): HotelsAvailabilityExtrasType {
  const { hotel_data: hotel } = hotelData;
  return {
    rating: Math.round(hotel.class),
    cityId: hotel.city_id,
    location: hotel.location,
    photos: sanitizePhotos(hotel.hotel_photos),
  };
}
