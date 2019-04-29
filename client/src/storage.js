// function for locally storing the user session key (token)
export function putInStorage(key, obj) {
    if (!key) {
        console.error("Key does not exist.");
    }
    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err);
    }
};

// function for retrieving the user session key (token)
export function getFromStorage(key) {
    if (!key) {
        return null;
    }

    try {
        const string = localStorage.getItem(key);
        if (string) {
            return JSON.parse(string); // return causes token in state to disappear
        }
        return null;
    } catch (err) {
        return null;
    }
};

// function to remove token
export function removeFromStorage(key) {
    if (!key) {
        return null;
    }

    try {
        localStorage.removeItem(key);
        return console.log('Token removed.')
    } catch (err) {
        return console.error(err);
    }
}