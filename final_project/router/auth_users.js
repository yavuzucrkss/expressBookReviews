const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in!" })
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfuly logged in!")
    }
    else {
        res.status(208).json({ message: "Invalid login" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = parseInt(req.params.isbn)
    let review = {
        "reviewer": req.user.data,
        "review": req.query.review
    }
    if (books.hasOwnProperty(isbn)) {
        const reviewer = req.user.data;
        books[isbn].reviews[reviewer] = review;
        return res.status(200).json({ message: `Review has been successfully added to book number ${isbn} isbn` })
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = parseInt(req.params.isbn)
    reviewer = req.user.data
    if (books.hasOwnProperty(isbn)) {
        delete books[isbn].reviews[reviewer]
        return res.status(200).json({ message: `Review has been successfully deleted from book number ${isbn} isbn` })
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
