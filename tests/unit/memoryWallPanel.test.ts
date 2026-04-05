// @vitest-environment jsdom

import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryWallPanel } from "@/features/office/components/panels/MemoryWallPanel";

const STORAGE_KEY = "memory-wall-items";

describe("MemoryWallPanel", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the panel title", () => {
    render(createElement(MemoryWallPanel));
    // The i18n key "memoryWall.title" resolves to "Hafıza Duvarı"
    expect(screen.getByText("Hafıza Duvarı")).toBeInTheDocument();
  });

  it("shows empty state message when no memories exist", () => {
    render(createElement(MemoryWallPanel));
    // The i18n key "memoryWall.empty" resolves to the empty state text
    expect(
      screen.getByText("Henüz paylaşılan hafıza yok. İlk notu ekleyin!")
    ).toBeInTheDocument();
  });

  it("can add a new memory", () => {
    render(createElement(MemoryWallPanel));

    // Type content into the textarea
    const textarea = screen.getByPlaceholderText(
      "Paylaşılacak bir not veya bilgi yazın..."
    );
    fireEvent.change(textarea, { target: { value: "Test memory note" } });

    // Click the add button ("Hafıza ekle")
    const addButton = screen.getByText("Hafıza ekle");
    fireEvent.click(addButton);

    // Verify the memory card appears with the text
    expect(screen.getByText("Test memory note")).toBeInTheDocument();

    // Verify empty state is gone
    expect(
      screen.queryByText("Henüz paylaşılan hafıza yok. İlk notu ekleyin!")
    ).not.toBeInTheDocument();
  });

  it("does not add a memory when content is empty or whitespace", () => {
    render(createElement(MemoryWallPanel));

    // The add button should be disabled when no content
    const addButton = screen.getByText("Hafıza ekle");
    expect(addButton).toBeDisabled();

    // Type only whitespace
    const textarea = screen.getByPlaceholderText(
      "Paylaşılacak bir not veya bilgi yazın..."
    );
    fireEvent.change(textarea, { target: { value: "   " } });
    expect(addButton).toBeDisabled();
  });

  it("uses 'Anonim' as default author when no author is specified", () => {
    render(createElement(MemoryWallPanel));

    const textarea = screen.getByPlaceholderText(
      "Paylaşılacak bir not veya bilgi yazın..."
    );
    fireEvent.change(textarea, { target: { value: "Anonymous memory" } });

    fireEvent.click(screen.getByText("Hafıza ekle"));

    // "Yazan" is the i18n label for author
    expect(screen.getByText(/Yazan.*Anonim/)).toBeInTheDocument();
  });

  it("persists memories to localStorage", () => {
    render(createElement(MemoryWallPanel));

    const textarea = screen.getByPlaceholderText(
      "Paylaşılacak bir not veya bilgi yazın..."
    );
    fireEvent.change(textarea, { target: { value: "Persistent note" } });
    fireEvent.click(screen.getByText("Hafıza ekle"));

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(1);
    expect(parsed[0].content).toBe("Persistent note");
    expect(parsed[0].author).toBe("Anonim");
    expect(typeof parsed[0].id).toBe("string");
    expect(typeof parsed[0].timestamp).toBe("number");
    expect(typeof parsed[0].color).toBe("string");
  });

  it("loads existing memories from localStorage on mount", () => {
    // Pre-populate localStorage
    const existingMemories = [
      {
        id: "mw-test-1",
        content: "Pre-existing memory",
        author: "Asena",
        color: "#fbbf24",
        timestamp: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingMemories));

    render(createElement(MemoryWallPanel));

    expect(screen.getByText("Pre-existing memory")).toBeInTheDocument();
    expect(screen.getByText(/Yazan.*Asena/)).toBeInTheDocument();
  });

  it("delete button removes a memory", () => {
    // Pre-populate with a memory
    const existingMemories = [
      {
        id: "mw-del-1",
        content: "Memory to delete",
        author: "Kayra",
        color: "#34d399",
        timestamp: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingMemories));

    render(createElement(MemoryWallPanel));

    // Memory should be visible
    expect(screen.getByText("Memory to delete")).toBeInTheDocument();

    // Click the delete button (aria-label "Sil")
    const deleteButton = screen.getByLabelText("Sil");
    fireEvent.click(deleteButton);

    // Memory should be gone
    expect(screen.queryByText("Memory to delete")).not.toBeInTheDocument();

    // Should show empty state again
    expect(
      screen.getByText("Henüz paylaşılan hafıza yok. İlk notu ekleyin!")
    ).toBeInTheDocument();
  });

  it("clears textarea after adding a memory", () => {
    render(createElement(MemoryWallPanel));

    const textarea = screen.getByPlaceholderText(
      "Paylaşılacak bir not veya bilgi yazın..."
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Note to add" } });
    fireEvent.click(screen.getByText("Hafıza ekle"));

    // Textarea should be cleared
    expect(textarea.value).toBe("");
  });
});
