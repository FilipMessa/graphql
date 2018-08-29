// @flow

import { evaluateResolver } from '../../../../../common/services/TestingTools';
import TransportationServiceRelevantLocations from '../TransportationServiceRelevantLocations';

const fields = TransportationServiceRelevantLocations.getFields();

it('should work', () => {
  expect(evaluateResolver(fields.whitelabelURL)).toMatchInlineSnapshot(
    `"https://kiwi.rideways.com/"`,
  );
});
