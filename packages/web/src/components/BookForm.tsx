import React from "react"
import Button from "./ui/Button"
import Input from "./ui/Input"
import Select from "./ui/Select"
import { Book } from "@/model/book"
import { Author } from '@/model/author'
import { NewBook } from "@book-manager/database"

type BookFormProps = {
    initialValues?: Book | undefined
    authors: Author[]
    onSubmit: (values: NewBook) => void
    submitLabel?: string
}

export default function BookForm({ initialValues, authors, onSubmit, submitLabel = "Buch speichern" }: BookFormProps) {
    const [title, setTitle] = React.useState(initialValues?.title || "")
    const [authorId, setAuthorId] = React.useState(initialValues?.authorId || -1)
    const [isbn, setIsbn] = React.useState(initialValues?.isbn || "")
    const [year, setYear] = React.useState(initialValues?.year || "")

    function submitBook(){
        const newBook: NewBook = { title, authorId, isbn: isbn ? isbn : undefined, year: typeof year === "number" ? year : undefined }
        onSubmit(newBook)
        setTitle(initialValues?.title ?? "")
        setAuthorId(initialValues?.authorId ?? -1)
        setIsbn(initialValues?.isbn ?? "")
        setYear(initialValues?.year ?? "")
    }

    return (
        <>
            <form>
                <Input label="Titel" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Select
                    label="Autor"
                    name="authorId"
                    value={authorId}
                    onChange={(e) => setAuthorId(Number(e.target.value))}
                    options={authors.map((author) => ({ value: author.id, label: author.name }))}
                    emptyText="Bitte wählen"
                    required
                />
                <Input label="ISBN" name="isbn" type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                <Input label="Jahr" name="year" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                <Button variant="primary" type="button" onClick={submitBook}>{submitLabel}</Button>
            </form>
        </>
    )
}