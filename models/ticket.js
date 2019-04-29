const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticket_id: {
        type: String,
        default: ''
    },
    itemName: {
        type: String,
        default: ''
    },
    serialNumber: {
        type: String,
        default: ''
    },
    ticketStatus: {
        type: String,
        default: 'Open'
    },
    ticketResolution: {
        type: String,
        default: ''
    },
    ticketDate: {
        type: Date,
        default: Date.now()
    },
    ticketNotes: {
        type: String,
        default: ''
    },
    resolutionNotes: {
        type: String,
        default: 'N/A'
    },
    isResolved: {
        type: Boolean,
        default: false
    }
});

mongoose.set('bufferCommands', false);

module.exports = mongoose.model('Ticket', TicketSchema);