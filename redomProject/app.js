// CUSTOM
function CustomHeader() {}
CustomHeader.prototype.init = function(params) {
    this.params = params;

    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span style="flex-grow: 1;">${params.displayName}</span>
            ${params.column.colId === 'refresh' ? '<button>Refresh</button>' : ''}
        </div>
    `;

    if (params.column.colId === 'refresh') {
        this.eGui.querySelector('button').addEventListener('click', () => {
            fetch('http://localhost:8000/users')
                .then(response => response.json())
                .then(data => {
                    params.api.updateGridOptions({ rowData: data });
                });
        });
    }
};
CustomHeader.prototype.getGui = function() {
    return this.eGui;
};

function MyCustomToolPanel() {}

MyCustomToolPanel.prototype.init = function(params) {
    this.params = params;

    this.container = document.createElement('div');
    this.container.className = 'my-custom-tool-panel';

    this.input = document.createElement('input');
    this.input.placeholder = 'Enter filter set name';
    this.container.appendChild(this.input);

    this.button = document.createElement('button');
    this.button.textContent = 'Save Filter Set';
    this.button.addEventListener('click', this.saveFilterSet.bind(this));
    this.container.appendChild(this.button);

    this.title = document.createElement('h2');  // Create a h2 element for the title
    this.title.textContent = 'Filter Sets Saved :';  // Set the text content of the title
    this.container.appendChild(this.title);  // Append the title to the container

    this.filterSetList = document.createElement('div');
    this.container.appendChild(this.filterSetList);

    this.updateFilterSetList();
};

MyCustomToolPanel.prototype.getSortModel = function() {
    var sortModel = this.params.api.getColumnState().filter(function(s) {
        return s.sort != null;
    });

    return sortModel;
};

MyCustomToolPanel.prototype.updateSortModel = function() {
    var sortModel = JSON.parse(localStorage.getItem('sortModel')) || [];
    if (sortModel.length > 0) {
        var currentSortModel = this.params.api.getColumnState();
        var mergeSortModel = currentSortModel.map(function(o1) {
            return sortModel.find(function(o2) { return o2.colId === o1.colId; }) || o1;
        });
        this.params.columnApi.setColumnState(mergeSortModel);
    }
};
MyCustomToolPanel.prototype.applySavedColumnState = function(applpySavedColumnState) {
    this.params.api.applyColumnState({
        state: applpySavedColumnState,
    });
};

MyCustomToolPanel.prototype.updateFilterSetList = function() {
    // Clear existing list
    this.filterSetList.innerHTML = '';

    // Retrieve filter sets from local storage
    var filterSets = JSON.parse(localStorage.getItem('filterSets')) || {};

    // Create a div with a button for each filter set
    for (var filterSetName in filterSets) {
        var div = document.createElement('div');
        div.className = 'filter-set';  // Add class name to the div

        var button = document.createElement('button');
        button.textContent = filterSetName;
        button.addEventListener('click', this.loadFilterSet.bind(this, filterSetName));
        div.appendChild(button);

        this.filterSetList.appendChild(div);
    }
};

MyCustomToolPanel.prototype.loadFilterSet = function(filterSetName) {
    // Retrieve filter set from local storage
    var filterSets = JSON.parse(localStorage.getItem('filterSets')) || {};
    var filterSet = filterSets[filterSetName];

    // Apply filter set to grid
    this.params.api.setFilterModel(filterSet.filterModel);
    this.updateSortModel();
    this.applySavedColumnState(filterSet.columnGroupState);
};

MyCustomToolPanel.prototype.getGui = function() {
    return this.container;
};



MyCustomToolPanel.prototype.saveFilterSet = function() {
    var filterSetName = this.input.value;
    if (!filterSetName) {
        alert('Please enter a name for the filter set.');
        return;
    }

    var filterModel = this.params.api.getFilterModel();
    var sortModel =  this.getSortModel();
    var columnGroupState = this.params.api.getColumnState();
    var newFilterSet = {
        filterModel: filterModel,
        sortModel: sortModel,
        columnGroupState: columnGroupState
    };

    // Retrieve existing filter sets from local storage
    var filterSets = JSON.parse(localStorage.getItem('filterSets')) || {};

    // Add new filter set to the object
    filterSets[filterSetName] = newFilterSet;

    // Save updated object back to local storage
    localStorage.setItem('filterSets', JSON.stringify(filterSets));
    this.updateFilterSetList();

};

var gridApi, columnApi;
var originalRowData = [];

// Define the column definitions for AG Grid
var columnDefs = [
    {headerName: "ID", field: "id"},
    {
        headerName: "Name",
        field: "name",
        cellRenderer: function(params) {
            return '<button class="btn-cell">' + params.value + '</button>';
        },
        comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
            return valueA.localeCompare(valueB);
        },
        onCellClicked: function(params) {
            var currentSalary = parseFloat(params.data.salary);
            if (currentSalary) {
                var newSalary = currentSalary * 1.1;
                params.node.setDataValue('salary', newSalary.toFixed(2));
                params.api.flashCells({rowNodes: [params.node], columns: ['salary']});
            }
        }
    },
    {headerName: "Position", field: "position"},
    {headerName: "Office", field: "office"},
    {headerName: "Age", field: "age", sort:"desc"},
    {headerName: "Start Date", field: "start_date"},
    {headerName: "Salary", field: "salary"},
    {headerName: "", field: "refresh", sortable : false, filter : false, suppressMenu : true, width: 100, headerComponent: CustomHeader },
];

// Grid Options: Defines & controls grid behaviour.
var gridOptions = {
    columnDefs: columnDefs,
    rowData: null, // Set rowData to null initially
    onGridReady: function (params) {
        fetch('http://localhost:8000/users')  // Replace with your Django API endpoint
            .then(response => response.json())
            .then(data => {
                // Update the grid with the data
                params.api.setGridOption('rowData', data);
                originalRowData = [...data];
                
            });
            gridApi = params.api;
            columnApi = params.columnApi;
    },
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        // allow every column to be aggregated
        enableValue: true,
        // allow every column to be grouped
        enableRowGroup: true,
        // allow every column to be pivoted
        enablePivot: true,
        filter: true,
      },
      components: {
        myCustomToolPanel: MyCustomToolPanel,
        CustomHeader: CustomHeader,
    },
      autoGroupColumnDef: {
        minWidth: 200,
      },
      sideBar: true,
      sideBar: {
        toolPanels: [
          'columns',
          {
            id: 'filters',
            labelKey: 'filters',
            labelDefault: 'Filters',
            iconKey: 'menu',
            toolPanel: 'agFiltersToolPanel',
          },
          {
            id: 'myCustomToolPanel',
            labelDefault: 'My Custom Tool Panel',
            labelKey: 'myCustomToolPanel',
            iconKey: 'menu',
            toolPanel: 'myCustomToolPanel',
        },
        ],
        defaultToolPanel: 'filters',
      },
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
var gridApi = agGrid.createGrid(document.querySelector('#myGrid'), gridOptions);



// ****
//  I kept this because it was a mistake but i took a long time doing that instead of the step 5
//  ****

// var filterSetMenu = document.getElementById('filterSetMenu');

// var label = document.createElement('label');
// var selectColumn = document.createElement('select');
// var lineBreak = document.createElement('br');
// var labelOrder = document.createElement('label');
// var selectOrder = document.createElement('select');
// var button = document.createElement('button');

// label.textContent = 'Choix de la colonne: ';
// labelOrder.textContent = 'Choix du sens: ';
// button.textContent = 'Apply Filter';

// gridOptions.columnDefs.forEach(function(columnDef) {
//     var option = new Option(columnDef.headerName, columnDef.field);
//     selectColumn.appendChild(option);
// });

// ['asc', 'desc'].forEach(function(order) {
//     var option = new Option(order.charAt(0).toUpperCase() + order.slice(1), order);
//     selectOrder.appendChild(option);
// });
// filterSetMenu.append(label, selectColumn, lineBreak, labelOrder, selectOrder, button);

// button.addEventListener('click', function() {
//     var selectedColumn = selectColumn.value;
//     var selectedOrder = selectOrder.value;

//     columnDefs.forEach(function(columnDef) {
//         if (columnDef.field === selectedColumn) {
//             columnDef.sort = selectedOrder;
//             columnDef.sortable = true;
//         } else {
//             columnDef.sort = undefined;
//             columnDef.sortable = false;
//         }

//     });

//     gridApi.setGridOption('columnDefs', columnDefs);
//     gridApi.setGridOption('rowData', originalRowData);
// });