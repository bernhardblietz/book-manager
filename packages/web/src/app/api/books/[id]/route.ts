import { authors, Book, books, db, NewBook } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  try {
    const res = await db.select().from(books).where(eq(books.id, Number(id))).innerJoin(authors, eq(books.authorId, authors.id));
    if (res.length < 1) return NextResponse.json({ error: "No book with id " + id + " found" }, { status: 404 })
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to fetch a book with id " + id }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  try {
    const res = await db.delete(books).where(eq(books.id, Number(id))).returning()
    if (res.length < 1) return NextResponse.json({ error: "No book with id " + id + " found" }, { status: 404 })
    return NextResponse.json({deleted: res})
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to delete a book with id " + id }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  const {title, authorId, isbn, year}: NewBook = await request.json();
  try {
    const res = await db.update(books).set({title, authorId, isbn, year}).where(eq(books.id, Number(id))).returning();
    if (res.length < 1) return NextResponse.json({ error: "No book with id " + id + " found" }, { status: 404 })
    return NextResponse.json({updated: res});
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to fetch a book with id " + id }, { status: 500 });
  }
}