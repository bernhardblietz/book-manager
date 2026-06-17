"use client";

import BookForm from "@/components/BookForm";
import { Author } from "@/model/author"
import { useEffect, useState } from "react";
import BookList from "@/components/BookList";
import { BookResponse, BookWithAuthor, Query } from "@/model/book";
import { NewBook } from "@book-manager/database";
import QueryForm from "@/components/QueryForm";
import Pagination from "@mui/material/Pagination";
import { Typography } from "@mui/material";

async function fetchBooks(query: Query): Promise<BookResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  const url = `http://localhost:3000/api/books?${params.toString()}`;
  return await fetch(url).then(res => res.json())
}

async function fetchAuthors(): Promise<Author[]> {
  return await fetch("http://localhost:3000/api/authors").then(res => res.json())
}

export default function BooksPage() {

  const [booksWithAuthors, setBooksWithAuthors] = useState<BookWithAuthor[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [updatesAvailable, setUpdatesAvailable] = useState<Boolean>(false)
  const [query, setQuery] = useState<Query>({})
  const [pages, setPages] = useState<number>(0)

  useEffect(() => {
    async function loadAuthors() {
      setAuthors([]);
      const authors = await fetchAuthors();
      setAuthors(authors);
    }

    async function loadBooks(query: Query) {
      setBooksWithAuthors([]);
      const response = await fetchBooks(query);
      setBooksWithAuthors(response.data);
      setPages(Math.ceil(response.total / response.pageSize));
    }

    loadAuthors();
    loadBooks(query);
    return () => {
      setUpdatesAvailable(false)
    }
  }, [updatesAvailable, query]);

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
      <div className="flex flex-row gap-8">
        <QueryForm
          initialValues={{page: 1, pageSize: 20}}
          onSubmit={(query) => setQuery(query)}
          authors={authors}
        />
        {booksWithAuthors.length > 0 &&
        <BookList
          booksWithAuthors={booksWithAuthors}
          authors={authors}
          onDelete={(id: number) => deleteBook(id)}
          onSave={(id: number, newBook: NewBook) => saveBook(id, newBook)}
        /> ||
         <Typography className="w-full text-center">Keine Bücher gefunden.</Typography>
         }
        <div data-testid="SubmitForm">
          <BookForm
            authors={authors}
            onSubmit={(book: NewBook) => submitBook(book)}
          />
        </div>
      </div>
      {booksWithAuthors.length > 0 &&
        <div className="flex flex-row justify-center">
          <Pagination count={pages} onChange={(e, index) => setQuery({authorId: query.authorId, page: index, pageSize: query.pageSize, q: query.q})}/>
        </div>
      }
    </div>
  );
}
