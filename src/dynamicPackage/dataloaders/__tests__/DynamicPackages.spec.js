// @flow

import DynamicPackages from '../DynamicPackages';
import LocationDataLoader from '../../../location/dataloaders/Location';

import dynamicPackagesData from '../../datasets/dynamicPackages.json';

describe('Dynamic packages', () => {
  test('CreatePackage returns valid packages', () => {
    const dynamicPackages = new DynamicPackages(new LocationDataLoader());
    const { Flight, Hotels } = dynamicPackagesData;
    const packages = Hotels.map(h => dynamicPackages.createPackage(Flight, h));
    expect(packages).toMatchSnapshot();
  });
  test('CreateHotel returns valid results', () => {
    const dynamicPackages = new DynamicPackages(new LocationDataLoader());
    const { Hotels } = dynamicPackagesData;
    const hotels = Hotels.map(h => dynamicPackages.createHotel(h));
    expect(hotels).toMatchSnapshot();
  });
  test('CreateFlight returns valid results', () => {
    const dynamicPackages = new DynamicPackages(new LocationDataLoader());
    const { Flight } = dynamicPackagesData;
    const flights = dynamicPackages.createFlight(Flight);
    expect(flights).toMatchSnapshot();
  });
});
