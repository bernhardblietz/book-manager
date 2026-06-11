import { authors, Book, books, db, NewBook } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await db.select().from(books).innerJoin(authors, eq(books.authorId, authors.id))
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const {title, authorId, isbn, year}: Book = await request.json();
  
  if(!title) return NextResponse.json({ error: "Missing field: title"}, {status: 400});
  if(!authorId) return NextResponse.json({ error: "Missing field: authorId"}, {status: 400});
  if(isbn != undefined && (await db.select().from(books).where(eq(books.isbn, isbn))).length > 0)
    return NextResponse.json({ error: "ISBN already in use"}, {status: 422});

  try {
    const newBook: NewBook = {title: title, authorId: authorId, isbn: isbn, year: year};
    const res = await db.insert(books).values(newBook).returning();
    return NextResponse.json({created: res}, {status: 201});
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to create new Book"}, { status: 500 });
  } 
}