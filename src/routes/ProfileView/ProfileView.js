import React from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { Grid, Row, Col, Form, FormGroup, FormControl, Checkbox, Button } from 'react-bootstrap'

const mapStateToProps = ({ user }) => ({ user })

const ProfileView = ({ user }) => (
  <div className="profile-view">
    <Grid>
      <Row>
        <Col md={3}>
          <div
            className="profile-view__photo"
            style={{ backgroundImage: `url(${user.photoURL})` }}
          />
          {user.admin && <h3>ADMIN</h3>}
        </Col>
        <Col md={5}>
          <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
              <Col sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="Name" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col sm={2}>
                Email
              </Col>
              <Col sm={10}>
                <FormControl type="email" placeholder="Email" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <Col sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl type="password" placeholder="Password" />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Checkbox>Remember me</Checkbox>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type="submit">
                  Sign in
                </Button>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                Delete my account
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Grid>
  </div>
)

ProfileView.propTypes = {
  user: PropTypes.object
}

export default connect(mapStateToProps)(ProfileView)
