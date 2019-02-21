import React, { Component } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { history } from '@helpers/utils/config';
import AdminLayout from '@layouts/Admin/Admin';
import Login from '@views/Login';
import { inject, observer } from 'mobx-react';
@inject('AuthStore', 'UserStore')
@observer
class App extends Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    async componentWillMount() {
        if (!this.props.AuthStore.appLoaded) {
            this.props.AuthStore.setAppLoaded()
            if (this.props.AuthStore.isLoggedIn && !this.props.UserStore.userLoaded) {
                this.props.UserStore.setInProgress(true)
                await this.props.UserStore.loadUser()
                this.props.UserStore.setInProgress(false)
                this.props.UserStore.setUserLoaded(true)
            }
        }
    }

    render() {
        if (this.props.AuthStore.appLoaded) {
            const { isLoggedIn } = this.props.AuthStore
            const { userLoaded } = this.props.UserStore
            return (
                <Router history={history}>
                    <React.Fragment>
                        <Switch>
                            <Route path="/admin" render={props => <AdminLayout {...props} />} />
                            <Redirect exact from="/" to="/admin/dashboard" />
                        </Switch>
                        <Route exact path="/" render={() => (
                            isLoggedIn && userLoaded ? (
                                <Redirect to="/admin/dashboard" />
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route exact path="/login" render={(props) => (
                            isLoggedIn && userLoaded ? (
                                <Redirect to="/admin/dashboard" />
                            ) : (
                                    <Login {...props} />
                                )
                        )} />
                    </React.Fragment>
                </Router>
            )
        }
    }
}
export default App