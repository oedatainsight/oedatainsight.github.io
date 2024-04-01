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
  // Define the chart update function
  function updateChart(interaction) {
    // Fetch the data for the selected enzyme-herb pair
    const preSupplementationData = interaction.preSupplementation.mean;
    const postSupplementationData = interaction.postSupplementation.mean;

    // Fetch the confidence intervals for the selected enzyme-herb pair
    const preSupplementationCI = interaction.preSupplementation.CI.split(' to ').map(Number);
    const postSupplementationCI = interaction.postSupplementation.CI.split(' to ').map(Number);

    // Create a new chart
    const ctx = document.getElementById('interactionChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pre-supplementation', 'Post-supplementation'],
        datasets: [{
          label: window.selected.enzyme,
          data: [preSupplementationData, postSupplementationData],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
          // Add error bars
          errorBars: {
            data: [preSupplementationCI, postSupplementationCI],
            type: 'custom',
            symmetric: false
          }
        }]
      },
      options: {
        title: {
          display: true,
          text: footnote,
          fontSize: 20
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
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
        interactionDisplay.textContent = `Interaction between ${window.selected.enzyme} and ${window.selected.herb}: ${interaction.description || 'Data not available'}`;
        interactionDisplay.classList.add('fade-in'); // Add the fade-in class
        
        // Add the slide-right class to the selected items
        document.querySelector(`.enzyme-image[alt="${window.selected.enzyme}"]`).classList.add('slide-right', 'selected');
        document.querySelector(`.herb-image[alt="${window.selected.herb}"]`).classList.add('slide-right', 'selected');

        // Remove non-selected items
        for (let image of document.querySelectorAll('.enzyme-image:not(.selected), .herb-image:not(.selected)')) {
          image.remove();
        }
        updateChart(interaction);

      } else {
        console.log('Data not available');
      }   
        // Show the "Go Back" button
      document.getElementById('goBack').style.display = 'block';
    }

    // Add a click event listener to the "Go Back" button
    document.getElementById('goBack').addEventListener('click', function() {
      // Reset the state and selected items
      window.state = 'enzyme';
      window.selected = {};

      // Clear the interaction data
      interactionDisplay.textContent = '';

      // Hide the "Go Back" button
      this.style.display = 'none';

      // Reload the page to reset the selection screen
      location.reload();
    });
  }
});
