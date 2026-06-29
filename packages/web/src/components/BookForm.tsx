"use client";

import type { Book } from "@book-manager/database";
import React from "react";
import type { Author } from "@/model/author";
import type { ActionResult, PartialBook } from "@/model/book";
import type { FormError } from "@/model/form";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import z from "zod";

type BookFormProps = {
  initialValues?: PartialBook;
  authors: Author[];
  onSubmit: (newBook: Book) => Promise<ActionResult>;
  submitLabel?: string;
};

export default function BookForm({
  initialValues,
  authors,
  onSubmit,
  submitLabel = "Buch speichern",
}: BookFormProps) {
  const [id, _setId] = React.useState(initialValues?.id);
  const [title, setTitle] = React.useState(initialValues?.title);
  const [authorId, setAuthorId] = React.useState(initialValues?.authorId);
  const [isbn, setIsbn] = React.useState(initialValues?.isbn);
  const [year, setYear] = React.useState(initialValues?.year);
  const [errors, setErrors] = React.useState<FormError[]>([]);


  const BookFormSchema = z.object({
    title: z.string().min(1),
    authorId: z.int().min(1).positive(),
    isbn: z.string().optional(),
    year: z.int().min(1).optional(),
  });

  function submitBook() {
    const result = z.safeParse(BookFormSchema, { title, authorId, isbn, year });
    if (result.success) {
      onSubmit({ title, authorId, isbn, year } as Book);
      setTitle(initialValues?.title);
      setAuthorId(initialValues?.authorId);
      setIsbn(initialValues?.isbn);
      setYear(initialValues?.year);
      setErrors([])
    } else {
      const tree = z.treeifyError(result.error);
      const formErrors = Object.entries(tree.properties ?? {}).reduce<FormError[]>(
        (acc, [scope, property]) => {
          acc.push({
            scope,
            message: property.errors.join("\n"),
          });
          return acc;
        },
        [],
      );

      setErrors(formErrors);
    }
  }

  function clearErrorFromScope(scope: string) {
    setErrors(errors.filter((err) => err.scope !== scope));
  }

  function validateYear(s: string) {
    if (s === "") return setYear(undefined);
    if (s.match(/[1-9]/) && Number(s) > 0) setYear(Number(s));
  }

  return (
    <form className="min-w-3xs">
      <Input
        label="Titel"
        name="title"
        value={title ?? ""}
        onChange={(e) => {
          setTitle(e.target.value);
          clearErrorFromScope("title");
        }}
        error={errors.find((err) => err.scope === "title")?.message}
        required
      />
      <Select
        label="Autor"
        name="authorId"
        value={authorId ?? -1}
        onChange={(e) => {
          setAuthorId(Number(e.target.value));
          clearErrorFromScope("authorId");
        }}
        options={authors.map((author) => ({ value: author.id, label: author.name }))}
        emptyText="Bitte wählen"
        error={errors.find((err) => err.scope === "authorId")?.message}
        required
      />
      <Input
        label="ISBN"
        name="isbn"
        type="text"
        value={isbn ?? ""}
        onChange={(e) => setIsbn(e.target.value ? e.target.value : undefined)}
      />
      <Input
        label="Jahr"
        name="year"
        type="text"
        value={year ?? ""}
        onChange={(e) => {
          validateYear(e.target.value);
          clearErrorFromScope("year");
        }}
        error={errors.find((err) => err.scope === "year")?.message}
      />
      <Button variant="primary" type="button" onClick={submitBook}>
        {submitLabel}
      </Button>
    </form>
  );
}
