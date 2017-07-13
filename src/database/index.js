import axios from 'axios'

export const fetchCards = () => {
  if (__DEV__) return axios('http://localhost:3000/AllSets.json')
  if (__PROD__) return axios('https://mtgjson.com/json/AllSets.json')
}

let cardsDatabase = []

export const saveCardsDatabase = database => { cardsDatabase = database }

export { cardsDatabase }
