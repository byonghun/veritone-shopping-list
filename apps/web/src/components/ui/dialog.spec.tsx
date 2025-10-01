import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";

describe("Dialog (Radix wrapper)", () => {
  it("opens via trigger, renders overlay & content, and closes via the close button", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Modal</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title text</DialogTitle>
          <DialogDescription>Description text</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Open Modal" }));

    const dialogEl = await screen.findByRole("dialog");
    expect(dialogEl).toBeInTheDocument();
    expect(dialogEl).toHaveAttribute("data-slot", "dialog-content");

    const overlay = document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement | null;
    expect(overlay).toBe(null);

    expect(screen.getByText("Title text")).toHaveAttribute("data-slot", "dialog-title");
    expect(screen.getByText("Description text")).toHaveAttribute("data-slot", "dialog-description");

    const closeBtn = document.querySelector('[data-slot="dialog-close"]') as HTMLElement | null;
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("respects showCloseButton={false}", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dialog-close"]')).toBeNull();
  });

  it("merges custom classNames on Overlay and Content", () => {
    render(
      <Dialog defaultOpen>
        <DialogOverlay />
        <DialogContent className="content-extra">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Body</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const content = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;

    expect(content.className).toContain("content-extra");
    expect(content.className).toContain("rounded-[4px]");
  });
});
