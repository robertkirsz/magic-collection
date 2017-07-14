import HomeView from './HomeView'
import AllCardsView from './AllCardsView'
import MyCardsView from './MyCardsView'

export {
  HomeView,
  AllCardsView,
  MyCardsView
}

/*
// import { auth }      from 'utils/firebase'
import App from '../App'
import AllCardsView from './AllCardsView'
import MyCardsView from './MyCardsView'
import CardView from './CardView'
// import ProfileView   from './ProfileView'
import SettingsView from './SettingsView'
import CollectionStatsView from './CollectionStatsView'
import NotFoundView from './NotFoundView'

// Redirects unathorized users
// const requireAuth = (nextState, replace) => {
//   if (!auth.currentUser) replace('/all-cards')
// }

// TODO: show spinner when loading stuff on routes like settings and stats

export const createRoutes = () => ({
  path: '/',
  component: App,
  indexRoute: { component: AllCardsView },
  onEnter: (nextState, replace) => {
    if (nextState.location.pathname === '/') replace('/all-cards')
  },
  routes: [
    {
      path: 'all-cards',
      component: AllCardsView,
      showAppButtons: true,
      routes: [{ path: '/all-cards/:cardUrl', component: CardView }]
    },
    {
      path: 'my-cards',
      component: MyCardsView,
      showAppButtons: true,
      // onEnter: requireAuth,
      routes: [{ path: '/my-cards/:cardUrl', component: CardView }]
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
*/
