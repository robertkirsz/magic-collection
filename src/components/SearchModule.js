import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
// --- Helpers ---
import cn from 'classnames'
import _get from 'lodash/get'
import _debounce from 'lodash/debounce'
import _every from 'lodash/every'
import _find from 'lodash/find'
// --- Store ---
import { filterAllCards } from 'store/allCards'
import { filterMyCards } from 'store/myCards'
import { resetMainCardFocus } from 'store/keyboard'
// --- Components ---
import { ColorFilter, CmcFilter, ColorButtons } from 'components'

// TODO: make filetr query stay between route changes
// TODO: show idicator that a query is on (a dot in the search icon)

const mapStateToProps = ({ location, allCards }) => ({
  pathname: location.pathname,
  cardSets: allCards.cardSets
})

const mapDispatchToProps = { filterAllCards, filterMyCards, resetMainCardFocus }

const initialState = () => ({
  queryName: '',
  queryTypes: '',
  queryText: '',
  cmcValue: 0,
  cmcType: 'minimum', // 'minimum' || 'exactly' || 'maximum'
  monocoloredOnly: false,
  multicoloredOnly: false,
  cardSet: 'all-sets',
  colors: {
    White: true,
    Blue: true,
    Black: true,
    Red: true,
    Green: true,
    Colorless: true
  }
})

class SearchModule extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    cardSets: PropTypes.array.isRequired,
    filterAllCards: PropTypes.func.isRequired,
    filterMyCards: PropTypes.func.isRequired,
    resetMainCardFocus: PropTypes.func.isRequired
  }

  state = {
    ...initialState(),
    showSearchForm: false
  }

  debouncedFilter = _debounce(state => {
    this.filter(state)
  }, 300)

  componentDidMount () {
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = e => {
    // Do nothing if some input is already focused
    if (document.activeElement.tagName === 'INPUT') return
    // Don't do anything on routes other than these two
    if (this.props.pathname !== '/all-cards' && this.props.pathname !== '/my-cards') return
    // If a letter, a space or a backspace was pressed...
    if (
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      (e.keyCode >= 97 && e.keyCode <= 122) ||
      e.keyCode === 32 ||
      e.keyCode === 8
    ) {
      this.setState({ showSearchForm: true }, this.selectNameInput)
    }
  }

  // Reverts to the initial state
  resetState = () => {
    const newState = { ...initialState() }
    this.setState(newState)
    this.filter(newState)
  }

  // Updates various search queries
  handleChange = property => value => {
    const newState = {
      ...this.state,
      [property]: _get(value, 'target.value', value)
    }
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  // Updates card color query
  handleChangeColor = (color, state) => {
    const newState = { ...this.state }
    newState.colors[color] = state
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  handleChangeMonocolored = () => {
    const newState = { ...this.state }
    newState.monocoloredOnly = !this.state.monocoloredOnly
    newState.multicoloredOnly = false
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  handleChangeMulticolored = () => {
    const newState = { ...this.state }
    newState.multicoloredOnly = !this.state.multicoloredOnly
    newState.monocoloredOnly = false
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  // Turns on or off all the color buttons
  toggleColors = state => {
    const newState = {
      ...this.state,
      colors: {
        White: state,
        Blue: state,
        Black: state,
        Red: state,
        Green: state,
        Colorless: state
      }
    }
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  // Returns filtering function that will be used by reducers to filter cards
  search = state => {
    const queryName = state.queryName.trim().toLowerCase()
    const queryTypes = state.queryTypes.toLowerCase().split(' ')
    const queryText = state.queryText.trim().toLowerCase()

    return card => {
      // Hide cards with no text when text is specified
      if (queryText && !card.text) return false
      // Checking name
      const nameOk = card.name.toLowerCase().indexOf(queryName) > -1
      // Checking types
      const typeOk = queryTypes.length
        ? _every(
            queryTypes,
            qt =>
              _find(card.types, ct => ct.toLowerCase().indexOf(qt) > -1) ||
              _find(card.subtypes, cst => cst.toLowerCase().indexOf(qt) > -1)
          )
        : true
      // Checking text
      const textOk = card.text ? card.text.toLowerCase().indexOf(queryText) > -1 : true
      // Checking set
      const setOK =
        state.cardSet !== 'all-sets' ? _find(card.variants, { setCode: state.cardSet }) : true
      // Checking card colors
      const colorsOk = card.colors
        ? _find(card.colors, color => state.colors[color])
        : state.colors.Colorless
      // Monocolored only test
      let monoOk = true
      if (state.monocoloredOnly && card.colors && card.colors.length !== 1) monoOk = false
      // Multicolored only test
      let multiOk = true
      if (state.multicoloredOnly && (!card.colors || (card.colors && card.colors.length < 2))) {
        multiOk = false
      }
      // Converted mana cost test
      let cmcOk = false
      if (state.cmcType === 'minimum' && (card.cmc || 0) >= state.cmcValue) cmcOk = true
      if (state.cmcType === 'exactly' && (card.cmc || 0) === state.cmcValue) cmcOk = true
      if (state.cmcType === 'maximum' && (card.cmc || 0) <= state.cmcValue) cmcOk = true

      return nameOk && typeOk && textOk && setOK && colorsOk && cmcOk && monoOk && multiOk
    }
  }

  // Passes filtering function to a particular reducer
  filter = state => {
    this.props.resetMainCardFocus()
    if (this.props.pathname === '/all-cards') this.props.filterAllCards(this.search(state))
    if (this.props.pathname === '/my-cards') this.props.filterMyCards(this.search(state))
  }

  focusNameInput = () => {
    if (document.activeElement.tagName === 'INPUT') return

    this.refs.nameInput.focus()
  }

  selectNameInput = () => {
    if (document.activeElement.tagName === 'INPUT') return

    this.refs.nameInput.select()
  }

  searchModuleMouseLeave = () => {
    if (document.activeElement.tagName === 'INPUT') {
      document.activeElement.blur()
    }

    this.setState({ showSearchForm: false })
  }

  render () {
    const { cardSets } = this.props

    const searchButton = (
      <button
        className="search-button fa fa-search"
        aria-hidden="true"
        onMouseEnter={this.focusNameInput}
      />
    )

    const searchForm = (
      <div className="search-form">
        <div className="text-inputs form-group">
          <input
            className="form-control"
            ref="nameInput"
            placeholder="Name"
            value={this.state.queryName}
            onChange={this.handleChange('queryName')}
            onBlur={() => {
              this.setState({ showSearchForm: false })
            }}
          />
          <input
            className="form-control"
            placeholder="Type"
            value={this.state.queryTypes}
            onChange={this.handleChange('queryTypes')}
          />
          <input
            className="form-control"
            placeholder="Text"
            value={this.state.queryText}
            onChange={this.handleChange('queryText')}
          />
        </div>
        <div className="form-group">
          <select
            className="form-control"
            value={this.state.cardSet}
            onChange={this.handleChange('cardSet')}
          >
            <option value="all-sets">All sets</option>
            {cardSets.map(set =>
              <option key={set.code} value={set.code}>
                {set.name}
              </option>
            )}
          </select>
        </div>
        <div className="color-filter-group form-group">
          <ColorFilter colors={this.state.colors} onColorChange={this.handleChangeColor} />
          <ColorButtons
            colors={this.state.colors}
            toggleAll={() => {
              this.toggleColors(true)
            }}
            toggleNone={() => {
              this.toggleColors(false)
            }}
            monocoloredOnly={this.state.monocoloredOnly}
            multicoloredOnly={this.state.multicoloredOnly}
            handleChangeMonocolored={this.handleChangeMonocolored}
            handleChangeMulticolored={this.handleChangeMulticolored}
          />
        </div>
        <CmcFilter
          cmcValue={this.state.cmcValue}
          cmcType={this.state.cmcType}
          changeCmcValue={this.handleChange('cmcValue')}
          changeCmcType={this.handleChange('cmcType')}
        />
        <div>
          <button className="btn" onClick={this.resetState}>
            Reset
          </button>
        </div>
      </div>
    )

    return (
      <div
        className={cn('search-module', { 'form-visible': this.state.showSearchForm })}
        onMouseLeave={this.searchModuleMouseLeave}
      >
        {searchButton}
        {searchForm}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchModule)
