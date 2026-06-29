"use client";

import type { NewBook } from "@book-manager/database";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Card, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import type { Author } from "@/model/author";
import type { ActionResult, Book, BookWithAuthor } from "@/model/book";
import BookForm from "./BookForm";

type BookCardProps = {
  bookWithAuthor: BookWithAuthor;
  authors: Author[];
  onDelete: (id: number) => Promise<ActionResult>;
  onSave: (newBook: Book) => Promise<ActionResult>;
};

export default function BookCard({ bookWithAuthor, authors, onDelete, onSave }: BookCardProps) {
  const author: Author = bookWithAuthor.authors;
  const book: Book = bookWithAuthor.books;
  const [editState, setEditState] = useState<boolean>(false);

  function saveBook(newBook: NewBook) {
    const saveBook: Book = {
      ...newBook,
      id: book.id,
      isbn: newBook.isbn ?? undefined,
      year: newBook.year ?? undefined,
    };
    setEditState(false);
    return onSave(saveBook);
  }

  if (editState)
    return (
      <Card className="flex flex-row justify-between p-4">
        <BookForm authors={authors} initialValues={book} onSubmit={saveBook} />
      </Card>
    );

  return (
    <Card className="flex flex-row justify-between p-4">
      <div className="py-1 px-2 grid grid-cols-2 gap-8">
        <div>
          <Typography>{book.title}</Typography>
          <Typography>by {author.name}</Typography>
        </div>
        <div className="w-full">
          {book.isbn ? <Typography>ISBN: {book.isbn}</Typography> : ""}
          {book.year ? <Typography>year: {book.year}</Typography> : ""}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex items-center">
          <IconButton onClick={() => setEditState(true)}>
            <EditIcon />
          </IconButton>
        </div>
        <div className="flex items-center">
          <IconButton onClick={() => onDelete(book.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
