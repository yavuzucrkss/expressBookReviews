const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here 
    const username = req.body.username
    const password = req.body.password

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password })
            return res.status(200).json({ message: "User registered!" })
        } else {
            return res.status(404).json({ message: "User already exists!" })
        }
    }
    else {
        return res.status(404).json({ message: "Unable to register user." });
    }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = parseInt(req.params.isbn)
    return res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author
    let authorBooks = Object.values(books).filter((book) => book.author === author);
    let booksbyAuthor = {"booksbyAuthor": authorBooks}
    return res.send(booksbyAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title
    let titleBasedBooks = Object.values(books).filter((book) => book.title === title);
    return res.send(titleBasedBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn

    if(books[isbn]){
        return res.send(books[isbn].reviews);
    }
    else{
        return res.status(404).json({message: "book not found"}); 
    }
});

module.exports.general = public_users;
