import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { SearchIcon, DownloadIcon } from './icons';

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
  pageSize = 20,
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

  const handleExportCsv = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  }, [gridApi]);

  if (loading) return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (error) return <div className="text-red-600">Error loading data</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-10 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchChange}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
          />
        </div>

        {/* Header Actions (Download Icon, Add Button) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Export CSV"
          >
            <DownloadIcon className="h-6 w-6" />
          </button>
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