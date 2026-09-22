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

const defaultReaders = [
    {
        id: 1,
        name: "Amara",
        area: "Yaba",
        books: 4,
        initials: "AM"
    },
    {
        id: 2,
        name: "Daniel",
        area: "Surulere",
        books: 7,
        initials: "DA"
    },
    {
        id: 3,
        name: "Tomi",
        area: "Ikeja",
        books: 3,
        initials: "TO"
    },
    {
        id: 4,
        name: "Maya",
        area: "Gbagada",
        books: 5,
        initials: "MY"
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
            `cover-${index + 1}`;


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
                event.target ===
                addBookSection
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

            const coverClass =
                `cover-${index + 1}`;


            bookElement.innerHTML = `

                <div
                    class="
                        discover-book-cover
                        ${book.image ? "" : "placeholder"}
                        ${book.image ? "" : coverClass}
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
   DEBUG
========================= */

console.log(
    "BookXchange books:",
    books
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


            console.log(
                "Exchange request:",
                {
                    bookId:
                        requestedBookId,

                    message:
                        message
                }
            );


            requestForm.reset();

            closeRequestModal();


            alert(
                "Your exchange request has been sent."
            );

        }
    );

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


function displayNearbyReaders() {

    if (!nearbyList) return;


    nearbyList.innerHTML = "";


    if (nearbyCount) {

        nearbyCount.textContent =
            defaultReaders.length === 1
                ? "1 reader"
                : `${defaultReaders.length} readers`;
    }


    if (defaultReaders.length === 0) {

        nearbyList.innerHTML = `
            <div class="nearby-empty">
                No readers found nearby yet.
            </div>
        `;

        return;
    }


    defaultReaders.forEach(
        function (reader) {

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
                        ${reader.area}
                    </p>

                </div>


                <div class="reader-books">
                    ${reader.books}
                    ${
                        reader.books === 1
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
        defaultReaders.find(
            function (reader) {
                return reader.id === readerId;
            }
        );

    if (!reader || !readerProfileModal) {
        return;
    }


    readerProfileInitials.textContent =
        reader.initials;

    readerProfileName.textContent =
        reader.name;

    readerProfileArea.textContent =
        reader.area;


    /*
        For now, give each seed reader
        a few books from our existing
        available books.

        Later this will come directly
        from that user's Supabase data.
    */

    const availableBooks =
        books.filter(function (book) {
            return book.status === "available";
        });


    readerBooksGrid.innerHTML = "";


    if (availableBooks.length === 0) {

        readerBooksGrid.innerHTML = `
            <div class="reader-books-empty">
                This reader has no books available
                for exchange right now.
            </div>
        `;

    } else {

        availableBooks
            .slice(0, 3)
            .forEach(function (book, index) {

                const bookElement =
                    document.createElement(
                        "article"
                    );

                bookElement.classList.add(
                    "reader-book"
                );


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


                readerBooksGrid.appendChild(
                    bookElement
                );

            });
    }


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
   PROFILE
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
    location: "Lagos, Nigeria",
    bio: "A reader who believes good books should keep moving."
};


let profile = JSON.parse(
    localStorage.getItem("bookxchangeProfile")
) || defaultProfile;


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