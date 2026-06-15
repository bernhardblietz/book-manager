import { Card, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BookWithAuthor } from '@/model/book'
import { Author } from '@/model/author'
import { useState } from "react";
import BookForm from "./BookForm";
import { NewBook } from "@book-manager/database";

type BookCardProps = {
    bookWithAuthor: BookWithAuthor
    authors: Author[]
    onDelete: Function
    onSave: Function
}

export default function BookCard({ bookWithAuthor, authors, onDelete, onSave }: BookCardProps ){
    const author = bookWithAuthor.authors
    const book = bookWithAuthor.books
    const [editState, setEditState] = useState<Boolean>(false)


    if(editState)
        
    return (
        <Card className="flex flex-row justify-between p-4">
            <BookForm
                authors={authors}
                initialValues={book}
                onSubmit={(newBook) => {onSave(book.id, newBook)}}
            />
        </Card>
    )

    return (
        <Card className="flex flex-row justify-between p-4">
            <div className="py-1 px-2 grid grid-cols-2">
                <div>
                    <Typography>{book.title}</Typography>
                    <Typography>by {author.name}</Typography>
                </div>
                <div>
                    {book.isbn ? <Typography>ISBN: {book.isbn}</Typography> : ""}
                    {book.year ? <Typography>year: {book.year}</Typography> : ""}
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex items-center">
                    <IconButton onClick={() => setEditState(true)}>
                        <EditIcon/>
                    </IconButton>
                </div>
                <div className="flex items-center">
                    <IconButton onClick={() => onDelete(book.id)}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </div>
        </Card>
    )
}