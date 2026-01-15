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
  gridClassName = '',
  gridHeight = '600px',
  pageSize = 5,
  onRowClicked,
  headerActions,
}) {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [searchText, setSearchText] = useState('');

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

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', value);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error loading data</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchChange}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
          />
        </div>

        {/* Header Actions (Add Button, etc.) */}
        <div className="flex items-center">
          {headerActions}
        </div>
      </div>

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
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}