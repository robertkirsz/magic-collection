// ------------------------------------
// Actions
// ------------------------------------
export const setMainCardFocus = index => ({ type: 'SET_MAIN_CARD_FOCUS', index })
export const resetMainCardFocus = () => ({ type: 'RESET_MAIN_CARD_FOCUS' })
export const setVariantCardFocus = index => ({ type: 'SET_VARIANT_CARD_FOCUS', index })
export const resetVariantCardFocus = () => ({ type: 'RESET_VARIANT_CARD_FOCUS' })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  SET_MAIN_CARD_FOCUS: (state, { index }) => ({
    ...state,
    mainCardFocusIndex: { index, time: Date.now() }
  }),
  RESET_MAIN_CARD_FOCUS: state => ({
    ...state,
    mainCardFocusIndex: { index: null, time: Date.now() }
  }),
  SET_VARIANT_CARD_FOCUS: (state, { index }) => ({
    ...state,
    variantCardFocusIndex: { index, time: Date.now() }
  }),
  RESET_VARIANT_CARD_FOCUS: state => ({
    ...state,
    variantCardFocusIndex: { index: null, time: Date.now() }
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  mainCardFocusIndex: { index: null, time: 0 },
  variantCardFocusIndex: { index: null, time: 0 }
}

export default (state = initialState, action) =>
  ACTION_HANDLERS[action.type] ? ACTION_HANDLERS[action.type](state, action) : state
