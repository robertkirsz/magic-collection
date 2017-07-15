import React from 'react'
import { Route, Switch } from 'react-router-dom'
// --- Components ---
import HomeView from './HomeView'
import AllCardsView from './AllCardsView'
import MyCardsView from './MyCardsView'
import CardView from './CardView'
import SettingsView from './SettingsView'
import CollectionStatsView from './CollectionStatsView'
import NotFoundView from './NotFoundView'

const Routes = () =>
  <Switch>
    <Route path="/" exact component={HomeView} />
    <Route path="/all-cards" exact component={AllCardsView} />
    <Route path="/all-cards/:cardUrl" component={CardView} />
    <Route path="/my-cards" exact component={MyCardsView} />
    <Route path="/my-cards/:cardUrl" component={CardView} />
    <Route path="/settings" exact component={SettingsView} />
    <Route path="/collection-stats" exact component={CollectionStatsView} />
    <Route component={NotFoundView} />
  </Switch>

export default Routes

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
*/
