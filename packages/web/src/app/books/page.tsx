"use client";

import { Author } from "@/model/author"
import { useEffect, useState } from "react";
import BookList from "@/components/BookList";
import { BookResponse, BookWithAuthor, Query, Book } from "@/model/book";
import QueryForm from "@/components/QueryForm";
import Pagination from "@mui/material/Pagination";

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
  

  async function submitBook(book: Book): Promise<boolean> {
    return await fetch('http://localhost:3000/api/books', { method: 'POST', body: JSON.stringify(book) })
    .then(res => {
      if(res.status === 201) {
        setUpdatesAvailable(true)
        return true
       }
      return false
    })
  }
  
  async function deleteBook(id: number): Promise<boolean> {
    return await fetch('http://localhost:3000/api/books/' + id, { method: 'DELETE'})
    .then(res => { 
      if(res.status === 200) {
        setUpdatesAvailable(true)
        return true
      }
      return false
    })
  }

  async function saveBook(book: Book): Promise<boolean> {
    return await fetch('http://localhost:3000/api/books/' + book.id,
      { method: 'PUT', body: JSON.stringify(book, (k, v) => v === undefined ? null : v) })
    .then(res => {
      if(res.status === 200) {
        setUpdatesAvailable(true)
        return true
        }
      return false
    })
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
        <BookList
          booksWithAuthors={booksWithAuthors}
          authors={authors}
          onDelete={(id: number) => deleteBook(id)}
          onSave={(newBook: Book) => saveBook(newBook)}
          onAdd={(newBook: Book) => submitBook(newBook)}
        />
      </div>
      {booksWithAuthors.length > 0 &&
        <div className="flex flex-row justify-center">
          <Pagination count={pages} page={query.page || 1} onChange={(e, index: number) => setQuery({...query, page: index})}/>
        </div>
      }
    </div>
  );
}
