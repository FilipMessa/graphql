// @flow

import stringify from 'json-stable-stringify';

const mockResponses = {};

module.exports = () => ({
  initIndex: () => ({
    search: (prefix?: string | Object) => {
      const key =
        typeof prefix === 'object' ? stringify(prefix) : prefix || 'undefined';
      return {
        hits: mockResponses[key],
      };
    },
  }),
});

module.exports.setMatchedByPrefix = (cities: Object[], prefix?: string) => {
  const key = stringify({
    query: prefix ? prefix : '',
    restrictSearchableAttributes: ['name'],
  });
  mockResponses[key] = cities;
};

module.exports.setMatchedByCityId = (cities: Object[], cityId: string) => {
  const key = stringify({
    query: cityId,
    restrictSearchableAttributes: ['city_id'],
  });
  mockResponses[key] = cities;
};

module.exports.setNearbyCities = (
  cities: Object[],
  lat: number,
  lng: number,
) => {
  const key = {
    aroundLatLng: `${lat}, ${lng}`,
  };
  mockResponses[stringify(key)] = cities;
};
