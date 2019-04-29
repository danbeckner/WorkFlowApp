import React, { Component } from 'react';
import axios from 'axios';
import EmployeeDashboard from './employeeDashboard';
import ReCAPTCHA from 'react-google-recaptcha';
import { putInStorage, getFromStorage, removeFromStorage } from '../storage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// add the font awesome icons into the library
library.add(faSpinner);

// recaptcha constant for production
// will validate the user is a human not a bot
const onChange = (value) => {
    console.log("Captcha value:", value);
}

// Public ReCAPTCHA key for authenticating user
const recapKey = "6LclFJUUAAAAAA0_GmbXWfnAxzOoeZpYyWXgutNx";

class LogIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            token: '',
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            siteId: '',
            company: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpUsername: '',
            signUpPassword: '',
            signUpSiteId: '',
            signUpCompany: '',
            signInUsername: '',
            signInEmail: '',
            signInPassword: '',
            signInError: '',
            user: null
        };

        this.addSignUpFirstName = this.addSignUpFirstName.bind(this);
        this.addSignUpLastName = this.addSignUpLastName.bind(this);
        this.addSignUpEmail = this.addSignUpEmail.bind(this);
        this.addSignUpUsername = this.addSignUpUsername.bind(this);
        this.addSignUpPassword = this.addSignUpPassword.bind(this);
        this.addSignUpSiteId = this.addSignUpSiteId.bind(this);
        this.addSignUpCompany = this.addSignUpCompany.bind(this);
        this.addSignInUsername = this.addSignInUsername.bind(this);
        this.addSignInEmail = this.addSignInEmail.bind(this);
        this.addSignInPassword = this.addSignInPassword.bind(this);

        this.signUp = this.signUp.bind(this);
        this.signIn = this.signIn.bind(this);
        // this.logOut = this.logOut.bind(this);
    }

    // event handlers for grabbing user input from the forms
    addSignUpFirstName(e) {
        this.setState({
            signUpFirstName: e.target.value
        });
    }

    addSignUpLastName(e) {
        this.setState({
            signUpLastName: e.target.value
        });
    }

    addSignUpEmail(e) {
        this.setState({
            signUpEmail: e.target.value
        });
    }

    addSignUpUsername(e) {
        this.setState({
            signUpUsername: e.target.value
        });
    }

    addSignUpPassword(e) {
        this.setState({
            signUpPassword: e.target.value
        });
    }

    addSignUpSiteId(e) {
        this.setState({
            signUpSiteId: e.target.value
        });
    }

    addSignUpCompany(e) {
        this.setState({
            signUpCompany: e.target.value
        });
    }

    addSignInUsername(e) {
        this.setState({
            signInUsername: e.target.value
        });
    }

    addSignInEmail(e) {
        this.setState({
            signInEmail: e.target.value
        });
    }

    addSignInPassword(e) {
        this.setState({
            signInPassword: e.target.value
        });
    }

    // sign up function for posting the user input to the backend sign up api    
    signUp = () => {

        const {
            signUpFirstName,
            signUpLastName,
            signUpUsername,
            signUpEmail,
            signUpPassword,
            // signUpSiteId,
            // signUpCompany
        } = this.state;

        // axios method for posting to the sign up api
        fetch('api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // grab user input from state
            body: JSON.stringify({
                firstName: signUpFirstName,
                lastName: signUpLastName,
                username: signUpUsername,
                email: signUpEmail,
                password: signUpPassword,
                // siteId: signUpSiteId,
                // company: signUpCompany
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log('json', json);
                if (json.success) {
                    alert('Sign up successful. Please log in to continue.');
                    console.log("success", json.success)
                    return;
                } else {
                    this.setState({
                        signUpError: json.message,
                        signUpFirstName: '',
                        signUpLastName: '',
                        signUpUsername: '',
                        signUpEmail: '',
                        signUpPassword: '',
                    })
                    alert(json.message);
                    return;
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    // sign in function for posting the user input to the backend sign in api
    signIn = () => {

        // grab state
        const {
            signInUsername,
            signInEmail,
            signInPassword
        } = this.state;

        console.log(signInEmail, signInUsername);

        // set loading to true if the content is not available 
        this.setState({
            isLoading: true,
        });

        // Post request to backend
        fetch('api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: signInUsername,
                email: signInEmail,
                password: signInPassword
            })
        })
            // promises for json response
            // if the log in is successful grab the token from the response and place in local storage
            .then(response => response.json())
            .then(json => {
                console.log('json', json);
                if (json.success) {
                    putInStorage('fullstack_app', { token: json.token });
                    // reset state
                    this.setState({
                        isLoading: false,
                        signInUsername: '',
                        signInPassword: '',
                        // signInEmail: '',
                        token: json.token,
                        signInError: ''
                    });
                } else {
                    this.setState({
                        signInError: json.message,
                        isLoading: false,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    // log out function
    logOut = () => {

        // set loading to true until the request is complete
        this.setState({
            isLoading: true,
        });

        // retrieve the token from storage
        const obj = getFromStorage('fullstack_app');

        // if token is available from local storage pass token to backend to delete the user session
        if (obj && obj.token) {
            const { token } = obj.token;
            // Verify token
            fetch('api/logout?token=' + token, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                // promises for receiving a response and removing the token from local storage
                .then(res => res.json())
                .then(json => {
                    removeFromStorage('fullstack_app');
                    if (json.success) {
                        // reset state
                        this.setState({
                            token: '',
                            isLoading: false,
                            signInError: ''
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                        });
                    }
                })
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    validateSession = () => {
        const obj = getFromStorage('fullstack_app');
        console.log('event fired', getFromStorage('fullstack_app'));
        if (obj && obj.token) {
            const token = obj.token;
            // Verify token
            fetch('api/validate?token=' + token,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(
                    this.setState({
                        token: token,
                        isLoading: false
                    })
                )
        } else {
            this.setState({
                isLoading: false
            });
        }
    }

    /* 
     token based authentication during the application lifecyclee
    when the component mounts the application will check local storage for a token existance
    if the token exists then the server will check the database to validate the token in user sessions
    if it exists then it places the token in the component state which tells the application to display the employee dashboard
    */
    componentDidMount() {
        this.validateSession();
    }

    render() {
        // grab state
        const {
            isLoading,
            token,
            signUpFirstName,
            signUpLastName,
            signUpUsername,
            signUpEmail,
            signUpPassword,
            signUpSiteId,
            signUpCompany,
            signInUsername,
            signInEmail,
            signInPassword,
            signInError,
            signUpError,
            user
        } = this.state

        // loading icon if server request/response is not complete
        if (isLoading) {
            return (
                <div id="icon-container">
                    <FontAwesomeIcon
                        className="fas fa-pulse fa-2x"
                        icon="spinner"
                    /> Content loading.
                </div>
            );
        }

        // if token does not exist in local storage then display login screen
        if (!token) {
            return (
                <React.Fragment>
                    {/* <NavBar></NavBar> */}
                    <nav className="navbar navbar-dark bg-dark nav-custom">
                        <p className="navbar-brand brand-color"></p>
                    </nav>
                    <div className="container align-items-center mt-5">
                        <div className="card-deck justify-content-center">
                            <form className="main-sign-in-form">
                                <div className="container border mt-5">
                                    <h1 className="text-center mt-4">Please Log In</h1>
                                    <div className="input-group input-group-lg px-5 mt-5">
                                        <div className="input-group-prepend">
                                            <span className="email-tag-size input-group-text input-group-addon warning" id="inputGroup-sizing-lg">Username</span>
                                        </div>
                                        <input
                                            className="form-control"
                                            aria-label="Large"
                                            aria-describedby="inputGroup-sizing-sm"
                                            type="email"
                                            placeholder="Username"
                                            value={signInUsername}
                                            onChange={this.addSignInUsername} />
                                    </div>
                                    <div className="input-group input-group-lg px-5 mt-4">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text input-group-addon warning" id="inputGroup-sizing-lg">Password</span>
                                        </div>
                                        <input
                                            className="form-control"
                                            aria-label="Large"
                                            aria-describedby="inputGroup-sizing-sm"
                                            type="password"
                                            placeholder="Password"
                                            value={signInPassword}
                                            onChange={this.addSignInPassword} />
                                    </div>
                                    {/* <p className="error-alert">{signInError}</p> */}
                                    {
                                        (signInError) ? (
                                            <p className="error-alert">{signInError}</p>
                                        ) : (null)
                                    }
                                    <div className="container text-center">
                                        <div className="btn-group mt-5 mr-1" role="group">
                                            <button type="submit" className="btn btn-outline-success" onClick={this.signIn}>Login</button>
                                        </div>
                                        <div className="btn-group mt-5 ml-1" role="group">
                                            <button type="button" className="btn btn-outline-primary" data-toggle="modal" data-target="#createAccountModal">Create Account</button>
                                        </div>
                                    </div>
                                    <div className="container text-center mb-2">
                                        <div className="btn-group mt-3 ml-1 mb-4" role="group">
                                            <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#forgotPasswordModal">Forgot Password</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" role="dialog" aria-labelledby="forgotPasswordTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="forgotPasswordTitle">Forgot Password</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="modal-lg">
                                                    <div className="input-group input-group-md">
                                                        <input type="text" className="form-control mr-3" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Email" />
                                                        <input type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Confirm Email" />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <ReCAPTCHA sitekey={recapKey} onChange={onChange} />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                    <button type="button" className="btn btn-primary">Send Email</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal fade" id="createAccountModal" tabIndex="-1" role="dialog" aria-labelledby="createAccountTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="createAccountTitle">Create Account</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="modal-lg">
                                                    <div className="input-group input-group-md">
                                                        <input
                                                            type="text"
                                                            className="form-control mr-3"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            placeholder="First Name"
                                                            value={signUpFirstName}
                                                            onChange={this.addSignUpFirstName} />
                                                        <input
                                                            className="form-control"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            type="text"
                                                            placeholder="Last Name"
                                                            value={signUpLastName}
                                                            onChange={this.addSignUpLastName} />
                                                    </div>
                                                    {/* <div className="input-group input-group-md mt-4">
                                                        <input
                                                            className="form-control mr-3"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            type="text"
                                                            placeholder="Site ID"
                                                            value={signUpSiteId}
                                                            onChange={this.addSignUpSiteId} />
                                                        <input
                                                            className="form-control"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            type="text"
                                                            placeholder="Company"
                                                            value={signUpCompany}
                                                            onChange={this.addSignUpCompany} />
                                                    </div> */}
                                                    <div className="input-group input-group-md mt-4">
                                                        <input
                                                            type="text"
                                                            className="form-control mr-3"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            placeholder="Username"
                                                            value={signUpUsername}
                                                            onChange={this.addSignUpUsername} />
                                                        <input
                                                            className="form-control"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            type="email"
                                                            placeholder="Email"
                                                            value={signUpEmail}
                                                            onChange={this.addSignUpEmail} />
                                                    </div>
                                                    <div className="input-group input-group-md mt-4">
                                                        <input
                                                            className="form-control mr-3"
                                                            aria-label="Large"
                                                            aria-describedby="inputGroup-sizing-sm"
                                                            type="password"
                                                            placeholder="Password"
                                                            value={signUpPassword}
                                                            onChange={this.addSignUpPassword} />
                                                        <input type="password" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Confirm Password" />
                                                    </div>
                                                    <div className="form-check form-check-inline mt-4">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                                        <label className="form-check-label" htmlFor="inlineRadio1">Customer Account</label>
                                                    </div>
                                                    <div className="form-check form-check-inline mt-4">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                                        <label className="form-check-label" htmlFor="inlineRadio2">Employee Account</label>
                                                    </div>
                                                    {
                                                        (signUpError) ? (
                                                            <p className="error-alert">{signUpError}</p>
                                                        ) : (null)
                                                    }
                                                    <div className="form-group mt-3">
                                                        <ReCAPTCHA sitekey={recapKey} onChange={onChange} />
                                                    </div>
                                                </div>
                                                <div className="modal-footer mt-4">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.signUp}>Create Account</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* <Footer></Footer> */}
                </React.Fragment>
            );
        }

        // else if token does exist then display the dashboard
        return (
            <React.Fragment>
                <EmployeeDashboard logOut={this.logOut.bind(this)} />
            </React.Fragment>
        );
    }
}

export default LogIn;
