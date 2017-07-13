import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
// TODO: switch to https://github.com/reactjs/react-transition-group
import Transition from 'react/lib/ReactCSSTransitionGroup'
import _find from 'lodash/find'
import { AuthModal, ErrorModal, KeyboardNavigation } from 'containers'
import { Header, SearchModule } from 'components'
import 'styles/core.scss'

const mapStateToProps = ({ layout, allCards, myCards, user }) => ({
  allCardsFetching: allCards.fetching,
  myCardsLoading: myCards.loading,
  userAuthPending: user.authPending
})

class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    params: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    allCardsFetching: PropTypes.bool.isRequired,
    myCardsLoading: PropTypes.bool.isRequired,
    userAuthPending: PropTypes.bool.isRequired
  }

  state = { showSpinner: true }

  componentWillReceiveProps ({ allCardsFetching, myCardsLoading, userAuthPending }) {
    if (__DEV__ && this.state.showSpinner) {
      console.info(
        'allCardsFetching:',
        allCardsFetching,
        'myCardsLoading:',
        myCardsLoading,
        'userAuthPending',
        userAuthPending
      )
    }

    if (!allCardsFetching && !myCardsLoading && !userAuthPending && this.state.showSpinner) {
      this.setState({ showSpinner: false })
    }
  }

  render () {
    const { routes, children } = this.props
    const { showSpinner } = this.state
    // Show button at the bottom of the screen on routes that have 'showAppButtons' prop
    const showAppButtons = _find(routes, 'showAppButtons')
    const topRoute = this.props.routes[this.props.routes.length - 1].path

    return (
      <div id="app">
        <Header />
        {children}
        <Transition
          transitionName="fade"
          transitionAppear
          transitionAppearTimeout={300}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {showAppButtons &&
            !showSpinner &&
            <div className="app-buttons">
              <SearchModule />
            </div>}
        </Transition>
        <AuthModal />
        <ErrorModal />
        <KeyboardNavigation
          onCardsListPage={topRoute === 'all-cards' || topRoute === 'my-cards'}
          onCardDetailsPage={this.props.params.cardUrl !== undefined}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(CoreLayout)
