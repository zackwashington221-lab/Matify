import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState, ToolbarButton } from "./primitives";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number;
  /** Plain-text value used by CSV exports when the rendered cell is JSX. */
  exportValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
  align?: "left" | "right" | "center";
};

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  bulkActions?: (selected: T[]) => ReactNode;
  toolbar?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  exportFilename?: string;
};

function toCsv<T>(rows: T[], cols: Column<T>[]) {
  const header = cols.map((c) => `"${c.header}"`).join(",");
  const body = rows.map((row) =>
    cols.map((c) => {
      const v = c.exportValue ? c.exportValue(row) : c.sortAccessor ? c.sortAccessor(row) : "";
      const str = String(v ?? "").replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  ).join("\n");
  return `${header}\n${body}`;
}

export function DataTable<T>({
  data, columns, rowKey, searchable = true, searchPlaceholder = "Search…",
  searchAccessor, pageSize = 10, onRowClick, bulkActions, toolbar,
  emptyTitle = "No results", emptyDescription = "Try adjusting your filters or search.",
  exportFilename = "export.csv",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let rows = data;
    if (query && searchAccessor) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => searchAccessor(r).toLowerCase().includes(q));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortAccessor) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortAccessor!(a);
          const bv = col.sortAccessor!(b);
          if (av < bv) return sortDir === "asc" ? -1 : 1;
          if (av > bv) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return rows;
  }, [data, query, sortKey, sortDir, columns, searchAccessor]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(rowKey(r)));

  const toggleSort = (k: string) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    const next = new Set(selected);
    if (allOnPageSelected) pageRows.forEach((r) => next.delete(rowKey(r)));
    else pageRows.forEach((r) => next.add(rowKey(r)));
    setSelected(next);
  };

  const selectedRows = filtered.filter((r) => selected.has(rowKey(r)));

  const exportCsv = () => {
    const rows = selectedRows.length > 0 ? selectedRows : filtered;
    const csv = toCsv(rows, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = exportFilename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-wrap">
        {searchable && (
          <div className="flex-1 min-w-[240px] max-w-md flex items-center gap-2 h-9 px-3 rounded-lg bg-secondary/70 border border-transparent focus-within:border-ring">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {toolbar}
          <ToolbarButton onClick={exportCsv} variant="secondary">
            <Download className="size-3.5" /> Export CSV
          </ToolbarButton>
        </div>
      </div>

      {/* Bulk bar */}
      {selectedRows.length > 0 && (
        <div className="px-4 py-2.5 bg-primary-soft border-b border-border flex items-center gap-3 text-[13px]">
          <span className="font-semibold">{selectedRows.length} selected</span>
          <button onClick={() => setSelected(new Set())} className="text-muted-foreground hover:text-foreground">Clear</button>
          <div className="ml-auto flex items-center gap-2">
            {bulkActions?.(selectedRows)}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-surface/60">
            <tr className="text-left">
              <th className="w-10 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAll}
                  className="size-4 rounded border-border accent-primary"
                />
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-3 py-2.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.headerClassName
                  )}
                >
                  {c.sortable ? (
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {c.header}
                      <ArrowUpDown className="size-3" />
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = rowKey(row);
                const isSel = selected.has(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-t border-border/60 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-secondary/50",
                      isSel && "bg-primary-soft/40"
                    )}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleRow(id)}
                        className="size-4 rounded border-border accent-primary"
                      />
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-3 py-3",
                          c.align === "right" && "text-right",
                          c.align === "center" && "text-center",
                          c.className
                        )}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground">
        <div>
          {filtered.length === 0 ? "0 results"
            : `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filtered.length)} of ${filtered.length}`}
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="size-8 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          ><ChevronLeft className="size-4" /></button>
          <span className="px-2 tabular-nums">Page {page + 1} of {totalPages}</span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="size-8 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          ><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
