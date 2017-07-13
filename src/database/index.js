import axios from 'axios'

export const fetchCards = () => {
  return axios('http://localhost:3000/AllSets.json')
  // if (process.env.NODE_ENV === 'development') return axios('http://localhost:3000/AllSets.json')
  // if (process.env.NODE_ENV === 'production') return axios('https://mtgjson.com/json/AllSets.json')
}

let cardsDatabase = []

export const saveCardsDatabase = database => { cardsDatabase = database }

export { cardsDatabase }
