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
        if (!window.selected[type]) {
        selectItem(type, item);
        // Add the faded class to non-selected images
        itemContainer.appendChild(img); // Add the image to the item container
        itemContainer.appendChild(name);

        for (let sibling of itemContainer.parentNode.children) {
          if (sibling !== itemContainer) {
        sibling.classList.add('faded');
      } else {
        sibling.classList.remove('faded');
          }
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
    ctx.canvas.height = 200; // Adjust as needed
    ctx.canvas.width = 400; // Adjust as needed
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pre-supplementation', 'Post-supplementation'],
        datasets: [{
          label:metabolizingAgent,
          data: [preSupplementationData, postSupplementationData],
          backgroundColor: ['rgba(128, 128, 128, 0.2)', 'rgba(128, 128, 128, 0.2)'], // Change to gray
          borderColor: ['rgba(128, 128, 128, 1)', 'rgba(128, 128, 128, 1)'], // Change to gray
          borderWidth: 1,
          footnote: footnote,
    
  
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
  function moveSelectedEnzymeAndHerb(enzymeName, herbName) {
    // Get the target positions for the enzyme and herb containers
    let enzymeTarget = Array.from(document.querySelectorAll('#enzymeGrid .itemContainer')).find(el => el.textContent.trim() === 'CYP2E1');
    let herbTarget = Array.from(document.querySelectorAll('#herbGrid .itemContainer')).find(el => el.textContent.trim() === 'Kava kava');
    let selectedEnzyme;
    let selectedHerb;

    // Add click event listeners to the enzyme grid items
    document.querySelectorAll('#enzymeGrid .item').forEach(item => {
      item.addEventListener('click', () => {
        selectedEnzyme = item.textContent; // Set the selected enzyme to the clicked item's text
      });
    });

    // Add click event listeners to the herb grid items
    document.querySelectorAll('#herbGrid .item').forEach(item => {
      item.addEventListener('click', () => {
        selectedHerb = item.textContent; // Set the selected herb to the clicked item's text
      });
    });
    // If the selected enzyme or herb doesn't exist, exit the function
    if (!selectedEnzyme || !selectedHerb) {
      console.log('valid');
      return;
    }

    // If the target enzyme or herb doesn't exist, exit the function
    if (!enzymeTarget || !herbTarget) {
      console.log('valid');
      return;
    }

    // Calculate the distances to the target positions
    let enzymeDistance = enzymeTarget.getBoundingClientRect().left - selectedEnzyme.getBoundingClientRect().left;
    let herbDistance = herbTarget.getBoundingClientRect().left - selectedHerb.getBoundingClientRect().left;

    // Apply a CSS transform to move the selected elements to the target positions
    selectedEnzyme.style.transform = `translateX(${enzymeDistance}px)`;
    selectedHerb.style.transform = `translateX(${herbDistance}px)`;
  }

  function selectItem(type, item) {
    // Check if the user is selecting the correct type
    if (window.selected[type]) {
      alert(`You have already selected a ${type}.`);
    }     // Check if the user is selecting the correct type  

      else
    // Store the selected item
    window.selected[type] = item;

    // If both an enzyme and a herb are selected, display the interaction data
    if (window.selected.enzyme && window.selected.herb) {
      if (window.studyData && window.studyData[window.selected.enzyme]) {
        const interaction = window.studyData[window.selected.enzyme][window.selected.herb]
        const interactionDescription = window.studyData[window.selected.enzyme][window.selected.herb].description;
        const footnote =  window.studyData[window.selected.enzyme].footnote;

        interactionDisplay.textContent = `Interaction between ${window.selected.enzyme} and ${window.selected.herb}: ${interactionDescription || 'Data not available'}`;
        interactionDisplay.classList.add('fade-in'); // Add the fade-in class
            // Define the target positions for the enzyme and herb containers
        moveSelectedEnzymeAndHerb(window.selected.enzyme, window.selected.herb);
        // Update the chart
        updateChart(interaction);
        footnote
        // Get the chart container
        const chartContainer = document.getElementById('chart-container');

        // Check if chartContainer exists
        if (chartContainer) {
          // Remove any existing footnote
          const existingFootnote = document.querySelector('#chart-container p');
          if (existingFootnote) existingFootnote.remove();

          // Create a new paragraph element for the footnote
          const footnoteElement = document.createElement('p');

          // Set the text of the footnote element
          footnoteElement.textContent = window.studyData[window.selected.enzyme].footnote;

          // Add the footnote element to the chart container
          chartContainer.appendChild(footnoteElement);
        } else {
          console.error('chart-container not found');
        }

        }
      }
    // Update the state

    document.getElementById('goBack').style.display = 'block';
    document.getElementById('goBack').addEventListener('click', function() {
      // Reset the state and selected items
      window.state = 'enzyme';
      window.selected = {};
       // Remove the chart
      let chart = document.getElementById('interactionChart');
      chart.remove();

      // Clear the interaction data
      interactionDisplay.textContent = '';

      // Hide the "Go Back" button
      this.style.display = 'none';

      // Reload the page to reset the selection screen
      location.reload();
    });
  }
});
