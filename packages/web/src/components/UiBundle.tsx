"use client";

import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import type { Author } from "@/model/author";
import type { BookResponse, Query } from "@/model/book";
import QueryForm from "./QueryForm";

type UiBundleProps = {
  initialQuery: Query;
  authors: Author[];
  bookResponse: BookResponse;
  children?: ReactNode;
};

export default function UiBundle({ bookResponse, initialQuery, authors, children }: UiBundleProps) {
  const [query, setQuery] = useState<Query>(initialQuery);
  const pagecount = Math.ceil(bookResponse.total / bookResponse.pageSize);

  const router = useRouter();

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(query).forEach((entry) => {
      newSearchParams.set(entry[0], entry[1].toString());
    });

    router.push(`/books?${newSearchParams}`);
  }, [query, router.push]);

  return (
    <div>
      <h1>Bücher</h1>
      <div className="flex flex-row gap-8">
        <QueryForm initialValues={query} onSubmit={setQuery} authors={authors} />
        <div className="flex flex-col gap-8 items-center w-full">
          {children}
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <Pagination
            count={pagecount}
            page={bookResponse.page}
            onChange={(_e, index) => setQuery({ ...query, page: index })}
        />
      </div>
    </div>
  );
}
