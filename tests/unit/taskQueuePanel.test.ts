// @vitest-environment jsdom

import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TaskQueuePanel } from "@/features/office/components/panels/TaskQueuePanel";

const STORAGE_KEY = "task-queue-items";

describe("TaskQueuePanel", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the panel title", () => {
    render(createElement(TaskQueuePanel));
    // The i18n key "taskQueue.title" resolves to "Görev Kuyruğu"
    expect(screen.getByText("Görev Kuyruğu")).toBeInTheDocument();
  });

  it("shows empty state when no tasks exist", () => {
    render(createElement(TaskQueuePanel));
    // The i18n key "taskQueue.empty" resolves to "Henüz görev yok."
    expect(screen.getByText("Henüz görev yok.")).toBeInTheDocument();
  });

  it("renders filter tabs (Tümü, Beklemede, Devam Ediyor, Tamamlandı)", () => {
    render(createElement(TaskQueuePanel));

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();

    // Check all four filter tabs are present
    expect(screen.getByRole("tab", { name: /Tümü/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Beklemede/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Devam Ediyor/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Tamamlandı/i })
    ).toBeInTheDocument();
  });

  it("all 6 agents appear in dropdown options when form is visible", () => {
    render(createElement(TaskQueuePanel));

    // Open the form by clicking "Görev ekle"
    const addButton = screen.getByText("Görev ekle");
    fireEvent.click(addButton);

    const expectedAgents = [
      "Asena",
      "Umay",
      "Kayra",
      "Erlik",
      "Tulpar",
      "Tengri",
    ];

    // There should be two select dropdowns (from + to), each with all 6 agents
    const selects = screen.getAllByRole("combobox");
    // The first two are the agent selects (from, to), the third is priority
    const fromSelect = selects[0] as HTMLSelectElement;
    const toSelect = selects[1] as HTMLSelectElement;

    for (const agent of expectedAgents) {
      // Each agent should appear in both from and to selects
      const fromOptions = Array.from(fromSelect.options).map(
        (o) => o.textContent
      );
      const toOptions = Array.from(toSelect.options).map(
        (o) => o.textContent
      );
      expect(fromOptions).toContain(agent);
      expect(toOptions).toContain(agent);
    }
  });

  it("can add a new task via the form", () => {
    render(createElement(TaskQueuePanel));

    // Open form
    fireEvent.click(screen.getByText("Görev ekle"));

    // Fill in the title
    const titleInput = screen.getByPlaceholderText("Görev başlığı");
    fireEvent.change(titleInput, { target: { value: "Test görevi" } });

    // Click the submit button (also labeled "Görev ekle")
    const submitButtons = screen.getAllByText("Görev ekle");
    // The submit button is the one inside the form (second one)
    fireEvent.click(submitButtons[submitButtons.length - 1]);

    // The task should now appear in the list
    expect(screen.getByText("Test görevi")).toBeInTheDocument();

    // Empty state should be gone
    expect(screen.queryByText("Henüz görev yok.")).not.toBeInTheDocument();
  });

  it("persists tasks to localStorage after adding", () => {
    render(createElement(TaskQueuePanel));

    // Open form and add a task
    fireEvent.click(screen.getByText("Görev ekle"));
    fireEvent.change(screen.getByPlaceholderText("Görev başlığı"), {
      target: { value: "Persistent task" },
    });
    const submitButtons = screen.getAllByText("Görev ekle");
    fireEvent.click(submitButtons[submitButtons.length - 1]);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe("Persistent task");
    expect(parsed[0].status).toBe("pending");
  });

  it("loads existing tasks from localStorage on mount", () => {
    const existingTasks = [
      {
        id: "task-test-1",
        title: "Pre-existing task",
        description: "A test task",
        fromAgent: "Asena",
        toAgent: "Umay",
        status: "pending",
        priority: "normal",
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTasks));

    render(createElement(TaskQueuePanel));

    expect(screen.getByText("Pre-existing task")).toBeInTheDocument();
  });

  it("filters tasks by status when clicking tabs", () => {
    const tasks = [
      {
        id: "t-1",
        title: "Pending task",
        description: "",
        fromAgent: "Asena",
        toAgent: "Umay",
        status: "pending",
        priority: "normal",
        createdAt: Date.now(),
      },
      {
        id: "t-2",
        title: "Completed task",
        description: "",
        fromAgent: "Kayra",
        toAgent: "Erlik",
        status: "completed",
        priority: "high",
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    render(createElement(TaskQueuePanel));

    // Both should be visible on "Tümü" tab
    expect(screen.getByText("Pending task")).toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();

    // Click "Beklemede" tab — only pending should be visible
    fireEvent.click(screen.getByRole("tab", { name: /Beklemede/i }));
    expect(screen.getByText("Pending task")).toBeInTheDocument();
    expect(screen.queryByText("Completed task")).not.toBeInTheDocument();

    // Click "Tamamlandı" tab — only completed should be visible
    fireEvent.click(screen.getByRole("tab", { name: /Tamamlandı/i }));
    expect(screen.queryByText("Pending task")).not.toBeInTheDocument();
    expect(screen.getByText("Completed task")).toBeInTheDocument();
  });

  it("delete button removes a task", () => {
    const tasks = [
      {
        id: "t-del-1",
        title: "Task to delete",
        description: "",
        fromAgent: "Tulpar",
        toAgent: "Tengri",
        status: "pending",
        priority: "urgent",
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    render(createElement(TaskQueuePanel));

    expect(screen.getByText("Task to delete")).toBeInTheDocument();

    // Click the delete button (labeled "Sil")
    fireEvent.click(screen.getByText("Sil"));

    expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
    expect(screen.getByText("Henüz görev yok.")).toBeInTheDocument();
  });

  it("does not add a task when title is empty", () => {
    render(createElement(TaskQueuePanel));

    // Open form
    fireEvent.click(screen.getByText("Görev ekle"));

    // Submit button should be disabled with empty title
    const submitButtons = screen.getAllByText("Görev ekle");
    const submitButton = submitButtons[submitButtons.length - 1];
    expect(submitButton).toBeDisabled();
  });
});
