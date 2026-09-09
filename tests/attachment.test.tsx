import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Attachment, formatFileSize } from "../packages/ui/src/conversation";

test("name, kind, formatted size and named download and remove actions are exposed", async () => {
  const onRemove = vi.fn();
  render(<Attachment name="spring-proofs.pdf" kind="PDF" size={248000} href="/files/spring-proofs.pdf" onRemove={onRemove} />);
  expect(screen.getByText("spring-proofs.pdf")).toBeInTheDocument();
  expect(screen.getByText(/PDF/)).toBeInTheDocument();
  expect(screen.getByText(/242.2 KB/)).toBeInTheDocument();
  const download = screen.getByRole("link", { name: "Download spring-proofs.pdf" });
  expect(download).toHaveAttribute("href", "/files/spring-proofs.pdf");
  expect(download).toHaveAttribute("download");
  await userEvent.click(screen.getByRole("button", { name: "Remove spring-proofs.pdf" }));
  expect(onRemove).toHaveBeenCalledTimes(1);
  expect(formatFileSize(0)).toBe("0 B");
  expect(formatFileSize(1536)).toBe("1.5 KB");
  expect(formatFileSize(12_000_000)).toBe("11.4 MB");
});

test("remove does not submit the surrounding form", async () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <Attachment name="notes.txt" onRemove={() => {}} />
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Remove notes.txt" }));
  expect(onSubmit).not.toHaveBeenCalled();
});

test("uploading shows progress, error explains and retries, and a long name stays readable by assistive technology", async () => {
  const onRetry = vi.fn();
  const long = "a-very-long-export-of-the-spring-collection-with-margins-and-proofs-final-version-3.pdf";
  const { rerender } = render(<Attachment name={long} status="uploading" progress={40} />);
  const bar = screen.getByRole("progressbar", { name: "Uploading " + long });
  expect(bar).toHaveAttribute("value", "40");
  expect(screen.getByRole("status")).toHaveTextContent("40%");
  rerender(<Attachment name={long} status="error" error="The upload was interrupted." onRetry={onRetry} />);
  expect(screen.getByRole("alert")).toHaveTextContent("The upload was interrupted.");
  expect(screen.getByRole("group", { name: long })).toHaveAttribute("data-status", "error");
  await userEvent.click(screen.getByRole("button", { name: "Retry uploading " + long }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});
