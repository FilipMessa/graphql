// @flow

module.exports.Booking = {
  all: require('./booking/AllBookings.json'),
  '2707224': require('./booking/booking-2707224.json'),
  '2707229': require('./booking/booking-2707229.json'),
  '2707251': require('./booking/booking-2707251.json'),
};

module.exports.Location = {
  unknown: require('./location/unknown.json'),
  prague: require('./location/prague.json'),
  mexico: require('./location/mexico.json'),
  frankfurt: require('./location/frankfurt.json'),
};

module.exports.Flight = {
  prgMex: require('./flight/prg-mex.json'),
  prgMexCzk: require('./flight/prg-mex-czk.json'),
  prgFraMex: require('./flight/prg,fra-mex.json'),
  noResults: require('./flight/no-results.json'),
};

module.exports.Airline = {
  all: require('./airline/airlines.json'),
};