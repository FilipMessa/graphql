// @flow

import Trip from '../Trip';
import { evaluateResolver } from '../../../../common/services/TestingTools';

const fields = Trip.getFields();

it('Trip type should have valid fields', () => {
  expect(fields).toMatchSnapshot();
});

describe('Legs resolver', () => {
  it('should set stopoverDuration null for first leg', () => {
    const result = evaluateResolver(fields.legs, {
      legs: [{ test: '' }],
    });

    expect(result[0].stopoverDuration).toBe(null);
  });

  it('should calculate duration correctly for other legs', () => {
    const result = evaluateResolver(fields.legs, {
      legs: [
        { arrival: { when: { utc: 500 } } },
        { departure: { when: { utc: 500 + 120 * 1000 * 60 } } },
      ],
    });

    expect(result[1].stopoverDuration).toBe(120);
  });
});
