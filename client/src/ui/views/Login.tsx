import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Loader from 'react-loaders';
import NotificationAlert from 'react-notification-alert';
import {
    Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row
} from 'reactstrap';

import { userService } from '@services/user.service';

@inject('AuthStore', 'UserStore')
@observer
class Login extends React.Component<any, any> {
    private notificationsRef: any;
    constructor(props: any) {
        super(props)
        this.state = {
            email: '',
            password: '',
            submitted: false,
            isLoading: false
        };
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

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const { email, password } = this.state
        const { setToken, setIsLoggedIn } = this.props.AuthStore
        if (email && password) {
            try {
                this.setState({
                    isLoading: true
                })
                await userService.login(email, password)
                this.notify('tc', 'success', 'Successfully logged in!', 'tim-icons icon-check-2')
                setToken(localStorage.getItem('token'))
                await this.props.UserStore.loadUser()
                setIsLoggedIn(true)
                this.props.UserStore.setUserLoaded(true)
            } catch (err) {
                this.notify('tc', 'danger', 'Unable to login with those credentials. Please try again.', 'tim-icons icon-alert-circle-exc')
                this.props.UserStore.setUserLoaded(false)
            }
            this.setState({
                submitted: true,
                isLoading: false,
            })
        }
    }

    render() {
        const { email, password, submitted, isLoading } = this.state
        return (
            <React.Fragment>
                <Container>
                    <div className="react-notification-alert-container">
                        <NotificationAlert ref="notificationAlert" />
                    </div>
                    <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
                        <Col xs={12} lg={8}>
                            <Card data-color="blue" style={{ minHeight: '50vh', padding: 30 }}>
                                <CardHeader>
                                    <h1 className="text-primary">Login</h1>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup className={(submitted && !email ? ' has-error' : '')}>
                                            <Label>Email</Label>
                                            <Input type="text" name="email" id="email"
                                                className="form-control form-control-lg"
                                                value={email}
                                                onChange={this.handleChange}
                                                style={{ borderRadius: '0.4285rem' }} />
                                        </FormGroup>
                                        <FormGroup className={(submitted && !password ? ' has-error' : '')}>
                                            <Label>Password</Label>
                                            <Input type="password" name="password" id="password"
                                                className="form-control form-control-lg"
                                                value={password}
                                                onChange={this.handleChange}
                                                style={{ borderRadius: '0.4285rem' }} />
                                            {submitted && !password &&
                                                <div className="help-block">Password is required</div>
                                            }
                                        </FormGroup>
                                        <FormGroup style={{ marginTop: 50 }}>
                                            <Button color="primary" block data-color="blue">
                                                {
                                                    isLoading ? (
                                                        <Loader type="ball-beat" active />
                                                    ) : `Login`
                                                }
                                            </Button>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}
export default Login