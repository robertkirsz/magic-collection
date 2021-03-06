// ----------------------------------------------- //
// Component for searching for and filtering cards //
// ----------------------------------------------- //

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
// --- Helpers ---
import cn from 'classnames'
import _get from 'lodash/get'
import _debounce from 'lodash/debounce'
import _every from 'lodash/every'
import _find from 'lodash/find'
// --- Store ---
import { dispatch } from '../redux'
// --- Components ---
import { ColorFilter, CmcFilter, ColorButtons } from './'
import { Button, Input } from '../styled'

// TODO: make filetr query stay between route changes
// TODO: show idicator that a query is on (a dot in the search icon)

const mapStateToProps = ({ allCards }) => ({ cardSets: allCards.cardSets })

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
    cardSets: PropTypes.array.isRequired
  }

  nameInput = null

  state = {
    ...initialState(),
    showSearchForm: false,
    queryPresent: false
  }

  debouncedFilter = _debounce(state => {
    this.filter(state)
  }, 300)

  componentDidMount () {
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentDidUpdate (prevProps) {
    if (
      this.state.queryPresent &&
      ((this.props.pathname === '/all-cards' && prevProps.pathname === '/my-cards') ||
        (this.props.pathname === '/my-cards' && prevProps.pathname === '/all-cards'))
    ) {
      this.debouncedFilter(this.state)
    }
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
    const newState = { ...initialState(), queryPresent: false }
    this.setState(newState)
    this.filter(newState)
  }

  // Updates various search queries
  handleChange = property => value => {
    const newState = {
      ...this.state,
      [property]: _get(value, 'target.value', value),
      queryPresent: true
    }
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  // Updates card color query
  handleChangeColor = (color, state) => e => {
    const newState = {
      ...this.state,
      queryPresent: true
    }
    newState.colors[color] = state
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  handleChangeMonocolored = () => {
    const newState = {
      ...this.state,
      queryPresent: true
    }
    newState.monocoloredOnly = !this.state.monocoloredOnly
    newState.multicoloredOnly = false
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  handleChangeMulticolored = () => {
    const newState = {
      ...this.state,
      queryPresent: true
    }
    newState.multicoloredOnly = !this.state.multicoloredOnly
    newState.monocoloredOnly = false
    this.setState(newState)
    this.debouncedFilter(newState)
  }

  // Turns on or off all the color buttons
  toggleColors = state => {
    const newState = {
      ...this.state,
      queryPresent: true,
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
  // TODO: test how efficient this filtering is. Maybe it fould be faster when
  // filtering first by set, then by color etc.
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
    dispatch.resetMainCardFocus()
    if (this.props.pathname === '/all-cards') dispatch.filterAllCards(this.search(state))
    if (this.props.pathname === '/my-cards') dispatch.filterMyCards(this.search(state))
  }

  focusNameInput = () => {
    if (document.activeElement.tagName === 'INPUT') return

    this.nameInput.focus()
  }

  selectNameInput = () => {
    if (document.activeElement.tagName === 'INPUT') return

    this.nameInput.select()
  }

  searchModuleMouseLeave = () => {
    if (document.activeElement.tagName === 'INPUT') {
      document.activeElement.blur()
    }

    this.setState({ showSearchForm: false })
  }

  render () {
    const { cardSets } = this.props

    return (
      <StyledSearchModule
        className={cn('search-module', { 'form-visible': this.state.showSearchForm })}
        onMouseLeave={this.searchModuleMouseLeave}
      >
        <SearchButton
          queryPresent={this.state.queryPresent}
          className="search-button fa fa-search"
          aria-hidden="true"
          onMouseEnter={this.focusNameInput}
        />

        <SearchForm className="search-form">
          <NameInput
            innerRef={o => {
              this.nameInput = o
            }}
            placeholder="Name"
            value={this.state.queryName}
            onChange={this.handleChange('queryName')}
            onBlur={() => {
              this.setState({ showSearchForm: false })
            }}
          />

          <TypeInput
            placeholder="Type"
            value={this.state.queryTypes}
            onChange={this.handleChange('queryTypes')}
          />

          <TextInput
            placeholder="Text"
            value={this.state.queryText}
            onChange={this.handleChange('queryText')}
          />

          <SetsArea>
            <select value={this.state.cardSet} onChange={this.handleChange('cardSet')}>
              <option value="all-sets">All sets</option>
              {cardSets.map(set =>
                <option key={set.code} value={set.code}>
                  {set.name}
                </option>
              )}
            </select>
          </SetsArea>

          <CmcArea>
            <CmcFilter
              cmcValue={this.state.cmcValue}
              cmcType={this.state.cmcType}
              changeCmcValue={this.handleChange('cmcValue')}
              changeCmcType={this.handleChange('cmcType')}
            />
          </CmcArea>

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

          <ButtonsArea>
            <Button className="btn" onClick={this.resetState}>
              Reset
            </Button>
          </ButtonsArea>
        </SearchForm>
      </StyledSearchModule>
    )
  }
}

export default connect(mapStateToProps)(SearchModule)

const StyledSearchModule = styled.div`
  flex: none;
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: var(--shadow);
  pointer-events: auto;
  transition: all var(--transitionTime);

  &.form-visible,
  &:hover {
    width: 90vw;
    height: 420px;
    border-radius: 10px;

    @media (min-width: 401px) {
      width: 415px;
      height: 220px;
    }

    .search-button {
      font-size: 4em;
      opacity: 0;
    }

    .search-form {
      transform: scale(1);
      opacity: 1;
    }
  }
`

const SearchButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  font-size: 1.5em;
  opacity: 1;
  transition: all var(--transitionTime);
  ${props => props.queryPresent && css`
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: -4px; right: -4px;
      width: 12px; height: 12px;
      background: lime;
      border: 4px solid white;
      border-radius: 50%;
      box-sizing: content-box;
    }
  `}
`

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas: "name-input" "type-input" "text-input" "sets-area" "cmc-area" "colors-area"
    "color-buttons-area" "buttons-area";
  grid-gap: 0.5rem;

  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0.5rem;

  transform: scale(0);
  transform-origin: center;
  opacity: 0;
  transition: all var(--transitionTime);

  @media (min-width: 401px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas: "name-input type-input text-input" "sets-area cmc-area cmc-area"
      "colors-area colors-area color-buttons-area" "buttons-area buttons-area buttons-area";
  }
`

const NameInput = styled(Input)`
  grid-area: name-input;
`
const TypeInput = styled(Input)`
  grid-area: type-input;
`
const TextInput = styled(Input)`
  grid-area: text-input;
`

const SetsArea = styled.div`
  grid-area: sets-area;
  display: flex;
  select {
    flex: 1;
    width: 100%;
  }
`

const CmcArea = styled.div`grid-area: cmc-area;`

const ButtonsArea = styled.div`
  grid-area: buttons-area;
  justify-self: center;
`
