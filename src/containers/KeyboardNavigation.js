import { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import key from 'keyboardjs'

const mapStateToProps = ({ keyboard }) => ({
  mainCardFocusIndex: keyboard.mainCardFocusIndex,
  variantCardFocusIndex: keyboard.variantCardFocusIndex
})

class KeyboardNavigation extends Component {
  static propTypes = {
    onCardsListPage: PropTypes.bool.isRequired,
    onCardDetailsPage: PropTypes.bool.isRequired,
    mainCardFocusIndex: PropTypes.object.isRequired,
    variantCardFocusIndex: PropTypes.object.isRequired
  }

  state = {
    mainCardIndex: null,
    variantCardIndex: null
  }

  componentWillMount () {
    this.initMouseEvents()
  }

  componentWillUnmount () {
    key.reset()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.mainCardFocusIndex.time !== nextProps.mainCardFocusIndex.time) {
      this.setState({ mainCardIndex: nextProps.mainCardFocusIndex.index })
    }

    if (this.props.variantCardFocusIndex.time !== nextProps.variantCardFocusIndex.time) {
      this.setState({ variantCardIndex: nextProps.variantCardFocusIndex.index })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // Blur active card if 'mainCardIndex' got nullified
    if (this.props.onCardsListPage && this.state.mainCardIndex === null && prevState.mainCardIndex !== null) {
      this.blurActiveCard()
    }

    // Blur active card if 'variantCardIndex' got nullified
    if (this.props.onCardDetailsPage && this.state.variantCardIndex === null && prevState.variantCardIndex !== null) {
      this.blurActiveCard()
    }

    // Update focus state on search list's cards
    if (this.props.onCardsListPage && this.state.mainCardIndex !== prevState.mainCardIndex) {
      const cards = this.getCards()
      cards[this.state.mainCardIndex] && cards[this.state.mainCardIndex].focus()
    }

    // Update focus state on card details page cards
    if (this.props.onCardDetailsPage && this.state.variantCardIndex !== prevState.variantCardIndex) {
      const variants = this.getVariants()
      variants[this.state.variantCardIndex] && variants[this.state.variantCardIndex].focus()
    }
  }

  getCards = () => document.querySelectorAll('.cards-search-list .card')

  getCardWrappers = () => document.querySelectorAll('.cards-search-list .card-wrapper')

  getVariants = () => document.querySelectorAll('.card-variants-list .card')

  getVariantWrappers = () => document.querySelectorAll('.card-variants-list .card-wrapper')

  blurActiveCard = () => {
    const activeCard = document.querySelector('.card:focus')
    if (activeCard) activeCard.blur()
  }

  initMouseEvents = () => {
    key.bind('up', e => {
      e.preventDefault()

      if (this.props.onCardsListPage) {
        if (this.state.mainCardIndex === null) {
          this.setState({ mainCardIndex: 0 })
          return
        }

        const cards = this.getCardWrappers()
        const singleCard = cards[0]

        if (singleCard) {
          const cardWidth = singleCard.getBoundingClientRect().width
          const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
          const ratio = Math.floor(windowWidth / cardWidth)

          if (this.state.mainCardIndex + 1 <= ratio) return
          else this.setState({ mainCardIndex: this.state.mainCardIndex - ratio })
        }
      }

      if (this.props.onCardDetailsPage) {
        if (this.state.variantCardIndex === null) {
          this.setState({ variantCardIndex: 0 })
          return
        }

        const variants = this.getVariantWrappers()
        const singleVariant = variants[0]

        if (singleVariant) {
          const variantCardWidth = singleVariant.getBoundingClientRect().width
          const parentWidth = document.querySelector('.card-variants-list').getBoundingClientRect().width
          const ratio = Math.floor(parentWidth / variantCardWidth)

          if (this.state.variantCardIndex + 1 <= ratio) return
          else this.setState({ variantCardIndex: this.state.variantCardIndex - ratio })
        }
      }
    })

    key.bind('down', e => {
      e.preventDefault()

      if (this.props.onCardsListPage) {
        if (this.state.mainCardIndex === null) {
          this.setState({ mainCardIndex: 0 })
          return
        }

        const cards = this.getCardWrappers()
        const singleCard = cards[0]

        if (singleCard) {
          const cardWidth = singleCard.getBoundingClientRect().width
          const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
          const ratio = Math.floor(windowWidth / cardWidth)

          if (this.state.mainCardIndex >= cards.length - ratio) this.setState({ mainCardIndex: cards.length - 1 })
          else this.setState({ mainCardIndex: this.state.mainCardIndex + ratio })
        }
      }

      if (this.props.onCardDetailsPage) {
        if (this.state.variantCardIndex === null) {
          this.setState({ variantCardIndex: 0 })
          return
        }

        const variants = this.getVariantWrappers()
        const singleVariant = variants[0]

        if (singleVariant) {
          const variantCardWidth = singleVariant.getBoundingClientRect().width
          const parentWidth = document.querySelector('.card-variants-list').getBoundingClientRect().width
          const ratio = Math.floor(parentWidth / variantCardWidth)

          if (this.state.variantCardIndex >= variants.length - ratio) this.setState({ variantCardIndex: variants.length - 1 })
          else this.setState({ variantCardIndex: this.state.variantCardIndex + ratio })
        }
      }
    })

    key.bind('left', e => {
      e.preventDefault()

      if (this.props.onCardsListPage) {
        if (this.state.mainCardIndex === null) {
          this.setState({ mainCardIndex: 0 })
          return
        }

        let mainCardIndex = 0

        if (this.state.mainCardIndex === null) mainCardIndex = 0
        else if (this.state.mainCardIndex > 0) mainCardIndex = this.state.mainCardIndex - 1

        this.setState({ mainCardIndex })
      }

      if (this.props.onCardDetailsPage) {
        if (this.state.variantCardIndex === null) {
          this.setState({ variantCardIndex: 0 })
          return
        }

        let variantCardIndex = 0

        if (this.state.variantCardIndex > 0) variantCardIndex = this.state.variantCardIndex - 1

        this.setState({ variantCardIndex })
      }
    })

    key.bind('right', e => {
      e.preventDefault()

      if (this.props.onCardsListPage) {
        if (this.state.mainCardIndex === null) {
          this.setState({ mainCardIndex: 0 })
          return
        }

        const cards = this.getCardWrappers()

        if (this.state.mainCardIndex < cards.length - 1) { this.setState({ mainCardIndex: this.state.mainCardIndex + 1 }) }
      }

      if (this.props.onCardDetailsPage) {
        if (this.state.variantCardIndex === null) {
          this.setState({ variantCardIndex: 0 })
          return
        }

        const variants = this.getVariantWrappers()

        if (this.state.variantCardIndex < variants.length - 1) { this.setState({ variantCardIndex: this.state.variantCardIndex + 1 }) }
      }
    })

    key.bind('enter', e => {
      e.preventDefault()
      if (this.props.onCardsListPage) {
        const activeCard = document.querySelector('.card:focus')
        if (activeCard) document.activeElement.click()
        return
      }

      if (this.props.onCardDetailsPage) {
        const addButton = document.querySelector('.card:focus .card__add-remove-buttons .add-button')
        if (addButton) addButton.click()
      }
    })

    key.bind('esc', () => {
      if (this.props.onCardsListPage) this.setState({ mainCardIndex: null })
      if (this.props.onCardDetailsPage) this.setState({ variantCardIndex: null })
    })

    key.bind(['=', 'num+'], e => {
      e.preventDefault()
      const addButton = document.querySelector('.card:focus .card__add-remove-buttons .add-button')
      if (addButton) addButton.click()
    })

    key.bind(['-', 'num-'], e => {
      e.preventDefault()
      const removeButton = document.querySelector('.card:focus .card__add-remove-buttons .remove-button')
      if (removeButton) removeButton.click()
    })
  }

  render = () => {
    console.log('state', this.state.mainCardIndex, 'props', this.props.mainCardFocusIndex.index)
    return null
  }
}

export default connect(mapStateToProps)(KeyboardNavigation)
