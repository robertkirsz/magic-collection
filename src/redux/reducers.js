// TODO: redirect user on logout
// TODO: fox usage of 'initialState'

import { combineReducers } from 'redux'
// --- Firebase ---
import { updateAndReturnUserSettings, updateCardInDatabase, updateUserData } from '../firebase'
// --- Helpers ---
import { debug } from '../utils'
// --- Database ---
import { cardsDatabase, saveCardsDatabase } from '../database'
// --- Classes ---
import { Card } from '../classes'
// --- Helpers ---
import _reduce from 'lodash/reduce'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _reject from 'lodash/reject'
import _get from 'lodash/get'
import _sortBy from 'lodash/sortBy'
import isAfter from 'date-fns/is_after'

const initialState = {
  user: {
    authPending: true,
    signedIn: false,
    error: null,
    name: '',
    email: '',
    picture: ''
  },
  allCards: {
    fetching: true, // TODO: change to 'loading'
    // TODO: add 'loaded'
    error: null,
    cardsNumber: 0,
    latestSet: {},
    cardSets: [],
    filteredCards: null
  },
  myCards: {
    cards: [],
    loading: true,
    loaded: false,
    filteredCards: null
  },
  modal: {
    opened: false,
    name: '',
    props: {}
  },
  keyboard: {
    mainCardFocusIndex: { index: null, time: 0 },
    variantCardFocusIndex: { index: null, time: 0 }
  },
  settings: {
    myCardsLocked: true,
    cardDetailsPopup: true,
    cardHoverAnimation: true,
    collectionLockBehaviour: 'lockedAtStart' // 'unlockedAtStart' || 'asLeft'
  },
}

const reducers = {
  user: {
    AUTH_REQUEST: state => ({ ...state, authPending: true, error: null }),
    AUTH_SUCCESS: (state, { user }) => {
      updateUserData(user)

      const newState = {
        ...state,
        ...user,
        authPending: false,
        signedIn: true
      }
      // TODO: deal with admins - I don't know if I need that option now
      if (user.admin) newState.admin = true

      return newState
    },
    AUTH_ERROR: (state, { error }) => ({ ...state, authPending: false, error }),
    CLEAR_AUTH_ERROR: state => ({ ...state, error: null }),
    SIGN_OUT_SUCCESS: () => ({ ...initialState.user, authPending: false }),
    NO_USER: () => ({ ...initialState.user, authPending: false })
  },
  allCards: {
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
        const cardWithMultiverseId = cardsFromThisSet.filter(o => !!o.multiverseid)
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
  },
  myCards: {
    ADD_CARD: (state, { card, variant }) => {
      if (debug) console.log('%cADD_CARD', 'color: #A1C659;', variant.name)
      // Make copies of both main card and its chosen variant
      let cardCopy = card.copy()
      const variantCopy = variant.copy()
      // Copy card collection from store
      let cardsCollection = [...state.cards]
      // Check if this card already exists in collection
      const cardsInCollection = cardsCollection.find(cardFromCollection => cardFromCollection.name === cardCopy.name)
      // If it does...
      if (cardsInCollection) {
        // Reassign it as a 'cardCopy'
        cardCopy = cardsInCollection.copy()
        console.warn('cardCopy', cardCopy)
        // Check if it contains chosen variant
        const variantToUpdate = cardCopy.variants.find(variant => variant.id === variantCopy.id)
        // If it does...
        if (variantToUpdate) {
          if (debug) {
            console.log('%c   existing card - existing variant - incrementing', 'color: #A1C659;')
          }
          // Increment its count
          variantToUpdate.cardsInCollection++
          // In other case...
        } else {
          if (debug) console.log('%c   existing card - new variant', 'color: #A1C659;')
          // Set variant's count to 1
          variantCopy.cardsInCollection = 1
          // Insert it into main card
          cardCopy.variants.push(variantCopy)
        }
        // Increment main card's count
        cardCopy.cardsInCollection++
        // Get that card's index in the collection
        const cardIndex = cardsCollection.findIndex(cardFromCollection => cardFromCollection.id === cardCopy.id)
        // Use that index to insert the updated card into the collection
        cardsCollection = [...cardsCollection.slice(0, cardIndex), cardCopy, ...cardsCollection.slice(cardIndex + 1)]
        // Save changes to the database
        updateCardInDatabase(cardCopy)
        // Update the store
        return {
          ...state,
          cards: cardsCollection
        }
      }

      // If chosen card doesn't exist in the collection yet...
      if (debug) console.log('%c   new card - new variant', 'color: #A1C659;')
      // Set both its chosen variant's counts to one
      cardCopy.cardsInCollection = 1
      variantCopy.cardsInCollection = 1
      // Add variant to the main card
      cardCopy.variants = [variantCopy]
      // Add the main card to the collection
      cardsCollection.push(cardCopy)
      // Save changes to the database
      updateCardInDatabase(cardCopy)
      // Update the store
      return {
        ...state,
        cards: cardsCollection
      }
    },
    REMOVE_CARD: (state, { card, variant }) => {
      if (debug) console.log('%cREMOVE_CARD payload', 'color: #A1C659;', variant.name)
      // Copy card collection from store
      let cardsCollection = [...state.cards]
      // Make copies of both main card and its chosen variant
      const cardCopy = cardsCollection.find(c => c.id === card.id).copy()
      const variantCopy = cardCopy.variants.find(c => c.id === variant.id).copy()
      // Find their respective indexes
      const cardIndex = cardsCollection.findIndex(c => c.id === cardCopy.id)
      const variantIndex = cardCopy.variants.findIndex(c => c.id === variantCopy.id)

      // If there is only one main card...
      if (cardCopy.cardsInCollection === 1) {
        if (debug) console.log('%c   only one main card - removing it', 'color: #A1C659;')
        // Decrement the main card
        cardCopy.cardsInCollection--
        // Remove it from the collection
        cardsCollection = [...cardsCollection.slice(0, cardIndex), ...cardsCollection.slice(cardIndex + 1)]
        // Save changes to the database
        updateCardInDatabase(cardCopy)
      }

      // If there are more copies of the main card...
      if (cardCopy.cardsInCollection > 1) {
        // If there is only one card of the chosen variant...
        if (variantCopy.cardsInCollection === 1) {
          if (debug) console.log('%c   only one variant card - removing it', 'color: #A1C659;')
          // Remove it from the main card
          cardCopy.variants = [
            ...cardCopy.variants.slice(0, variantIndex),
            ...cardCopy.variants.slice(variantIndex + 1)
          ]
        }

        // If there are more copies of the chosen variant...
        if (variantCopy.cardsInCollection > 1) {
          if (debug) console.log('%c   more variant cards - decrementing', 'color: #A1C659;')
          // Decrement it
          variantCopy.cardsInCollection--
          // Update main card's varaint array
          cardCopy.variants = [
            ...cardCopy.variants.slice(0, variantIndex),
            variantCopy,
            ...cardCopy.variants.slice(variantIndex + 1)
          ]
        }

        // Decrement the main card
        cardCopy.cardsInCollection--
        // Update the cards collection
        cardsCollection = [...cardsCollection.slice(0, cardIndex), cardCopy, ...cardsCollection.slice(cardIndex + 1)]

        // Save changes to the database
        updateCardInDatabase(cardCopy)
      }

      // Update the store
      return {
        ...state,
        cards: cardsCollection
      }
    },
    CLEAR_MY_CARDS: () => initialState.myCards,
    LOAD_MY_CARDS_REQUEST: state => ({ ...state, loading: true }),
    LOAD_MY_CARDS_SUCCESS: (state, { cards }) => ({ ...state, cards, loading: false, loaded: true }),
    FILTER_MY_CARDS: (state, { filterFunction }) => ({
      ...state,
      filteredCards: state.cards.filter(filterFunction)
    }),
    // TODO: check why these action handlers are used here
    SIGN_OUT_SUCCESS: () => ({ ...initialState.myCards, loading: false }),
    NO_USER: () => ({ ...initialState.myCards, loading: false })
  },
  modal: {
    OPEN_MODAL: (state, { name, props = {} }) => ({ ...state, opened: true, name, props }),
    CLOSE_MODAL: state => ({ ...state, opened: false })
  },
  keyboard: {
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
  },
  settings: {
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
    SIGN_OUT_SUCCESS: () => initialState.settings,
    RESTORE_DEFAULT_SETTINGS: () => updateAndReturnUserSettings(initialState.settings)
  },
}

const createReducer = (name, initialState) => (state = initialState, action) => {
  // if (action.type === 'LOGOUT') return initialState

  return reducers[name][action.type] ? reducers[name][action.type](state, action) : state
}

export default combineReducers(
  Object.keys(reducers).reduce((all, name) => {
    all[name] = createReducer(name, initialState[name])
    return all
  }, {})
)
