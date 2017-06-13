// @flow

import compareAsc from 'date-fns/compare_asc';
import { GraphQLNonNull, GraphQLList } from 'graphql';
import dateFns from 'date-fns';
import _ from 'lodash';
import request from '../services/HttpRequest';
import config from '../../config/application';
import GraphQLFlight from '../types/Flight';
import FlightsSearchInput from '../types/FlightsSearchInput';
import FlightsOptionsInput from '../types/FlightsOptionsInput';
import type { FlightType, LegType } from '../Entities';

export default {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLFlight))),
  args: {
    search: {
      type: new GraphQLNonNull(FlightsSearchInput),
    },
    options: {
      type: FlightsOptionsInput,
    },
  },
  resolve: async (
    ancestor: mixed,
    args: Object,
  ): Promise<Array<FlightType>> => {
    validateArgs(args);

    const allFlights = await request(
      config.restApiEndpoint.allFlights({
        flyFrom: args.search.from,
        to: args.search.to,
        dateFrom: dateFns.format(new Date(args.search.dateFrom), 'DD/MM/YYYY'),
        dateTo: dateFns.format(new Date(args.search.dateTo), 'DD/MM/YYYY'),
        curr: _.get(args, 'options.currency'),
      }),
    );

    const flightsMetadata = {
      currency: allFlights.currency,
    };
    return allFlights.data.map(flight =>
      sanitizeApiResponse(flight, flightsMetadata),
    );
  },
};

type FlightsMetadataType = {
  currency: string,
};

function sanitizeApiResponse(
  singleFlight: Object,
  flightsMetadata: FlightsMetadataType,
): FlightType {
  return {
    id: singleFlight.id,
    airlines: singleFlight.airlines,
    arrival: {
      when: {
        utc: new Date(singleFlight.aTimeUTC * 1000),
        local: new Date(singleFlight.aTime * 1000),
      },
      where: {
        code: singleFlight.flyTo,
        cityName: singleFlight.cityTo,
      },
    },
    departure: {
      when: {
        utc: new Date(singleFlight.dTimeUTC * 1000),
        local: new Date(singleFlight.dTime * 1000),
      },
      where: {
        code: singleFlight.flyFrom,
        cityName: singleFlight.cityFrom,
      },
    },
    legs: singleFlight.route.map((leg): LegType => ({
      id: leg.id,
      recheckRequired: leg.bags_recheck_required,
      flightNo: leg.flight_no,
      departure: {
        when: {
          utc: new Date(leg.dTimeUTC * 1000),
          local: new Date(leg.dTime * 1000),
        },
        where: {
          code: leg.flyFrom,
          cityName: leg.cityFrom,
        },
      },
      arrival: {
        when: {
          utc: new Date(leg.aTimeUTC * 1000),
          local: new Date(leg.aTime * 1000),
        },
        where: {
          code: leg.flyTo,
          cityName: leg.cityTo,
        },
      },
      airlineCode: leg.airline,
    })),
    price: {
      amount: singleFlight.price,
      currency: flightsMetadata.currency,
    },
  };
}

function validateArgs(args) {
  // Validate dateFrom starts before dateTo
  const dateFrom = new Date(args.search.dateFrom);
  const dateTo = new Date(args.search.dateTo);
  if (compareAsc(dateFrom, dateTo) > 0) {
    throw new Error(`DateFrom should start before dateTo`);
  }
}
