import { createMachine, assign } from "xstate";

export const dashboardMachine = createMachine({
  id: "dashboard",

  initial: "idle",

  context: {
    items: [],
    error: null,
  },

  states: {
    /* =====================
       IDLE STATE
       ===================== */
    idle: {
      on: {
        DATA_RECEIVED: {
          actions: assign({
            items: (context, event) => {
              if (!event?.data) return context.items;
              return [...context.items, event.data];
            },
          }),
        },

        APPLY_FILTER: "filtering",
        SORT_DATA: "sorting",

        API_ERROR: {
          target: "error",
          actions: assign({
            error: (_, event) => event?.error || "Unknown error",
          }),
        },
      },
    },

    /* =====================
       FILTERING STATE
       ===================== */
    filtering: {
      after: {
        0: "idle",
      },
    },

    /* =====================
       SORTING STATE
       ===================== */
    sorting: {
      after: {
        0: "idle",
      },
    },

    /* =====================
       ERROR STATE
       ===================== */
    error: {
      on: {
        DATA_RECEIVED: {
          target: "idle",
          actions: assign({
            items: (context, event) => {
              if (!event?.data) return context.items;
              return [...context.items, event.data];
            },
            error: () => null,
          }),
        },
      },
    },
  },
});
