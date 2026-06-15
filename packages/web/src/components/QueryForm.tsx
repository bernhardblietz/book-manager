import { Query } from "@/model/book"
import Input from "./ui/Input"
import React from "react"
import { Author } from "@/model/author"
import Select from "./ui/Select"
import Button from "./ui/Button"


type QueryFormProps = {
    initialValues?: Query
    onSubmit: (query: Query) => void
    authors: Author[]
}

export default function QueryForm({initialValues, onSubmit, authors}: QueryFormProps){
    const [queryText, setQueryText] = React.useState(initialValues?.q || "")
    const [authorId, setAuthorId] = React.useState(initialValues?.authorId || -1)
    const [page, setPage] = React.useState(initialValues?.page || 1)
    const [pageSize, setPageSize] = React.useState(initialValues?.pageSize || 20)

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
            <form>
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