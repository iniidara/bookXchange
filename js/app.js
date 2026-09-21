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


// =========================
// BOOK DATA
// =========================

let books =
    JSON.parse(localStorage.getItem("bookxchangeBooks")) ||
    defaultBooks;

function saveBooks() {
    localStorage.setItem(
        "bookxchangeBooks",
        JSON.stringify(books)
    );
}

let editingBookId = null;


// =========================
// ELEMENTS
// =========================

const bookList = document.getElementById("book-list");
const libraryList = document.getElementById("library-list");

const addBookButton =
    document.getElementById("add-book-button");

const addBookSection =
    document.getElementById("add-book-section");

const closeAddBook =
    document.getElementById("close-add-book");

const addBookForm =
    document.getElementById("add-book-form");


// =========================
// DISPLAY AVAILABLE BOOKS
// =========================

function displayBooks() {

    const bookCount =
        document.getElementById("book-count");

    const availableBooks =
        books.filter(function (book) {
            return book.status === "available";
        });


    // Update available book count

    if (bookCount) {

        const count = availableBooks.length;

        bookCount.textContent =
            count === 1
                ? "1 book"
                : `${count} books`;
    }


    if (!bookList) return;


    // Clear existing books

    bookList.innerHTML = "";


    // Empty state

    if (availableBooks.length === 0) {

        bookList.innerHTML = `
            <div class="empty-shelf">

                <p>
                    There are no books available for exchange right now.
                </p>

                <button
                    type="button"
                    class="empty-shelf-link"
                    id="empty-add-book"
                >
                    Add a book
                </button>

            </div>
        `;

        return;
    }


    // Display available books

    availableBooks.forEach(function (book, index) {

        const bookElement =
            document.createElement("article");

        bookElement.classList.add("shelf-book");


        const coverClass =
            `cover-${index + 1}`;


        bookElement.innerHTML = `
            <div class="book-cover ${book.image ? "" : coverClass}">

                ${
                    book.image
                        ? `<img
                                src="${book.image}"
                                alt="${book.title}"
                           >`
                        : `<span>${book.title}</span>`
                }

            </div>


            <div class="shelf-book-info">

                <h3>${book.title}</h3>

                <p>${book.author}</p>

                <span class="status">
                    Available for exchange
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


// =========================
// DISPLAY MY LIBRARY
// =========================

function displayLibrary() {

    const libraryCount =
        document.getElementById("library-count");


    if (!libraryList) return;


    libraryList.innerHTML = "";


    const keptBooks =
        books.filter(function (book) {
            return book.status === "keeping";
        });


    // Update library count

    if (libraryCount) {

        libraryCount.textContent =
            keptBooks.length === 1
                ? "1 book"
                : `${keptBooks.length} books`;
    }


    // Empty library state

    if (keptBooks.length === 0) {

        libraryList.innerHTML = `
            <div class="empty-library">

                <p>
                    You haven't kept any books yet.
                </p>

            </div>
        `;

        return;
    }


    // Display kept books

    keptBooks.forEach(function (book, index) {

        const libraryBook =
            document.createElement("div");

        libraryBook.classList.add("library-book");


        libraryBook.innerHTML = `
            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>


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


// =========================
// INITIAL DISPLAY
// =========================

displayBooks();
displayLibrary();


// =========================
// AVAILABLE BOOK ACTIONS
// =========================

if (bookList) {

    bookList.addEventListener("click", function (event) {


        // -------------------------
        // KEEP BOOK
        // -------------------------

        if (
            event.target.classList.contains("keep-book")
        ) {

            const bookId =
                Number(event.target.dataset.id);


            const book =
                books.find(function (book) {
                    return book.id === bookId;
                });


            if (!book) return;


            book.status = "keeping";


            saveBooks();

            displayBooks();
            displayLibrary();

            return;
        }


        // -------------------------
        // EDIT BOOK
        // -------------------------

        if (
            event.target.classList.contains("edit-book")
        ) {

            const bookId =
                Number(event.target.dataset.id);


            const book =
                books.find(function (book) {
                    return book.id === bookId;
                });


            if (!book) return;


            editingBookId = bookId;


            document.getElementById("book-title").value =
                book.title;


            document.getElementById("book-author").value =
                book.author;


            document.getElementById("book-condition").value =
                book.condition;


            document.getElementById("book-description").value =
                book.description;


            document.getElementById(
                "book-form-submit"
            ).textContent = "Save changes";


            addBookSection.classList.add("is-open");


            return;
        }


        // -------------------------
        // DELETE BOOK
        // -------------------------

        if (
            event.target.classList.contains("delete-book")
        ) {

            const bookId =
                Number(event.target.dataset.id);


            const bookIndex =
                books.findIndex(function (book) {
                    return book.id === bookId;
                });


            if (bookIndex !== -1) {

                books.splice(bookIndex, 1);

                saveBooks();

                displayBooks();
                displayLibrary();
            }


            return;
        }

    });
}


// =========================
// MY LIBRARY ACTIONS
// =========================

if (libraryList) {

    libraryList.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList.contains(
                    "make-available"
                )
            ) {

                const bookId =
                    Number(event.target.dataset.id);


                const book =
                    books.find(function (book) {
                        return book.id === bookId;
                    });


                if (!book) return;


                book.status = "available";


                saveBooks();

                displayBooks();
                displayLibrary();
            }

        }
    );
}


// =========================
// OPEN ADD BOOK MODAL
// =========================

if (addBookButton && addBookSection) {

    addBookButton.addEventListener(
        "click",
        function () {

            // Make sure this is a fresh Add form

            editingBookId = null;


            if (addBookForm) {
                addBookForm.reset();
            }


            const submitButton =
                document.getElementById(
                    "book-form-submit"
                );


            if (submitButton) {
                submitButton.textContent = "Add book";
            }


            addBookSection.classList.toggle(
                "is-open"
            );
        }
    );
}


// =========================
// EMPTY SHELF → ADD BOOK
// =========================

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.id === "empty-add-book"
        ) {

            editingBookId = null;


            if (addBookForm) {
                addBookForm.reset();
            }


            const submitButton =
                document.getElementById(
                    "book-form-submit"
                );


            if (submitButton) {
                submitButton.textContent = "Add book";
            }


            if (addBookSection) {
                addBookSection.classList.add(
                    "is-open"
                );
            }
        }

    }
);


// =========================
// CLOSE MODAL
// =========================

if (closeAddBook && addBookSection) {

    closeAddBook.addEventListener(
        "click",
        function () {

            addBookSection.classList.remove(
                "is-open"
            );

        }
    );
}


// =========================
// CLICK OUTSIDE MODAL
// =========================

if (addBookSection) {

    addBookSection.addEventListener(
        "click",
        function (event) {

            if (
                event.target === addBookSection
            ) {

                addBookSection.classList.remove(
                    "is-open"
                );
            }

        }
    );
}


// =========================
// ADD / EDIT BOOK FORM
// =========================

if (addBookForm) {

    addBookForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("book-title")
                    .value
                    .trim();


            const author =
                document
                    .getElementById("book-author")
                    .value
                    .trim();


            const condition =
                document
                    .getElementById("book-condition")
                    .value;


            const description =
                document
                    .getElementById("book-description")
                    .value
                    .trim();


            const imageInput =
                document.getElementById("book-image");


            const imageFile =
                imageInput
                    ? imageInput.files[0]
                    : null;


            // =========================
            // EDIT EXISTING BOOK
            // =========================

            if (editingBookId !== null) {

                const book =
                    books.find(function (book) {
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
                displayLibrary();


                addBookForm.reset();


                document.getElementById(
                    "book-form-submit"
                ).textContent = "Add book";


                addBookSection.classList.remove(
                    "is-open"
                );


                return;
            }


            // =========================
            // ADD NEW BOOK
            // =========================

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


            // =========================
            // WITH IMAGE
            // =========================

            if (imageFile) {

                const reader =
                    new FileReader();


                reader.onload = function () {

                    newBook.image =
                        reader.result;


                    books.push(newBook);


                    saveBooks();


                    displayBooks();
                    displayLibrary();


                    addBookForm.reset();


                    addBookSection.classList.remove(
                        "is-open"
                    );
                };


                reader.readAsDataURL(
                    imageFile
                );

            }


            // =========================
            // WITHOUT IMAGE
            // =========================

            else {

                books.push(newBook);


                saveBooks();


                displayBooks();
                displayLibrary();


                addBookForm.reset();


                addBookSection.classList.remove(
                    "is-open"
                );
            }

        }
    );
}

/* =========================
   DISCOVER
========================= */

const discoverBookList =
    document.getElementById("discover-book-list");

const discoverCount =
    document.getElementById("discover-count");

const bookSearch =
    document.getElementById("book-search");

const filterButtons =
    document.querySelectorAll(".filter-button");


function displayDiscoverBooks(
    searchTerm = "",
    category = "all"
) {
    if (!discoverBookList) return;

    discoverBookList.innerHTML = "";

    const availableBooks = books.filter(function (book) {
        return book.status === "available";
    });

    const filteredBooks = availableBooks.filter(function (book) {

        const matchesSearch =
            book.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            book.author
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesSearch;
    });


    if (discoverCount) {
        const count = filteredBooks.length;

        discoverCount.textContent =
            count === 1
                ? "1 book"
                : `${count} books`;
    }


    if (filteredBooks.length === 0) {
        discoverBookList.innerHTML = `
            <div class="discover-empty">
                <p>
                    No books match your search.
                </p>
            </div>
        `;

        return;
    }


    filteredBooks.forEach(function (book, index) {

        const bookElement =
            document.createElement("article");

        bookElement.classList.add(
            "discover-book"
        );


        const coverClass =
            `cover-${index + 1}`;


        bookElement.innerHTML = `

            <div class="
                discover-book-cover
                ${book.image ? "" : "placeholder"}
                ${book.image ? "" : coverClass}
            ">

                ${
                    book.image
                        ? `
                            <img
                                src="${book.image}"
                                alt="${book.title}"
                            >
                        `
                        : `
                            <span>
                                ${book.title}
                            </span>
                        `
                }

            </div>


            <div class="discover-book-info">

                <h3>
                    ${book.title}
                </h3>

                <p class="author">
                    ${book.author}
                </p>

                <span class="condition">
                    ${book.condition}
                </span>

            </div>

        `;


        discoverBookList.appendChild(
            bookElement
        );
    });
}


/* Initial display */

displayDiscoverBooks();


/* Search */

if (bookSearch) {

    bookSearch.addEventListener(
        "input",
        function () {

            displayDiscoverBooks(
                bookSearch.value
            );

        }
    );

}


/* Category filters */

filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(
                function (button) {
                    button.classList.remove(
                        "active"
                    );
                }
            );

            button.classList.add("active");

            displayDiscoverBooks(
                bookSearch
                    ? bookSearch.value
                    : "",
                button.dataset.category
            );

        }
    );

});


// =========================
// DEBUG
// =========================

console.log(books);