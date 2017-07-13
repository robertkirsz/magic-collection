// ------------------------------------
// Constants
// ------------------------------------
const OPEN_MODAL = 'OPEN_MODAL'
const CLOSE_MODAL = 'CLOSE_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
export const openModal = (name, props) => ({ type: OPEN_MODAL, name, props })
export const closeModal = () => ({ type: CLOSE_MODAL })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_MODAL]: (state, { name, props = {} }) => ({ ...state, modal: { name, props } }),
  [CLOSE_MODAL]: state => ({ ...state, modal: { name: '', props: {} } })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  modal: {
    name: '',
    props: {}
  }
}

export default (state = initialState, action) =>
  ACTION_HANDLERS[action.type] ? ACTION_HANDLERS[action.type](state, action) : state
