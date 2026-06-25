"use server"

import { eq, ilike, SQL, and, asc, count } from "drizzle-orm";
import { ActionResult, Book, BookResponse, PartialBook, Query } from "@/model/book";
import { Author, authors, books, db } from "@book-manager/database";
import { revalidatePath } from "next/cache";

type DbBookResult = {
  id: number
  title: string
  authorId: number
  isbn: string | null
  year: number | null
}

function dbResultToBook(book: DbBookResult): Book {
  return {
    id: book.id,
    title: book.title,
    authorId: book.authorId,
    isbn: book.isbn ?? undefined,
    year: book.year ?? undefined,
  } as Book
}


  export async function fetchBooks(query: Query): Promise<BookResponse> {
    const filters: SQL[] = [];
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    if (query.q) filters.push(ilike(books.title, query.q));
    if (query.authorId) filters.push(eq(books.authorId, query.authorId));

    const data = await db.select().from(books).where(and(...filters))
        .innerJoin(authors, eq(books.authorId, authors.id))
        .orderBy(asc(books.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

    const total = await db.select({ count: count() }).from(books).where(and(...filters))

    return { data, page, pageSize, total: total[0].count } as BookResponse
  }


  export async function submitBook(book: Book): Promise<ActionResult> {
    try {
        if(book.isbn != undefined && (await db.select().from(books).where(eq(books.isbn, book.isbn))).length > 0) {
            return {success: false, error: "ISBN: " + book.isbn +  " already in use."}
        }
        const [insertedBook] = await db.insert(books).values(book).returning()
        revalidatePath("/books")
        return {success: true, data: dbResultToBook(insertedBook)}
    } catch {
        return {success: false, error: "An unexpected Error occured while trying to add Book with Title: " + book.title} 
    }
  }
  

  export async function deleteBook(id: number): Promise<ActionResult> {
    try {
        const [insertedBook] = await db.delete(books).where(eq(books.id, id)).returning()
        revalidatePath("/books")
        return {success: true, data: dbResultToBook(insertedBook)}
    } catch {
        return {success: false, error: "An unexpected Error occured while trying to delete book with ID: " + id} 
    }
  }


  export async function saveBook(book: Book): Promise<ActionResult> {
    try {
        const [insertedBook] = await db.update(books).set(book).where(eq(books.id, book.id)).returning()
        revalidatePath("/books")
        return {success: true, data: dbResultToBook(insertedBook)}
    } catch {
        return {success: false, error: "An unexpected Error occured while trying to save Book with ID: " + book.id} 
    }
  }

  export async function fetchAuthors(): Promise<Author[]> {
    return db.select().from(authors)
  }