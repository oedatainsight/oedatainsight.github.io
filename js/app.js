document.addEventListener('DOMContentLoaded', function() {
  const interactionDisplay = document.getElementById('interactionDisplay');
  window.selected = { enzyme: null, herb: null };

  // Fetch the data from your study
  // Fetch the data from your study
  fetch('/data/interactions.json')
    .then(response => response.json())
    .then(data => {
      // Store the data for later use
      window.studyData = data;

      // Populate the enzyme and herb grids
      populateGrid('enzymeGrid', ["CYP3A4", "CYP1A2", "CYP2D6", "CYP2E1"], 'enzyme');
      populateGrid('herbGrid', ["Goldenseal", "Black Cohosh", "Valerian", "Kava"], 'herb');
    });

  function populateGrid(gridId, items, type) {
    const grid = document.getElementById(gridId);
    items.forEach(item => {
      let img = document.createElement('img');
      img.classList.add('icon');
      img.src = `images/${type}-icons/${encodeURIComponent(item.toLowerCase())}.png`;      img.alt = item;
      img.classList.add(`${type}-image`);
      img.addEventListener('click', () => selectItem(type, item));
      grid.appendChild(img);
    });
  }

  // Initialize the state
  window.state = 'enzyme';

  function selectItem(type, item) {
    // Check if the user is selecting the correct type
    if (type !== window.state) {
      alert(`Please select an ${window.state} first.`);
      return;
    }

    // Store the selected item
    window.selected[type] = item;

    // Update the state
    window.state = window.state === 'enzyme' ? 'herb' : 'enzyme';

    // If both an enzyme and a herb are selected, display the interaction data
    // If both an enzyme and a herb are selected, display the interaction data
    if (window.selected.enzyme && window.selected.herb) {
      console.log('Enzyme:', window.selected.enzyme);
      console.log('Herb:', window.selected.herb);
      if (window.studyData && window.studyData[window.selected.enzyme]) {
        const interaction = window.studyData[window.selected.enzyme][window.selected.herb];
        console.log('Interaction:', interaction);
        interactionDisplay.textContent = `Interaction between ${window.selected.enzyme} and ${window.selected.herb}: ${interaction}`;
        
        // Reset the state and selected items
        window.state = 'enzyme';
        window.selected = {};
      } else {
        console.log('Data not available');
      }
    }
  }
});