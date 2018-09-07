// @flow

import { GraphQLObjectType, GraphQLList, GraphQLInt } from 'graphql';
import idx from 'idx';

import Leg from '../../../flight/types/outputs/Leg';
import GraphQLRouteStop from '../../../flight/types/outputs/RouteStop';
import type { DepartureArrival, Leg as LegType } from '../../../flight/Flight';
import FlightDurationInMinutes, {
  getDurationInMinutes,
} from '../../../flight/resolvers/FlightDuration';

export type TripData = {
  departure: DepartureArrival,
  arrival: DepartureArrival,
  legs: LegType[],
  bid: number,
};

export default new GraphQLObjectType({
  name: 'Trip',
  description:
    'Single travel from origin to destination, with possible stopovers.',
  fields: {
    departure: {
      type: GraphQLRouteStop,
      resolve: ({ departure }: TripData): DepartureArrival => departure,
    },

    arrival: {
      type: GraphQLRouteStop,
      resolve: ({ arrival }: TripData): DepartureArrival => arrival,
    },

    duration: {
      type: GraphQLInt,
      description: 'Trip duration in minutes.',
      resolve: ({ departure, arrival }: TripData): ?number => {
        return FlightDurationInMinutes(departure, arrival);
      },
    },

    legs: {
      type: new GraphQLList(Leg),
      resolve: ({ legs }: TripData): LegType[] =>
        legs.map((leg, index) => ({
          ...leg,
          stopoverDuration: getStopoverDuration(leg, legs[index - 1]),
        })),
    },
  },
});

const getStopoverDuration = (
  leg: LegType,
  previousLeg: ?LegType,
): number | null => {
  if (previousLeg == null) {
    return null;
  }

  const currentLegDeparture = idx(leg.departure, _ => _.when.utc);
  const previousLegArrival = idx(previousLeg.arrival, _ => _.when.utc);

  if (currentLegDeparture == null || previousLegArrival == null) {
    return null;
  }

  return getDurationInMinutes(
    new Date(previousLegArrival),
    new Date(currentLegDeparture),
  );
};
