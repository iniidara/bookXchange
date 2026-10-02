/* =========================
   BOOK DATA
========================= */

const defaultBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        condition: "Good",
        category: "classics",
        description:
            "A classic novel about wealth, love and the American Dream.",
        image: "",
        status: "available",
        ownerId: 1
    },

    {
        id: 2,
        title: "Norwegian Wood",
        author: "Haruki Murakami",
        condition: "Like New",
        category: "fiction",
        description:
            "A quiet story about memory, love and growing up.",
        image: "",
        status: "available",
        ownerId: 1
    },

    {
        id: 3,
        title: "The Secret History",
        author: "Donna Tartt",
        condition: "Good",
        category: "fiction",
        description:
            "A literary mystery about a group of college students.",
        image: "",
        status: "available",
        ownerId: 1
    }
];

/*
    Reader data lives in demoReaders below: one shared list of
    reader records used by Near You, reader profiles, and the
    matching algorithm. (Replaces the old seed list, which only
    had name/area and a hard-coded book count.)
*/


/* =========================
   DEMO READERS (other people)
========================= */

/*
    Local stand-in for future Supabase records.

    Shape mapping when the backend lands:
    - reader                 -> profiles row
    - reader.location        -> profiles.location
    - reader.availableBooks  -> books rows (owner_id = reader.id)
    - reader.wishlist        -> wishlists rows (user_id = reader.id)

    availableBooks use the same record shape as defaultBooks, and
    wishlist items use the same shape as the user's wishlist, so a
    future matching algorithm can compare records directly without
    conversion or rewriting.
*/

const demoReaders = [
    {
        id: 101,
        name: "David",
        location: "Yaba",
        initials: "D",
        bio: "Collector of campus novels and quiet British fiction.",
        availableBooks: [
            {
                id: 1011,
                title: "The Secret History",
                author: "Donna Tartt",
                condition: "Good",
                category: "fiction",
                description:
                    "A literary mystery about a group of college students.",
                image: "",
                status: "available",
                ownerId: 101
            },
            {
                id: 1012,
                title: "The Remains of the Day",
                author: "Kazuo Ishiguro",
                condition: "Fair",
                category: "fiction",
                description:
                    "A quiet story about duty, dignity and regret.",
                image: "",
                status: "available",
                ownerId: 101
            }
        ],
        wishlist: [
            {
                id: 1013,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                note: "Been meaning to read it for years."
            },
            {
                id: 1014,
                title: "The Catcher in the Rye",
                author: "J. D. Salinger",
                note: "Curious what all the fuss is about."
            }
        ]
    },

    {
        id: 102,
        name: "Amara",
        location: "Yaba",
        initials: "A",
        bio: "Reads across genres; always hunting for a good classic.",
        availableBooks: [
            {
                id: 1021,
                title: "1984",
                author: "George Orwell",
                condition: "Like New",
                category: "classics",
                description:
                    "Dystopia that still feels current.",
                image: "",
                status: "available",
                ownerId: 102
            },
            {
                id: 1022,
                title: "Beloved",
                author: "Toni Morrison",
                condition: "Good",
                category: "fiction",
                description:
                    "Haunting, and worth the patience.",
                image: "",
                status: "available",
                ownerId: 102
            }
        ],
        wishlist: [
            {
                id: 1023,
                title: "Norwegian Wood",
                author: "Haruki Murakami",
                note: "Everyone says start here."
            },
            {
                id: 1024,
                title: "Half of a Yellow Sun",
                author: "Chimamanda Ngozi Adichie",
                note: "On every recommendation list."
            }
        ]
    }
];


let books =
    JSON.parse(localStorage.getItem("bookxchangeBooks")) ||
    defaultBooks;


function saveBooks() {
    localStorage.setItem(
        "bookxchangeBooks",
        JSON.stringify(books)
    );
}


/* =========================
   EDITING STATE
========================= */

let editingBookId = null;


/* =========================
   SHELF ELEMENTS
========================= */

const bookList =
    document.getElementById("book-list");

const libraryList =
    document.getElementById("library-list");

const addBookButton =
    document.getElementById("add-book-button");

const addBookSection =
    document.getElementById("add-book-section");

const closeAddBook =
    document.getElementById("close-add-book");

const addBookForm =
    document.getElementById("add-book-form");


/* =========================
   DISPLAY AVAILABLE BOOKS
========================= */

function displayBooks() {

    const bookCount =
        document.getElementById("book-count");


    const availableBooks =
        books.filter(function (book) {
            return book.status === "available";
        });


    /* Count */

    if (bookCount) {

        const count =
            availableBooks.length;

        bookCount.textContent =
            count === 1
                ? "1 book"
                : `${count} books`;
    }


    if (!bookList) return;


    bookList.innerHTML = "";


    /* Empty state */

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


    /* Render books */

    availableBooks.forEach(function (book, index) {

        const bookElement =
            document.createElement("article");


        bookElement.classList.add(
            "shelf-book"
        );


        const coverClass =
            ["cover-one", "cover-two", "cover-three"][index % 3];


        bookElement.innerHTML = `

            <div class="book-cover ${book.image ? "" : coverClass}">

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


            <div class="shelf-book-info">

                <h3>
                    ${book.title}
                </h3>

                <p>
                    ${book.author}
                </p>

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


        bookList.appendChild(
            bookElement
        );
    });
}


/* =========================
   DISPLAY MY LIBRARY
========================= */

function displayLibrary() {

    const libraryCount =
        document.getElementById("library-count");


    if (!libraryList) return;


    libraryList.innerHTML = "";


    const keptBooks =
        books.filter(function (book) {
            return book.status === "keeping";
        });


    /* Count */

    if (libraryCount) {

        libraryCount.textContent =
            keptBooks.length === 1
                ? "1 book"
                : `${keptBooks.length} books`;
    }


    /* Empty state */

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


    /* Render library */

    keptBooks.forEach(function (book, index) {

        const libraryBook =
            document.createElement("div");


        libraryBook.classList.add(
            "library-book"
        );


        libraryBook.innerHTML = `

            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>


            <div>

                <h3>
                    ${book.title}
                </h3>

                <p>
                    ${book.author}
                </p>

            </div>


            <button
                class="make-available"
                data-id="${book.id}"
            >
                Make available
            </button>

        `;


        libraryList.appendChild(
            libraryBook
        );
    });
}


/* =========================
   INITIAL SHELF DISPLAY
========================= */

displayBooks();
displayLibrary();


/* =========================
   SHELF BOOK ACTIONS
========================= */

if (bookList) {

    bookList.addEventListener(
        "click",
        function (event) {


            /* KEEP */

            if (
                event.target.classList.contains(
                    "keep-book"
                )
            ) {

                const bookId =
                    Number(
                        event.target.dataset.id
                    );


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


            /* EDIT */

            if (
                event.target.classList.contains(
                    "edit-book"
                )
            ) {

                const bookId =
                    Number(
                        event.target.dataset.id
                    );


                const book =
                    books.find(function (book) {
                        return book.id === bookId;
                    });


                if (!book) return;


                editingBookId =
                    bookId;


                document.getElementById(
                    "book-title"
                ).value =
                    book.title;


                document.getElementById(
                    "book-author"
                ).value =
                    book.author;


                document.getElementById(
                    "book-condition"
                ).value =
                    book.condition;


                const categoryInput =
                    document.getElementById(
                        "book-category"
                    );


                if (categoryInput) {

                    categoryInput.value =
                        book.category || "";
                }


                document.getElementById(
                    "book-description"
                ).value =
                    book.description;


                const submitButton =
                    document.getElementById(
                        "book-form-submit"
                    );


                if (submitButton) {

                    submitButton.textContent =
                        "Save changes";
                }


                if (addBookSection) {

                    addBookSection.classList.add(
                        "is-open"
                    );
                }


                return;
            }


            /* DELETE */

            if (
                event.target.classList.contains(
                    "delete-book"
                )
            ) {

                const bookId =
                    Number(
                        event.target.dataset.id
                    );


                const bookIndex =
                    books.findIndex(function (book) {
                        return book.id === bookId;
                    });


                if (bookIndex !== -1) {

                    books.splice(
                        bookIndex,
                        1
                    );


                    saveBooks();

                    displayBooks();
                    displayLibrary();
                }


                return;
            }

        }
    );
}


/* =========================
   LIBRARY ACTIONS
========================= */

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
                    Number(
                        event.target.dataset.id
                    );


                const book =
                    books.find(function (book) {
                        return book.id === bookId;
                    });


                if (!book) return;


                book.status =
                    "available";


                saveBooks();

                displayBooks();
                displayLibrary();
            }

        }
    );
}


/* =========================
   OPEN ADD BOOK MODAL
========================= */

if (
    addBookButton &&
    addBookSection
) {

    addBookButton.addEventListener(
        "click",
        function () {

            editingBookId =
                null;


            if (addBookForm) {

                addBookForm.reset();
            }


            const submitButton =
                document.getElementById(
                    "book-form-submit"
                );


            if (submitButton) {

                submitButton.textContent =
                    "Add book";
            }


            addBookSection.classList.toggle(
                "is-open"
            );

        }
    );
}


/* =========================
   EMPTY SHELF ADD BUTTON
========================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.id ===
            "empty-add-book"
        ) {

            editingBookId =
                null;


            if (addBookForm) {

                addBookForm.reset();
            }


            const submitButton =
                document.getElementById(
                    "book-form-submit"
                );


            if (submitButton) {

                submitButton.textContent =
                    "Add book";
            }


            if (addBookSection) {

                addBookSection.classList.add(
                    "is-open"
                );
            }

        }

    }
);


/* =========================
   CLOSE ADD BOOK MODAL
========================= */

if (
    closeAddBook &&
    addBookSection
) {

    closeAddBook.addEventListener(
        "click",
        function () {

            addBookSection.classList.remove(
                "is-open"
            );

        }
    );
}


/* =========================
   CLOSE MODAL
   CLICK OUTSIDE
========================= */

if (addBookSection) {

    addBookSection.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".add-book-panel"
                )
            ) {

                addBookSection.classList.remove(
                    "is-open"
                );
            }

        }
    );
}


/* =========================
   ADD / EDIT BOOK
========================= */

if (addBookForm) {

    addBookForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Get form values */

            const title =
                document
                    .getElementById(
                        "book-title"
                    )
                    .value
                    .trim();


            const author =
                document
                    .getElementById(
                        "book-author"
                    )
                    .value
                    .trim();


            const condition =
                document
                    .getElementById(
                        "book-condition"
                    )
                    .value;


            const categoryInput =
                document.getElementById(
                    "book-category"
                );


            const category =
                categoryInput
                    ? categoryInput.value
                    : "";


            const description =
                document
                    .getElementById(
                        "book-description"
                    )
                    .value
                    .trim();


            const imageInput =
                document.getElementById(
                    "book-image"
                );


            const imageFile =
                imageInput
                    ? imageInput.files[0]
                    : null;


            /* =========================
               EDIT EXISTING BOOK
            ========================= */

            if (
                editingBookId !== null
            ) {

                const book =
                    books.find(function (book) {
                        return (
                            book.id ===
                            editingBookId
                        );
                    });


                if (book) {

                    book.title =
                        title;

                    book.author =
                        author;

                    book.condition =
                        condition;

                    book.category =
                        category;

                    book.description =
                        description;


                    /*
                        Only replace the image
                        if the user selected
                        a new one.
                    */

                    if (imageFile) {

                        const reader =
                            new FileReader();


                        reader.onload =
                            function () {

                                book.image =
                                    reader.result;


                                saveBooks();

                                displayBooks();
                                displayLibrary();
                                displayDiscoverBooks();


                                finishBookForm();

                            };


                        reader.readAsDataURL(
                            imageFile
                        );

                        return;
                    }

                }


                editingBookId =
                    null;


                saveBooks();

                displayBooks();
                displayLibrary();
                displayDiscoverBooks();


                finishBookForm();

                return;
            }


            /* =========================
               CREATE NEW BOOK
            ========================= */

            const newBook = {

                id:
                    Date.now(),

                title:
                    title,

                author:
                    author,

                condition:
                    condition,

                category:
                    category,

                description:
                    description,

                image:
                    "",

                status:
                    "available",

                ownerId:
                    1
            };


            /* =========================
               SAVE WITH IMAGE
            ========================= */

            if (imageFile) {

                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        newBook.image =
                            reader.result;


                        books.push(
                            newBook
                        );


                        saveBooks();

                        displayBooks();
                        displayLibrary();
                        displayDiscoverBooks();


                        finishBookForm();

                    };


                reader.readAsDataURL(
                    imageFile
                );


            } else {

                books.push(
                    newBook
                );


                saveBooks();

                displayBooks();
                displayLibrary();
                displayDiscoverBooks();


                finishBookForm();
            }

        }
    );
}


/* =========================
   FINISH BOOK FORM
========================= */

function finishBookForm() {

    editingBookId =
        null;


    if (addBookForm) {

        addBookForm.reset();
    }


    const submitButton =
        document.getElementById(
            "book-form-submit"
        );


    if (submitButton) {

        submitButton.textContent =
            "Add book";
    }


    if (addBookSection) {

        addBookSection.classList.remove(
            "is-open"
        );
    }

}


/* =========================
   DISCOVER
========================= */

const discoverBookList =
    document.getElementById(
        "discover-book-list"
    );


const discoverCount =
    document.getElementById(
        "discover-count"
    );


const bookSearch =
    document.getElementById(
        "book-search"
    );


const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


/* =========================
   DISPLAY DISCOVER BOOKS
========================= */

function displayDiscoverBooks(
    searchTerm = "",
    category = "all"
) {

    if (!discoverBookList) return;


    discoverBookList.innerHTML =
        "";


    /* Only show available books */

    const availableBooks =
        books.filter(function (book) {

            return (
                book.status ===
                "available"
            );

        });


    /* Filter */

    const filteredBooks =
        availableBooks.filter(
            function (book) {


                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();


                const matchesSearch =
                    book.title
                        .toLowerCase()
                        .includes(search) ||

                    book.author
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all" ||
                    book.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    /* Count */

    if (discoverCount) {

        const count =
            filteredBooks.length;


        discoverCount.textContent =
            count === 1
                ? "1 book"
                : `${count} books`;
    }


    /* Empty state */

    if (
        filteredBooks.length ===
        0
    ) {

        discoverBookList.innerHTML = `

            <div class="discover-empty">

                <p>
                    No books match your search.
                </p>

            </div>

        `;

        return;
    }


    /* Render */

    filteredBooks.forEach(
        function (book, index) {

            const bookElement =
                document.createElement(
                    "article"
                );


            bookElement.classList.add(
                "discover-book"
            );

            bookElement.dataset.id = book.id;
            bookElement.classList.add("clickable-book");


            bookElement.innerHTML = `

                <div
                    class="
                        discover-book-cover
                        ${book.image ? "" : "placeholder"}
                    "
                >

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

        }
    );

}


/* =========================
   INITIAL DISCOVER DISPLAY
========================= */

displayDiscoverBooks();


/* =========================
   DISCOVER SEARCH
========================= */

if (bookSearch) {

    bookSearch.addEventListener(
        "input",
        function () {

            const activeFilter =
                document.querySelector(
                    ".filter-button.active"
                );


            const category =
                activeFilter
                    ? activeFilter.dataset.category
                    : "all";


            displayDiscoverBooks(
                bookSearch.value,
                category
            );

        }
    );

}


/* =========================
   DISCOVER CATEGORY FILTERS
========================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {


                /* Remove active state */

                filterButtons.forEach(
                    function (button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                /* Activate clicked button */

                button.classList.add(
                    "active"
                );


                /* Get category */

                const category =
                    button.dataset.category;


                /* Keep current search */

                const search =
                    bookSearch
                        ? bookSearch.value
                        : "";


                displayDiscoverBooks(
                    search,
                    category
                );

            }
        );

    }
);

/* =========================
   BOOK DETAIL MODAL
========================= */

const bookDetailModal =
    document.getElementById(
        "book-detail-modal"
    );

const closeBookDetail =
    document.getElementById(
        "close-book-detail"
    );

const bookDetailOverlay =
    document.querySelector(
        ".book-detail-overlay"
    );

const bookDetailCover =
    document.getElementById(
        "book-detail-cover"
    );

const bookDetailTitle =
    document.getElementById(
        "book-detail-title"
    );

const bookDetailAuthor =
    document.getElementById(
        "book-detail-author"
    );

const bookDetailCondition =
    document.getElementById(
        "book-detail-condition"
    );

const bookDetailDescription =
    document.getElementById(
        "book-detail-description"
    );


function openBookDetails(bookId) {

    const book =
        books.find(function (book) {
            return book.id === bookId;
        });

    if (!book || !bookDetailModal) return;

    requestedBookId = bookId;


    bookDetailTitle.textContent =
        book.title;

    bookDetailAuthor.textContent =
        book.author;

    bookDetailCondition.textContent =
        book.condition;

    bookDetailDescription.textContent =
        book.description ||
        "No description provided.";


    if (book.image) {

        bookDetailCover.innerHTML = `
            <img
                src="${book.image}"
                alt="${book.title}"
            >
        `;

        bookDetailCover.classList.remove(
            "placeholder"
        );

    } else {

        bookDetailCover.innerHTML = `
            <span>
                ${book.title}
            </span>
        `;

        bookDetailCover.classList.add(
            "placeholder"
        );
    }


    bookDetailModal.classList.add(
        "is-open"
    );

    bookDetailModal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeBookDetails() {

    if (!bookDetailModal) return;

    bookDetailModal.classList.remove(
        "is-open"
    );

    bookDetailModal.setAttribute(
        "aria-hidden",
        "true"
    );
}


if (discoverBookList) {

    discoverBookList.addEventListener(
        "click",
        function (event) {

            const bookCard =
                event.target.closest(
                    ".clickable-book"
                );

            if (!bookCard) return;

            const bookId =
                Number(
                    bookCard.dataset.id
                );

            openBookDetails(bookId);

        }
    );
}


if (closeBookDetail) {

    closeBookDetail.addEventListener(
        "click",
        closeBookDetails
    );
}


if (bookDetailOverlay) {

    bookDetailOverlay.addEventListener(
        "click",
        closeBookDetails
    );
}


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeBookDetails();
        }

    }
);


/* =========================
   EXCHANGE REQUEST
========================= */

const requestBookButton =
    document.getElementById(
        "request-book-button"
    );

const requestModal =
    document.getElementById(
        "request-modal"
    );

const closeRequest =
    document.getElementById(
        "close-request"
    );

const requestOverlay =
    document.querySelector(
        ".request-overlay"
    );

const requestForm =
    document.getElementById(
        "request-form"
    );

const requestBookName =
    document.getElementById(
        "request-book-name"
    );


let requestedBookId = null;


function openRequestModal() {

    if (!requestedBookId || !requestModal) {
        return;
    }


    const book =
        books.find(function (book) {
            return book.id === requestedBookId;
        });


    if (!book) return;


    requestBookName.textContent =
        `${book.title} by ${book.author}`;


    requestModal.classList.add(
        "is-open"
    );

    requestModal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeRequestModal() {

    if (!requestModal) return;


    requestModal.classList.remove(
        "is-open"
    );

    requestModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (requestBookButton) {

    requestBookButton.addEventListener(
        "click",
        function () {

            /*
                The currently open
                book detail modal
                already corresponds to
                requestedBookId.
            */

            openRequestModal();

        }
    );
}


if (closeRequest) {

    closeRequest.addEventListener(
        "click",
        closeRequestModal
    );

}


if (requestOverlay) {

    requestOverlay.addEventListener(
        "click",
        closeRequestModal
    );

}


if (requestForm) {

    requestForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const message =
                document
                    .getElementById(
                        "request-message"
                    )
                    .value
                    .trim();


            if (!message) return;


            /*
                Persist the request. Owner resolution: when the
                requested book belongs to a demo reader we use
                that reader's id; otherwise it is the current
                demo user (1). No auth yet, so requester is the
                implicit local user.
            */

            const requestedBook =
                books.find(function (book) {
                    return book.id === requestedBookId;
                });

            if (!requestedBook) return;

            const requesterId = 1; /* demo current user (no auth yet) */

            const recipientId =
                findReaderById(requestedBook.ownerId)
                    ? requestedBook.ownerId
                    : 1;

            createExchangeRequest({
                bookId: requestedBookId,
                requesterId: requesterId,
                recipientId: recipientId,
                message: message
            });


            requestForm.reset();

            closeRequestModal();

            alert(
                "Your exchange request has been sent."
            );

        }
    );

}

/* =========================
   EXCHANGE REQUESTS
   (localStorage model)
========================= */

/*
    Persisted exchange requests, replacing the old
    console+alert-only prototype behavior.

    Record shape (localStorage key "bookxchangeRequests"):
    {
        id:           number (Date.now()),
        requesterId:  number (demo current user = 1 until auth),
        recipientId:  number (book owner; demo reader id or 1),
        bookId:       number (requested book),
        message:      string,
        status:       "pending" | "accepted" | "declined",
        createdAt:    ISO timestamp string
    }

    Messages/chat and status transitions are out of scope for
    now; Supabase will replace this model with a real
    exchange_requests table.
*/

const REQUESTS_STORAGE_KEY =
    "bookxchangeRequests";


const defaultRequests = [
    {
        id: 9001,
        requesterId: 1,
        recipientId: 101,
        bookId: 1011,
        message:
            "Hi David! The Secret History has been on my list for ages. Would you trade it for The Great Gatsby?",
        status: "pending",
        createdAt: "2026-09-20T10:00:00.000Z"
    },
    {
        id: 9002,
        requesterId: 102,
        recipientId: 1,
        bookId: 1,
        message:
            "I'd love to borrow The Great Gatsby - I can swap my 1984 copy if you like.",
        status: "accepted",
        createdAt: "2026-09-22T14:30:00.000Z"
    },
    {
        id: 9003,
        requesterId: 1,
        recipientId: 102,
        bookId: 1021,
        message:
            "Is your 1984 still available? Happy to trade Norwegian Wood.",
        status: "declined",
        createdAt: "2026-09-24T09:15:00.000Z"
    }
];


function loadExchangeRequests() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(REQUESTS_STORAGE_KEY)
            );

        return Array.isArray(stored) ? stored : defaultRequests.slice();

    } catch (error) {
        return defaultRequests.slice();
    }

}


function saveExchangeRequests(requests) {

    localStorage.setItem(
        REQUESTS_STORAGE_KEY,
        JSON.stringify(requests)
    );

}


/*
    Create and persist a request from plain data. Returns the
    stored record (including id/status/createdAt) or null when
    the required fields are missing. Pure data-in, record-out.
*/

function createExchangeRequest(input) {

    if (
        !input ||
        !input.bookId ||
        !input.requesterId ||
        !input.recipientId ||
        typeof input.message !== "string"
    ) {
        return null;
    }

    const request = {
        id: Date.now(),
        requesterId: input.requesterId,
        recipientId: input.recipientId,
        bookId: input.bookId,
        message: input.message,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    const requests = loadExchangeRequests();

    requests.push(request);

    saveExchangeRequests(requests);

    return request;

}


/*
    Valid request statuses, mirroring the planned Supabase
    exchange_requests.status enum.
*/

const EXCHANGE_REQUEST_STATUSES = [
    "pending",
    "accepted",
    "declined"
];


/*
    Change a request's status by id. Only "pending",
    "accepted", and "declined" are accepted; anything else is
    rejected without touching storage. The record is updated in
    place and an updatedAt timestamp is added so a future
    Supabase row can keep the same audit field.

    Returns the updated request, or null when the request does
    not exist or the status is invalid.
*/

function setExchangeRequestStatus(requestId, status) {

    if (EXCHANGE_REQUEST_STATUSES.indexOf(status) === -1) {
        return null;
    }

    const requestIdNumber =
        Number(requestId);

    const requests =
        loadExchangeRequests();

    const request =
        requests.find(function (item) {
            return item.id === requestIdNumber;
        });

    if (!request) {
        return null;
    }

    request.status = status;

    request.updatedAt =
        new Date().toISOString();

    saveExchangeRequests(requests);

    return request;

}


/*
    Fetch one request by id (number or numeric string).
    Returns the record or null. Useful for the future status
    UI and for deep links.
*/

function findExchangeRequestById(requestId) {

    const requestIdNumber =
        Number(requestId);

    return loadExchangeRequests().find(function (item) {
        return item.id === requestIdNumber;
    }) || null;

}


/*
    Locate a book (user's shelf first, then demo readers'
    shelves) so a request can display what was asked for.
*/

function findBookInfoById(bookId) {

    const userBook =
        books.find(function (book) {
            return book.id === bookId;
        });

    if (userBook) {
        return userBook;
    }

    for (let i = 0; i < demoReaders.length; i++) {

        const readerBook =
            (demoReaders[i].availableBooks || []).find(function (book) {
                return book.id === bookId;
            });

        if (readerBook) {
            return readerBook;
        }

    }

    return null;

}


/*
    The other participant in a request: the owner when the
    current user sent it, the sender otherwise. Requester id 1
    is the implicit demo current user (no auth yet).
*/

function getOtherParticipant(request) {

    const otherId =
        request.requesterId === 1
            ? request.recipientId
            : request.requesterId;

    const reader =
        findReaderById(otherId);

    return reader ? reader.name : "Another reader";

}


/*
    Exchange-requests list on the profile page. Reuses the
    wishlist row classes (.wishlist-book etc.) so no new
    styling was needed. Read-only for now: status changes go
    through setExchangeRequestStatus until a real UI exists.
*/

function displayExchangeRequests() {

    const requestsList =
        document.getElementById("exchange-requests-list");

    if (!requestsList) {
        return;
    }

    const requests =
        loadExchangeRequests();

    const requestsCount =
        document.getElementById("exchange-requests-count");

    if (requestsCount) {

        requestsCount.textContent =
            requests.length === 1
                ? "1 request"
                : `${requests.length} requests`;
    }


    requestsList.innerHTML = "";


    if (requests.length === 0) {

        requestsList.innerHTML = `
            <div class="empty-shelf">
                <p>
                    No exchange requests yet.
                </p>
            </div>
        `;

        return;
    }


    requests.forEach(function (request, index) {

        const book =
            findBookInfoById(request.bookId);

        const statusLabel =
            request.status.charAt(0).toUpperCase() +
            request.status.slice(1);

        const otherReader =
            getOtherParticipant(request);

        const directionLabel =
            request.requesterId === 1
                ? "To " + otherReader
                : "From " + otherReader;

        const requestElement =
            document.createElement("article");

        requestElement.className = "wishlist-book";

        requestElement.innerHTML = `

            <div class="wishlist-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="wishlist-main">

                <h3>
                    ${book ? book.title : "Unknown book"}
                </h3>

                <p>
                    ${book ? book.author : ""}
                </p>

            </div>

            <div class="wishlist-note">

                <span>${directionLabel}</span>

                <p>
                    ${request.message || "No message added."}
                </p>

            </div>

            <div class="wishlist-status">
                <span>${statusLabel}</span>
            </div>

        `;

        requestsList.appendChild(requestElement);

    });

}


displayExchangeRequests();

/* =========================
   CHAT (data model)
   (localStorage, no UI yet)
========================= */

/*
    Chat data model for the exchange conversation flow.
    Prototype-only for now: two localStorage lists, no UI,
    no backend.

    Record shapes:

    Conversation (localStorage key "bookxchangeConversations"):
    {
        id:             number (Date.now() or seed 91xx),
        participantIds: [number, number] (demo user 1 + reader id),
        requestId:      number | null (related exchange request),
        createdAt:      ISO timestamp string
    }

    Message (localStorage key "bookxchangeMessages"):
    {
        id:             number (Date.now() or seed 910xx),
        conversationId: number (parent conversation),
        senderId:       number (participant who wrote it),
        text:           string,
        createdAt:      ISO timestamp string
    }

    Supabase mapping (planned tables in readme.md):
    - conversation -> conversations row (id, request_id,
      created_at); participantIds resolve to the two profiles
      involved (e.g. a conversation_participants join table, or
      derived from the related exchange_request pair).
    - message -> messages row:
        id            -> id
        senderId      -> sender_id
        (receiver)    -> receiver_id = the other participant
        requestId     -> request_id (via the conversation)
        text          -> content
        createdAt     -> created_at

    Ids stay numbers and timestamps stay ISO strings so the
    localStorage records can be posted to Supabase nearly
    as-is once auth arrives.
*/

const CONVERSATIONS_STORAGE_KEY =
    "bookxchangeConversations";

const MESSAGES_STORAGE_KEY =
    "bookxchangeMessages";

const LAST_CONVERSATION_STORAGE_KEY =
    "bookxchangeLastConversation";


/*
    Demo conversations. Conversation 9101 belongs to request
    9001 (user 1 -> David, The Secret History); conversation
    9102 belongs to request 9002 (Amara -> user 1, The Great
    Gatsby). Message timestamps sit after their request's
    createdAt so a future timeline view reads correctly.
*/

const defaultConversations = [
    {
        id: 9101,
        participantIds: [1, 101],
        requestId: 9001,
        createdAt: "2026-09-20T10:01:00.000Z"
    },
    {
        id: 9102,
        participantIds: [1, 102],
        requestId: 9002,
        createdAt: "2026-09-22T14:35:00.000Z"
    }
];

const defaultChatMessages = [
    {
        id: 91001,
        conversationId: 9101,
        senderId: 1,
        text:
            "Hi David! Just sent a request for The Secret History - would The Great Gatsby work as a swap?",
        createdAt: "2026-09-20T10:01:30.000Z"
    },
    {
        id: 91002,
        conversationId: 9101,
        senderId: 101,
        text:
            "Hey! Gatsby is already on my wishlist, so that's an easy yes.",
        createdAt: "2026-09-20T11:12:00.000Z"
    },
    {
        id: 91003,
        conversationId: 9101,
        senderId: 1,
        text:
            "Great - I can meet at the Yaba library whenever suits you.",
        createdAt: "2026-09-20T11:30:00.000Z"
    },
    {
        id: 91004,
        conversationId: 9102,
        senderId: 102,
        text:
            "Thanks for accepting the Gatsby swap! My 1984 copy is in really good shape.",
        createdAt: "2026-09-22T15:02:00.000Z"
    },
    {
        id: 91005,
        conversationId: 9102,
        senderId: 1,
        text:
            "No problem. Thursday afternoon at the usual spot in Yaba?",
        createdAt: "2026-09-22T15:40:00.000Z"
    }
];


function loadConversations() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
            );

        return Array.isArray(stored)
            ? stored
            : defaultConversations.slice();

    } catch (error) {
        return defaultConversations.slice();
    }

}


function saveConversations(conversations) {

    localStorage.setItem(
        CONVERSATIONS_STORAGE_KEY,
        JSON.stringify(conversations)
    );

}


/*
    Create and persist a conversation from plain data. Both
    participants must be distinct numbers; requestId is
    optional and becomes null when left out. If a conversation
    for the same pair (order-independent) about the same
    request already exists, it is returned instead so the UI
    never spawns duplicate threads. Returns the stored record
    or null when validation fails.
*/

function createConversation(input) {

    if (
        !input ||
        !Array.isArray(input.participantIds) ||
        input.participantIds.length !== 2 ||
        typeof input.participantIds[0] !== "number" ||
        typeof input.participantIds[1] !== "number" ||
        input.participantIds[0] === input.participantIds[1]
    ) {
        return null;
    }

    const requestId =
        input.requestId === undefined || input.requestId === null
            ? null
            : Number(input.requestId);

    const conversations =
        loadConversations();

    const existing =
        conversations.find(function (conversation) {

            const sameParticipants =
                (conversation.participantIds[0] === input.participantIds[0] &&
                    conversation.participantIds[1] === input.participantIds[1]) ||
                (conversation.participantIds[0] === input.participantIds[1] &&
                    conversation.participantIds[1] === input.participantIds[0]);

            const sameRequest =
                (conversation.requestId || null) === requestId;

            return sameParticipants && sameRequest;

        });

    if (existing) {
        return existing;
    }

    const conversation = {
        id: Date.now(),
        participantIds: input.participantIds.slice(),
        requestId: requestId,
        createdAt: new Date().toISOString()
    };

    conversations.push(conversation);

    saveConversations(conversations);

    return conversation;

}


/*
    Fetch one conversation by id (number or numeric string).
    Returns the record or null.
*/

function findConversationById(conversationId) {

    const conversationIdNumber =
        Number(conversationId);

    return loadConversations().find(function (conversation) {
        return conversation.id === conversationIdNumber;
    }) || null;

}


/*
    Which conversation the user had open last. chat.html uses
    this so a plain reload reopens the same thread instead of
    jumping to the newest one. A single number is stored
    (JSON-encoded); anything else reads as "none".
*/

function getLastOpenedConversationId() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(LAST_CONVERSATION_STORAGE_KEY)
            );

        return typeof stored === "number" ? stored : null;

    } catch (error) {
        return null;
    }

}


function setLastOpenedConversationId(conversationId) {

    if (conversationId === undefined || conversationId === null) {
        return false;
    }

    localStorage.setItem(
        LAST_CONVERSATION_STORAGE_KEY,
        JSON.stringify(Number(conversationId))
    );

    return true;

}


function loadMessages() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(MESSAGES_STORAGE_KEY)
            );

        return Array.isArray(stored)
            ? stored
            : defaultChatMessages.slice();

    } catch (error) {
        return defaultChatMessages.slice();
    }

}


function saveMessages(messages) {

    localStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(messages)
    );

}


/*
    Create and persist a message from plain data. The parent
    conversation must already exist and the text must not be
    empty, so orphan or blank messages never reach storage.
    Returns the stored record (including id/createdAt) or
    null when validation fails.
*/

function createMessage(input) {

    if (
        !input ||
        !input.conversationId ||
        !input.senderId ||
        typeof input.text !== "string" ||
        input.text.trim() === ""
    ) {
        return null;
    }

    const conversation =
        findConversationById(input.conversationId);

    if (!conversation) {
        return null;
    }

    const message = {
        id: Date.now(),
        conversationId: conversation.id,
        senderId: input.senderId,
        text: input.text,
        createdAt: new Date().toISOString()
    };

    const messages =
        loadMessages();

    messages.push(message);

    saveMessages(messages);

    return message;

}


/*
    All messages for one conversation, oldest first, so a
    future chat view can render the thread straight from this
    list. Returns [] for unknown conversations.
*/

function getConversationMessages(conversationId) {

    const conversationIdNumber =
        Number(conversationId);

    return loadMessages()
        .filter(function (message) {
            return message.conversationId === conversationIdNumber;
        })
        .sort(function (a, b) {
            return a.createdAt < b.createdAt ? -1 : 1;
        });

}


/*
    True when readerId is one of the conversation's
    participants (numeric string ids are accepted). The gate
    future UI will use before letting the current user read or
    write in a thread.
*/

function isConversationParticipant(conversation, readerId) {

    if (
        !conversation ||
        !Array.isArray(conversation.participantIds) ||
        readerId === undefined ||
        readerId === null
    ) {
        return false;
    }

    return conversation.participantIds.indexOf(Number(readerId)) !== -1;

}


/*
    The other participant's id in a conversation, given the
    current user's id. Returns null when the conversation is
    malformed or the given user is not a participant, so the
    demo user (1) can never be swapped with a stranger.
*/

function getOtherConversationParticipant(conversation, currentUserId) {

    if (
        !conversation ||
        !Array.isArray(conversation.participantIds) ||
        !isConversationParticipant(conversation, currentUserId)
    ) {
        return null;
    }

    const currentId =
        Number(currentUserId);

    const otherId =
        conversation.participantIds.find(function (participantId) {
            return participantId !== currentId;
        });

    return otherId === undefined ? null : otherId;

}


/* =========================
   READER PROFILES (shared)
========================= */

/*
    Reader-profile helpers shared by every surface that shows
    ANOTHER reader: the Near You list, the reader modal,
    "View reader" deep links, and any future standalone
    reader-profile page.

    These are deliberately separate from the CURRENT USER's
    profile logic (PROFILE section below), which is editable
    and persists to localStorage.
*/

function findReaderById(readerId) {

    return demoReaders.find(function (reader) {
        return reader.id === readerId;
    }) || null;

}


function getReaderAvailableBooks(reader) {

    return ((reader && reader.availableBooks) || []).filter(
        function (book) {
            return book.status === "available";
        }
    );

}


/*
    Fill any reader-profile container with a reader's data.
    `targets` supplies the elements to fill:

        initialsElement, nameElement, locationElement, booksGrid

    Returns true when something was rendered. The Near You
    modal uses it today; a dedicated reader page can pass its
    own elements without new logic. When Supabase lands,
    demoReaders becomes a profiles query and this code stays
    unchanged.
*/

function renderReaderProfileInto(reader, targets) {

    if (
        !reader ||
        !targets ||
        !targets.initialsElement ||
        !targets.nameElement ||
        !targets.locationElement ||
        !targets.booksGrid
    ) {
        return false;
    }


    targets.initialsElement.textContent =
        reader.initials ||
        String(reader.name || "?").trim().charAt(0).toUpperCase();

    targets.nameElement.textContent =
        reader.name;

    targets.locationElement.textContent =
        reader.location;


    const availableBooks =
        getReaderAvailableBooks(reader);


    targets.booksGrid.innerHTML = "";


    if (availableBooks.length === 0) {

        targets.booksGrid.innerHTML = `
            <div class="reader-books-empty">
                This reader has no books available
                for exchange right now.
            </div>
        `;

        return true;
    }


    availableBooks.forEach(function (book) {

        const bookElement =
            document.createElement("article");

        bookElement.classList.add("reader-book");


        bookElement.innerHTML = `

            <div class="
                reader-book-cover
                ${book.image ? "" : "placeholder"}
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


            <h4>
                ${book.title}
            </h4>

            <p>
                ${book.author}
            </p>

        `;


        targets.booksGrid.appendChild(bookElement);

    });


    return true;

}


/* =========================
   NEAR YOU
========================= */

const nearbyList =
    document.getElementById(
        "nearby-list"
    );


const nearbyCount =
    document.getElementById(
        "nearby-count"
    );


/*
    Prototype location matching: normalized word-token
    comparison only (trim, lowercase, collapse whitespace,
    split on non-alphanumeric characters). A reader is
    "nearby" when the two location strings share any word
    token, so a saved "Yaba, Lagos" matches a reader in
    "Yaba" - while "Aba" does not accidentally match
    "Yaba". Deterministic and GPS-free; Supabase will
    replace this with real coordinates (e.g. a PostGIS
    radius query) later.
*/

function normalizeLocation(location) {

    return String(location || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


function isLocationNearby(locationA, locationB) {

    const tokensA =
        normalizeLocation(locationA)
            .split(/[^a-z0-9]+/)
            .filter(Boolean);

    const tokensB =
        normalizeLocation(locationB)
            .split(/[^a-z0-9]+/)
            .filter(Boolean);


    if (
        tokensA.length === 0 ||
        tokensB.length === 0
    ) {
        return false;
    }

    return tokensA.some(function (token) {
        return tokensB.indexOf(token) !== -1;
    });

}


/*
    Filter readers down to those near the user's location.
    With no saved location, every reader is shown. Pure data
    in, data out - no DOM or storage access.
*/

function getNearbyReaders(readers, userLocation) {

    if (!normalizeLocation(userLocation)) {
        return readers.slice();
    }

    return readers.filter(function (reader) {
        return isLocationNearby(
            reader.location,
            userLocation
        );
    });

}


/*
    Reads the location saved by the CURRENT USER'S PROFILE
    section (same "bookxchangeProfile" record). Read directly
    from storage so Near You can render before that section
    initializes lower in this file.
*/

function getCurrentUserLocation() {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem("bookxchangeProfile")
            );

        return (stored && stored.location) || "";

    } catch (error) {
        return "";
    }

}


function displayNearbyReaders() {

    if (!nearbyList) return;


    const userLocation =
        getCurrentUserLocation();

    const nearbyReaders =
        getNearbyReaders(demoReaders, userLocation);


    nearbyList.innerHTML = "";


    if (nearbyCount) {

        nearbyCount.textContent =
            nearbyReaders.length === 1
                ? "1 reader"
                : `${nearbyReaders.length} readers`;
    }


    if (nearbyReaders.length === 0) {

        nearbyList.innerHTML = `
            <div class="nearby-empty">
                ${
                    userLocation
                        ? `No readers found near ${userLocation} yet.`
                        : "No readers found nearby yet."
                }
            </div>
        `;

        return;
    }


    nearbyReaders.forEach(
        function (reader) {

            const availableCount =
                getReaderAvailableBooks(reader).length;

            const readerElement =
                document.createElement(
                    "article"
                );


            readerElement.classList.add(
                "nearby-reader"
            );

            readerElement.dataset.id = reader.id;
            readerElement.classList.add("clickable-reader");


            readerElement.innerHTML = `

                <div class="reader-initials">
                    ${reader.initials}
                </div>


                <div class="reader-info">

                    <h3>
                        ${reader.name}
                    </h3>

                    <p>
                        ${reader.location}
                    </p>

                </div>


                <div class="reader-books">
                    ${availableCount}
                    ${
                        availableCount === 1
                            ? "book"
                            : "books"
                    }
                </div>

            `;


            nearbyList.appendChild(
                readerElement
            );

        }
    );
}


displayNearbyReaders();

/* =========================
   READER PROFILE MODAL
========================= */

const readerProfileModal =
    document.getElementById(
        "reader-profile-modal"
    );

const readerProfileOverlay =
    document.querySelector(
        ".reader-profile-overlay"
    );

const closeReaderProfile =
    document.getElementById(
        "close-reader-profile"
    );

const readerProfileInitials =
    document.getElementById(
        "reader-profile-initials"
    );

const readerProfileName =
    document.getElementById(
        "reader-profile-name"
    );

const readerProfileArea =
    document.getElementById(
        "reader-profile-area"
    );

const readerBooksGrid =
    document.getElementById(
        "reader-books-grid"
    );


function openReaderProfile(readerId) {

    const reader =
        findReaderById(readerId);

    if (!reader || !readerProfileModal || !readerBooksGrid) {
        return;
    }


    /*
        The modal supplies its own elements; a future
        standalone reader page can reuse renderReaderProfileInto
        with its own targets.
    */

    renderReaderProfileInto(reader, {
        initialsElement: readerProfileInitials,
        nameElement: readerProfileName,
        locationElement: readerProfileArea,
        booksGrid: readerBooksGrid
    });


    readerProfileModal.classList.add(
        "is-open"
    );

    readerProfileModal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeReaderProfileModal() {

    if (!readerProfileModal) {
        return;
    }

    readerProfileModal.classList.remove(
        "is-open"
    );

    readerProfileModal.setAttribute(
        "aria-hidden",
        "true"
    );
}


if (nearbyList) {

    nearbyList.addEventListener(
        "click",
        function (event) {

            const readerElement =
                event.target.closest(
                    ".clickable-reader"
                );

            if (!readerElement) {
                return;
            }

            const readerId =
                Number(
                    readerElement.dataset.id
                );

            openReaderProfile(
                readerId
            );

        }
    );
}


if (closeReaderProfile) {

    closeReaderProfile.addEventListener(
        "click",
        closeReaderProfileModal
    );
}


if (readerProfileOverlay) {

    readerProfileOverlay.addEventListener(
        "click",
        closeReaderProfileModal
    );
}

/* =========================
   CURRENT USER'S PROFILE
   (editable, localStorage)
========================= */

const profileName = document.getElementById("profile-name");
const profileLocation = document.getElementById("profile-location");
const profileBio = document.getElementById("profile-bio");
const profileAvatar = document.getElementById("profile-avatar");

const profileBookCount = document.getElementById("profile-book-count");
const profileAvailableCount = document.getElementById("profile-available-count");
const profileLibraryCount = document.getElementById("profile-library-count");

const profileBooksGrid = document.getElementById("profile-books-grid");

const editProfileButton = document.getElementById("edit-profile-button");
const profileEditModal = document.getElementById("profile-edit-modal");
const closeProfileEdit = document.getElementById("close-profile-edit");
const profileEditOverlay = document.querySelector(".profile-edit-overlay");

const profileForm = document.getElementById("profile-form");

const profileNameInput = document.getElementById("profile-name-input");
const profileLocationInput = document.getElementById("profile-location-input");
const profileBioInput = document.getElementById("profile-bio-input");


const defaultProfile = {
    name: "Your Name",

    /*
        Matches the demo readers' neighborhood so the Near You
        prototype shows nearby readers out of the box.
    */
    location: "Yaba, Lagos",

    bio: "A reader who believes good books should keep moving."
};let profile =
    defaultProfile;

try {

    profile =
        JSON.parse(
            localStorage.getItem("bookxchangeProfile")
        ) || defaultProfile;

} catch (error) {

    /* Corrupt stored profile -> fall back to defaults */
    profile =
        defaultProfile;

}


function saveProfile() {
    localStorage.setItem(
        "bookxchangeProfile",
        JSON.stringify(profile)
    );
}


function getInitials(name) {

    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "YR";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}


function displayProfile() {

    if (!profileName) {
        return;
    }

    profileName.textContent = profile.name;
    profileLocation.textContent = profile.location;
    profileBio.textContent = profile.bio;

    profileAvatar.textContent = getInitials(profile.name);


    const availableBooks = books.filter(
        book => book.status === "available"
    );

    const libraryBooks = books.filter(
        book => book.status === "keeping"
    );


    profileBookCount.textContent = books.length;
    profileAvailableCount.textContent = availableBooks.length;
    profileLibraryCount.textContent = libraryBooks.length;


    if (!profileBooksGrid) {
        return;
    }


    profileBooksGrid.innerHTML = "";


    if (availableBooks.length === 0) {

        profileBooksGrid.innerHTML = `
            <div class="empty-shelf">
                <p>
                    You aren't sharing any books yet.
                </p>

                <button
                    type="button"
                    class="empty-shelf-link"
                    id="profile-add-book-link"
                >
                    Add a book
                </button>
            </div>
        `;

        const addBookLink =
            document.getElementById("profile-add-book-link");

        if (addBookLink) {
            addBookLink.addEventListener("click", () => {
                window.location.href = "shelf.html";
            });
        }

        return;
    }


    availableBooks.forEach(book => {

        const bookElement =
            document.createElement("article");

        bookElement.className = "profile-book";

        const coverStyle = book.image
            ? `style="background-image: url('${book.image}')"`
            : "";

        bookElement.innerHTML = `
            <div
                class="profile-book-cover"
                ${coverStyle}
            >
                ${
                    book.image
                        ? ""
                        : "No cover"
                }
            </div>

            <div class="profile-book-info">

                <h3>${book.title}</h3>

                <p>${book.author}</p>

            </div>
        `;

        profileBooksGrid.appendChild(bookElement);
    });
}


/*
    Render ANOTHER reader's profile into the profile page
    structure (profile.html?reader=<id>). Reuses the current
    user's profile layout, but is read-only: edit controls
    and personal stats are hidden, and the books grid shows
    that reader's available books.
*/

function displayReaderProfilePage(reader) {

    if (!reader || !profileName) {
        return;
    }


    /* Identity (same elements the current user's profile uses) */

    profileName.textContent =
        reader.name;

    profileLocation.textContent =
        reader.location;

    profileBio.textContent =
        reader.bio || "";

    profileAvatar.textContent =
        reader.initials ||
        getInitials(reader.name);


    /* Edit controls and stats belong to the current user only */

    if (editProfileButton) {
        editProfileButton.style.display = "none";
    }

    [profileBookCount, profileAvailableCount, profileLibraryCount]
        .forEach(function (statElement) {
            if (statElement && statElement.parentElement) {
                statElement.parentElement.style.display = "none";
            }
        });


    /* "Your shelf" heading only makes sense for the current user */

    const profileSectionHeading =
        document.querySelector(
            ".profile-books-section .section-heading"
        );

    if (profileSectionHeading) {
        profileSectionHeading.style.display = "none";
    }


    /* Their available books, in the same grid style */

    if (!profileBooksGrid) {
        return;
    }

    const availableBooks =
        getReaderAvailableBooks(reader);

    profileBooksGrid.innerHTML = "";


    if (availableBooks.length === 0) {

        profileBooksGrid.innerHTML = `
            <div class="empty-shelf">
                <p>
                    No books available for exchange right now.
                </p>
            </div>
        `;

        return;
    }


    availableBooks.forEach(function (book) {

        const bookElement =
            document.createElement("article");

        bookElement.className = "profile-book";

        const coverStyle = book.image
            ? `style="background-image: url('${book.image}')"`
            : "";

        bookElement.innerHTML = `
            <div
                class="profile-book-cover"
                ${coverStyle}
            >
                ${
                    book.image
                        ? ""
                        : book.title
                }
            </div>

            <div class="profile-book-info">

                <h3>${book.title}</h3>

                <p>${book.author}</p>

            </div>
        `;

        profileBooksGrid.appendChild(bookElement);

    });

}


function openProfileEditor() {

    if (!profileEditModal) {
        return;
    }

    profileNameInput.value = profile.name;
    profileLocationInput.value = profile.location;
    profileBioInput.value = profile.bio;

    profileEditModal.classList.add("is-open");
    profileEditModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


function closeProfileEditor() {

    if (!profileEditModal) {
        return;
    }

    profileEditModal.classList.remove("is-open");
    profileEditModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}


if (editProfileButton) {
    editProfileButton.addEventListener(
        "click",
        openProfileEditor
    );
}


if (closeProfileEdit) {
    closeProfileEdit.addEventListener(
        "click",
        closeProfileEditor
    );
}


if (profileEditOverlay) {
    profileEditOverlay.addEventListener(
        "click",
        closeProfileEditor
    );
}


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            profile = {
                name: profileNameInput.value.trim(),
                location: profileLocationInput.value.trim(),
                bio: profileBioInput.value.trim()
            };

            saveProfile();
            displayProfile();
            closeProfileEditor();
        }
    );
}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            profileEditModal &&
            profileEditModal.classList.contains("is-open")
        ) {
            closeProfileEditor();
        }

    }
);


displayProfile();

/* =========================
   WISHLIST
========================= */

const wishlistList =
    document.getElementById("wishlist-list");

const addWishlistButton =
    document.getElementById("add-wishlist-button");

const wishlistModal =
    document.getElementById("wishlist-modal");

const closeWishlist =
    document.getElementById("close-wishlist");

const wishlistForm =
    document.getElementById("wishlist-form");


let wishlist = JSON.parse(
    localStorage.getItem("bookxchangeWishlist")
) || [
    {
        id: 1,
        title: "The Secret History",
        author: "Donna Tartt",
        note: "I've heard way too much about this book."
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        note: "Want to finally read Orwell."
    },
    {
        id: 3,
        title: "Half of a Yellow Sun",
        author: "Chimamanda Ngozi Adichie",
        note: "It's been on my list for ages."
    },
    {
        id: 4,
        title: "Never Let Me Go",
        author: "Kazuo Ishiguro",
        note: "Recommended by a friend."
    }
];


function saveWishlist() {

    localStorage.setItem(
        "bookxchangeWishlist",
        JSON.stringify(wishlist)
    );

}


function displayWishlist() {

    if (!wishlistList) {
        return;
    }

    wishlistList.innerHTML = "";


    if (wishlist.length === 0) {

        wishlistList.innerHTML = `
            <div class="empty-shelf">
                <p>
                    Your wishlist is empty.
                </p>

                <button
                    type="button"
                    class="empty-shelf-link"
                    id="empty-wishlist-link"
                >
                    Add a book
                </button>
            </div>
        `;

        document
            .getElementById("empty-wishlist-link")
            ?.addEventListener(
                "click",
                openWishlistModal
            );

        return;
    }


    wishlist.forEach((book, index) => {

        const article =
            document.createElement("article");

        article.className = "wishlist-book";

        article.innerHTML = `

            <div class="wishlist-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="wishlist-main">

                <h3>
                    ${book.title}
                </h3>

                <p>
                    ${book.author}
                </p>

            </div>

            <div class="wishlist-note">

                <span>Why I want it</span>

                <p>
                    ${book.note || "No note added."}
                </p>

            </div>

            <div class="wishlist-status">

                <span>Searching</span>

                <button
                    type="button"
                    class="wishlist-remove"
                    data-id="${book.id}"
                >
                    Remove
                </button>

            </div>

        `;

        wishlistList.appendChild(article);

    });


    document
        .querySelectorAll(".wishlist-remove")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    wishlist =
                        wishlist.filter(
                            book => book.id !== id
                        );

                    saveWishlist();
                    displayWishlist();

                }
            );

        });

}


function openWishlistModal() {

    if (!wishlistModal) {
        return;
    }

    wishlistModal.classList.add("is-open");

    wishlistModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeWishlistModal() {

    if (!wishlistModal) {
        return;
    }

    wishlistModal.classList.remove("is-open");

    wishlistModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


if (addWishlistButton) {

    addWishlistButton.addEventListener(
        "click",
        openWishlistModal
    );

}


if (closeWishlist) {

    closeWishlist.addEventListener(
        "click",
        closeWishlistModal
    );

}


if (wishlistModal) {

    wishlistModal.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".wishlist-panel"
                )
            ) {
                closeWishlistModal();
            }

        }
    );

}


if (wishlistForm) {

    wishlistForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const title =
                document
                    .getElementById("wishlist-title")
                    .value
                    .trim();

            const author =
                document
                    .getElementById("wishlist-author")
                    .value
                    .trim();

            const note =
                document
                    .getElementById("wishlist-note")
                    .value
                    .trim();


            wishlist.push({

                id: Date.now(),

                title,

                author,

                note

            });


            saveWishlist();

            displayWishlist();

            wishlistForm.reset();

            closeWishlistModal();

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            wishlistModal &&
            wishlistModal.classList.contains("is-open")
        ) {
            closeWishlistModal();
        }

    }
);


displayWishlist();

/* =========================
   MATCHING ALGORITHM
   (pure, DOM-free)
========================= */

/*
    Normalize a book title for comparison: trim surrounding
    whitespace, lowercase, and collapse internal whitespace runs.
    Exact comparison only - no fuzzy/approximate matching.
*/

function normalizeBookTitle(title) {
    return String(title || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/*
    A reader is a match only when BOTH are true:
    1. They have an available book the user's wishlist wants.
    2. The user has an available book their wishlist wants.

    Inputs are plain data (same shapes as demoReaders /
    defaultBooks / user wishlist), so this works unchanged
    when the data later comes from Supabase.

    Returns display-ready match objects:
    { readerId, name, location, initials, yourBook, theirBook }
*/

function findMatches(userBooks, userWishlist, readers) {

    const userAvailableBooks =
        userBooks.filter(function (book) {
            return book.status === "available";
        });

    const userWantedTitles =
        new Set(
            userWishlist.map(function (item) {
                return normalizeBookTitle(item.title);
            })
        );

    const matches = [];


    readers.forEach(function (reader) {

        const theirAvailableBooks =
            (reader.availableBooks || []).filter(function (book) {
                return book.status === "available";
            });

        const theirWantedTitles =
            new Set(
                (reader.wishlist || []).map(function (item) {
                    return normalizeBookTitle(item.title);
                })
            );

        /* Condition 1: they have a book the user wants */

        const bookTheyHave =
            theirAvailableBooks.find(function (book) {
                return userWantedTitles.has(
                    normalizeBookTitle(book.title)
                );
            });

        /* Condition 2: the user has a book they want */

        const bookTheyWant =
            userAvailableBooks.find(function (book) {
                return theirWantedTitles.has(
                    normalizeBookTitle(book.title)
                );
            });

        if (bookTheyHave && bookTheyWant) {

            matches.push({
                readerId: reader.id,
                name: reader.name,
                location: reader.location,
                initials:
                    reader.initials ||
                    String(reader.name || "?").trim().charAt(0).toUpperCase(),
                yourBook: {
                    title: bookTheyWant.title,
                    author: bookTheyWant.author
                },
                theirBook: {
                    title: bookTheyHave.title,
                    author: bookTheyHave.author
                }
            });

        }

    });

    return matches;
}


/* =========================
   MATCHES PAGE
========================= */

const matchList =
    document.getElementById("match-list");

function displayMatches() {

    if (!matchList) {
        return;
    }

    const matches =
        findMatches(books, wishlist, demoReaders);


    matchList.innerHTML = "";


    if (matches.length === 0) {

        matchList.innerHTML = `
            <div class="empty-shelf">

                <p>
                    No mutual exchanges yet. A match appears when
                    another reader has a book you're looking for,
                    and wants one you're ready to share.
                </p>

                <p>
                    Keep adding books to your shelf and wishlist.
                    Matches appear as your collection grows.
                </p>

                <div class="empty-shelf-actions">

                    <a href="shelf.html" class="empty-shelf-link">
                        Add a book to your shelf
                    </a>

                    <a href="wishlist.html" class="empty-shelf-link">
                        Add a book to your wishlist
                    </a>

                </div>

            </div>
        `;

        return;
    }


    matches.forEach(function (match) {

        const matchElement =
            document.createElement("article");


        matchElement.classList.add(
            "match"
        );


        matchElement.innerHTML = `

            <div class="match-person">

                <div class="match-avatar">
                    ${match.initials}
                </div>

                <div>
                    <h3>${match.name}</h3>
                    <p>📍 ${match.location}</p>
                </div>

            </div>


            <div class="exchange">

                <div class="exchange-side">
                    <span>You have</span>

                    <strong>
                        ${match.yourBook.title}
                    </strong>

                    <small>
                        ${match.yourBook.author}
                    </small>
                </div>


                <div class="exchange-arrow">
                    ↔
                </div>


                <div class="exchange-side">
                    <span>${match.name} has</span>

                    <strong>
                        ${match.theirBook.title}
                    </strong>

                    <small>
                        ${match.theirBook.author}
                    </small>
                </div>

            </div>


            <div class="match-reason">

                <p>
                    You want ${match.theirBook.title}.
                    ${match.name} wants ${match.yourBook.title}.
                </p>

                <a href="profile.html?reader=${match.readerId}">
                    View reader →
                </a>

            </div>

        `;


        matchList.appendChild(
            matchElement
        );

    });

}


displayMatches();


/* =========================
   READER PROFILE DEEP LINK
========================= */

/*
    profile.html?reader=<id> renders that reader's profile in
    the profile page structure. Without the parameter the page
    shows the current user's editable profile as before.
    (Supersedes the previous modal-based deep link.)
*/

if (typeof URLSearchParams !== "undefined") {

    const readerParam =
        Number(
            new URLSearchParams(
                window.location.search
            ).get("reader")
        );

    const linkedReader =
        readerParam ? findReaderById(readerParam) : null;

    if (linkedReader) {
        displayReaderProfilePage(linkedReader);
    }

}

/* =========================
   CHAT PAGE
========================= */

/*
    Conversation view (chat.html?conversation=<id>): renders
    the other reader, the related exchange/book, the message
    thread, and the compose form. Display only — all storage
    work happens through the CHAT (data model) helpers, so the
    view can later read from Supabase without rewriting.

    Without a resolvable ?conversation= parameter the page
    reopens the thread the user had open last (remembered in
    localStorage), falling back to the most recent one.
*/

function getChatElements() {

    return {
        initials: document.getElementById("chat-initials"),
        name: document.getElementById("chat-reader-name"),
        location: document.getElementById("chat-reader-location"),
        contextBook: document.getElementById("chat-context-book"),
        contextMeta: document.getElementById("chat-context-meta"),
        messages: document.getElementById("chat-messages"),
        form: document.getElementById("chat-compose-form"),
        input: document.getElementById("chat-message-input")
    };

}


/*
    Compact editorial stamp for a message row, e.g.
    "Sep 20, 10:01". Returns "" for anything unparsable.
*/

function formatChatTimestamp(isoTimestamp) {

    const date =
        new Date(isoTimestamp);

    if (isNaN(date.getTime())) {
        return "";
    }

    const month =
        date.toLocaleString("en-US", { month: "short" });

    const day =
        date.getDate();

    const hours =
        String(date.getHours()).padStart(2, "0");

    const minutes =
        String(date.getMinutes()).padStart(2, "0");

    return month + " " + day + ", " + hours + ":" + minutes;

}


function renderChatIdentity(reader, targets) {

    if (!reader || !targets || !targets.initials || !targets.name) {
        return false;
    }

    targets.initials.textContent =
        reader.initials ||
        String(reader.name || "?").trim().charAt(0).toUpperCase();

    targets.name.textContent =
        reader.name;

    if (targets.location) {
        targets.location.textContent =
            reader.location || "";
    }

    return true;

}


/*
    The context strip: which book the thread is about and the
    state of the related request. Threads without a request
    (e.g. started straight from a match) read as open.
*/

function renderChatContext(conversation, targets) {

    if (!conversation || !targets || !targets.contextBook) {
        return false;
    }

    const otherParticipantId =
        getOtherConversationParticipant(conversation, 1);

    const otherReader =
        otherParticipantId
            ? findReaderById(otherParticipantId)
            : null;

    const relatedRequest =
        conversation.requestId
            ? findExchangeRequestById(conversation.requestId)
            : null;

    const book =
        relatedRequest
            ? findBookInfoById(relatedRequest.bookId)
            : null;

    targets.contextBook.textContent =
        book ? book.title : "A book swap";

    if (targets.contextMeta) {

        targets.contextMeta.textContent =
            (relatedRequest
                ? "Request " + relatedRequest.status
                : "Open conversation") +
            (otherReader ? " with " + otherReader.name : "");

    }

    return true;

}


/*
    Thread rows: quiet small-caps "who · when" line above the
    text, own messages pushed right with a quieter label. No
    bubbles — rows and hairlines only.
*/

function renderChatMessages(conversation, targets) {

    if (!conversation || !targets || !targets.messages) {
        return false;
    }

    const messages =
        getConversationMessages(conversation.id);

    targets.messages.innerHTML = "";


    if (messages.length === 0) {

        targets.messages.innerHTML = `
            <div class="chat-empty">
                <p>
                    No messages yet. Say hello.
                </p>
            </div>
        `;

        return true;
    }


    messages.forEach(function (message) {

        const sender =
            findReaderById(message.senderId);

        const senderName =
            message.senderId === 1
                ? "You"
                : (sender ? sender.name : "Reader");

        const isOwn =
            message.senderId === 1;

        const messageElement =
            document.createElement("article");

        messageElement.className =
            isOwn ? "chat-message own" : "chat-message";

        messageElement.innerHTML = `

            <p class="chat-message-from">
                <strong>${senderName}</strong>
                ${formatChatTimestamp(message.createdAt)}
            </p>

            <p class="chat-message-text">
                ${message.text}
            </p>

        `;

        targets.messages.appendChild(messageElement);

    });

    return true;

}


/*
    Submit handler for the compose form. Reads the textarea,
    stores via createMessage (which validates), re-renders the
    thread and clears the field. Blank messages are ignored —
    no error UI needed in the prototype.
*/

function handleChatSubmit(conversation, targets, event) {

    if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
    }

    if (!conversation || !targets || !targets.input) {
        return null;
    }

    const text =
        targets.input.value;

    if (typeof text !== "string" || text.trim() === "") {
        return null;
    }

    const message =
        createMessage({
            conversationId: conversation.id,
            senderId: 1,
            text: text
        });

    if (message) {

        renderChatMessages(conversation, targets);

        targets.input.value = "";

        /* Keep the newest row in view after sending. */

        const messageRows =
            targets.messages.children;

        const newestRow =
            messageRows[messageRows.length - 1];

        if (
            newestRow &&
            typeof newestRow.scrollIntoView === "function"
        ) {
            newestRow.scrollIntoView({ block: "nearest" });
        }

    }

    return message;

}


/*
    Which thread the page should open, in priority order:

    1. ?conversation=<id> deep link, when it resolves
    2. the conversation open last (localStorage memory)
    3. the current user's most recent conversation
*/

function getPreferredConversation() {

    if (typeof URLSearchParams !== "undefined") {

        const conversationParam =
            Number(
                new URLSearchParams(
                    window.location.search
                ).get("conversation")
            );

        const linked =
            conversationParam
                ? findConversationById(conversationParam)
                : null;

        if (linked) {
            return linked;
        }

    }

    const lastOpenedId =
        getLastOpenedConversationId();

    const lastOpened =
        lastOpenedId
            ? findConversationById(lastOpenedId)
            : null;

    if (lastOpened && isConversationParticipant(lastOpened, 1)) {
        return lastOpened;
    }

    return loadConversations()
        .filter(function (item) {
            return isConversationParticipant(item, 1);
        })
        .sort(function (a, b) {
            return b.createdAt.localeCompare(a.createdAt);
        })[0] || null;

}


function displayConversation() {

    const targets =
        getChatElements();

    /* Not the chat page -> do nothing. */
    if (!targets.messages || !targets.form || !targets.input) {
        return null;
    }


    const conversation =
        getPreferredConversation();


    if (!conversation) {

        targets.messages.innerHTML = `
            <div class="chat-empty">
                <p>
                    No conversations yet. Start one from your matches.
                </p>
            </div>
        `;

        /* Still swallow submits so the page never reloads. */
        targets.form.addEventListener("submit", function (event) {
            handleChatSubmit(conversation, targets, event);
        });

        return null;
    }


    /* Remember this thread so a plain reload reopens it. */
    setLastOpenedConversationId(conversation.id);


    const otherParticipantId =
        getOtherConversationParticipant(conversation, 1);

    renderChatIdentity(
        otherParticipantId
            ? findReaderById(otherParticipantId)
            : null,
        targets
    );

    renderChatContext(conversation, targets);

    renderChatMessages(conversation, targets);


    targets.form.addEventListener("submit", function (event) {
        handleChatSubmit(conversation, targets, event);
    });

    return conversation;

}


displayConversation();