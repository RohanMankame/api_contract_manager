import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';

// register community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// create a themed object with params (Theming API)
const myTheme = themeQuartz.withParams({
  browserColorScheme: 'light',
  headerFontSize: 14,
});

export default function AgGridTable({
  fetcher,
  colDefs: initialColDefs = [],
  gridClassName = '', // do not use legacy ag-theme-* classes when using Theming API
  gridHeight = '600px',
  pageSize = 20,
  onRowClicked,
}) {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetcher();
        if (!mounted) return;
        setRowData(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fetcher]);

  const colDefs = useMemo(() => {
    if (initialColDefs && initialColDefs.length) return initialColDefs;
    if (!rowData || rowData.length === 0) return [{ field: 'id', headerName: 'ID' }];
    const keys = Object.keys(rowData[0]);
    return keys.map((k) => ({
      field: k,
      headerName: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
    }));
  }, [initialColDefs, rowData]);

  const gridOptions = useMemo(() => ({ theme: myTheme }), []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error loading data</div>;

  return (
    <div style={{ width: '100%', height: gridHeight }} className={gridClassName}>
      <AgGridReact
        gridOptions={gridOptions}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{ sortable: true, filter: true, resizable: true }}
        pagination={true}
        paginationPageSize={pageSize}
        rowSelection={{ type: 'single' }}
        onRowClicked={onRowClicked}
      />
    </div>
  );
}