import { BookWithAuthor } from "@/model/book"
import BookCard from "./BookCard"
import { Author } from "@/model/author"

type BookListProps = {
    booksWithAuthors: BookWithAuthor[]
    authors: Author[]
    onDelete: Function
    onSave: Function
}

export default function BookList({ booksWithAuthors, authors, onDelete, onSave }: BookListProps) {
    return(
        <div className="w-full flex flex-col gap-2">
             {booksWithAuthors.map((bookWithAuthor) => (
                    <div key={bookWithAuthor.books.id}>
                        <BookCard
                            bookWithAuthor={bookWithAuthor}
                            authors={authors}
                            onDelete={onDelete}
                            onSave={onSave}
                        />
                    </div>
                ))}
        </div>
    )
}