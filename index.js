// Initialize the noUiSlider plugin with SurveyJS
window['surveyjs-widgets'].nouislider(Survey);

// Create a new SurveyJS Model with the provided JSON configuration
const survey = new Survey.Model(json);

// Add an event listener that triggers when the survey is completed
survey.onComplete.add((sender, options) => {
    // Log the survey data to the console in a formatted JSON structure
    console.log(JSON.stringify(sender.data, null, 3));
});

// Render the survey inside the element with id 'surveyElement'
$("#surveyElement").Survey({ model: survey });

// Event listener for when a question is rendered in the survey
survey.onAfterRenderQuestion.add((survey, options) => {
    // Check if the rendered question is the 'range' type
    if (options.question.name === 'range') {
        // Use setTimeout to allow for the DOM elements to be fully loaded
        setTimeout(() => {
            // Get the slider element within the rendered question
            let sliderElement = options.htmlElement.querySelector('.noUi-target');

            // Check if the slider element exists
            if (!sliderElement) {
                console.error('No slider found');
                return;
            }

            // Access the noUiSlider instance from the slider element
            let slider = sliderElement.noUiSlider;

            // CHANGE THIS -->
            // slider.noUiSlider.disable();

            // Function to update the slider value
            function updateSliderValue(change) {
                // Get the current value of the slider
                let currentValue = parseFloat(slider.get());
                // Calculate the new value
                let newValue = currentValue + change;
                // Set the new value on the slider
                slider.set(newValue);
            }

            // Variable to store the interval timer
            let interval;
            // Function to start moving the slider
            function startMoving(change) {
            
                let currentValue = parseFloat(slider.get());
                console.log(currentValue)
                let val = newIntervalValue(currentValue);

                // Set an interval to continuously update the slider value
                interval = setInterval(() => {
                    updateSliderValue(change);
                }, val); // Update interval in milliseconds
            }

            function newIntervalValue(val){
                return 100 + Math.exp(Math.E, Math.abs(val - 50));
                // return 100 + 1000*Math.abs(val - 50)                
            }

            // Function to stop moving the slider
            function stopMoving() {
                // Clear the interval timer
                clearInterval(interval);
            }

            // Create left and right buttons and append them to the slider's parent element
            let leftButton = $('<button/>', { text: 'Left', id: 'leftArrow' });
            let rightButton = $('<button/>', { text: 'Right', id: 'rightArrow' });
            $(sliderElement.parentElement).append(leftButton, rightButton);

            // Add event listeners for mousedown, mouseup, and mouseleave on both buttons
            $('#leftArrow').mousedown(function() {
                startMoving(-1); // Start moving left
            }).mouseup(stopMoving).mouseleave(stopMoving);

            $('#rightArrow').mousedown(function() {
                startMoving(1); // Start moving right
            }).mouseup(stopMoving).mouseleave(stopMoving);

        }, 0);
    }
});

// Event listener for the checkbox to enable or disable the slider
$("#ex7-enabled").click(function() {
    if(this.checked) {
        // Enable the slider if the checkbox is checked (Without JQuery)
        slider.enable();
    }
    else {
        // Disable the slider if the checkbox is unchecked (Without JQuery)
        slider.disable();
    }
});