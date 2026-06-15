"use client";

import BookForm from "@/components/BookForm";
import { Author } from "@/model/author"
import { useEffect, useState } from "react";
import BookList from "@/components/BookList";
import { BookWithAuthor } from "@/model/book";
import { NewBook } from "@book-manager/database";

async function fetchBooksWithAuthors(): Promise<BookWithAuthor[]> {
  return await fetch("http://localhost:3000/api/books").then(res => res.json())
}

async function fetchAuthors(): Promise<Author[]> {
  return await fetch("http://localhost:3000/api/authors").then(res => res.json())
}

export default function BooksPage() {

  const [booksWithAuthors, setBooksWithAuthors] = useState<BookWithAuthor[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [updatesAvailable, setUpdatesAvailable] = useState<Boolean>(false)

  useEffect(() => {
    async function loadAuthors() {
      setAuthors([]);
      const authors = await fetchAuthors();
      setAuthors(authors);
    }

    async function loadBooksWithAuthors() {
      setBooksWithAuthors([]);
      const books = await fetchBooksWithAuthors();
      setBooksWithAuthors(books);
    }

    loadAuthors();
    loadBooksWithAuthors();
    return () => {
      setUpdatesAvailable(false)
    }
  }, [updatesAvailable]);

  function submitBook(book: NewBook) {
    fetch('http://localhost:3000/api/books', { method: 'POST', body: JSON.stringify(book) })
    .then(res => { if(res.status === 201) setUpdatesAvailable(true) })
  }
  
  function deleteBook(id: number) {
    fetch('http://localhost:3000/api/books/' + id, { method: 'DELETE'})
    .then(res => { if(res.status === 200) setUpdatesAvailable(true) })
  }

  function saveBook(id: number, book: NewBook) {
    fetch('http://localhost:3000/api/books/' + id, { method: 'PUT', body: JSON.stringify(book) })
    .then(res => { if(res.status === 200) setUpdatesAvailable(true) })
  }

  return (
    <div>
      <h1>Bücher</h1>
      <p>Diese Seite wird von dir implementiert. Viel Erfolg!</p>
      <div className="flex flex-row justify-between gap-8">
        <BookList
          booksWithAuthors={booksWithAuthors}
          authors={authors}
          onDelete={(id: number) => deleteBook(id)}
          onSave={(id: number, newBook: NewBook) => saveBook(id, newBook)}
        />
        <BookForm
          authors={authors}
          onSubmit={(book: NewBook) => submitBook(book)}
        />
      </div>
    </div>
  );
}
