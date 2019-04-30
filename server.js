/*
This file contains the express and express router tools. 
The mongoose wrapper for conducting mongodb operations. 
The middleware for navigating CORS.
It includes the database schemas and all API endpoints.
In future releases the API endpoints may move to a routes folder.
*/

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const dbRoute = require("./serverSecrets");

// import the database schemas
const User = require("./models/user");
const UserSession = require("./models/userSession");
const Item = require("./models/item");
const Ticket = require("./models/ticket");

// specify port to run backend services
const PORT = process.env.PORT || 3001;

// create appvariable for serving data with express
const app = express();

// create variable for using express.router
const router = express.Router();


/*
const dbRoute is the collection path and is imported from the secrets.js file 
secrets.js is included in gitignore file and not pushed to the git repo 
due to the sensitive nature of the information
the dbRoute is the mongodb connection string and can be retrieved from your collection settings
*/


// connect backend to database using mongoose middleware
mongoose.connect(
    dbRoute,
    {
        useNewUrlParser: true
    }
);

// set mongodb connection to variable
let db = mongoose.connection;

// inform developer of successful database connection
db.once("open", () => console.log("You have a successful db connection."));

// enable ALL CORS requests
app.use(cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));

//*** work around for CORS/CORB but should be solved by CORS library and app.use(cors()) ***//
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//*** sign up api ***/
router.post("/signup", (req, res, next) => {
    const { body } = req;
    const {
        firstName,
        lastName,
        password
    } = body;

    let { email, username } = body;

    // validate user input
    if (!firstName) {
        return res.send({
            success: false,
            message: 'Error: First name is required.'
        });
    } if (!lastName) {
        return res.send({
            success: false,
            message: 'Error: Last name is required.'
        });
    } if (!email) {
        return res.send({
            success: false,
            message: 'Error: Email is required.'
        });
    } if (!username) {
        return res.send({
            success: false,
            message: 'Error: Username is required.'
        });
    } if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password is required.'
        });
    }

    // if the user inputs any uppercase characters change to lower case and trim any unnecessary spaces
    email = body.email.toLowerCase();
    email = body.email.trim();

    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                message: 'Error: Account already exist.'
            });
        } else {

            // create a new user using the schema created
            let newUser = new User();

            // add properties to the document in the database
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.email = email;
            newUser.username = username;
            newUser.password = newUser.generateHash(password);

            // save the user in the database
            newUser.save(err => {
                if (err) {
                    res.json({
                        success: false,
                        error: err
                    });
                }
                res.json({
                    success: true,
                    message: 'Sign up successful'
                });
            })
        }
    })
});

/*** sign in api ***/
router.post("/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email, username } = body;

    // validate the user input in case the frontend missed anything
    if (!username) {
        return res.send({
            success: false,
            message: 'Error: Username is required.'
        });
        // } if (!email) {
        //     return res.send({
        //         success: false,
        //         message: 'Error: Email is required.'
        //     });
    } if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password is required.'
        })
    }

    // if the user inputs any uppercase characters change to lower case and trim any unnecessary spaces
    email = body.email.toLowerCase();
    email = body.email.trim();

    // check the database for email existance to validate the user logins
    User.find({ username: username }, (err, users) => {
        console.log(users.username);
        if (err) {
            console.log('error:'.err);
            return res.send({
                success: false,
                message: 'Error: server error'
            });
        } if (users.length != 1) {
            return res.send({
                success: false,
                message: 'Error: User does not exist.'
            })
        }

        // validate password
        const user = users[0];
        // if (!user.validPassword(password)) {
        //     return res.send({
        //         success: false,
        //         message: 'Error: Invalid'
        //     });
        // }

        // create the user session using the userSession schema and tie it to the user_id from the userSchemas
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.userFirstName = user.firstName;

        // save the user session in the database
        userSession.save((err, doc) => {
            if (err) {
                res.json({
                    success: false,
                    error: err
                });
            }
            res.json({
                success: true,
                message: 'Sign in success',
                token: doc._id
            });
        });
    });
});

/*** Validate api ***/
//validates the existance of a token when the component mounts. If token exists the user will be logged into session
router.get("/validate", (req, res, next) => {
    // const { query } = req;
    const { token } = req;

    // mongoose query for finding the token in the database and checks to see if it is still valid
    UserSession.find({
        userId: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
            console.log(err);
            return res.json({
                success: false,
                error: 'Error: System encountered an error.'
            });
        }
        else if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid token or token does not exist.'
            });
        }
        else {
            res.send({
                success: true,
                message: 'Token validated.'
            });
        }
    });
});

/*** log out api  ***/
router.get("/logout", (req, res, next) => {
    const { query } = req;
    const { token } = query;
    //?token=test

    // verify token's existence and set it to deleted
    UserSession.findOneAndUpdate({
        userId: token,
        isDeleted: false
    }, {
            // change the isDeleted to true for the userSession for the creation of a new session at next login
            $set: {
                isDeleted: true
            }
        }, null, (err) => {
            if (err) {
                return res.json({
                    success: false,
                    error: err
                });
            }
            res.json({
                success: true,
                message: 'Session ended. Logout successful.'
            });
        }
    );
});


/*** Dashboard APIs ***/
// GET total item count
router.get("/getItemCount", (req, res, next) => {
    const { query } = req;

    Item.countDocuments(query).exec((err, count) => {
        if (err) {
            return res.json({
                success: false,
                error: err
            })
        }
        res.json({ count: count });
    })
})

// GET total ticket count
router.get("/getTicketCount", (req, res, next) => {
    const { query } = req;

    Ticket.countDocuments({ isResolved: true }).exec((err, count) => {
        if (err) {
            return res.json({
                success: false,
                error: err
            })
        }
        res.json({ count: count });
    })
})

// GET user info
router.get("/getSessionInfo/:_id?", (req, res, next) => {
    let query = UserSession.find({ _id: req.params._id });

    // mongoose query for finding an individual item
    query.exec(function (err, session) {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, session: session })
    })
})


/*** item api ***/
// CREATE method
// Add item into the database
router.post("/addItem", (req, res, next) => {
    const { body } = req;

    let {
        itemName,
        serialNumber,
        installDate,
        warrantyStart,
        warrantyEnd,
        itemNotes
    } = body

    // validate user input for item if the frontend missed anything
    if (!itemName) {
        return res.send({
            success: false,
            message: 'Error: Item name is required.'
        });
    } if (!serialNumber) {
        return res.send({
            success: false,
            message: 'Error: Serial number is required.'
        });
    }

    // create a new item using the item schema
    let newItem = new Item();

    // grabbing the item state from the request body and setting in the item schema
    newItem.itemName = itemName;
    newItem.serialNumber = serialNumber;
    newItem.installDate = installDate;
    newItem.warrantyStart = warrantyStart;
    newItem.warrantyEnd = warrantyEnd;
    newItem.itemNotes = itemNotes;

    // mongoose method for saving the item in mongodb
    newItem.save(err => {
        if (err) return res.json({
            success: false,
            error: err
        });
        res.json({
            success: true,
            message: 'Item added.'
        });
    })
})

// GET individual item
router.get("/getItem/:itemName?", (req, res, next) => {

    let query = Item.find({ itemName: req.params.itemName });

    // mongoose query for finding an individual item
    query.exec(function (err, item) {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, item: item })
    })
})

// UPDATE item in database
router.post("/updateItem/:itemName?", (req, res, next) => {
    const { body } = req;
    let { serialNumber, update } = body;

    // mongoose query for finding and updating an item
    Item.findOneAndUpdate(serialNumber, update, err => {
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        } else {
            return res.json({
                success: true,
                message: 'Item updated.'
            });
        }
    })
})


router.delete("/deleteItem/:itemName?", (req, res, next) => {
    // const { body } = req;
    // let { itemName } = body;

    let query = Item.findOneAndDelete({ itemName: req.params.itemName });

    // mongoose query for finding and deleting an item
    query.exec(function (err, item) {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, item: item })
    })
})

// GET all items in inventory
// GET item from database
router.get("/getInventory", (req, res, next) => {

    // grab all items from mongodb
    Item.find((err, item) => {
        console.log(res.json)
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, item: item })
    })
})

/*** Ticket API ***/
// CREATE ticket
router.post("/createTicket", (req, res, next) => {

    const { body } = req;

    let {
        ticket_id,
        itemName,
        serialNumber,
        ticketNotes
    } = body;

    // validate user input if frontend missed anything 
    if (!ticket_id) {
        return res.send({
            success: false,
            message: 'Error: Ticket ID is required.'
        });
    }
    if (!itemName) {
        return res.send({
            success: false,
            message: 'Error: Item name is required.'
        });
    } if (!serialNumber) {
        return res.send({
            success: false,
            message: 'Error: Serial number is required.'
        });
    } if (!ticketNotes) {
        return res.send({
            success: false,
            message: 'Error: Ticket notes are required.'
        });
    }


    // create new ticket using the ticket schema
    let newTicket = new Ticket();

    // add ticket information from the request body and set in the ticket schema
    newTicket.ticket_id = ticket_id;
    newTicket.itemName = itemName;
    newTicket.serialNumber = serialNumber;
    newTicket.ticketNotes = ticketNotes;

    // mongoose method for saving a ticket
    newTicket.save(err => {
        if (err) return res.json({
            success: false,
            error: err
        });
        res.json({
            success: true,
            message: 'Ticket created.'
        });
    })
})

// GET all ticket information
router.get("/getTicket", (req, res, next) => {

    // mongoose request for finding an item mongodb
    Ticket.find((err, ticket) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, ticket: ticket })
    });
})

// UPDATE ticket information
router.post("/updateTicket/:ticket_id?", (req, res, next) => {
    const { body } = req;
    let { ticket_id, update } = body;

    // mongoose request for updating the ticket
    Ticket.findOneAndUpdate(ticket_id, update, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    })
});

// CLOSE ticket
router.post("/closeTicket/:ticket_id?", (req, res, next) => {
    const { body } = req;
    let { ticket_id, ticketResolution, resolutionNotes, } = body;

    // mongoose request for updating the ticket
    Ticket.findOneAndUpdate({ ticket_id },
        {
            $set: {
                isResolved: true,
                ticketResolution,
                ticketStatus: "Closed",
                resolutionNotes
            }
        },
        { multi: true }, err => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true, message: "Ticket closed." });
        })
})

// append /api for http requests
app.use("/api", router);

const path = require('path');
// production code for serving the application postbuild
if (process.env.NODE_ENV === 'production') {

    // Exprees will serve up production assets
    app.use(express.static('client/build'));

    // Express serve up index.html file if it doesn't recognize route
    // app.get('*', (req, res) => {
    //     res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
    // });

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// run backend on PORT
app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});