export const fetchCards = () =>
  new Promise((resolve, reject) => {
    fetch('https://mtgjson.com/json/AllSets.json')
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
