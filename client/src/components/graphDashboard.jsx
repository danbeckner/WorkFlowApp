import React, { Component } from 'react';
import { Bar, Doughnut, Chart } from 'react-chartjs-2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faRedo } from '@fortawesome/free-solid-svg-icons';
import { getFromStorage } from '../storage';
import "react-datepicker/dist/react-datepicker.css";

// add the font awesome icons into the library
library.add(faPlus, faTrashAlt, faRedo)

// let ticketsArr = [];

export default class GraphDash extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ticketCount: 0,
            itemCount: 0,
            openTickets: 0,
            closedTickets: 0,
            user: null
        }
    }

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

    // getTicketCount = () => {
    //     fetch("api/getTicketCount")
    //         .then(count => count.json())
    //         .then(res => {
    //             console.log("ticket count", res.count)
    //             this.setState({ ticketCount: res.count })
    //         })
    // }

    getItemCount = () => {
        fetch("api/getItemCount")
            .then(count => count.json())
            .then(res => {
                console.log("item count", res.count)
                this.setState({ itemCount: res.count })
            })
    }

    getTicketStats = () => {
        fetch("api/getTicket")
            .then(ticket => ticket.json())
            .then(res => {
                let ticketsArr = res.ticket;
                console.log(ticketsArr)

                let closedTickets = ticketsArr.filter(function (tickets) { return tickets.ticketStatus === "Closed" }).length;
                let openTickets = ticketsArr.filter(function (tickets) { return tickets.ticketStatus === "Open" }).length;
                let ticketCount = closedTickets + openTickets;

                console.log("number of closed:", closedTickets);
                console.log("number of open:", openTickets);

                this.setState({ openTickets: openTickets });
                this.setState({ closedTickets: closedTickets });
                this.setState({ ticketCount: ticketCount });

            })
    }

    componentDidMount() {
        // this.getTicketCount();
        this.getItemCount();
        this.getTicketStats();
        // this.getSessionInfo();
        // this.filterTickets();
    }

    render() {

        // some of this code is a variation on https://jsfiddle.net/cmyker/u6rr5moq/
        var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
        Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
            draw: function () {
                originalDoughnutDraw.apply(this, arguments);

                var chart = this.chart;
                var width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;

                var fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";

                var sum = 0;
                for (var i = 0; i < chart.config.data.datasets[0].data.length; i++) {
                    sum += chart.config.data.datasets[0].data[i];
                }

                var text = sum,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 1.56;

                ctx.fillText(text, textX, textY);
            }
        });

        const { itemCount, openTickets, closedTickets, ticketCount } = this.state;

        const ticketInfo = {
            labels: ["Open", "Closed"],
            datasets: [{
                label: "My First dataset",
                data: [openTickets, closedTickets],
                backgroundColor: [
                    'rgba(105, 0, 132, .2)',
                    // '#cfd0d1'
                    // '#d8d8d8'
                    'rgba(0, 137, 132, .2)'
                ],
                borderColor: [
                    'rgba(200, 99, 132, .7)',
                    // '#bfc0c1'
                    'rgba(0, 10, 130, .7)'
                ],
                borderWidth: 1
            }]
        };

        const totalTickets = {

            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "Opened",
                data: [65, 59, 80, 81, 56, 55, 40],
                // data: [openTickets],
                backgroundColor: [
                    'rgba(105, 0, 132, .2)',
                    'rgba(105, 0, 132, .2)',
                    'rgba(105, 0, 132, .2)',
                    'rgba(105, 0, 132, .2)',
                    'rgba(105, 0, 132, .2)',
                    'rgba(105, 0, 132, .2)',
                    'rgba(105, 0, 132, .2)'
                ],
                borderColor: [
                    'rgba(200, 99, 132, .7)',
                    'rgba(200, 99, 132, .7)',
                    'rgba(200, 99, 132, .7)',
                    'rgba(200, 99, 132, .7)',
                    'rgba(200, 99, 132, .7)',
                    'rgba(200, 99, 132, .7)',
                    'rgba(200, 99, 132, .7)'
                ],
                borderWidth: 1
            },
            {
                label: "Closed",
                data: [28, 48, 40, 19, 86, 27, 90],
                // data: [closedTickets],
                backgroundColor: [
                    'rgba(0, 137, 132, .2)',
                    'rgba(0, 137, 132, .2)',
                    'rgba(0, 137, 132, .2)',
                    'rgba(0, 137, 132, .2)',
                    'rgba(0, 137, 132, .2)',
                    'rgba(0, 137, 132, .2)',
                    'rgba(0, 137, 132, .2)'
                ],
                borderColor: [
                    'rgba(0, 10, 130, .7)',
                    'rgba(0, 10, 130, .7)',
                    'rgba(0, 10, 130, .7)',
                    'rgba(0, 10, 130, .7)',
                    'rgba(0, 10, 130, .7)',
                    'rgba(0, 10, 130, .7)',
                    'rgba(0, 10, 130, .7)'
                ],
                borderWidth: 1
            }]
        };

        return (
            <React.Fragment >
                <div className="graph-dashboard component-container container-fluid">
                    <div className="row">
                        <div className="dash-header ml-3 mt-3">
                            <h4>Dashboard</h4>
                        </div>
                        <hr className="line" />
                        <div className="col-12 mt-5">
                            <div className="row d-flex justify-content-center mt-5">
                                <div className="col-2 is-container">
                                    <p className="data-box-header font-weight-bold">Inventory Statistics</p>
                                    <p className="data-box-header is-styles">Total Items in Inventory: {itemCount}</p>
                                    <p className="data-box-header is-styles">Open Tickets: {openTickets}</p>
                                    <p className="data-box-header is-styles">Closed Tickets: {closedTickets}</p>
                                    <p className="data-box-header is-styles">Total Tickets: {ticketCount}</p>
                                </div>
                                <div className="col-4">
                                    <Doughnut
                                        data={ticketInfo}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            cutoutPercentage: 80,
                                            title: {
                                                display: true,
                                                position: 'top',
                                                text: 'Daily Tickets'
                                            }
                                        }}
                                    />
                                </div>
                                <div className="graph-container col-4">
                                    <Bar
                                        data={totalTickets}
                                        height={200}
                                        width={350}
                                        options={{
                                            maintainAspectRatio: true,
                                            responsive: true,
                                            scales: {
                                                xAxes: [
                                                    {
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }
                                                ],
                                                yAxes: [
                                                    {
                                                        gridLines: {
                                                            drawBorder: false
                                                        }
                                                    }
                                                ]
                                            },
                                            title: {
                                                display: true,
                                                position: 'top',
                                                text: 'Monthly Ticket Statistics'
                                            }
                                        }}

                                    />
                                </div>
                            </div>
                        </div>
                        {/* <hr className="line" />
                        <div className="col-12 d-flex info-container">
                            <div className="row">
                                <div className="col-6 border-yellow ql-container">
                                    <p className="data-box-header">QuickLinks</p>
                                    <ul>
                                        <li>Frequently Asked Questions</li>
                                        <li>Contact</li>
                                        <li>Legal</li>
                                        <li>Privacy Notices</li>
                                    </ul>
                                </div>
                                <div className="col-6 is-container">
                                    <p className="data-box-header">Inventory Statistics</p>
                                    <p className="data-box-header">Total Items in Inventory: {itemCount}</p>
                                    <p className="data-box-header">Open Tickets: {openTickets}</p>
                                    <p className="data-box-header">Closed Tickets: {closedTickets}</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <hr className="line line-margin" />
                </div>
                <div className="row navbar justify-content-center navbar-light foot-color foot-graph-container foot-graph-color">
                    <p className="navbar-brand foot" href="#">Copyright&copy; 2019 Dan Beckner, Inc. All Rights Reserved.</p>
                </div>
            </React.Fragment >
        );
    }
}