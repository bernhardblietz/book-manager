window.global ||= window;
import { describe, it, expect, vi, beforeEach} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom";
import BooksPage from "./page";



describe("BooksPage", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (String(url).includes("/api/books")) {
        return Promise.resolve(
          new Response(JSON.stringify(
              { data: [ { books: { id: 1, title: "Test-Buch", authorId: 1}, authors: { name: "Autor", id: 1 } } ], page: 1, pageSize: 20, total: 1 }
          )),
        );
      }
      return Promise.resolve(new Response(JSON.stringify([])));
    }) as typeof fetch;
  });
  it("zeigt Bücher aus der API an", async () => {
    render(<BooksPage />);
    expect(await screen.findByText("Test-Buch")).toBeInTheDocument();
  });
});

describe("BooksPage", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (String(url).includes("/api/books")) {
        return Promise.resolve(
          new Response(JSON.stringify(
              { data: [], page: 1, pageSize: 20, total: 0 }
          )),
        );
      }
      return Promise.resolve(new Response(JSON.stringify([])));
    }) as typeof fetch;
  });
  it("zeigt Hinweis an wenn keine Bücher gefunden wurden", async () => {
    render(<BooksPage />);
    expect(await screen.findByText("Keine Bücher gefunden.")).toBeInTheDocument();
  });
});

describe("BooksPage", () => {
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (String(url).includes("/api/authors")) {
        return Promise.resolve(
          new Response(JSON.stringify(
              [{ "id": 1, "name": "Test-Autor" }]
          )),
        );
      }
      return Promise.resolve(new Response(JSON.stringify([])));
    }) as typeof fetch;
  });
  it("valides Form-Submit ruft fetch mit POST", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch")
      render(<BooksPage />);
      const titleInputs = screen.getAllByLabelText('Titel', {selector: 'input'})
      const authorIdInputs = screen.getAllByLabelText('Autor', {selector: 'select'})
      await userEvent.type(titleInputs[0], 'Test-Buch')
      await userEvent.selectOptions(authorIdInputs[0], "1")
      const submitButton = await screen.findAllByText("Buch speichern")
      await userEvent.click(submitButton[0])
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/books', { method: 'POST', body: "{\"title\":\"Test-Buch\",\"authorId\":1}" })
  })
})