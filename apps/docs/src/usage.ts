export const usage: Record<string,string> = {
  "shimmer": "<Shimmer enabled speed={2.8}>Preparing your next idea.</Shimmer>",
  "react-hook-form": "<form noValidate onSubmit={form.handleSubmit((values) => console.log(values))}><HookFormField control={form.control} name=\"name\" label=\"Name\" description=\"Shown to your team.\" rules={{ required: \"Enter your name.\" }}>{({ field, controlProps }) => <Input {...field} {...controlProps} />}</HookFormField><button type=\"submit\">Save</button></form>",
  "scroll-fade": "<div className=\"relative overflow-hidden rounded-xl bg-paper\"><div ref={ref} role=\"region\" aria-label=\"Activity\" tabIndex={0} className=\"h-40 overflow-auto p-4\"><p>Your scrollable content.</p></div><ScrollFade edges={edges} depth={32} /></div>",
  "button": "<Button onClick={() => alert(\"Hello\")}>Create project</Button>",
  "button-group": "<ButtonGroup label=\"Actions\"><button>Save</button><button>Publish</button></ButtonGroup>",
  "aspect-ratio": "<AspectRatio ratio={16 / 9}><img src=\"/your-image.jpg\" alt=\"Your description\" /></AspectRatio>",
  "avatar": "<Avatar name=\"Alex Rivers\" />",
  "badge": "<Badge tone=\"success\">Published</Badge>",
  "card": "<Card><h3>Your project</h3><p>Make room for an idea.</p></Card>",
  "direction": "<Direction dir=\"rtl\"><p>Right-to-left content</p></Direction>",
  "empty": "<Empty title=\"No projects yet\">Create your first project.</Empty>",
  "item": "<Item title=\"Field notes\" description=\"Updated today\" action={<button>Open</button>} />",
  "kbd": "<Kbd>⌘ K</Kbd>",
  "progress": "<Progress value={45} label=\"Upload progress\" />",
  "separator": "<Separator />",
  "skeleton": "<Skeleton className=\"h-10 w-40\" />",
  "spinner": "<Spinner label=\"Loading projects\" />",
  "typography": "<Typography as=\"h2\" editorial>A considered beginning.</Typography>",
  "alert": "<Alert title=\"Saved\" tone=\"success\">Your work is up to date.</Alert>",
  "calendar": "<Calendar mode=\"range\" defaultMonth={new Date(2026, 8, 1)} selected={range} onSelect={setRange} numberOfMonths={2} showOutsideDays={false} disabled={{ dayOfWeek: [0, 6] }} excludeDisabled footer={range?.to ? \"Dates selected\" : \"Choose a start and end date\"} />",
  "checkbox": "<Checkbox label=\"Accept terms\" checked={enabled} onCheckedChange={v => setEnabled(v === true)} />",
  "combobox": "<Combobox label=\"Discipline\" options={[\"Design\", \"Engineering\"]} />",
  "date-picker": "<DatePicker aria-label=\"Start date\" />",
  "field": "<Field label=\"Email\" error={undefined}><input type=\"email\" required /></Field>",
  "input": "<Input aria-label=\"Project name\" placeholder=\"A new beginning\" />",
  "input-group": "<InputGroup prefix=\"https://\"><input aria-label=\"Domain\" /></InputGroup>",
  "input-otp": "<InputOTP value={value} onChange={setValue} length={6} />",
  "label": "<><Label htmlFor=\"name\">Name</Label><input id=\"name\" /></>",
  "native-select": "<NativeSelect aria-label=\"Discipline\" options={options} />",
  "radio-group": "<RadioGroup label=\"Discipline\" options={options} defaultValue=\"design\" />",
  "select": "<Select label=\"Discipline\" options={options} value={value} onValueChange={setValue} />",
  "slider": "<Slider label=\"Volume\" defaultValue={[40]} min={0} max={100} />",
  "switch": "<Switch label=\"Updates\" checked={enabled} onCheckedChange={setEnabled} />",
  "textarea": "<Textarea aria-label=\"Notes\" placeholder=\"Your thoughts…\" />",
  "toggle": "<Toggle aria-label=\"Favorite\" pressed={enabled} onPressedChange={setEnabled}>Favorite</Toggle>",
  "toggle-group": "<ToggleGroup label=\"View\" options={[\"List\", \"Grid\"]} value={value} onValueChange={setValue} />",
  "alert-dialog": "<AlertDialog trigger={<button>Archive</button>} title=\"Archive project?\" description=\"Members keep read access and you can restore it later.\" confirmLabel=\"Archive\" onConfirm={async () => { await fetch(\"/api/archive\", { method: \"POST\" }); setEnabled(true); }} />",
  "dialog": "<Dialog trigger={<button>Open</button>} title=\"Profile\" description=\"Edit your public profile.\"><input aria-label=\"Name\" /></Dialog>",
  "drawer": "<Drawer trigger={<button>Open</button>} title=\"Preferences\" description=\"Choose your settings.\"><p>Your controls go here.</p></Drawer>",
  "sheet": "<Sheet trigger={<button>Open</button>} title=\"Project\" description=\"Inspect project details.\"><p>Your content goes here.</p></Sheet>",
  "hover-card": "<HoverCard trigger={<a href=\"/profile\">Profile</a>}><p>Supplementary profile information.</p></HoverCard>",
  "popover": "<Popover trigger={<button>Settings</button>} label=\"Quick settings\"><p>Your controls go here.</p></Popover>",
  "toast": "<><button onClick={() => setEnabled(true)}>Notify</button><Toast open={enabled} onOpenChange={setEnabled} title=\"Saved\" description=\"Your changes are stored.\" /></>",
  "tooltip": "<Tooltip content=\"Save this project\"><button>Save</button></Tooltip>",
  "accordion": "<Accordion items={[{title: \"Can I customize it?\", content: \"Yes, edit the source.\"}]} />",
  "breadcrumb": "<Breadcrumb items={[{label:\"Home\",href:\"/\"},{label:\"Projects\"}]} />",
  "collapsible": "<Collapsible title=\"Show details\"><p>More information.</p></Collapsible>",
  "command": "<Command items={[{label:\"New project\",onSelect:()=>setEnabled(true)}]} />",
  "context-menu": "<ContextMenu items={menuItems}><div tabIndex={0}>Right-click here</div></ContextMenu>",
  "dropdown-menu": "<DropdownMenu trigger={<button>Actions</button>} items={menuItems} />",
  "menubar": "<Menubar menus={[{label:\"File\",items:menuItems}]} />",
  "navigation-menu": "<NavigationMenu items={[{label:\"Projects\",href:\"/projects\"},{label:\"About\",href:\"/about\"}]} />",
  "pagination": "<Pagination page={page} total={5} onChange={setPage} />",
  "scroll-area": "<ScrollArea fade={enabled} label=\"Project activity\" className=\"h-40\"><p>Your scrollable content.</p></ScrollArea>",
  "sidebar": "<Sidebar items={[{label:\"Projects\",href:\"/projects\"}]}><p>Workspace content.</p></Sidebar>",
  "tabs": "<Tabs items={[{value:\"overview\",label:\"Overview\",content:<p>Your overview.</p>},{value:\"settings\",label:\"Settings\",content:<p>Your settings.</p>}]} />",
  "carousel": "<Carousel slides={[{title:\"First idea\",description:\"A beginning.\"},{title:\"Next step\",description:\"Keep going.\"}]} />",
  "chart": "<Chart label=\"Contributions\" data={[{name:\"Mon\",value:12},{name:\"Tue\",value:24}]} />",
  "data-table": "<DataTable rows={[{id:\"1\",name:\"Field notes\",status:\"Draft\",amount:120}]} />",
  "resizable": "<Resizable left={<p>Navigation</p>} right={<p>Workspace</p>} />",
  "table": "<Table caption=\"Projects\" columns={[\"Name\",\"Status\"]} rows={[[\"Field notes\",\"Draft\"]]} />",
  "attachment": "<Attachment name=\"notes.pdf\" onRemove={() => setEnabled(true)} />",
  "bubble": "<Bubble side=\"end\">Hello there.</Bubble>",
  "marker": "<Marker>Today</Marker>",
  "message": "<Message author=\"Alex\" time=\"09:41\">A new idea.</Message>",
  "message-scroller": "<MessageScroller label=\"Project conversation\"><p>First message.</p><p>Second message.</p></MessageScroller>",
  "questionnaire": "<Questionnaire questions={[{id:\"focus\",title:\"Your focus?\",options:[\"Design\",\"Engineering\"]}]} onComplete={answers=>console.log(answers)} />"
};

/** Extra named imports and setup statements for examples that need a hook. */
export const usageImports: Record<string,string[]> = {
  "scroll-fade": ["useScrollFade"]
};
/** Whole import lines for examples that need another module. */
export const usageExtraImports: Record<string,string[]> = {
  "react-hook-form": ['import { useForm } from "react-hook-form";', 'import { Input } from "./components/aretusa/forms";']
};
export const usageSetup: Record<string,string> = {
  "react-hook-form": "const form = useForm<{ name: string }>({ defaultValues: { name: \"\" } });",
  "scroll-fade": "const { ref, edges } = useScrollFade();",
  "calendar": "const [range, setRange] = useState<{ from: Date | undefined; to?: Date }>();"
};

export function usageCode(id:string,name:string,module:string){const names=[name,...(usageImports[id]??[])].join(", ");const setup=usageSetup[id]?`  ${usageSetup[id]}\n`:"";const extra=(usageExtraImports[id]??[]).map(line=>line+"\n").join("");return `import { useState } from "react";\n${extra}import { ${names} } from "./components/aretusa/${module}";\n\nexport function Example() {\n  const [value, setValue] = useState("");\n  const [enabled, setEnabled] = useState(false);\n  const [page, setPage] = useState(1);\n  const [date, setDate] = useState<Date | undefined>();\n  const options = [{value: "design", label: "Design"}, {value: "engineering", label: "Engineering"}];\n  const menuItems = [{label: "Rename", onSelect: () => setEnabled(true)}];\n${setup}  return (${usage[id]});\n}`}
