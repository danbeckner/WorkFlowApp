# WorkFlowApp
Capstone Project - Inventory and Ticketing Management System written with the MERN stack

## Getting Started
Clone the project to use.

## Usage
This repository does not include client or server secrets due to the sensitive information. These files are used for storing the MongoDB access information and Google Recaptcha information. 

The app will not be operational unless you use your mongodb collection url and credentials. 

The two ways to do this are:

### Option 1:

Create a file in the parent directory entitled __serverSecrets.js__ and import into the __server.js__ file

__serverSecrets.js__
```
// mongodb collection url
module.exports = "mongodb+srv://<username>:<password>@cluster0-jysrd.mongodb.net/test?retryWrites=true";
```
__server.js__
```
// define the variable dbRoute as the collection url
const dbRoute = require("./serverSecrets");
```

### Option 2:
Define a variable with the collection url in the server.js file.

__Note:__ It is not recommended to define secrets in the server file directly. It is recommended to define them in a file that can be included in the .gitignore file.

__server.js__
```
// defines the variable dbRoute as the collection url
const dbRoute = require("./serverSecrets")
```

## Contributing
This project is not open for contributions.

## License
[MIT](https://choosealicense.com/licenses/mit/)