import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../packages/ui/src/basic";
import { Field, Input, Checkbox, Switch, Select } from "../packages/ui/src/forms";
import { Attachment } from '../packages/ui/src/conversation';
import { Modal } from "../packages/ui/src/overlays";
test('explicit control IDs retain clickable labels',async()=>{render(<><Checkbox id="terms" label="Accept terms"/><Switch id="updates" label="Receive updates"/></>);await userEvent.click(screen.getByText('Accept terms'));expect(screen.getByRole('checkbox',{name:'Accept terms'})).toBeChecked();await userEvent.click(screen.getByText('Receive updates'));expect(screen.getByRole('switch',{name:'Receive updates'})).toBeChecked()});
test('Select retains Field error semantics',()=>{render(<Field label="Discipline" error="Choose a discipline"><Select label="Discipline" options={[{value:'design',label:'Design'}]}/></Field>);const select=screen.getByRole('combobox',{name:'Discipline'});expect(select).toHaveAttribute('aria-invalid','true');expect(select).toHaveAccessibleDescription('Choose a discipline')});
test('removing an attachment does not submit a form',async()=>{let submitted=false,removed=false;render(<form onSubmit={e=>{e.preventDefault();submitted=true}}><Attachment name="notes.pdf" onRemove={()=>{removed=true}}/></form>);await userEvent.click(screen.getByRole('button',{name:'Remove notes.pdf'}));expect(removed).toBe(true);expect(submitted).toBe(false)});
test("a loading action cannot be activated", async () => {
  let calls = 0;
  render(
    <Button loading onClick={() => calls++}>
      Save
    </Button>,
  );
  await userEvent.click(screen.getByRole("button"));
  expect(calls).toBe(0);
  expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
});
test("a field connects its validation message to the control", () => {
  render(
    <Field label="Email" error="Enter a valid email">
      <Input />
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Email" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("Enter a valid email");
});
test("a modal returns focus to its trigger on escape", async () => {
  render(
    <Modal
      trigger={<Button>Open profile</Button>}
      title="Profile"
      description="Edit your information"
    >
      <Input aria-label="Name" />
    </Modal>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open profile" }));
  expect(screen.getByRole("dialog", { name: "Profile" })).toBeVisible();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open profile" })).toHaveFocus();
});
