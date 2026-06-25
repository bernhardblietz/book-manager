"use client"

import { ActionResult, BookResponse, BookWithAuthor } from "@/model/book"
import BookCard from "@/components/BookCard"
import { Book } from "@/model/book"
import Typography from "@mui/material/Typography"
import { Author } from "@/model/author"
import { startTransition, useOptimistic } from "react"
import { toast } from "sonner"
import { submitBook } from "@/app/actions"
import BookForm from "./BookForm"

type BookListProps = {
    bookResponse: BookResponse
    authors: Author[]
    onDelete: (id: number) => Promise<ActionResult>
    onSave: (newBook: Book) => Promise<ActionResult>
    onAdd: (newBook: Book) => Promise<ActionResult>
}

export default function BookList({ bookResponse, authors, onDelete, onSave, onAdd }: BookListProps) {
    
    const [optimisticBooks, setOptimisticBooks] = useOptimistic<BookWithAuthor[]>(bookResponse.data)

    function deleteBook (id: number) {
        startTransition(async () => {
            setOptimisticBooks(optimisticBooks.filter(item => item.books.id !== id))
            const result: ActionResult = await onDelete(id);
            if (result.success){
                toast.success("Book with ID: " + result.data?.id + " deleted successfully.")
                return
            }
            toast.error(result.error + " Reverting.")
            setOptimisticBooks(bookResponse.data)
        })
    }

    function saveBook (newBook: Book) {
        startTransition(async () => {
            setOptimisticBooks(optimisticBooks.map((item) => item.books.id === newBook.id ? {authors: item.authors, books: newBook} : item ))
            const result: ActionResult = await onSave(newBook)
            if (result.success){
                toast.success("Book with ID: " + result.data?.id + " saved successfully.")
                return
            }
            toast.error(result.error + " Reverting.")
            setOptimisticBooks(bookResponse.data)
        })
    }

    function addBook (newBook: Book) {
        startTransition(async () => {
            const author = authors.find(author => author.id === newBook.authorId) || {id: -1, name: "unknown Author"}
            const dummyBook = {...newBook, id: -1}
            const dummyBookWithAuthor: BookWithAuthor = {books: dummyBook, authors: author}
            setOptimisticBooks([...optimisticBooks, dummyBookWithAuthor])
            const result: ActionResult = await onAdd(newBook)
            if (result.success){
                toast.success("Book with ID: " + result.data?.id + " added successfully.")
                return
            }
            toast.error(result.error + " Reverting.")
            setOptimisticBooks(bookResponse.data)
        })
    }

    return (
        <div className="flex flex-row gap-8 w-full">
            <div className="w-full flex flex-col gap-2">
                {bookResponse.data.map((bookWithAuthor) => (
                        <div key={bookWithAuthor.books.id}>
                            <BookCard
                                bookWithAuthor={bookWithAuthor}
                                authors={authors}
                                onDelete={deleteBook}
                                onSave={saveBook}
                            />
                        </div>
                    ))}
                {bookResponse.data.length === 0 && <Typography className="w-full text-center">Keine Bücher gefunden.</Typography>}
            </div>
            <BookForm
                authors={authors}
                onSubmit={addBook}
            />
        </div>
    )
}