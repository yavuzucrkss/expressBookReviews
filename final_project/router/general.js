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

//async wait usage
// public_users.get('/', async function (req, res) {
//     try {
//       const books = await getAllBooks(); // Call an asynchronous function to get all the books
//       return res.send(JSON.stringify(books, null, 4));
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send('Server Error');
//     }
//   });
  
//   // Asynchronous function to retrieve all books
//   async function getAllBooks() {
//     return new Promise((resolve, reject) => {
//       // Perform the necessary operations to fetch the books here
//       // For example, you can retrieve the books from a database or an external API
  
//       // Resolve the promise with the retrieved books when the operation is complete
//       resolve(books);
//     });
// }

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
        //Write your code here
        const isbn = parseInt(req.params.isbn)
        return res.send(books[isbn])
    });


// using Promise
// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = parseInt(req.params.isbn);

//     getBookByIsbn(isbn)
//         .then(book => {
//             return res.send(book);
//         })
//         .catch(error => {
//             console.error(error);
//             return res.status(500).send('Server Error');
//         });
// });

// function getBookByIsbn(isbn) {
//     return new Promise((resolve, reject) => {
//         if (isbn in books) {
//             resolve(books[isbn]);
//         } else {
//             reject(new Error('Kitap bulunamadı'));
//         }
//     });
// }


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author
    let authorBooks = Object.values(books).filter((book) => book.author === author);
    let booksbyAuthor = { "booksbyAuthor": authorBooks }
    return res.send(booksbyAuthor);
});

// using Promise
// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author;
//     getBooksByAuthor(author)
//         .then(books => {
//             const booksByAuthor = { "booksByAuthor": books };
//             return res.send(booksByAuthor);
//         })
//         .catch(error => {
//             console.error(error);
//             return res.status(500).send('Server Error');
//         });
// });

// function getBooksByAuthor(author) {
//     return new Promise((resolve, reject) => {
//         const authorBooks = Object.values(books).filter(book => book.author === author);
//         resolve(authorBooks);
//     });
// }


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn

    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    }
    else {
        return res.status(404).json({ message: "book not found" });
    }
});




// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title
    let titleBasedBooks = Object.values(books).filter((book) => book.title === title);
    return res.send(titleBasedBooks);
});


// using Promise
// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title;
//     getBooksByTitle(title)
//         .then(books => {
//             return res.send(books);
//         })
//         .catch(error => {
//             console.error(error);
//             return res.status(500).send('Server Error');
//         });
// });

// function getBooksByTitle(title) {
//     return new Promise((resolve, reject) => {
//         const titleBasedBooks = Object.values(books).filter(book => book.title === title);
//         resolve(titleBasedBooks);
//     });
// }

module.exports.general = public_users;
