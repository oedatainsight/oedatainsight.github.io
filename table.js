// table.js
fetch('/data/table2.json')
  .then(response => response.json())
  .then(data => {
    // Here 'data' is the JSON data from 'table.json'
    // Call the function to build the table with this data
    buildTable(data);
  })
  .catch(error => {
    console.error('Error loading JSON data:', error);
  });

function buildTable(data) {
  // Access your HTML table
  const table = document.getElementById('your-table-id');
  
  // Use the JSON data to add rows and cells to the table
  data.supplements.forEach(supplement => {
    // Create a new row for each supplement
    let row = table.insertRow();
    let cell = row.insertCell();
    cell.textContent = supplement.name;
    
    // Now loop through each compound of the supplement
    supplement.compounds.forEach((compound, index) => {
      if (index === 0) {
        cell = row.insertCell();
        cell.textContent = compound.name;
        // Add more cells for content, daily dose, etc.
      } else {
        // Insert new rows for additional compounds
        row = table.insertRow();
        row.insertCell().textContent = ''; // Empty cell for supplement column
        row.insertCell().textContent = compound.name;
        // Add more cells for content, daily dose, etc.
      }
    });
  });
}
