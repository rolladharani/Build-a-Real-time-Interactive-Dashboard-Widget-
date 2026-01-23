import { useEffect, useRef, useState, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { dashboardMachine } from "./DashboardWidget.machine";
import { createWebSocket } from "../../api/realtimeService";
import styles from "./DashboardWidget.module.css";
import debounce from "lodash.debounce";

function DashboardWidget() {
  const machineRef = useRef(dashboardMachine);
  const [state, send] = useMachine(machineRef.current);

  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  useEffect(() => {
    const socket = createWebSocket((data) => {
      send({ type: "DATA_RECEIVED", data });
    });
    return () => socket.close();
  }, [send]);

  const debouncedSetType = useMemo(
    () => debounce(setTypeFilter, 300),
    []
  );

  const debouncedSetSeverity = useMemo(
    () => debounce(setSeverityFilter, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetType.cancel();
      debouncedSetSeverity.cancel();
    };
  }, [debouncedSetType, debouncedSetSeverity]);

  const visibleItems = useMemo(() => {
    let items = [...state.context.items];

    if (typeFilter !== "all") {
      items = items.filter((i) => i.type === typeFilter);
    }

    if (severityFilter !== "all") {
      items = items.filter((i) => i.severity === severityFilter);
    }

    items.sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    );

    return items.slice(-5);
  }, [state.context.items, typeFilter, severityFilter, sortOrder]);

  return (
    <div className={styles.card}>
      <h1>Real-Time Dashboard</h1>

      <div className={styles.statusBar}>
        <span aria-live="polite">
          Status: <strong>{String(state.value)}</strong>
        </span>
        <span aria-live="polite">
          Total Events: <strong>{state.context.items.length}</strong>
        </span>
      </div>

      <div className={styles.controls}>
        <select
          aria-label="Filter events by type"
          defaultValue="all"
          onChange={(e) => debouncedSetType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="metric">Metric</option>
          <option value="log">Log</option>
          <option value="alert">Alert</option>
        </select>

        <select
          aria-label="Filter events by severity"
          defaultValue="all"
          onChange={(e) => debouncedSetSeverity(e.target.value)}
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          aria-label="Toggle sort order"
          onClick={() =>
            setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
          }
          className={styles.sortBtn}
        >
          Sort: {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <h3 className={styles.heading}>Live Events (Last 5)</h3>

      {visibleItems.length === 0 ? (
        <p className={styles.empty}>No events to display</p>
      ) : (
        <ul className={styles.list} role="list">
          {visibleItems.map((item, index) => (
            <li
              key={index}
              className={styles.item}
              tabIndex="0"
              role="listitem"
            >
              <span className={styles.type}>{item.type}</span>
              <span className={`${styles.severity} ${styles[item.severity]}`}>
                {item.severity}
              </span>
              <span className={styles.value}>{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardWidget;
