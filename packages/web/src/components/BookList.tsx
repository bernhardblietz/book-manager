import { BookWithAuthor } from "@/model/book"
import BookCard from "./BookCard"
import { Author } from "@/model/author"
import { startTransition, useOptimistic } from "react"
import { Book } from "@/model/book"
import BookForm from "./BookForm"
import { Typography } from "@mui/material"

type BookListProps = {
    booksWithAuthors: BookWithAuthor[]
    authors: Author[]
    onDelete: (id: number) => Promise<boolean>
    onSave: (newBook: Book) => Promise<boolean>
    onAdd: (newBook: Book) => Promise<boolean>
}

export default function BookList({ booksWithAuthors, authors, onDelete, onSave, onAdd }: BookListProps) {
    const [optimisticBooks, setOptimisticBooks] = useOptimistic<BookWithAuthor[]>(booksWithAuthors)

    function deleteBook (id: number) {
        startTransition(async () => {
            setOptimisticBooks(optimisticBooks.filter(item => item.books.id !== id))
            const success = await onDelete(id);
            if (!success) setOptimisticBooks(booksWithAuthors)
        })
    }

    function saveBook (newBook: Book) {
        startTransition(async () => {
            setOptimisticBooks(optimisticBooks.map((item) => item.books.id === newBook.id ? {authors: item.authors, books: newBook} : item ))
            const success = await onSave(newBook)
            if(!success) setOptimisticBooks(booksWithAuthors)
        })
    }

    function addBook (newBook: Book) {
        startTransition(async () => {
            const author = authors.find(author => author.id === newBook.authorId) || {id: -1, name: "unknown Author"}
            const dummyBook = {...newBook, id: -1}
            const dummyBookWithAuthor: BookWithAuthor = {books: dummyBook, authors: author}
            setOptimisticBooks([...optimisticBooks, dummyBookWithAuthor])
            const success = await onAdd(newBook)
            if(!success) setOptimisticBooks(booksWithAuthors)
        })
    }

    return(
        <div className="flex flex-row gap-8 w-full">
            <div className="w-full flex flex-col gap-2">
                {optimisticBooks.map((bookWithAuthor) => (
                        <div key={bookWithAuthor.books.id}>
                            <BookCard
                                bookWithAuthor={bookWithAuthor}
                                authors={authors}
                                onDelete={deleteBook}
                                onSave={saveBook}
                            />
                        </div>
                    ))}
                {optimisticBooks.length === 0 && <Typography className="w-full text-center">Keine Bücher gefunden.</Typography>}
            </div>
            <BookForm data-testid="SubmitForm"
                authors={authors}
                onSubmit={(book: Book) => addBook(book)}
            />
        </div>
    )
}