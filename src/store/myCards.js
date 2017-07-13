import _map from 'lodash/map'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import { Card } from 'classes'
import { updateCardInDatabase, loadCollection } from 'utils/firebase'
import { cardsDatabase } from 'database'

const debug = false

// ------------------------------------
// Actions
// ------------------------------------
export const addCard = (card, variant) => ({ type: 'ADD_CARD', card, variant })
export const removeCard = (card, variant) => ({ type: 'REMOVE_CARD', card, variant })
export const clearMyCards = () => ({ type: 'CLEAR_MY_CARDS' })
export const filterMyCards = filterFunction => ({ type: 'FILTER_MY_CARDS', filterFunction })
export const loadMyCards = () => {
  return async (dispatch, getState) => {
    if (!cardsDatabase.length) return

    dispatch(loadMyCardsRequest())

    let retrievedCollection = []

    await loadCollection()
      .then(response => {
        if (response.success) {
          const collection = response.data

          retrievedCollection = _map(collection, (value, key) => {
            const mainCard = new Card(_find(cardsDatabase, { id: key }))
            mainCard.cardsInCollection = value.cardsInCollection
            mainCard.variants = _map(value.variants, (value, key) => {
              const variant = new Card(_find(mainCard.variants, { id: key }))
              variant.cardsInCollection = value.cardsInCollection
              return variant
            })
            return mainCard
          })
        }
      })

    dispatch(loadMyCardsSuccess(retrievedCollection))
  }
}
export const loadMyCardsRequest = () => ({ type: 'LOAD_MY_CARDS_REQUEST', loading: true })
export const loadMyCardsSuccess = cards => ({ type: 'LOAD_MY_CARDS_SUCCESS', cards, loading: false })
export const noCards = () => ({ type: 'NO_CARDS' })

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  ADD_CARD: (state, { card, variant }) => {
    if (debug) console.log('%cADD_CARD', 'color: #A1C659;', variant.name)
    // Make copies of both main card and its chosen variant
    let cardCopy = card.copy()
    const variantCopy = variant.copy()
    // Copy card collection from store
    let cardsCollection = [...state.cards]
    // Check if this card already exists in collection
    const cardsInCollection = _find(cardsCollection, cardFromCollection => cardFromCollection.name === cardCopy.name)
    // If it does...
    if (cardsInCollection) {
      // Reassign it as a 'cardCopy'
      cardCopy = cardsInCollection.copy()
      // Check if it contains chosen variant
      const variantToUpdate = _find(cardCopy.variants, { id: variantCopy.id })
      // If it does...
      if (variantToUpdate) {
        if (debug) console.log('%c   existing card - existing variant - incrementing', 'color: #A1C659;')
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
      const cardIndex = _findIndex(cardsCollection, cardFromCollection => cardFromCollection.id === cardCopy.id)
      // Use that index to insert the updated card into the collection
      cardsCollection = [
        ...cardsCollection.slice(0, cardIndex),
        cardCopy,
        ...cardsCollection.slice(cardIndex + 1)
      ]
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
    const cardCopy = _find(cardsCollection, { id: card.id }).copy()
    const variantCopy = _find(cardCopy.variants, { id: variant.id }).copy()
    // Find their respective indexes
    const cardIndex = _findIndex(cardsCollection, cardFromCollection => cardFromCollection.id === cardCopy.id)
    const variantIndex = _findIndex(cardCopy.variants, cardVariant => cardVariant.id === variantCopy.id)

    // If there is only one main card...
    if (cardCopy.cardsInCollection === 1) {
      if (debug) console.log('%c   only one main card - removing it', 'color: #A1C659;')
      // Decrement the main card
      cardCopy.cardsInCollection--
      // Remove it from the collection
      cardsCollection = [
        ...cardsCollection.slice(0, cardIndex),
        ...cardsCollection.slice(cardIndex + 1)
      ]
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
      cardsCollection = [
        ...cardsCollection.slice(0, cardIndex),
        cardCopy,
        ...cardsCollection.slice(cardIndex + 1)
      ]

      // Save changes to the database
      updateCardInDatabase(cardCopy)
    }

    // Update the store
    return {
      ...state,
      cards: cardsCollection
    }
  },
  CLEAR_MY_CARDS: () => initialState,
  LOAD_MY_CARDS_REQUEST: state => ({ ...state, loading: true }),
  LOAD_MY_CARDS_SUCCESS: (state, { cards }) => ({ ...state, loading: false, cards }),
  FILTER_MY_CARDS: (state, { filterFunction }) => ({
    ...state,
    filteredCards: state.cards.filter(filterFunction)
  }),
  SIGN_OUT_SUCCESS: () => ({ ...initialState, loading: false }),
  NO_USER: () => ({ ...initialState, loading: false })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  cards: [],
  loading: true,
  filteredCards: null
}

export default function myCardsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
