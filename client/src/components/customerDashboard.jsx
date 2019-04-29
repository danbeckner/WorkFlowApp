import React, { Component } from 'react';
import ViewItem from './viewItem';
import ViewInventory from './viewInventory';
import UpdateContactInfo from './updateContactInfo';

export default class CustDashboard extends Component {

    constructor() {
        super()
        this.state = {
            showItem: true,
            showInventory: false,
            showContact: false
        };
    }

    toggleItem = (bool) => {
        this.setState({ showItem: bool });
        this.setState({ showInventory: false });
        this.setState({ showContact: false });
    }

    toggleInventory = (bool) => {
        this.setState({ showItem: false });
        this.setState({ showInventory: bool });
        this.setState({ showContact: false });
    }

    toggleContactInfo = (bool) => {
        this.setState({ showItem: false });
        this.setState({ showInventory: false });
        this.setState({ showContact: bool });
    }

    render() {
        return (
            <React.Fragment>
                {/* <NavBar></NavBar> */}
                <div className="container">
                    <div className="row cust-nav-row-height align-items-center justify-content-center">
                        <ul className="nav nav-pills nav-fill">
                            <li className="nav-item">
                                <button className="btn btn-outline-info" onClick={this.toggleItem.bind(true)} href="#">Item Lookup</button>
                            </li>
                            <li className="nav-item mx-5">
                                <button className="btn btn-outline-info" onClick={this.toggleInventory.bind(true)} href="#">View Inventory</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-info" onClick={this.toggleContactInfo.bind(true)} href="#">Update Site Contact</button>
                            </li>
                        </ul>
                    </div>
                    {this.state.showItem && <ViewItem />}
                    {this.state.showInventory && <ViewInventory />}
                    {this.state.showContact && <UpdateContactInfo />}
                </div>
                {/* <Footer></Footer> */}
            </React.Fragment >
        );
    }
}