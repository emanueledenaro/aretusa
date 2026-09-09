import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Activity, LayoutGrid, Settings2 } from "lucide-react";

export function TabsExample() {
  const [section, setSection] = React.useState("activity");
  const controlled = [
    { value: "overview", label: "Overview", icon: <LayoutGrid />, content: <p className="max-w-prose text-sm leading-relaxed text-muted">Everything you need to begin: the brief, the people involved and the first milestone.</p> },
    { value: "activity", label: "Activity", icon: <Activity />, content: <ul className="space-y-3 text-sm">{["Brief approved", "Print proofs uploaded", "Terrace booked for the review"].map((line) => <li key={line} className="border-b border-line pb-3 last:border-b-0">{line}</li>)}</ul> },
    { value: "billing", label: "Billing", disabled: true, content: <p>Unavailable</p> },
    { value: "settings", label: "Settings", icon: <Settings2 />, content: <div className="max-w-sm"><U.Switch label="Weekly digest" description="A summary every Monday morning." defaultChecked /><U.Switch label="Mention alerts" /></div> },
  ];
  return (
    <div className="w-full space-y-10">
      <div>
        <p className="mb-3 text-sm text-muted">Pill variant, controlled. Section: <span className="font-medium text-ink">{section}</span></p>
        <U.Tabs label="Project sections" items={controlled} value={section} onValueChange={setSection} />
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Line variant with long labels, in a narrow parent.</p>
        <div className="w-60 max-w-full">
          <U.Tabs
            label="Archive sections"
            variant="line"
            items={[
              { value: "letters", label: "Letters from Ortigia", content: <p className="text-sm leading-relaxed">Forty-two letters, transcribed and searchable.</p> },
              { value: "maps", label: "Maps and margins", content: <p className="text-sm leading-relaxed">Hand drawn plans of the salt gardens.</p> },
              { value: "workshop", label: "Workshop notes, 1998 to 2004", content: <p className="text-sm leading-relaxed">Six notebooks of print tests.</p> },
            ]}
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted">Many tabs wrap before anything is clipped.</p>
        <U.Tabs
          label="Months"
          items={["January", "February", "March", "April", "May", "June", "July", "August", "September"].map((m) => ({ value: m.toLowerCase(), label: m, content: <p className="text-sm text-muted">Bookings for {m}.</p> }))}
        />
      </div>
    </div>
  );
}
