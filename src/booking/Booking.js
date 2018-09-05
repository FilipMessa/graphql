// @flow

import type { DepartureArrival, Leg } from '../flight/Flight';
import type { Price } from '../common/types/Price';
import type { AllowedBaggage } from './Baggage';
import type { TripData } from './types/outputs/Trip';

/**
 * This is fetched from 'bookings' endpoint.
 */
export type BookingType =
  | 'BookingOneWay'
  | 'BookingReturn'
  | 'BookingMulticity';

export type BookingsItem = {
  id: number,
  arrival: DepartureArrival,
  departure: DepartureArrival,
  legs: Array<Leg>,
  price: Price,
  created: Date,
  authToken: string,
  status: string,
  type: BookingType,
  passengerCount: number,
  trips?: TripData[],
  inbound?: TripData,
  outbound?: TripData,
  passengers: Passenger[],
};

export type TravelDocument = {|
  idNumber: string,
  expiration: number,
|};

export type Visa = {|
  info: string,
  status: string,
  timestamp: number,
  country: string,
|};

// This type could be expanded with health and passport information
export type TravelInfo = {|
  visa: Visa[],
|};

export type Pkpass = {|
  +flightNumber: string,
  +url: string,
  +passenger?: Passenger,
|};

export type Passenger = {|
  id: number,
  firstname: string,
  lastname: string,
  insuranceType: string,
  title: string,
  birthday: string,
  nationality: string,
  travelDocument: TravelDocument,
  travelInfo: TravelInfo[],
  pkpasses: $ReadOnlyArray<Pkpass> | null,
|};

export type BookedService = {|
  category: string,
  status: string,
|};

export type ContactDetails = {|
  phone: string,
  email: string,
  passenger: ?Passenger,
|};

/**
 * This is additionally fetched from 'booking/12..' endpoint if needed.
 */
export type Booking = BookingsItem & {
  allowedBaggage: AllowedBaggage,
  assets: BookingAssets,
  bookedServices: BookedService[],
  contactDetails: ContactDetails,
  allowedToChangeFlights: ?number,
  onlineCheckinIsAvailable: boolean,
  insurancePrices: InsurancePrice[],
};

export type BoardingPass = {|
  +boardingPassUrl: mixed,
  +flightNumber: string,
  +availableAt: ?string,
  +leg: ?Leg,
  +pkpasses: $ReadOnlyArray<Pkpass>,
|};

export type BookingAssets = {
  ticketUrl: ?string,
  invoiceUrl: ?string,
  boardingPasses: BoardingPass[],
  legs: Leg[],
};

export type InsurancePrice = {|
  +type: 'travel_basic' | 'travel_plus' | 'none',
  +price: Price | null,
|};
