// table.js
document.addEventListener('DOMContentLoaded', (event) => {
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

    function buildTable(jsonData) {
      const table = document.getElementById('supplementsTable');
    
      jsonData.supplements.forEach(supplement => {
        supplement.compounds.forEach((compound, index) => {
          const row = table.insertRow();
    
          // Insert the supplement name only for the first compound
          let cell = row.insertCell();
          cell.textContent = index === 0 ? supplement.name : '';
          
          // Insert the compound name
          cell = row.insertCell();
          cell.textContent = compound.name;
          
          // Insert the content
          cell = row.insertCell();
          cell.textContent = compound.content;
    
          // Insert the daily dose
          cell = row.insertCell();
          cell.textContent = compound.dailyDose;
    
          cell = row.insertCell();
          if (index === 0) {
            cell.textContent = compound.dosageForm ? compound.dosageForm : '';
            dosageFormAdded = true;
          }
    
          cell = row.insertCell();
          if (index === 0) {
            cell.textContent = compound.disintegrationTime ? compound.disintegrationTime : '';
            disintegrationTimeAdded = true;
          }
        });
      });

    }
    
});
