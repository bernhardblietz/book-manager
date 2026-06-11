import { BookWithAuthor } from "@/model/book"
import BookCard from "./BookCard"

type BookListProps = {
    booksWithAuthors: BookWithAuthor[]
    onDelete: Function
}

export default function BookList({ booksWithAuthors, onDelete }: BookListProps) {
    return(
        <div className="flex flex-col gap-2">
             {booksWithAuthors.map((bookWithAuthor) => (
                    <div key={bookWithAuthor.books.id}>
                        <BookCard
                            book={bookWithAuthor.books}
                            author={bookWithAuthor.authors}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
        </div>
    )
}