import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { SearchIcon, DownloadIcon, EyeIcon } from './icons';


// actions cell renderer
const ActionsCellRenderer = (params) => {
  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (params.onViewDetails) {
            params.onViewDetails(params.data);
          } else if (params.onRowClicked) {
            params.onRowClicked({ data: params.data });
          }
        }}
        className="inline-flex items-center justify-center p-1.5 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400"
        title="View Details"
      >
        <EyeIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

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
  onViewDetails,
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
    let baseCols = [];
    if (initialColDefs && initialColDefs.length) {
      baseCols = initialColDefs;
    } else if (rowData && rowData.length > 0) {
      const keys = Object.keys(rowData[0]);
      baseCols = keys.map((k) => ({
        field: k,
        headerName: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
      }));
    }

    if (baseCols.length === 0) {
      return [{ field: 'id', headerName: 'ID' }];
    }

    return [
      ...baseCols,
      {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onRowClicked: onRowClicked,
          onViewDetails: onViewDetails,
        },
        pinned: 'right',
        width: 100,
        resizable: false,
        sortable: false,
        filter: false,
      }
    ];
  }, [initialColDefs, rowData, onRowClicked, onViewDetails]);

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
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white shadow-sm hover:bg-indigo-100 duration-300"
          />
        </div>

        {/* Header Actions (Download Icon, Add Button) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-indigo-100 duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 "
            title="Export CSV"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download CSV
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