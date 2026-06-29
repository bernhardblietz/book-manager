"use client";

import type { NewBook } from "@book-manager/database";
import Typography from "@mui/material/Typography";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import BookCard from "@/components/BookCard";
import type { Author } from "@/model/author";
import type { ActionResult, Book, BookResponse, BookWithAuthor } from "@/model/book";
import BookForm from "./BookForm";

type BookListProps = {
  bookResponse: BookResponse;
  authors: Author[];
  onDelete: (id: number) => Promise<ActionResult>;
  onSave: (newBook: Book) => Promise<ActionResult>;
  onAdd: (newBook: NewBook) => Promise<ActionResult>;
};

export default function BookList({
  bookResponse,
  authors,
  onDelete,
  onSave,
  onAdd,
}: BookListProps) {
  const [optimisticBooks, setOptimisticBooks] = useOptimistic<BookWithAuthor[]>(bookResponse.data);

  function deleteBook(id: number): Promise<ActionResult> {
    return new Promise((resolve) => {
      startTransition(async () => {
        setOptimisticBooks(optimisticBooks.filter((item) => item.books.id !== id));
        const result: ActionResult = await onDelete(id);
        if (result.success) {
          toast.success(`Book with ID: ${result.data?.id} deleted successfully.`);
          resolve(result);
          return;
        }
        toast.error(`${result.error} Reverting.`);
        setOptimisticBooks(bookResponse.data);
        resolve(result);
      });
    });
  }

  function saveBook(newBook: Book): Promise<ActionResult> {
    return new Promise((resolve) => {
      startTransition(async () => {
        setOptimisticBooks(
          optimisticBooks.map((item) =>
            item.books.id === newBook.id ? { authors: item.authors, books: newBook } : item,
          ),
        );
        const result: ActionResult = await onSave(newBook);
        if (result.success) {
          toast.success(`Book with ID: ${result.data?.id} saved successfully.`);
          resolve(result);
          return;
        }
        toast.error(`${result.error} Reverting.`);
        setOptimisticBooks(bookResponse.data);
        resolve(result);
      });
    });
  }

  function addBook(newBook: NewBook): Promise<ActionResult> {
    return new Promise((resolve) => {
      startTransition(async () => {
        const author = authors.find((author) => author.id === newBook.authorId) || {
          id: -1,
          name: "unknown Author",
        };
        const dummyBook: Book = {
          ...newBook,
          id: -1,
          isbn: newBook.isbn ?? undefined,
          year: newBook.year ?? undefined,
        };
        const dummyBookWithAuthor: BookWithAuthor = { books: dummyBook, authors: author };
        setOptimisticBooks([...optimisticBooks, dummyBookWithAuthor]);
        const result: ActionResult = await onAdd(newBook);
        if (result.success) {
          toast.success(`Book with ID: ${result.data?.id} added successfully.`);
          resolve(result);
          return;
        }
        toast.error(`${result.error} Reverting.`);
        setOptimisticBooks(bookResponse.data);
        resolve(result);
      });
    });
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
        {bookResponse.data.length === 0 && (
          <Typography className="w-full text-center">Keine Bücher gefunden.</Typography>
        )}
      </div>
      <BookForm authors={authors} onSubmit={addBook} />
    </div>
  );
}
