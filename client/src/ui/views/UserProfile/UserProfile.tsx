import { inject, observer } from 'mobx-react';
import React from 'react';
import NotificationAlert from 'react-notification-alert';
import {
  Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input,
  Row
} from 'reactstrap';
import { IUserProfileProps } from './IUserProfileProps';

@inject('UserStore')
@observer
class ProfileForm extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  submitForm = ev => {
    ev.preventDefault();
    this.props.onSubmitForm();
  }

  setName = e => this.props.user.setName(e.target.value)
  setCompany = e => this.props.user.setCompany(e.target.value)
  setPassword = e => this.props.user.setPassword(e.target.value)
  setStreet = e => this.props.user.setStreet(e.target.value)
  setCity = e => this.props.user.setCity(e.target.value)
  setCountry = e => this.props.user.setCountry(e.target.value)
  setPostCode = e => this.props.user.setPostCode(e.target.value)

  render() {
    const { name, company, email, password, street, city, country, postCode } = this.props.user
    return (
      <Form onSubmit={this.submitForm} autoComplete="off">
        <CardHeader>
          <h5 className="title">Edit Profile</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col className="pr-md-1" md="6">
              <FormGroup>
                <label>Company</label>
                <Input
                  type="text"
                  name="company"
                  value={company}
                  onChange={this.setCompany}
                />
              </FormGroup>
            </Col>
            <Col className="pl-md-1" md="6">
              <FormGroup>
                <label>
                  Email address
                </label>
                <Input type="email" name="email" value={email} disabled autoComplete="off" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="pr-md-1" md="12">
              <FormGroup>
                <label>Name</label>
                <Input
                  name="name"
                  value={name}
                  onChange={this.setName}
                  type="text"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <label>Street</label>
                <Input
                  name="street"
                  value={street}
                  onChange={this.setStreet}
                  type="text"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="pr-md-1" md="4">
              <FormGroup>
                <label>City</label>
                <Input
                  name="city"
                  value={city}
                  onChange={this.setCity}
                  type="text"
                />
              </FormGroup>
            </Col>
            <Col className="px-md-1" md="4">
              <FormGroup>
                <label>Country</label>
                <Input
                  name="country"
                  value={country}
                  onChange={this.setCountry}
                  type="text"
                />
              </FormGroup>
            </Col>
            <Col className="pl-md-1" md="4">
              <FormGroup>
                <label>Postal Code</label>
                <Input name="postCode" value={postCode} onChange={this.setPostCode} type="text" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Row>
                <Col md={2}>
                  <label>Teams Assigned:</label>
                </Col>
                <Col>
                  <Badge color="primary" pill className="py-2">Developer</Badge>
                </Col>
              </Row>
            </Col>
          </Row>

        </CardBody>
        <CardFooter>
          <Button className="btn-fill" color="primary" type="submit" block>
            Save
          </Button>
        </CardFooter>
      </Form>

    )
  }
}


@inject('AuthStore', 'UserStore')
@observer
class UserProfile extends React.Component<IUserProfileProps, any> {
  private notificationsRef: any;
  constructor(props) {
    super(props)
  }

  updateState = field => ev => {
    const state = this.state
    const newState = Object.assign({}, state, { [field]: ev.target.value })
    this.setState(newState)
  }

  onSubmit = async () => {
    try {
      const response = await this.props.UserStore.profileSubmit()
      if (response.status === 200) {
        this.notify('tc', 'success', response.data.message, 'far fa-check-circle')
      }
    } catch (err) {
      console.error(err)
      this.notify('tc', 'danger', 'Unable to save details.', 'far fa-times-circle')
    }
  }

  notify = (place, type, message, icon?) => {
    let options = {};
    options = {
      place: place,
      message: (
        <div>
          {message}
        </div>
      ),
      type: type,
      icon: icon,
      autoDismiss: 7
    };
    this.notificationsRef = this.refs.notificationAlert as any;
    this.notificationsRef.notificationAlert(options);
  };

  render() {
    const { name } = this.props.UserStore
    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="12">
              <Card>
                <ProfileForm user={this.props.UserStore} onSubmitForm={this.onSubmit} />
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;
