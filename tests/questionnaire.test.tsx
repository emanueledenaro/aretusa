import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Questionnaire } from "../packages/ui/src/conversation";

const questions = [
  { id: "focus", title: "What are you building?", options: ["A website", "An application"] },
  { id: "priority", title: "What matters most?", description: "Pick the one you would defend.", options: ["Clarity", "Speed"] },
];

test("a required question blocks Next with a repairable error, and going back preserves the answer", async () => {
  const onComplete = vi.fn();
  render(<Questionnaire questions={questions} onComplete={onComplete} />);
  expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "What are you building?" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  const group = screen.getByRole("radiogroup", { name: "What are you building?" });
  expect(group).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("alert")).toHaveTextContent("Choose one option to continue.");
  expect(screen.getByRole("radio", { name: "A website" })).toHaveFocus();
  await userEvent.click(screen.getByRole("radio", { name: "An application" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
  expect(screen.getByText("Pick the one you would defend.")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(screen.getByRole("radio", { name: "An application" })).toBeChecked();
  expect(onComplete).not.toHaveBeenCalled();
});

test("optional and conditional questions: skipping is allowed and hidden steps are left out of the answers", async () => {
  const onComplete = vi.fn();
  render(
    <Questionnaire
      questions={[
        { id: "kind", title: "Project kind", options: ["Print", "Web"] },
        { id: "paper", title: "Paper stock", options: ["Cream", "White"], when: (a) => a.kind === "Print" },
        { id: "notes", title: "Anything else?", required: false, options: ["Call me", "Email me"] },
      ]}
      onComplete={onComplete}
    />,
  );
  expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: "Print" }));
  expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: "Web" }));
  expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("heading", { name: /Anything else\?/ })).toBeInTheDocument();
  expect(screen.getByText("Optional")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Finish" }));
  expect(onComplete).toHaveBeenCalledWith({ kind: "Web" });
});

test("an async completion shows a pending state, a failure explains and retries, and no questions renders a status", async () => {
  let attempt = 0;
  const onComplete = vi.fn(
    () =>
      new Promise<void>((resolve, reject) => {
        attempt += 1;
        setTimeout(() => (attempt === 1 ? reject(new Error("offline")) : resolve()), 10);
      }),
  );
  const { unmount } = render(<Questionnaire questions={[questions[0]]} onComplete={onComplete} />);
  await userEvent.click(screen.getByRole("radio", { name: "A website" }));
  await userEvent.click(screen.getByRole("button", { name: "Finish" }));
  expect(screen.getByRole("button", { name: "Finish" })).toHaveAttribute("aria-busy", "true");
  expect(screen.getByRole("radio", { name: "A website" })).toBeDisabled();
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Your answers could not be saved. Try again."));
  await userEvent.click(screen.getByRole("button", { name: "Try again" }));
  await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  unmount();
  render(<Questionnaire questions={[]} onComplete={() => {}} />);
  expect(screen.getByRole("status")).toHaveTextContent("No questions configured.");
});
