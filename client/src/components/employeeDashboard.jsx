import React, { Component } from 'react';
import NavBar from './navbar';
import GraphDash from './graphDashboard';
import ViewInventory from './viewInventory';
import TicketQueue from './viewTicketQueue';
import Footer from './footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faClipboard, faWrench } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faClipboard, faWrench)

let $ = require('jquery');

export default class EmpDashboard extends Component {
    constructor() {
        super()
        this.state = {
            showGraphDash: true,
            showInventory: false,
            showContact: false,
            ticketQueue: false,
        };
    }

    // function for passing the logout prop to the parent component
    logOut = () => {
        this.props.logOut();
    };

    toggleGraphDash = (bool) => {
        this.setState({ showGraphDash: bool });
        this.setState({ showInventory: false });
        this.setState({ ticketQueue: false });
        this.setState({ showContact: false });
    }

    toggleInventory = (bool) => {
        this.setState({ showGraphDash: false });
        this.setState({ showInventory: bool });
        this.setState({ showContact: false });
        this.setState({ ticketQueue: false })
    }

    toggleTicketQueue = (bool) => {
        this.setState({ showGraphDash: false });
        this.setState({ showInventory: false });
        this.setState({ showContact: false });
        this.setState({ ticketQueue: bool })
    }

    toggleContactInfo = (bool) => {
        this.setState({ showGraphDash: false });
        this.setState({ showInventory: false });
        this.setState({ showContact: bool });
        this.setState({ ticketQueue: false })
    }


    // component lifecycle function for toggling css animations for the side navigation bar
    componentDidMount = () => {

        $('.sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <nav id="sidebar" className="navbar-dark bg-dark active">
                        <div className="sidebar-header">
                            <h3 className="mb-3">WorkFlow</h3>
                            <strong className="mb-3">WF</strong>
                            <button title="Toggle Menu" type="button" id="sidebarCollapse" className="navbar-toggler mb-3 sidebarCollapse">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        <ul className="list-unstyled components">
                            <li className="active mb-3">
                                <FontAwesomeIcon title="Home" icon="home" className="mr-1 icon-size" href="#" onClick={this.toggleGraphDash.bind(true)} />
                                <a href="#" onClick={this.toggleGraphDash.bind(true)}>Home</a>
                            </li>
                            <li className="active mb-3">
                                <FontAwesomeIcon title="Inventory" icon="clipboard" className="mr-1 icon-size" onClick={this.toggleInventory.bind(true)} />
                                <a href="#inventorySubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                                    Inventory
                                </a>
                                <ul className="collapse list-unstyled submenu mt-2" id="inventorySubmenu">
                                    <li>
                                        <a href="#" onClick={this.toggleInventory.bind(true)}>View Inventory</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="mb-3">
                                <FontAwesomeIcon title="Maintenance" icon="wrench" className="mr-1 icon-size" onClick={this.toggleTicketQueue.bind(true)} />
                                <a href="#ticketsSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                                    Maintenance
                                </a>
                                <ul className="collapse list-unstyled submenu mt-2" id="ticketsSubmenu">
                                    <li>
                                        <a href="#" onClick={this.toggleTicketQueue.bind(true)}>Ticket Queue</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <FontAwesomeIcon title="Accounts" icon="user" className="mr-1 icon-size" />
                                <a href="#accountsSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                                    Accounts
                                </a>
                                <ul className="collapse list-unstyled submenu mt-2" id="accountsSubmenu">
                                    <li>
                                        <a href="#">View Site</a>
                                    </li>
                                    <li>
                                        <a href="#">View Customer</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>

                    <div id="content" className="container-fluid cf-color">
                        <NavBar logOut={this.logOut.bind(this)} />
                        {this.state.showGraphDash && <GraphDash />}
                        {this.state.showInventory && <ViewInventory />}
                        {this.state.ticketQueue && <TicketQueue />}
                        {/* <Footer /> */}
                    </div>
                </div>
            </React.Fragment >
        );
    }
}