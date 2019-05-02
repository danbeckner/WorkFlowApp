import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import Footer from './footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faRedo } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// add the font awesome icons into the library
library.add(faPlus, faTrashAlt, faRedo)

export default class ViewInventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showInventory: false,
            item: [],
            itemName: '',
            serialNumber: '',
            installDate: new Date(),
            warrantyStart: new Date(),
            warrantyEnd: new Date(),
            itemNotes: '',
            objItemToDelete: '',
            serialNumberToDelete: ''
        };

        this.addItemName = this.addItemName.bind(this);
        this.addSerialNumber = this.addSerialNumber.bind(this);
        this.addInstallDate = this.addInstallDate.bind(this);
        this.addWarrantyStart = this.addWarrantyStart.bind(this);
        this.addWarrantyEnd = this.addWarrantyEnd.bind(this);
        this.addItemNotes = this.addItemNotes.bind(this);

        this.addItem = this.addItem.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    };

    // function for retrieving the full inventory from the database
    retrieveInventory = () => {
        fetch("api/getInventory")
            .then(item => item.json())
            .then(res => {
                console.log(res.item)
                this.setState({ item: res.item })
            });
    };

    // event handlers for grabbing user input from the forms
    addItemName = (e) => {
        this.setState({ itemName: e.target.value });
    }

    addSerialNumber = (e) => {
        this.setState({ serialNumber: e.target.value });
    }

    addInstallDate = (date) => {
        this.setState({ installDate: date });
    }

    addWarrantyStart = (date) => {
        this.setState({ warrantyStart: date });
    }

    addWarrantyEnd = (date) => {
        this.setState({ warrantyEnd: date });
    }

    addItemNotes = (e) => {
        this.setState({ itemNotes: e.target.value });
    }

    addItemToDelete = (e) => {
        this.setState({ objItemToDelete: e.target.value })
    }

    addSerialNumberToDelete = (e) => {
        this.setState({ objItemToDelete: e.target.value })
    }

    // add item function for adding items to the database
    addItem = () => {
        const {
            itemName,
            serialNumber,
            installDate,
            warrantyStart,
            warrantyEnd,
            itemNotes
        } = this.state;

        // let installDate = new Date();

        // acios method for posting new item to the backend
        fetch("api/addItem", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // grab the user input from the state and send to backend
            body: JSON.stringify({
                itemName: itemName,
                serialNumber: serialNumber,
                installDate: installDate,
                warrantyStart: warrantyStart,
                warrantyEnd: warrantyEnd,
                itemNotes: itemNotes
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log('json', json);
                if (json.success) {
                    alert('Item added successfully. Please refresh the table.');
                    console.log("success", json.success)
                    return;
                } else {
                    alert(json.message);
                    return;
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    // function for reseting the form after submission
    resetForm = () => {
        document.getElementById('addItem').reset();
    };

    // function for deleting an item from the database
    deleteItem = () => {

        // grab the item from the state
        const { objItemToDelete } = this.state;

        // axios method for deleting item from the database using path variables
        axios.delete("api/deleteItem/" + objItemToDelete, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'applications/json'
            }
        }).then(console.log({
            itemName: objItemToDelete
        }))
            .then(function (response) {
                console.log(response);
                alert("Item deleted successfully. Please refresh the table.");
            })
            .catch(function (error) {
                console.log(error);
                alert("Something went wrong. If the issue persists please contact the system administrator.");
            })
    };

    // component lifecycle function for retrieving the inventory and setting state when the component is mounted
    componentWillMount() {
        this.retrieveInventory();
    }

    render() {

        // create the columns and headers for the table
        const columns = [
            {
                Header: "",
                id: "row",
                maxWidth: 50,
                filterable: false,
                Cell: (row) => {
                    return <div>{row.index + 1}</div>;
                }
            },
            {
                Header: "Item Name",
                accessor: "itemName"
            },
            {
                Header: "Serial Number",
                accessor: "serialNumber"
            },
            {
                id: 'installDate',
                Header: "Install Date",
                accessor: d => {
                    return Moment(d.installDate)
                        .local()
                        .format("MM-DD-YYYY")
                }
            },
            {
                id: 'warrantyStart',
                Header: "Warranty Start",
                accessor: d => {
                    return Moment(d.warrantyStart)
                        .local()
                        .format("MM-DD-YYYY")
                }
            },
            {
                id: 'warrantyEnd',
                Header: "Warranty End",
                accessor: d => {
                    return Moment(d.warrantyEnd)
                        .local()
                        .format("MM-DD-YYYY")
                }
            },
            {
                // Header: "Expand",
                columns: [
                    {
                        expander: true,
                        Header: () => <strong>Notes</strong>,
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
                            textAlign: "center",
                            userSelect: "none",
                            color: "green"
                        }
                    }
                ]
            }
        ]

        const {
            item,
            itemName,
            serialNumber,
            itemNotes,
            objItemToDelete,
            serialNumberToDelete
        } = this.state;

        return (
            <React.Fragment >
                <div className="component-container">
                    <div className="component-header">
                        <p className="header-content">Inventory / View All</p>
                        <div className="ticket-btn">
                            <FontAwesomeIcon
                                icon="plus"
                                className="mr-1 icon-style"
                                data-toggle="modal"
                                data-target="#addItemModal" />
                            <a className="mr-4 cursor" data-toggle="modal" data-target="#addItemModal">Add Item</a>
                            <FontAwesomeIcon
                                icon="trash-alt"
                                className="mr-1 icon-style"
                                data-toggle="modal"
                                data-target="#deleteItemModal" />
                            <a className="mr-3 cursor" data-toggle="modal" data-target="#deleteItemModal" >Delete Item</a>
                            <FontAwesomeIcon
                                icon="redo"
                                className="mr-1 icon-style"
                                onClick={this.retrieveInventory} />
                            <a className="cursor" onClick={this.retrieveInventory}>Refresh</a>
                        </div>
                    </div>
                    <ReactTable
                        data={item}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value}
                        columns={columns}
                        defaultPageSize={10}
                        className="-striped -highlight mt-2 center"
                        style={{
                            height: "700px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        SubComponent={(row) => {
                            return (
                                <div style={{ padding: "20px", whiteSpace: 'unset' }}>
                                    Item Notes:
                                    <br />
                                    {row.original.itemNotes}
                                </div>
                            )
                        }}
                    />
                    <div className="mt-3" style={{ textAlign: "center" }}>
                        <em>Tip: Hold shift when sorting to multi-sort!</em>
                    </div>

                    {/* Add item modal */}
                    <div className="modal fade" id="addItemModal" tabIndex="-1" role="dialog" aria-labelledby="addItemTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="addItemTitle">Add Item</h5>
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
                                        <div className="input-group input-group-md mt-4">
                                            <DatePicker
                                                type="text"
                                                className="form-control mr-3"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                id="inputInstallDate"
                                                placeholder="Install Date"
                                                selected={this.state.installDate}
                                                onChange={this.addInstallDate} />
                                            <DatePicker
                                                className="form-control"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                type="text"
                                                id="inputWarrantyStart"
                                                placeholder="Warranty Start"
                                                selected={this.state.warrantyStart}
                                                onChange={this.addWarrantyStart} />
                                        </div>
                                        <div className="input-group input-group-md mt-4">
                                            <DatePicker
                                                type="text"
                                                className="form-control"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                id="inputWarrantyEnd"
                                                placeholder="Warranty End"
                                                selected={this.state.warrantyEnd}
                                                onChange={this.addWarrantyEnd} />
                                        </div>
                                        <div className="input-group input-group-md mt-4">
                                            <textarea
                                                className="form-control"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                type="text"
                                                id="item-text-area"
                                                placeholder="Item notes..."
                                                value={itemNotes}
                                                onChange={this.addItemNotes} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer mt-4">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.addItem}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delete item modal */}
                    <div className="modal fade" id="deleteItemModal" tabIndex="-1" role="dialog" aria-labelledby="deleteItemTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="deleteItemTitle">Delete Item</h5>
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
                                                id="inputItemName"
                                                placeholder="Item Name"
                                                value={objItemToDelete}
                                                onChange={this.addItemToDelete} />
                                            <input
                                                className="form-control"
                                                aria-label="Large"
                                                aria-describedby="inputGroup-sizing-sm"
                                                type="text"
                                                id="inputSerialNumber"
                                                placeholder="Serial Number"
                                                value={serialNumberToDelete}
                                                onChange={this.addSerialNumberToDelete} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer mt-4">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.deleteItem}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment >
        );
    }
}