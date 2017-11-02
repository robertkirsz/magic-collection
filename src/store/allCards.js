// --- Database ---
import { cardsDatabase, saveCardsDatabase } from '../database'
// --- Classes ---
import { Card } from '../classes'
// --- Helpers ---
import _reduce from 'lodash/reduce'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _reject from 'lodash/reject'
import _filter from 'lodash/filter'
import _get from 'lodash/get'
import _sortBy from 'lodash/sortBy'
import isAfter from 'date-fns/is_after'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  ALL_CARDS_REQUEST: state => (state.fetching ? state : { ...state, fetching: true, error: null }),
  ALL_CARDS_SUCCESS: (state, { allSets }) => {
    const allCards = [] // Will contain every single Magic card
    const uniqueCards = {} // Will contain unique cards
    const cardSets = []
    // Compares release dates and chooses the latest one
    const latestSet = _reduce(
      allSets,
      (result, value, key) => {
        if (!result.releaseDate) return value
        return isAfter(value.releaseDate, result.releaseDate) ? value : result
      },
      {}
    )
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
        variants: uniqueCards[card.name]
          ? [...uniqueCards[card.name].variants, new Card(card)]
          : [new Card(card)]
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
  fetching: true, // TODO: change to 'loading'
  // TODO: add 'loaded'
  error: null,
  cardsNumber: 0,
  latestSet: {},
  cardSets: [],
  filteredCards: null
}

export default (state = initialState, action) =>
  ACTION_HANDLERS[action.type] ? ACTION_HANDLERS[action.type](state, action) : state
