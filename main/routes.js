export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome
  },
  {
    path: '/games/:gameId',
    exact: true,
    component: components.PGame
  },
  {
    path: '/games/:gameId/chronology',
    exact: true,
    component: components.PGameChronology
  },
  {
    path: '/library',
    exact: true,
    component: components.PLibrary
  },
  {
    path: '/templates/:templateId',
    exact: true,
    component: components.PTemplate
  },
  {
    path: '/addTemplate',
    exact: true,
    component: components.PTemplate
  },
  {
    path: '/pastgames',
    exact: true,
    component: components.PPastGames
  }
]
