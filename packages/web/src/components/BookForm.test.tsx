import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Author } from "@/model/author";
import type { ActionResult, PartialBook } from "@/model/book";
import BookForm from "./BookForm";

describe("BooksForm", () => {
  const authors: Author[] = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ];
  const testBook: PartialBook = { title: "Test-Buch", authorId: 1, isbn: "1", year: 2020 };
  const mockSubmit = vi.fn(() => Promise.resolve({} as ActionResult));
  it("submit Button ruft onSubmit mit korrekten Werten ", async () => {
    render(<BookForm authors={authors} onSubmit={mockSubmit} initialValues={testBook} />);
    const submitButton = await screen.findAllByText("Buch speichern");
    submitButton[0].click();
    expect(mockSubmit).toHaveBeenCalledExactlyOnceWith(testBook);
  });
});
