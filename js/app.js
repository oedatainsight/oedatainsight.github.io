document.addEventListener('DOMContentLoaded', function() {
    const enzymeSelect = document.getElementById('enzymeSelect');
    const herbSelect = document.getElementById('herbSelect');
    const interactionDisplay = document.getElementById('interactionDisplay');

    // Example function to populate enzyme dropdown (adjust based on your actual data structure)
    function populateEnzymes() {
        // This data loading part should be adapted to fetch from `interactions.json`
        const enzymes = ["CYP3A4", "CYP2D6"]; // Example enzyme list
        enzymes.forEach(enzyme => {
            let option = new Option(enzyme, enzyme);
            enzymeSelect.add(option);
        });
    }

    // Load enzyme options on page load
    populateEnzymes();

    enzymeSelect.onchange = () => {
        // Implement similar logic to populate herbSelect based on selected enzyme
        // And apply fade-out animation to interactionDisplay if visible
        interactionDisplay.classList.remove('fade-in');
    };

    herbSelect.onchange = () => {
        // Load and display interaction data for the selected herb and enzyme
        // Use fetch() to get your data if it's not already loaded
        const enzyme = enzymeSelect.value;
        const herb = herbSelect.value;

       // Constructing image paths
    const herbImagePath = `images/herb-icons/${herb.toLowerCase()}.png`;
    const enzymeImagePath = `images/enzyme-icons/${enzyme}.png`;

    // Building the interaction display content
    const interactionData = `
        <div class="interaction-images">
            <img src="${herbImagePath}" alt="${herb}" class="herb-image">
            <img src="${enzymeImagePath}" alt="${enzyme}" class="enzyme-image">
        </div>
        <p>Interaction data for ${enzyme} and ${herb}.</p>
    `;
    interactionDisplay.innerHTML = interactionData;
    
        setTimeout(() => {
            interactionDisplay.innerHTML = interactionData; // Update with real data
            interactionDisplay.classList.add('fade-in');
        }, 1000); // Delay to simulate fade-out then fade-in
    };
});
