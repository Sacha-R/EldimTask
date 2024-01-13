// Define the column definitions for AG Grid
var columnDefs = [
    {headerName: "ID", field: "id"},
    {
        headerName: "Name",
        field: "name",
        cellRenderer: function(params) {
            return '<button class="btn-cell">' + params.value + '</button>';
        },
        onCellClicked: function(params) {
            var currentSalary = parseFloat(params.data.salary);
            if (currentSalary) {
                var newSalary = currentSalary * 1.1;
                params.node.setDataValue('salary', newSalary.toFixed(2));
                params.api.flashCells({rowNodes: [params.node], columns: ['salary']});
                // params.api.refreshCells({rowNodes: [params.node], columns: ['salary']});
            }
        }
    },
    {headerName: "Position", field: "position"},
    {headerName: "Office", field: "office"},
    {headerName: "Age", field: "age"},
    {headerName: "Start Date", field: "start_date"},
    {headerName: "Salary", field: "salary"}
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
                params.api.setRowData(data);
            });
    },
    defaultColDef: {
        resizable: true,
        width: 100,
        sortable: true,
        filter: true
    },
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
new agGrid.Grid(document.querySelector('#myGrid'), gridOptions);