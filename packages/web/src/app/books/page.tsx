"use server";

import UiBundle from "@/components/UiBundle";
import { BookResponse, Query } from "@/model/book";
import { deleteBook, fetchAuthors, fetchBooks, saveBook, submitBook } from "../actions";
import BookList from "@/components/BookList";
import { Author } from "@/model/author";
import z from "zod";

type BooksPageProps = {
  searchParams: Promise<Query>
}

const QueryParser = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  authorId: z.coerce.number().int().positive().optional(),
  q: z.string().optional(),
})

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const parseResult = QueryParser.safeParse(await searchParams)

  let query
  if(parseResult.success){
    query = parseResult.data
  } else {
    console.log("error parsing searchParams: " + parseResult.error)
    query = {}
  }

  const authors: Author[] = await fetchAuthors()
  const bookResponse: BookResponse = await fetchBooks(query)

  return (
    <UiBundle
      initialQuery={query}
      authors={authors}
      bookResponse={bookResponse}
    >
      <BookList
        bookResponse={bookResponse}
        authors={authors}
        onDelete={deleteBook}
        onSave={saveBook}
        onAdd={submitBook}
      />
    </UiBundle>
  )
}