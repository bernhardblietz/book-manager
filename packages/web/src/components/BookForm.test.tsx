import { describe, it, expect, vi} from "vitest";
import { Author } from '@/model/author'
import { render, screen } from "@testing-library/react";
import BookForm from './BookForm';
import { PartialBook } from "@/model/book";

describe("BooksForm", () => {
    const authors: Author[] = [{id: 1, name: "A"}, {id: 2, name: "B"}, {id: 3, name: "C"}]
    const testBook: PartialBook = {title: "Test-Buch", authorId: 1, isbn: "1", year: 2020}
    const mockSubmit = vi.fn((book: PartialBook) => [])
    it("submit Button ruft onSubmit mit korrekten Werten ", async () => {
        render(
            <BookForm
                authors={authors}
                onSubmit={mockSubmit}
                initialValues={testBook}
            />
        );
        const submitButton = await screen.findAllByText("Buch speichern")
        submitButton[0].click()
        expect(mockSubmit).toHaveBeenCalledExactlyOnceWith(testBook);

    });

});