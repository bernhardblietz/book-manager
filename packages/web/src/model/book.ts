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