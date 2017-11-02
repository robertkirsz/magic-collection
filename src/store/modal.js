// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  OPEN_MODAL: (state, { name, props = {} }) => ({ ...state, opened: true, name, props }),
  CLOSE_MODAL: state => ({ ...state, opened: false })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  opened: false,
  name: '',
  props: {}
}

export default (state = initialState, action) =>
  ACTION_HANDLERS[action.type] ? ACTION_HANDLERS[action.type](state, action) : state
