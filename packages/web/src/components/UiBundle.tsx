"use client"

import { submitBook } from "@/app/actions"
import { Author } from "@/model/author"
import { Book, BookResponse, Query } from "@/model/book"
import { ReactNode, useEffect, useState } from "react"
import QueryForm from "./QueryForm"
import BookForm from "./BookForm"
import Pagination from "@mui/material/Pagination"
import React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type UiBundleProps = {
    initialQuery: Query
    authors: Author[]
    bookResponse: BookResponse
    children?: ReactNode
}

export default function UiBundle({ bookResponse, initialQuery, authors, children }: UiBundleProps) {

  const [query, setQuery] = useState<Query>(initialQuery)
  const pagecount = Math.ceil(bookResponse.total / bookResponse.pageSize)

  const router = useRouter()

  async function onSubmit(book: Book) {
    if(await submitBook(book)){
      toast.success("Book added successfully.")
      return
    }
    toast.error("An Error occured while trying to add the Book.")
  }

  useEffect(() => {
    const newSearchParams = new URLSearchParams
    Object.entries(query).forEach((entry) => {
      newSearchParams.set(entry[0], entry[1].toString())
    });
    
    router.push(`/books?${newSearchParams}`)
  }, [query])

  return (
    <div>
      <h1>Bücher</h1>
      <div className="flex flex-row gap-8">
        <QueryForm
          initialValues={query}
          onSubmit={setQuery}
          authors={authors}
        />
        <div className="flex flex-col gap-8 items-center w-full">
            {children}
            <Pagination count={pagecount} page={bookResponse.page} onChange={(e, index) => setQuery({...query, page: index})}/>
        </div>
      </div>
    </div>
  );
}