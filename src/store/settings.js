import { updateAndReturnUserSettings } from '../firebase'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleSetting = (property, value) => ({
  type: 'TOGGLE_SETTING',
  property,
  value
})
export const loadInitialSettings = settings => ({
  type: 'LOAD_INITIAL_SETTINGS',
  settings
})
export const restoreDefaultSettings = () => ({
  type: 'RESTORE_DEFAULT_SETTINGS'
})

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  TOGGLE_SETTING: (state, { property, value }) =>
    updateAndReturnUserSettings({
      ...state,
      [property]: value !== undefined ? value : !state[property]
    }),
  LOAD_INITIAL_SETTINGS: (state, { settings }) => {
    const newState = {
      ...state,
      ...settings
    }

    if (settings.collectionLockBehaviour === 'lockedAtStart') newState.myCardsLocked = true
    if (settings.collectionLockBehaviour === 'unlockedAtStart') newState.myCardsLocked = false

    return newState
  },
  SIGN_OUT_SUCCESS: () => initialState,
  RESTORE_DEFAULT_SETTINGS: () => updateAndReturnUserSettings(initialState)
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  myCardsLocked: true,
  cardDetailsPopup: true,
  cardHoverAnimation: true,
  collectionLockBehaviour: 'lockedAtStart' // 'unlockedAtStart' || 'asLeft'
}

export default (state = initialState, action) =>
  ACTION_HANDLERS[action.type] ? ACTION_HANDLERS[action.type](state, action) : state
