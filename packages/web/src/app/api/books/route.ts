import { authors, books, db } from "@book-manager/database";
import { eq, ilike, asc, SQL, and, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const BookPostSchema = z.object({
  title: z.string().min(1),
  authorId: z.int().positive(),
  isbn: z.string().nullish(),
  year: z.int().nullish(),
})

export const QuerySchema = z.object({
  pageNumber: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  authorId: z.coerce.number().min(1).optional(),
  queryText: z.string().optional(),
})

export async function GET(request: NextRequest) {

  const params = request.nextUrl.searchParams

  const queryRaw = { 
    queryText: params.get("q") ?? undefined, 
    authorId: params.get("authorId") ?? undefined, 
    pageNumber: params.get("page") ?? undefined, 
    pageSize: params.get("pageSize") ?? undefined
  }

  const result = QuerySchema.safeParse(queryRaw)

  if (!result.success){
      return NextResponse.json(z.treeifyError(result.error), {status: 400});
  }

  const query = result.data
  const filters: SQL[] = [];

  if (query.queryText) filters.push(ilike(books.title, query.queryText));
  if (query.authorId) filters.push(eq(books.authorId, query.authorId));

  try {
    const data = await db.select().from(books)
    .where(and(...filters))
    .innerJoin(authors, eq(books.authorId, authors.id))
    .orderBy(asc(books.id))
    .limit(query.pageSize)
    .offset((query.pageNumber-1) * query.pageSize)

    const total = await db.select({ count: count() }).from(books).where(and(...filters))

    return NextResponse.json({ data, page: query.pageNumber, pageSize: query.pageSize, total: total[0].count });
  } catch {
    return NextResponse.json({ error: "An unexpected error occured while trying to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const result = BookPostSchema.safeParse(json);
  
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