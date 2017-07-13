import { updateAndReturnUserSettings } from 'utils/firebase'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleSetting = (property, value) => ({
  type: 'TOGGLE_SETTING',
  property,
  value
})
export const changeCardDetailsPopupDelay = delayValue => ({
  type: 'CARD_DETAILS_POPUP_DELAY',
  delayValue
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
  TOGGLE_SETTING: (state, { property, value }) => (
    updateAndReturnUserSettings({
      ...state,
      [property]: value !== undefined
        ? value
        : !state[property]
    })
  ),
  CARD_DETAILS_POPUP_DELAY: (state, { delayValue }) => {
    const _delayValue = delayValue === 'false'
      ? false
      : parseInt(delayValue, 10)
    return updateAndReturnUserSettings({ ...state, cardDetailsPopupDelay: _delayValue })
  },
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
  cardDetailsPopupDelay: 1000,
  cardModalAnimation: true,
  cardHoverAnimation: true,
  collectionLockBehaviour: 'lockedAtStart' // 'unlockedAtStart' || 'asLeft'
}

export default function settingsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
