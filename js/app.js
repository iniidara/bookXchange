const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        condition: "Good",
        description: "A classic novel about wealth, love and the American Dream.",
        image: "",
        status: "available",
        ownerId: 1
    },
    {
        id: 2,
        title: "Norwegian Wood",
        author: "Haruki Murakami",
        condition: "Like New",
        description: "A quiet story about memory, love and growing up.",
        image: "",
        status: "available",
        ownerId: 1
    },
    {
        id: 3,
        title: "The Secret History",
        author: "Donna Tartt",
        condition: "Good",
        description: "A literary mystery about a group of college students.",
        image: "",
        status: "available",
        ownerId: 1
    }
];

const bookList = document.getElementById("book-list");

function displayBooks() {
    if (!bookList) return;

    bookList.innerHTML = "";

    books.forEach(function(book, index) {
        const bookElement = document.createElement("article");

        bookElement.classList.add("shelf-book");

        const coverClass = `cover-${index + 1}`;

        bookElement.innerHTML = `
            <div class="book-cover ${book.image ? "" : coverClass}">
                ${
                    book.image
                        ? `<img src="${book.image}" alt="${book.title}">`
                        : `<span>${book.title}</span>`
                }
            </div>

            <div class="shelf-book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>

                <span class="status">
                    ${
                        book.status === "available"
                            ? "Available for exchange"
                            : "Keeping"
                    }
                </span>

                <div>
                 <button class="edit-book" data-id="${book.id}">Edit</button>
                 <button class="delete-book" data-id="${book.id}">Delete</button>
                </div>
            </div>
        `;

        bookList.appendChild(bookElement);
    });
}

displayBooks();

if (bookList) {
    bookList.addEventListener("click", function(event) {

        if (event.target.classList.contains("delete-book")) {

            const bookId = Number(event.target.dataset.id);

            const bookIndex = books.findIndex(function(book) {
                return book.id === bookId;
            });

            if (bookIndex !== -1) {
                books.splice(bookIndex, 1);
                displayBooks();
            }
        }

    });
}

const addBookButton = document.getElementById("add-book-button");
const addBookSection = document.getElementById("add-book-section");

if (addBookButton && addBookSection) {
    addBookButton.addEventListener("click", function() {
        addBookSection.classList.toggle("is-open");
    });
}

const closeAddBook = document.getElementById("close-add-book");

if (closeAddBook && addBookSection) {
    closeAddBook.addEventListener("click", function() {
        addBookSection.classList.remove("is-open");
    });
}

if (addBookSection) {
    addBookSection.addEventListener("click", function(event) {
        if (event.target === addBookSection) {
            addBookSection.classList.remove("is-open");
        }
    });
}

const addBookForm = document.getElementById("add-book-form");

if (addBookForm) {
    addBookForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const condition = document.getElementById("book-condition").value;
        const description = document.getElementById("book-description").value;

        const imageInput = document.getElementById("book-image");
        const imageFile = imageInput.files[0];

        const newBook = {
            id: Date.now(),
            title: title,
            author: author,
            condition: condition,
            description: description,
            image: "",
            status: "available",
            ownerId: 1
        };

        if (imageFile) {
            const reader = new FileReader();

            reader.onload = function() {
                newBook.image = reader.result;

                books.push(newBook);

                displayBooks();

                addBookForm.reset();
                addBookSection.hidden = true;
            };

            reader.readAsDataURL(imageFile);
        } else {
            books.push(newBook);

            displayBooks();

            addBookForm.reset();
            addBookSection.classList.remove("is-open");
        }
    });
}

console.log(books);