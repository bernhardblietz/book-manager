import { authors, books, db } from "@book-manager/database";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";

const BookPutSchema = z.object({
  title: z.string().min(1).optional(),
  authorId: z.int().positive().optional(),
  isbn: z.string().nullish(),
  year: z.int().nullish(),
});

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  try {
    const res = await db
      .select()
      .from(books)
      .where(eq(books.id, Number(id)))
      .innerJoin(authors, eq(books.authorId, authors.id));
    if (res.length < 1)
      return NextResponse.json({ error: `No book with id ${id} found` }, { status: 404 });
    return NextResponse.json(res);
  } catch {
    return NextResponse.json(
      { error: `An unexpected error occured while trying to fetch a book with id ${id}` },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  try {
    const res = await db
      .delete(books)
      .where(eq(books.id, Number(id)))
      .returning();
    if (res.length < 1)
      return NextResponse.json({ error: `No book with id ${id} found` }, { status: 404 });
    return NextResponse.json({ deleted: res });
  } catch {
    return NextResponse.json(
      { error: `An unexpected error occured while trying to delete a book with id ${id}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/books/[id]">) {
  const { id } = await ctx.params;
  const json = await request.json();
  const result = BookPutSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json(z.treeifyError(result.error), { status: 400 });
  }

  const book = result.data;
  try {
    const res = await db
      .update(books)
      .set(book)
      .where(eq(books.id, Number(id)))
      .returning();
    if (res.length < 1)
      return NextResponse.json({ error: `No book with id ${id} found` }, { status: 404 });
    return NextResponse.json({ updated: res });
  } catch {
    return NextResponse.json(
      { error: `An unexpected error occured while trying to save a book with id ${id}` },
      { status: 500 },
    );
  }
}
