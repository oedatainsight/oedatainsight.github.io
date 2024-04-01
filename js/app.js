document.addEventListener('DOMContentLoaded', function() {
  
  const interactionDisplay = document.getElementById('interactionDisplay');
  window.selected = { enzyme: null, herb: null };
  window.state = 'enzyme'; // Initialize the state\

  // Fetch the data from your study
  fetch('/data/interactions.json')
    .then(response => response.json())
    .then(data => {
      // Store the data for later use
      window.studyData = data;

      // Populate the enzyme and herb grids
      populateGrid('enzymeGrid', ["CYP3A4", "CYP1A2", "CYP2D6", "CYP2E1"], 'enzyme');
      populateGrid('herbGrid', ["Goldenseal", "Black Cohosh", "Valerian", "Kava kava"], 'herb');
      populatStudyDetails();
    }); 
    function populatStudyDetails() {
    
    const objectivesContainer = document.getElementById('objectivesContainer');
    const methodsContainer = document.getElementById('methodsContainer');
    const conclusionsContainer = document.getElementById('conclusionsContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const studyDetailsData = window.studyData.studyDetails;

    objectivesContainer.innerHTML = `
      <h2>Objectives</h2>
      <p>${studyDetailsData.objectives}</p>
    `;

    methodsContainer.innerHTML = `
      <h2>Methods</h2>
      <p>${studyDetailsData.methods}</p>
    `;
    resultsContainer.innerHTML = `
      <h2>Results</h2>
      <p>Interactive Graph: Explore what this study found on the effects of herbal supplemmentation on metabolized ratios of substrate drugs. Select an enzyme and a herbal supplement</p>
    `;

    conclusionsContainer.innerHTML = `
      <h2>Conclusions</h2>
      <p>${studyDetailsData.conclusions}</p>
    `;
  }
  // Define the function to populate the enzyme and herb grids  

  function populateGrid(gridId, items, type) {
    const grid = document.getElementById(gridId);
 // Create a container for the images
    //container.style.display = 'inline-block'; // Make the container display its children inline
    //grid.appendChild(container); // Add the container to the grid

    items.forEach(item => {
      let itemContainer = document.createElement('div'); // Create a container for each item
      itemContainer.style.display = 'inline-block'; // Make the container display its children inline
      let img = document.createElement('img');

      img.classList.add('icon');
      img.src = `images/${type}-icons/${encodeURIComponent(item.toLowerCase())}.png`;
      img.alt = item;
      img.classList.add(`${type}-image`);

      let name = document.createElement('p'); // Create a new p element for the name
      name.textContent = item; // Set the text content to the item name
  
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
      itemContainer.appendChild(img); // Add the image to the item container
      itemContainer.appendChild(name); // Add the name to the item container
  
      grid.appendChild(itemContainer); // Add the item container to // Add the image to the container instead of the grid
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
    const footnote = window.studyData[window.selected.enzyme].footnote;
    const metabolizingAgent = window.studyData[window.selected.enzyme].metabolizingagent;
        
    // Create a new chart
    const ctx = document.getElementById('interactionChart').getContext('2d');
    ctx.canvas.height = 200;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pre-supplementation', 'Post-supplementation'],
        datasets: [{
          label:metabolizingAgent,
          data: [preSupplementationData, postSupplementationData],
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 0.2)'],
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
        const interaction = window.studyData[window.selected.enzyme][window.selected.herb]
        const interactionDescription = window.studyData[window.selected.enzyme][window.selected.herb].description;
        const footnote =  window.studyData[window.selected.enzyme].footnote;


        interactionDisplay.textContent = `Interaction between ${window.selected.enzyme} and ${window.selected.herb}: ${interactionDescription || 'Data not available'}`;
        interactionDisplay.classList.add('fade-in'); // Add the fade-in class
        // Add the slide-right class to the selected items
        document.querySelector(`.enzyme-image[alt="${window.selected.enzyme}"]`).classList.add('slide-right', 'selected');
        document.querySelector(`.herb-image[alt="${window.selected.herb}"]`).classList.add('slide-right', 'selected');

        // Remove non-selected items
        for (let image of document.querySelectorAll('.enzyme-image:not(.selected), .herb-image:not(.selected)')) {
          image.remove();
        }
        updateChart(interaction);
        const footnoteDisplay = document.getElementById('footnoteDisplay');
        footnoteDisplay.textContent = footnote || 'Footnote not available';
        footnoteDisplay.classList.add('fade-in');
        // Display the "Go Back" button
        document.getElementById('goBack').style.display = 'block';
        
      }   
      
    }

    document.getElementById('goBack').style.display = 'block';
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
