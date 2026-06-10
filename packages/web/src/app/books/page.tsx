"use client";

import BookForm from "@/components/BookForm";
import { Book } from "@/model/book"
import { Author } from "@/model/author"
import { useState } from "react";
import BookList from "@/components/BookList";

export default function BooksPage() {

  const [books, setBooks] = useState<Book[]>([
    {title: "Erich und die Detektive", authorId: 1, isbn: "978-8723901576", year: 2006},
    {title: "Der Herr der Diebe", authorId: 2, isbn: "978-3791504575", year: 2000},
    {title: "Die Räuber", authorId: 3, isbn:"978-3126667807", year: 1782}
  ])

  const [authors, setAuthors] = useState<Author[]>([
    {name: "Erich Käster", id: 1},
    {name: "Cornelia Funke", id: 2},
    {name: "Friedrich Schiller", id: 3}
  ])

  return (
    <div>
      <h1>Bücher</h1>
      <p>Diese Seite wird von dir implementiert. Viel Erfolg!</p>
      <div className="grid grid-cols-2 gap-8">
        <BookList
          books={books}
          authors={authors}
          onDelete={(title: string, authorId: number) => setBooks(books.filter((book) => book.title !== title || book.authorId !== authorId))}          
        />
        <BookForm
          authors={authors}
          onSubmit={(book) => setBooks([...books, book])}
        />
      </div>
    </div>
  );
}
