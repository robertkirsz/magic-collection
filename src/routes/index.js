import HomeView from './HomeView'
import AllCardsView from './AllCardsView'
import MyCardsView from './MyCardsView'
import CardView from './CardView'
import SettingsView from './SettingsView'
import CollectionStatsView from './CollectionStatsView'

export {
  HomeView,
  AllCardsView,
  MyCardsView,
  CardView,
  SettingsView,
  CollectionStatsView
}

/*
// import { auth }      from 'utils/firebase'

// Redirects unathorized users
// const requireAuth = (nextState, replace) => {
//   if (!auth.currentUser) replace('/all-cards')
// }

// TODO: show spinner when loading stuff on routes like settings and stats

    {
      path: 'all-cards',
      showAppButtons: true,
    },
    {
      path: 'my-cards',
      showAppButtons: true,
      // onEnter: requireAuth,
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
