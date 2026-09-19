const defaultBooks = [
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

let books = JSON.parse(localStorage.getItem("bookxchangeBooks")) || defaultBooks;

function saveBooks() {
    localStorage.setItem("bookxchangeBooks", JSON.stringify(books));
}

let editingBookId = null;

const bookList = document.getElementById("book-list");

function displayBooks() {
    const bookCount = document.getElementById("book-count");
    if (bookCount) {
        const count = books.length;

        bookCount.textContent =
            count === 1
                ? "1 book"
                : `${count} books`;

    }
    if (!bookList) return;

    bookList.innerHTML = "";

    books.filter(function (book) {
        return book.status === "available";
    }).forEach(function (book, index) {
        const bookElement = document.createElement("article");

        bookElement.classList.add("shelf-book");

        const coverClass = `cover-${index + 1}`;

        bookElement.innerHTML = `
            <div class="book-cover ${book.image ? "" : coverClass}">
                ${book.image
                ? `<img src="${book.image}" alt="${book.title}">`
                : `<span>${book.title}</span>`
            }
            </div>

            <div class="shelf-book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>

                <span class="status">
                    ${book.status === "available"
                ? "Available for exchange"
                : "Keeping"
            }
                </span>

                <div class="book-actions">

    <button
        class="edit-book"
        data-id="${book.id}"
    >
        Edit
    </button>

    <button
        class="delete-book"
        data-id="${book.id}"
    >
        Delete
    </button>

    <button
        class="keep-book"
        data-id="${book.id}"
    >
        Keep
    </button>

</div>
            </div>
        `;

        bookList.appendChild(bookElement);
    });
}

displayBooks();

function displayLibrary() {
    const libraryList = document.getElementById("library-list");
    const libraryCount = document.getElementById("library-count");

    if (!libraryList) return;

    libraryList.innerHTML = "";

    const keptBooks = books.filter(function (book) {
        return book.status === "keeping";
    });

    if (libraryCount) {
        libraryCount.textContent =
            keptBooks.length === 1
                ? "1 book"
                : `${keptBooks.length} books`;
    }

    if (keptBooks.length === 0) {
        libraryList.innerHTML = `
            <div class="empty-library">
                <p>You haven't kept any books yet.</p>
            </div>
        `;

        return;
    }

    keptBooks.forEach(function (book, index) {

        const libraryBook = document.createElement("div");

        libraryBook.classList.add("library-book");

        libraryBook.innerHTML = `
            <span>${String(index + 1).padStart(2, "0")}</span>

            <div>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            </div>

            <button
                class="make-available"
                data-id="${book.id}"
            >
                Make available
            </button>
        `;

        libraryList.appendChild(libraryBook);
    });
}

displayLibrary();

if (bookList) {
    bookList.addEventListener("click", function (event) {
        if (event.target.classList.contains("keep-book")) {

    const bookId = Number(event.target.dataset.id);

    const book = books.find(function(book) {
        return book.id === bookId;
    });

    if (!book) return;

    book.status = "keeping";

    saveBooks();

    displayBooks();
    displayLibrary();
}
        const libraryList = document.getElementById("library-list");
        if (libraryList) {
            libraryList.addEventListener("click", function (event) {
                if (event.target.classList.contains("make-available")) {
                    const bookId = Number(event.target.dataset.id);
                    const book = books.find(function (book) {
                        return book.id === bookId;
                    });
                    if (!book) return;
                    book.status = "available";
                    saveBooks();
                    displayBooks();
                    displayLibrary();
                }
            });
        }

        if (event.target.classList.contains("edit-book")) {
            const bookId = Number(event.target.dataset.id);
            const book = books.find(function (book) {
                return book.id === bookId;
            });

            if (!book) return;

            editingBookId = bookId;

            document.getElementById("book-title").value = book.title;
            document.getElementById("book-author").value = book.author;
            document.getElementById("book-condition").value = book.condition;
            document.getElementById("book-description").value = book.description;

            document.getElementById("book-form-submit").textContent = "Save changes";

            addBookSection.classList.add("is-open");
        }

        if (event.target.classList.contains("delete-book")) {

            const bookId = Number(event.target.dataset.id);

            const bookIndex = books.findIndex(function (book) {
                return book.id === bookId;
            });

            if (bookIndex !== -1) {
                books.splice(bookIndex, 1);
                saveBooks();
                displayBooks();
            }
        }

    });
}

const addBookButton = document.getElementById("add-book-button");
const addBookSection = document.getElementById("add-book-section");

if (addBookButton && addBookSection) {
    addBookButton.addEventListener("click", function () {
        addBookSection.classList.toggle("is-open");
    });
}

const closeAddBook = document.getElementById("close-add-book");

if (closeAddBook && addBookSection) {
    closeAddBook.addEventListener("click", function () {
        addBookSection.classList.remove("is-open");
    });
}

if (addBookSection) {
    addBookSection.addEventListener("click", function (event) {
        if (event.target === addBookSection) {
            addBookSection.classList.remove("is-open");
        }
    });
}

const addBookForm = document.getElementById("add-book-form");

if (addBookForm) {
    addBookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const condition = document.getElementById("book-condition").value;
        const description = document.getElementById("book-description").value;

        const imageInput = document.getElementById("book-image");
        const imageFile = imageInput.files[0];

        if (editingBookId !== null) {
            const book = books.find(function (book) {
                return book.id === editingBookId;
            });
            if (book) {
                book.title = title;
                book.author = author;
                book.condition = condition;
                book.description = description;
            }
            editingBookId = null;
            saveBooks();
            displayBooks();
            addBookForm.reset();
            document.getElementById("book-form-submit").textContent = "Add book";
            addBookSection.classList.remove("is-open");
            return;
        }
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

            reader.onload = function () {
                newBook.image = reader.result;

                books.push(newBook);
                saveBooks();

                displayBooks();

                addBookForm.reset();
                addBookSection.classList.remove("is-open");
            };

            reader.readAsDataURL(imageFile);
        } else {
            books.push(newBook);
            saveBooks();

            displayBooks();

            addBookForm.reset();
            addBookSection.classList.remove("is-open");
        }
    });
}

console.log(books);