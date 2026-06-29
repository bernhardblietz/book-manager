window.global ||= window;

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { userEvent } from "vitest/browser";
import BookList from "@/components/BookList";
import type { Author } from "@/model/author";
import type { ActionResult, BookResponse } from "@/model/book";

describe("BookList", () => {
  const testResponse: BookResponse = {
    data: [{ books: { id: 1, authorId: 1, title: "Test-Buch" }, authors: { id: 1, name: "A" } }],
    page: 1,
    pageSize: 20,
    total: 1,
  };
  const emptyResponse: BookResponse = { data: [], page: 1, pageSize: 20, total: 0 };
  const authors: Author[] = [{ id: 1, name: "A" }];
  function dummyAction() {
    return new Promise<ActionResult>(() => {});
  }

  it("zeigt Bücher aus der API an", async () => {
    render(
      <BookList
        bookResponse={testResponse}
        authors={authors}
        onDelete={dummyAction}
        onSave={dummyAction}
        onAdd={dummyAction}
      />,
    );
    expect(await screen.findByText("Test-Buch")).toBeInTheDocument();
  });

  it("zeigt Hinweis an wenn keine Bücher gefunden wurden", async () => {
    render(
      <BookList
        bookResponse={emptyResponse}
        authors={authors}
        onDelete={dummyAction}
        onSave={dummyAction}
        onAdd={dummyAction}
      />,
    );
    expect(await screen.findByText("Keine Bücher gefunden.")).toBeInTheDocument();
  });

  it("valides Form-Submit ruft server action", async () => {
    const serverActionSpy = vi.fn(
      () =>
        new Promise<ActionResult>(() => {
          true;
        }),
    );
    render(
      <BookList
        bookResponse={emptyResponse}
        authors={authors}
        onDelete={dummyAction}
        onSave={dummyAction}
        onAdd={serverActionSpy}
      />,
    );
    const titleInputs = screen.getAllByLabelText("Titel", { selector: "input" });
    const authorIdInputs = screen.getAllByLabelText("Autor", { selector: "select" });
    await userEvent.type(titleInputs[0], "Test-Buch");
    await userEvent.selectOptions(authorIdInputs[0], "1");
    const submitButton = await screen.findAllByText("Buch speichern");
    await userEvent.click(submitButton[0]);
    expect(serverActionSpy).toHaveBeenCalledOnce();
  });
});
