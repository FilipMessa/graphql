// @flow

export const createLeg = (milliseconds: number, guarantee: ?boolean) => ({
  arrival: {
    when: {
      utc: new Date(milliseconds),
    },
  },
  guarantee,
});
