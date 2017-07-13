// import { auth }      from 'utils/firebase'
import CoreLayout    from 'layouts/CoreLayout'
import AllCardsView  from 'routes/AllCardsView'
import MyCardsView   from 'routes/MyCardsView'
import CardView      from 'routes/CardView'
// import ProfileView   from 'routes/ProfileView'
import SettingsView  from 'routes/SettingsView'
import CollectionStatsView  from 'routes/CollectionStatsView'
import NotFoundView  from 'routes/NotFoundView'

// Redirects unathorized users
// const requireAuth = (nextState, replace) => {
//   if (!auth.currentUser) replace('/all-cards')
// }

// TODO: show spinner when loading stuff on routes like settings and stats

export const createRoutes = () => ({
  path: '/',
  component: CoreLayout,
  indexRoute: { component: AllCardsView },
  onEnter: (nextState, replace) => {
    if (nextState.location.pathname === '/') replace('/all-cards')
  },
  childRoutes: [
    {
      path: 'all-cards',
      component: AllCardsView,
      showAppButtons: true,
      childRoutes: [
        { path: '/all-cards/:cardUrl', component: CardView }
      ]
    },
    {
      path: 'my-cards',
      component: MyCardsView,
      showAppButtons: true,
      // onEnter: requireAuth,
      childRoutes: [
        { path: '/my-cards/:cardUrl', component: CardView }
      ]
    },
    {
      path: 'settings',
      component: SettingsView
      // onEnter: requireAuth
    },
    // {
      // path: 'profile',
      // component: ProfileView
      // onEnter: requireAuth
    // },
    {
      path: 'collection-stats',
      component: CollectionStatsView
      // onEnter: requireAuth
    },
    {
      path: '*',
      component: NotFoundView
    }
  ]
})

export default createRoutes
