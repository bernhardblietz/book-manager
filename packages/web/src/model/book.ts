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

export const BookSchema = z.object({
  title: z.string().min(1),
  authorId: z.int().positive(),
  isbn: z.string().optional(),
  year: z.int().optional(),
})