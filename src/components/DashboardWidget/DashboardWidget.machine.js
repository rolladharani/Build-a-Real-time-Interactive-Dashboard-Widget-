import { createMachine, assign } from "xstate";

export const dashboardMachine = createMachine({
  id: "dashboard",

  initial: "connecting",

  context: {
    items: [],
    typeFilter: "all",
    severityFilter: "all",
    sortOrder: "desc",
    error: null
  },

  states: {
    connecting: {
      on: {
        API_CONNECTED: {
          target: "idle"
        },

        DATA_RECEIVED: {
          target: "idle",
          actions: assign({
            items: ({ context, event }) => [
              ...(context.items || []),
              event.data
            ]
          })
        },

        API_ERROR: {
          target: "error",
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    },

    idle: {
      on: {
        DATA_RECEIVED: {
          actions: assign({
            items: ({ context, event }) => [
              ...(context.items || []),
              event.data
            ]
          })
        },

        APPLY_FILTER: {
          actions: assign({
            typeFilter: ({ event }) => event.typeFilter,
            severityFilter: ({ event }) => event.severityFilter
          })
        },

        SORT_DATA: {
          actions: assign({
            sortOrder: ({ event }) => event.sortOrder
          })
        }
      }
    },

    error: {}
  }
});