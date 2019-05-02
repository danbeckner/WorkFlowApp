import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import Footer from './footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimesCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';

library.add(faPlus, faTimesCircle, faRedo);

export default class TicketQueue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ticket: [],
            ticket_id: '',
            itemName: '',
            serialNumber: '',
            ticketStatus: '',
            ticketResolution: '',
            ticketNotes: '',
            resolutionNotes: ''
        };

        this.addTicket_Id = this.addTicket_Id.bind(this);
        this.addItemName = this.addItemName.bind(this);
        this.addSerialNumber = this.addSerialNumber.bind(this);
        this.addTicketResolution = this.addTicketResolution.bind(this);
        this.addTicketNotes = this.addTicketNotes.bind(this);

        this.createTicket = this.createTicket.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.closeTicket = this.closeTicket.bind(this);
    }

    retrieveTickets = () => {
        fetch("api/getTicket")
            .then(ticket => ticket.json())
            .then(res => {
                console.log(res.ticket)
                this.setState({ ticket: res.ticket })
            });
    };

    addTicket_Id = (e) => {
        this.setState({ ticket_id: e.target.value });
    }

    addItemName = (e) => {
        this.setState({ itemName: e.target.value });
    }

    addSerialNumber = (e) => {
        this.setState({ serialNumber: e.target.value });
    }

    addTicketResolution = (e) => {
        this.setState({ ticketResolution: e.target.value })
    }

    addTicketNotes = (e) => {
        this.setState({ ticketNotes: e.target.value });
    }

    addResolutionNotes = (e) => {
        this.setState({ resolutionNotes: e.target.value });
    }

    createTicket = () => {

        let currentTicket_id = this.state.ticket.map(ticket => ticket.ticket_id);
        let newTicket_id = 0;
        let {
            ticket_id,
            itemName,
            serialNumber,
            ticketNotes
        } = this.state;

        while (currentTicket_id.includes(newTicket_id)) {
            ++newTicket_id;
        }

        axios.post("api/createTicket", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            ticket_id: ticket_id,
            itemName: itemName,
            serialNumber: serialNumber,
            ticketNotes: ticketNotes
        })
            .then(function (response) {
                console.log(response);
                alert("Ticket successfully created. Please refresh the table.");
            })
            .catch(function (error) {
                console.log(error);
            })
        fetch("api/getTicket")
            .then(ticket => ticket.json())
            .then(res => {
                console.log(res.ticket)
                this.setState({ ticket: res.ticket })
            });
    };

    resetForm = () => {
        document.getElementById('createTicket').reset();
    };

    closeTicket = () => {

        let { ticket_id, ticketResolution, resolutionNotes } = this.state;

        axios.post("api/closeTicket/" + ticket_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            ticket_id: ticket_id,
            ticketResolution: ticketResolution,
            resolutionNotes: resolutionNotes
        })
            .then(function (response) {
                console.log(response);
                alert("Ticket successfully closed. Please refresh the table.");
            })
            .catch(function (error) {
                console.log(error);
            })
        fetch("api/getTicket")
            .then(ticket => ticket.json())
            .then(res => {
                console.log(res.ticket)
                this.setState({ ticket: res.ticket })
            });
    }

    // componentDidMount() {
    componentWillMount() {
        this.retrieveTickets();
    }

    render() {

        const {
            ticket,
            ticket_id,
            itemName,
            serialNumber,
            ticketResolution,
            ticketNotes,
            resolutionNotes
        } = this.state;

        const columns = [
            {
                Header: "",
                id: "row",
                maxWidth: 50,
                filterable: false,
                sortable: false,
                Cell: (row) => {
                    return <div>{row.index + 1}</div>;
                },
                style: { textAlign: "center" }
            },
            {
                Header: "Ticket ID",
                accessor: "ticket_id",
                style: { textAlign: "center" }
            },
            {
                Header: "Item Name",
                accessor: "itemName",
                style: { textAlign: "center" }
            },
            {
                Header: "Serial Number",
                accessor: "serialNumber",
                style: { textAlign: "center" }
            },
            {
                columns: [{
                    Header: 'Status',
                    accessor: 'ticketStatus',
                    getProps: (state, rowInfo) => {
                        if (rowInfo && rowInfo.row) {
                            return {
                                style: { textAlign: "center", color: rowInfo.row.ticketStatus === 'Open' ? 'green' : 'red' },
                            };
                        }
                        return {};
                    }
                }]
            },
            {
                Header: "Resolution",
                accessor: "ticketResolution",
                style: { textAlign: "center", fontStyle: 'italic', whiteSpace: 'unset' }
            },
            {
                id: 'ticketId',
                Header: "Date Opened",
                accessor: d => {
                    return Moment(d.ticketDate)
                        .local()
                        .format("MM-DD-YYYY")
                },
                style: { textAlign: "center" }
            },
            {
                // Header: "Expand",
                columns: [
                    {
                        expander: true,
                        Header: () => <strong>More</strong>,
                        width: 65,
                        Expander: ({ isExpanded, ...rest }) => (
                            <div>
                                {isExpanded ? (
                                    <span>&#x2299;</span>
                                ) : (
                                        <span>&#x2295;</span>
                                    )}
                            </div>
                        ),
                        style: {
                            cursor: "pointer",
                            fontSize: 25,
                            padding: "0",
                            // textAlign: "",
                            userSelect: "none",
                            color: "green"
                        }
                    }
                ]
            }
        ]

        return (
            <React.Fragment >
                <div className="component-container">
                    <div className="component-header">
                        <p className="header-content">Maintenance / Ticket Queue</p>
                        <div className="ticket-btn">
                            <FontAwesomeIcon icon="plus" className="mr-1 icon-style" data-toggle="modal" data-target="#newTicketModal" />
                            <a className="mr-4 cursor" data-toggle="modal" data-target="#newTicketModal">New Ticket</a>
                            <FontAwesomeIcon icon="times-circle" className="mr-1 icon-style" data-toggle="modal" data-target="#closeTicketModal" />
                            <a className="mr-3 cursor" data-toggle="modal" data-target="#closeTicketModal">Close Ticket</a>
                            <FontAwesomeIcon icon="redo" className="mr-1 icon-style" onClick={this.retrieveTickets} />
                            <a className="cursor" onClick={this.retrieveTickets}>Refresh</a>
                        </div>
                    </div>
                    <ReactTable
                        data={ticket}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value}
                        columns={columns}
                        // defaultSorting={{ ticketStatus: "Closed" }}
                        // getTdProps={(state, rowInfo, column) => {
                        //     return {
                        //         style: {
                        //             color: rowInfo && rowInfo.original.ticketStatus === "Closed" ? "green" : "red"
                        //         }
                        //     };
                        // }}
                        defaultPageSize={10}
                        className="-striped -highlight mt-2"
                        style={{
                            height: "700px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        SubComponent={(row) => {
                            return (
                                <React.Fragment>
                                    <span style={{ display: 'inline-block' }}>
                                        <div style={{ padding: "10px", width: '50%', maxWidth: '50%', display: 'inline-block' }}>
                                            Ticket Notes:
                                    <br />
                                            {row.original.ticketNotes}
                                        </div>
                                        <div style={{ padding: "10px", width: '50%', maxWidth: '50%', display: 'inline-block' }}>
                                            Resolution Notes:
                                <br />
                                            {row.original.resolutionNotes}
                                        </div>
                                    </span>
                                </React.Fragment>
                            )
                        }}
                    />
                    <div className="mt-3" style={{ textAlign: "center" }}>
                        <em>Tip: Hold shift when sorting to multi-sort!</em>
                    </div>

                    <div className="modal fade" id="newTicketModal" tabIndex="-1" role="dialog" aria-labelledby="newTicketTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="newTicketTitle">New Ticket</h5>
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
                                                id="inputTicket_Id"
                                                placeholder="eg: A123456"
                                                value={ticket_id}
                                                onChange={this.addTicket_Id} />
                                        </div>
                                        <div className="input-group input-group-md mt-4">
                                            <input
                                                type="text"
                                                className="form-control mr-3"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                id="inputItemName"
                                                placeholder="Item Name"
                                                value={itemName}
                                                onChange={this.addItemName} />
                                            <input
                                                className="form-control"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                type="text"
                                                id="inputSerialNumber"
                                                placeholder="Serial Number"
                                                value={serialNumber}
                                                onChange={this.addSerialNumber} />
                                        </div>
                                    </div>
                                    <div className="input-group input-group-md mt-4">
                                        <textarea
                                            className="form-control"
                                            aria-label="Large"
                                            aria-describedby="inputGroup-sizing-sm"
                                            type="text"
                                            id="item-text-area"
                                            placeholder="Ticket notes..."
                                            value={ticketNotes}
                                            onChange={this.addTicketNotes} />
                                    </div>
                                </div>
                                <div className="modal-footer mt-4">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.createTicket}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="closeTicketModal" tabIndex="-1" role="dialog" aria-labelledby="closeTicketTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="closeTicketTitle">Close Ticket</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="modal-lg">
                                        <div className="input-group input-group-md mt-4">
                                            <input
                                                type="text"
                                                className="form-control mr-3"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                id="inputItemName"
                                                placeholder="Ticket ID"
                                                value={ticket_id}
                                                onChange={this.addTicket_Id} />
                                            <input
                                                className="form-control"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                type="text"
                                                id="inputSerialNumber"
                                                placeholder="Serial Number"
                                                value={serialNumber}
                                                onChange={this.addSerialNumber} />
                                        </div>
                                        <div className="input-group input-group-md mt-4"></div>
                                        <input
                                            type="text"
                                            className="form-control mr-3"
                                            aria-label="Large"
                                            aria-describedby="inputGroup-sizing-sm"
                                            id="inputTicket_Id"
                                            placeholder="Ticket Resolution"
                                            value={ticketResolution}
                                            onChange={this.addTicketResolution} />
                                    </div>
                                    <div className="input-group input-group-md mt-4">
                                        <textarea
                                            type="text"
                                            className="form-control mr-3"
                                            aria-label="Large"
                                            aria-describedby="inputGroup-sizing-sm"
                                            id="inputTicket_Id"
                                            placeholder="Resolution notes..."
                                            value={resolutionNotes}
                                            onChange={this.addResolutionNotes} />
                                        <textarea
                                            className="form-control"
                                            aria-label="Large"
                                            aria-describedby="inputGroup-sizing-sm"
                                            type="text"
                                            id="item-text-area"
                                            placeholder="Ticket notes..."
                                            value={ticketNotes}
                                            onChange={this.addTicketNotes} />
                                    </div>
                                </div>
                                <div className="modal-footer mt-4">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.closeTicket}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
                <Footer />
            </React.Fragment >
        );
    }
}