import { describe, it, expect } from "vitest";
import { createActor } from "xstate";
import { dashboardMachine } from "./DashboardWidget.machine";

describe("DashboardWidget State Machine", () => {
  it("should start with empty items", () => {
    const actor = createActor(dashboardMachine).start();

    expect(actor.getSnapshot().context.items).toEqual([]);
  });

  it("should add item when DATA_RECEIVED is sent", () => {
    const actor = createActor(dashboardMachine).start();

    const mockEvent = {
      type: "DATA_RECEIVED",
      data: {
        type: "metric",
        severity: "low",
        value: 42,
      },
    };

    actor.send(mockEvent);

    const items = actor.getSnapshot().context.items;
    expect(items.length).toBe(1);
    expect(items[0].value).toBe(42);
  });

  it("should accumulate multiple DATA_RECEIVED events", () => {
    const actor = createActor(dashboardMachine).start();

    actor.send({
      type: "DATA_RECEIVED",
      data: { type: "log", severity: "medium", value: 10 },
    });

    actor.send({
      type: "DATA_RECEIVED",
      data: { type: "alert", severity: "high", value: 99 },
    });

    const items = actor.getSnapshot().context.items;
    expect(items.length).toBe(2);
    expect(items[1].severity).toBe("high");
  });
});
