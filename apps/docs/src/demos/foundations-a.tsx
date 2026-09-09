import * as React from "react";
import * as U from "../../../../packages/ui/src/index";
import { Check, Clock, TriangleAlert, X } from "lucide-react";

export function BadgeExample() {
  return (
    <div className="grid w-full gap-8">
      <div>
        <p className="mb-3 text-sm font-medium">Soft and outline, five tones</p>
        <div className="flex flex-wrap items-center gap-2">
          <U.Badge>Draft</U.Badge>
          <U.Badge tone="info">Scheduled</U.Badge>
          <U.Badge tone="success">Published</U.Badge>
          <U.Badge tone="warning">In review</U.Badge>
          <U.Badge tone="danger">Failed</U.Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <U.Badge variant="outline">Draft</U.Badge>
          <U.Badge variant="outline" tone="info">Scheduled</U.Badge>
          <U.Badge variant="outline" tone="success">Published</U.Badge>
          <U.Badge variant="outline" tone="warning">In review</U.Badge>
          <U.Badge variant="outline" tone="danger">Failed</U.Badge>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium">Icons, dots and the small size</p>
        <div className="flex flex-wrap items-center gap-2">
          <U.Badge tone="success" icon={<Check strokeWidth={2.5} />}>Paid</U.Badge>
          <U.Badge tone="info" icon={<Clock />}>Opens at 09:00</U.Badge>
          <U.Badge tone="warning" icon={<TriangleAlert />}>Two seats left</U.Badge>
          <U.Badge tone="danger" icon={<X strokeWidth={2.5} />}>Cancelled</U.Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <U.Badge size="sm" dot>Draft</U.Badge>
          <U.Badge size="sm" dot tone="success">Live</U.Badge>
          <U.Badge size="sm" dot tone="warning">Pending</U.Badge>
          <U.Badge size="sm" dot tone="danger" variant="outline">Offline</U.Badge>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium">Beside controls and inline text</p>
          <div className="flex flex-wrap items-center gap-3">
            <U.Button tone="outline">Open workshop</U.Button>
            <U.Badge tone="success" dot>3 new</U.Badge>
          </div>
          <p className="mt-4 text-sm leading-6">
            The printing room is <U.Badge size="sm" tone="warning">booked</U.Badge> until Friday and the
            terrace is <U.Badge size="sm" tone="success">free</U.Badge> all week.
          </p>
        </div>
        <div className="w-60 max-w-full">
          <p className="mb-3 text-sm font-medium">Long label in a 240px parent</p>
          <U.Badge tone="info" icon={<Clock />}>
            Waiting for the printing room to confirm the reservation
          </U.Badge>
        </div>
      </div>
    </div>
  );
}
