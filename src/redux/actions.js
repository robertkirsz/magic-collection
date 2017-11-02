import _camelCase from 'lodash/camelCase'
import store from './store'

const actions = [
  // settings
  { type: 'TOGGLE_SETTING', property: null, value: null },
  { type: 'LOAD_INITIAL_SETTINGS', settings: null },
  { type: 'RESTORE_DEFAULT_SETTINGS' }
]

export const dispatch = actions.reduce((all, action) => {
  all[_camelCase(action.type)] = (payload = {}) => store.dispatch({ ...action, ...payload })
  return all
}, {})

export default actions
