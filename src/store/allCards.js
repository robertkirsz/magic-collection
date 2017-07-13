import _reduce from 'lodash/reduce'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _reject from 'lodash/reject'
import _filter from 'lodash/filter'
import _get from 'lodash/get'
import _sortBy from 'lodash/sortBy'
import moment from 'moment'
import { Card } from 'classes'
import { cardsDatabase, saveCardsDatabase, fetchCards } from 'database'
import { formattedError } from 'utils'
import { openModal } from 'store/layout'

// ------------------------------------
// Actions
// ------------------------------------
// Indicates that there is "allCards" request pending
export const sendRequest = () => ({ type: 'ALL_CARDS_REQUEST' })
export const responseSuccess = allSets => ({ type: 'ALL_CARDS_SUCCESS', allSets })
export const responseError = error => ({ type: 'ALL_CARDS_ERROR', error })
// Fetches all cards and passes them further
export const getCards = () => {
  return (dispatch, getState) => {
    // Dispatch action so we can show spinner
    dispatch(sendRequest())
    // Send API request
    fetchCards()
      .then(response => dispatch(responseSuccess(response.data)))
      .catch(error => {
        const errorMessage = formattedError(error)
        dispatch(responseError(errorMessage))
        dispatch(openModal('error', { message: errorMessage }))
      })
  }
}
export const filterAllCards = filterFunction => ({ type: 'FILTER_ALL_CARDS', filterFunction })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  ALL_CARDS_REQUEST: state => (
    state.fetching
      ? state
      : { ...state, fetching: true, error: null }
  ),
  ALL_CARDS_SUCCESS: (state, { allSets }) => {
    const allCards = [] // Will contain every single Magic card
    const uniqueCards = {} // Will contain unique cards
    const cardSets = []
    // Compares release dates and chooses the latest one
    const latestSet = _reduce(allSets, (result, value, key) => {
      if (!result.releaseDate) return value
      return moment(value.releaseDate).isAfter(result.releaseDate) ? value : result
    }, {})
    // For each set...
    _forEach(allSets, set => {
      // Save its code inside its cards objects
      const cardsFromThisSet = set.cards.map(card => {
        card.setCode = set.code.toLowerCase()
        return card
      })
      // Remove cards that don't have Multiverse ID
      const cardWithMultiverseId = _filter(cardsFromThisSet, 'multiverseid')
      // Add set to sets array if it has any valid vards
      if (cardWithMultiverseId.length) {
        cardSets.push({ name: set.name, code: set.code.toLowerCase() })
      }
      // Add cards with Multiverse ID to the cards array
      allCards.push(...cardWithMultiverseId)
    })

    // Group them by name and put reprints into an array: { 'Naturalize': { (...), variants: [{...}, {...}] } }
    _forEach(allCards, card => {
      uniqueCards[card.name] = {
        ...card,
        variants: uniqueCards[card.name] ? [...uniqueCards[card.name].variants, new Card(card)] : [new Card(card)]
      }
    })

    // Convert object to an array of cards
    let arrayOfCards = _map(uniqueCards, card => new Card(card))
    // Hide basic lands
    arrayOfCards = _reject(arrayOfCards, card => _get(card, 'supertypes[0]') === 'Basic')
    // Remove tokens
    arrayOfCards = _reject(arrayOfCards, { layout: 'token' })
    // Sort cards by name
    arrayOfCards = _sortBy(arrayOfCards, 'name')

    saveCardsDatabase(arrayOfCards)

    return {
      ...state,
      fetching: false,
      error: null,
      cardsNumber: arrayOfCards.length,
      latestSet,
      cardSets: _sortBy(cardSets, 'name')
    }
  },
  ALL_CARDS_ERROR: (state, { error }) => ({
    ...state,
    fetching: false,
    error
  }),
  FILTER_ALL_CARDS: (state, { filterFunction }) => ({
    ...state,
    filteredCards: cardsDatabase.filter(filterFunction)
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: true,
  error: null,
  cardsNumber: 0,
  latestSet: {},
  cardSets: [],
  filteredCards: null
}

export default function allCards (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
