const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        default: ''
    },
    serialNumber: {
        type: String,
        default: ''
    },
    installDate: {
        type: Date,
        default: ''
    },
    warrantyStart: {
        type: Date,
        default: ''
    },
    warrantyEnd: {
        type: Date,
        default: ''
    },
    selfInstall: {
        type: Boolean,
        default: false
    },
    itemNotes: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    }
});

mongoose.set('bufferCommands', false);

module.exports = mongoose.model('Item', ItemSchema);