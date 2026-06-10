import { Book } from "@/model/book"
import { Author } from '@/model/author'
import BookCard from "./BookCard"

type BookListProps = {
    books: Book[],
    authors: Author[]
    onDelete: Function
}

export default function BookList({ books, authors, onDelete }: BookListProps) {
    return(
        <div className="flex flex-col gap-2">
             {books.map((book) => (
                    <div key={book.title + book.authorId}>
                        <BookCard
                            book={book}
                            author={authors.find(author => author.id === book.authorId) ?? {id: -1, name: "Unbekannt"}}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
        </div>
    )
}