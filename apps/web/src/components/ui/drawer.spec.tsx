import { render, screen, fireEvent } from "@testing-library/react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";

describe("Drawer (Vaul wrapper)", () => {
  it("opens via trigger and closes via DrawerClose", () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader>
            <DrawerTitle>My Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(document.querySelector('[data-slot="drawer-content"]')).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    const content = document.querySelector('[data-slot="drawer-content"]') as HTMLElement;
    expect(content).toBeInTheDocument();

    expect(screen.getByText("My Drawer")).toHaveAttribute("data-slot", "drawer-title");

    fireEvent.click(screen.getByText("Close"));
    const closeContent = document.querySelector('[data-slot="drawer-content"]') as HTMLElement;
    expect(closeContent).toBeInTheDocument();
    expect(closeContent).toHaveAttribute("data-state", "closed");
  });

  it("reflects direction via data attribute on content (e.g., right)", () => {
    render(
      <Drawer direction="right" defaultOpen>
        <DrawerContent>
          <DrawerTitle>Right Drawer</DrawerTitle>
          <DrawerDescription>Test body</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    const content = document.querySelector('[data-slot="drawer-content"]') as HTMLElement;
    expect(content).toBeInTheDocument();
    expect(content.getAttribute("data-vaul-drawer-direction")).toBe("right");
  });

  it("merges custom className on DrawerContent and keeps base tokens", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent className="content-extra">
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Body</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    const content = document.querySelector('[data-slot="drawer-content"]') as HTMLElement;
    const cls = content.getAttribute("class") || "";
    expect(cls).toContain("content-extra");
    expect(cls).toContain("group/drawer-content");
  });
});
