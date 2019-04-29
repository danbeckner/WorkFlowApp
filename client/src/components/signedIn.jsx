import React, { Component } from 'react';
import NavBar from './navbar';
import Footer from './footer';
import CustomerDashboard from './customerDashboard';
import EmployeeDashboard from './employeeDashboard';

export default class SignedIn extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <NavBar />
                {/* <CustomerDashboard></CustomerDashboard> */}
                <EmployeeDashboard></EmployeeDashboard>
                <Footer></Footer>
            </React.Fragment>
        )
    };
}