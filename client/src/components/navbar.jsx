import React, { Component } from 'react';
import { DropdownItem } from 'reactstrap';
import { getFromStorage } from "../storage"
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// add the font awesome icons into the library
library.add(faSignOutAlt);

export default class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: ''
        }

    }

    // function for passing the logout click function to the parent component
    onLogOut = () => {
        this.props.logOut();
    };


    getSessionInfo = () => {
        const obj = getFromStorage('fullstack_app');
        console.log('event fired', getFromStorage('fullstack_app'));
        const token = obj.token;

        fetch("api/getSessionInfo/" + token)
            .then(session => session.json())
            .then(res => {
                console.log("Session Info", res.session)
                let user = res.session[0]['userFirstName'];

                console.log("user is", user)
                this.setState({ user: user })
            })
    }

    componentDidMount() {
        this.getSessionInfo();
    }

    render() {

        const { user } = this.state
        return (
            <React.Fragment>
                <nav className="navbar navbar-dark bg-dark nav-custom">
                    <p className="navbar-brand brand-color"></p>
                    <div className="nav-item">
                        <a className="nav-link username-color">{user}
                            <FontAwesomeIcon
                                className="fas fa-sign-out-alt fa-sm ml-1 cursor"
                                icon="sign-out-alt"
                                onClick={this.onLogOut.bind(this)}
                            />
                            {/* <button type="button" className="btn-outline-success" onClick={this.onLogOut.bind(this)}></button> */}
                        </a>
                    </div>
                    {/* <div className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle username-color" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">{user}</a>
                        <div className=" dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" data-toggle="modal" data-target="#changePassword"> Change Password</a>
                            <DropdownItem type="button" className="btn-outline-success" onClick={this.onLogOut.bind(this)}>Log Out</DropdownItem>
                        </div>
                    </div> */}
                </nav>
                <div className="modal fade" id="changePassword" tabIndex="-1" role="dialog" aria-labelledby="changePassword" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="changePasswordTitle">Change Password</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="modal-lg">
                                    <div className="input-group input-group-md">
                                        <input type="text" className="form-control mr-3" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Old Password" />
                                        <input type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Confirm Old Password" />
                                    </div>
                                    <div className="input-group input-group-md mt-3">
                                        <input type="text" className="form-control mr-3" aria-label="Large" area-describedby="inputGroup-sizing-sm" placeholder="New Password" />
                                        <input type="text" className="form-control" aria-label="Large" area-describedby="inputGroup-sizing-sm" placeholder="Confirm New Password" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}