document.addEventListener('DOMContentLoaded', function () {
  const selectElement = document.getElementById('drugSelect');
  const infoDiv = document.getElementById('drugInfo');

  fetch('data/drugs.json')
      .then(response => response.json())
      .then(drugs => {
          drugs.forEach(drug => {
              const option = new Option(drug.name, drug.name);
              selectElement.add(option);
          });

          selectElement.addEventListener('change', function () {
              const selectedDrug = drugs.find(drug => drug.name === this.value);
              if (selectedDrug) {
                  displayDrugInfo(selectedDrug);
              } else {
                  infoDiv.innerHTML = '';
              }
          });
      });

  function displayDrugInfo(drug) {
      infoDiv.innerHTML = `
          <h2>${drug.name}</h2>
          <p>${drug.description}</p>
          <h3>Pharmacokinetics:</h3>
          <p>Bioavailability: ${drug.pharmacokinetics.bioavailability}</p>
          <p>Half-Life: ${drug.pharmacokinetics.halfLife}</p>
          <p>Cmax: ${drug.pharmacokinetics.Cmax}</p>
          <p>Tmax: ${drug.pharmacokinetics.Tmax}</p>
      `;
  }
});
