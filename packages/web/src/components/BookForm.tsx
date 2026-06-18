import React from "react"
import Button from "./ui/Button"
import Input from "./ui/Input"
import Select from "./ui/Select"
import { PartialBook } from "@/model/book"
import { Author } from '@/model/author'
import { FormError } from "@/model/form"

type BookFormProps = {
    initialValues?: PartialBook
    authors: Author[]
    onSubmit: (values: PartialBook) => FormError[]
    submitLabel?: string
}

export default function BookForm({ initialValues, authors, onSubmit, submitLabel = "Buch speichern" }: BookFormProps) {
    const [id, setId] = React.useState(initialValues?.id)
    const [title, setTitle] = React.useState(initialValues?.title)
    const [authorId, setAuthorId] = React.useState(initialValues?.authorId)
    const [isbn, setIsbn] = React.useState(initialValues?.isbn)
    const [year, setYear] = React.useState(initialValues?.year)
    const [errors, setErrors] = React.useState<FormError[]>([])

    function submitBook(){
        const newBook: PartialBook = { id, title, authorId, isbn, year }
        const errors = onSubmit(newBook)
        if(errors.length == 0){
            setTitle(initialValues?.title)
            setAuthorId(initialValues?.authorId)
            setIsbn(initialValues?.isbn)
            setYear(initialValues?.year)
        }
        setErrors(errors)
    }

    function clearErrorFromScope(scope: string) {
        setErrors(errors.filter((err) => err.scope !== scope))
    }

    function validateYear(s : string){
        if (s === "") return setYear(undefined)
        if (s.match(/[1-9]/) && Number(s) > 0) setYear(Number(s))
    }

    return (
        <>
            <form>
                <Input label="Titel" name="title" value={title ?? ""} onChange={(e) => {setTitle(e.target.value); clearErrorFromScope("title")} } error={errors.find((err) => err.scope === "title")?.message} required />
                <Select
                    label="Autor"
                    name="authorId"
                    value={authorId ?? -1}
                    onChange={(e) => {setAuthorId(Number(e.target.value)); clearErrorFromScope("authorId")}}
                    options={authors.map((author) => ({ value: author.id, label: author.name }))}
                    emptyText="Bitte wählen"
                    error={errors.find((err) => err.scope === "authorId")?.message}
                    required
                />
                <Input label="ISBN" name="isbn" type="text" value={isbn ?? ""} onChange={(e) => setIsbn(e.target.value ? e.target.value : undefined)} />
                <Input label="Jahr" name="year" type="text" value={year ?? ""} onChange={(e) => { validateYear(e.target.value); clearErrorFromScope("year") }} error={errors.find((err) => err.scope === "year")?.message} />
                <Button variant="primary" type="button" onClick={submitBook}>{submitLabel}</Button>
            </form>
        </>
    )
}