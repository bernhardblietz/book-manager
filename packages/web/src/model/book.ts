import z from "zod";
import { Author } from "./author";

export type Book = {
    id: number;
    title: string;
    authorId: number;
    isbn?: string;
    year?: number;
}

export type BookWithAuthor = {
  books: Book,
  authors: Author
}

export type BookResponse = {
  data: BookWithAuthor[]
  page: number
  pageSize: number
  total: number
}

export type Query = {
  page?: number
  pageSize?: number
  authorId?: number
  q?: string
}