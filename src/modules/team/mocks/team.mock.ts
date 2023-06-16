export const TeamDBMock = {
  uuid: '1',
  name: 'Chelsea',
};
export const ListTeamResponseMock = {
  totalElements: 1,
  totalPages: 1,
  page: 1,
  perpage: 20,
  data: [TeamDBMock],
};
export const IMPORTED_TEAMS = [
  {
    uuid: '1',
    shortName: 'Chelsea',
    name: 'Chelsea Football Club',
    description:
      "Chelsea Football Club is an English professional football club based in Fulham, West London. Founded in 1905, they play their home games at Stamford Bridge.[5] The club competes in the Premier League, the top division of English football. They won their first major honour, the League championship, in 1955. The club won the FA Cup for the first time in 1970, their first European honour, the Cup Winners' Cup, in 1971, and became the third English club to win the Club World Cup in 2022.",
    celebratedDate: '1905-03-10',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/360px-Chelsea_FC.svg.png',
    type: 'football',
  },
];
