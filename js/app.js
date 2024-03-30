document.addEventListener('DOMContentLoaded', function() {
  const interactionDisplay = document.getElementById('interactionDisplay');
  window.selected = { enzyme: null, herb: null };
  window.state = 'enzyme'; // Initialize the state

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
    let container = document.createElement('div'); // Create a container for the images
    container.style.display = 'inline-block'; // Make the container display its children inline
    grid.appendChild(container); // Add the container to the grid

    items.forEach(item => {
      let img = document.createElement('img');
      img.classList.add('icon');
      img.src = `images/${type}-icons/${encodeURIComponent(item.toLowerCase())}.png`;
      img.alt = item;
      img.classList.add(`${type}-image`);
      img.addEventListener('click', function() {
        selectItem(type, item);
        // Add the faded class to non-selected images
        for (let image of container.children) {
          if (image.alt !== item) {
            image.classList.add('faded');
          } else {
            image.classList.remove('faded');
          }
        }
      });
      container.appendChild(img); // Add the image to the container instead of the grid
    });
  }

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
    if (window.selected.enzyme && window.selected.herb) {
      if (window.studyData && window.studyData[window.selected.enzyme]) {
        const interaction = window.studyData[window.selected.enzyme][window.selected.herb];
        interactionDisplay.textContent = `Interaction between ${window.selected.enzyme} and ${window.selected.herb}: ${interaction}`;
        interactionDisplay.classList.add('fade-in'); // Add the fade-in class

        // Add the slide-right class to the selected items
        document.querySelector(`.enzyme-image[alt="${window.selected.enzyme}"]`).classList.add('slide-right', 'selected');
        document.querySelector(`.herb-image[alt="${window.selected.herb}"]`).classList.add('slide-right', 'selected');

        // Remove non-selected items
        for (let image of document.querySelectorAll('.enzyme-image:not(.selected), .herb-image:not(.selected)')) {
          image.remove();
        }

        // Reset the state and selected items
        window.state = 'enzyme';
        window.selected = {};
      } else {
        console.log('Data not available');
      }
    }
  }
});