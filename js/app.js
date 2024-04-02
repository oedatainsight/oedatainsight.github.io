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

            // Calculate the target positions based on the positions of the CYP2E1 and Kava Kava images
        let cyp2e1Image = document.querySelector('.enzyme-image[alt="CYP2E1"]');
        let kavaKavaImage = document.querySelector('.herb-image[alt="Kava Kava"]');
        let enzymeTargetPosition = cyp2e1Image.getBoundingClientRect().right;
        let herbTargetPosition = kavaKavaImage.getBoundingClientRect().right;

            // Slide all enzyme images to the position of the CYP2E1 image
        for (let element of document.querySelectorAll('.enzyme-image')) {
          let currentPosition = element.getBoundingClientRect().right;
          let distance = enzymeTargetPosition - currentPosition;
          element.style.transform = `translateX(${distance}px)`;
          element.classList.add('selected');
        }

        // Slide all herb images to the position of the Kava Kava image
        for (let element of document.querySelectorAll('.herb-image')) {
          let currentPosition = element.getBoundingClientRect().right;
          let distance = herbTargetPosition - currentPosition;
          element.style.transform = `translateX(${distance}px)`;
          element.classList.add('selected');
        }

            // Remove non-selected items
        for (let image of document.querySelectorAll('.enzyme-image:not(.selected), .herb-image:not(.selected)')) {
          image.remove();
        }
      }
    }// Update the state

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
