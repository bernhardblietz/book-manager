import { Card, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Book } from '@/model/book'
import { Author } from '@/model/author'

type BookCardProps = {
    book: Book
    author: Author
    onDelete: Function
}

export default function BookCard({ book, author, onDelete = (title: string, authorId: number) => {}}: BookCardProps ){
    return (
        <Card className="flex flex-row justify-between">
            <div className="py-1 px-2 grid grid-cols-2 w-full">
                <div>
                    <Typography>{book.title}</Typography>
                    <Typography>by {author.name}</Typography>
                </div>
                <div>
                    {book.isbn ? <Typography>ISBN: {book.isbn}</Typography> : ""}
                    {book.year ? <Typography>year: {book.year}</Typography> : ""}
                </div>
            </div>
            <IconButton
                onClick={() => onDelete(book.title, author.id)}
            >
                <DeleteIcon/>
            </IconButton>
        </Card>
    )
}