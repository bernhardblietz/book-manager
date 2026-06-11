import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { BookSchema } from "@/model/book"
import z from "zod";

export async function GET() {
  try {
    const res = await db.select().from(books).innerJoin(authors, eq(books.authorId, authors.id))
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const result = BookSchema.safeParse(json);
  
  if (!result.success){
    return NextResponse.json(z.treeifyError(result.error), {status: 400});
  }
  
  const book = result.data

  try {
    if(book.isbn != undefined && (await db.select().from(books).where(eq(books.isbn, book.isbn))).length > 0)
    return NextResponse.json({ error: "ISBN already in use"}, {status: 422});
    const res = await db.insert(books).values(book).returning();
    return NextResponse.json({created: res}, {status: 201});
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to create new Book"}, { status: 500 });
  } 
}