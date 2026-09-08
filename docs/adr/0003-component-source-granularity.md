# Component source granularity

Registry items begin at a component-specific source module and follow real import edges. Related anatomy may share a file, such as Card and its header/footer. Internal barrels remain available to the documentation app, while consumer examples use the selected item's source path.

This keeps ownership and installation understandable, avoids unrelated component imports, and prevents hand-maintained dependency lists from drifting from actual code.
