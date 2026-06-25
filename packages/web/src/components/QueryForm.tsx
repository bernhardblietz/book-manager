import { Query } from "@/model/book"
import Input from "./ui/Input"
import React, { useEffect } from "react"
import { Author } from "@/model/author"
import Select from "./ui/Select"
import Button from "./ui/Button"


type QueryFormProps = {
    initialValues?: Query
    onSubmit: (query: Query) => void
    authors: Author[]
}

export default function QueryForm({initialValues, onSubmit, authors}: QueryFormProps){
    const [queryText, setQueryText] = React.useState<string>("")
    const [authorId, setAuthorId] = React.useState<number>(-1)
    const [page, setPage] = React.useState<number>(1)
    const [pageSize, setPageSize] = React.useState<number>(20)

    useEffect(() => {
        setQueryText(initialValues?.q || "")
        setAuthorId(initialValues?.authorId || -1)
        setPage(initialValues?.page || 1)
        setPageSize(initialValues?.pageSize || 20)
    }, [initialValues])

    function submitQuery() {
        const newQuery : Query = {}
        if(queryText) newQuery.q = queryText
        if(authorId > 0) newQuery.authorId = authorId
        if(page) newQuery.page = page
        if(pageSize) newQuery.pageSize = pageSize
        onSubmit(newQuery)
    }

    return (
        <>
            <form className="min-w-3xs">
                <Input label="Titel" name="queryText" value={queryText} onChange={(e) => setQueryText(e.target.value)} required />
                <Input label="Seite" name="page" value={page} onChange={(e) => setPage(Number(e.target.value))} required />
                <Input label="Bücher pro Seite" name="pageSize" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} required />
                <Select
                    label="Autor"
                    name="authorId"
                    value={authorId}
                    onChange={(e) => setAuthorId(Number(e.target.value))}
                    options={authors.map((author) => ({ value: author.id, label: author.name }))}
                    emptyText="Alle"
                    required
                />
                <Button variant="primary" type="button" onClick={submitQuery}>Suchen</Button>
            </form>
        </>
    )
}