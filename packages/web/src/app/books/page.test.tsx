import { describe, it, expect, vi, beforeEach} from "vitest";
import { render, screen } from "@testing-library/react";
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
      if (String(url).includes("/api/books")) {
        return Promise.resolve(
          new Response(JSON.stringify(
              { data: [ { books: { id: 1, title: "Test-Buch", authorId: 1}, authors: { name: "Autor", id: 1 } } ], page: 1, pageSize: 20, total: 1 }
          )),
        );
      }
      return Promise.resolve(new Response(JSON.stringify([])));
    }) as typeof fetch;
  })
  it("Form-Submit ruft fetch mit POST", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch")
      render(<BooksPage />);
      const submitButton = await screen.findAllByText("Buch speichern")
      submitButton[0].click()
      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/books', { method: 'POST', body: "{\"title\":\"\",\"authorId\":-1,\"isbn\":\"\"}" })
  })
})