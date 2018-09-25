// @flow

export const createLeg = (luxonDate: Object, guarantee: ?boolean) => ({
  id: Math.random().toString(16),
  departure: {
    when: {
      utc: luxonDate.minus({ hours: 1 }).toJSDate(),
    },
  },
  arrival: {
    when: {
      utc: luxonDate.toJSDate(),
    },
  },
  guarantee,
});
