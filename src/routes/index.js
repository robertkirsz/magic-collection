import React from 'react'
import { Route, Switch } from 'react-router-dom'
// --- Components ---
import HomeView from './HomeView'
import AllCardsView from './AllCardsView'
import MyCardsView from './MyCardsView'
import SettingsView from './SettingsView'
import CollectionStatsView from './CollectionStatsView'
import NotFoundView from './NotFoundView'

const Routes = () =>
  <Switch>
    <Route path="/" exact component={HomeView} />
    <Route path="/all-cards" component={AllCardsView} />
    <Route path="/my-cards" component={MyCardsView} />
    <Route path="/settings" component={SettingsView} />
    <Route path="/collection-stats" component={CollectionStatsView} />
    <Route component={NotFoundView} />
  </Switch>

export default Routes
