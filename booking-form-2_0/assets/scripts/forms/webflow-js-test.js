document.addEventListener('DOMContentLoaded', function () {
    // Select the input field by its ID
    const postcodeStubInput = document.getElementById('postcodeStub');

    // Add an event listener for the 'focus' event (triggered when the user clicks to enter text)
    postcodeStubInput.addEventListener('focus', function () {
        // Select all elements with the class 'space-type'
        const spaceTypeElements = document.querySelectorAll('.space-type');

        // Hide each element with the class 'space-type'
        spaceTypeElements.forEach(function (element) {
            element.style.display = 'none';
        });
    });
});
