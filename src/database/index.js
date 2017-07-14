export const fetchCards = () => new Promise((resolve, reject) => {
  const url = process.env.NODE_ENV === 'production'
    ? 'https://mtgjson.com/json/AllSets.json'
    : 'http://localhost:3000/AllSets.json'

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return response.json()
    })
    .then(data => resolve(data))
    .catch(error => reject(typeof error === 'string' ? error : error.message))
})

let cardsDatabase = []

export const saveCardsDatabase = database => {
  cardsDatabase = database
}

export { cardsDatabase }
