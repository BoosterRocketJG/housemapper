document.addEventListener('DOMContentLoaded', function () {
    // List of JavaScript files to load from the same domain using the proxy path
    const jsFiles = [
        'https://housemapper.co.uk/assets/scripts/forms/webflow-js-test.js',
        'https://housemapper.co.uk/assets/scripts/forms/buildship-submission-1.js',
        'https://housemapper.co.uk/assets/scripts/forms/post-code-checker-logic.js',
        'https://housemapper.co.uk/assets/scripts/forms/step-6.js',
        'https://housemapper.co.uk/assets/scripts/forms/step-9.js'
    ];

    // List of JSON files to load from the same domain using the proxy path
    const jsonFiles = [
        'https://housemapper.co.uk/assets/data/validation-messages.json',
        'https://housemapper.co.uk/assets/data/approved-postcodes.json'
    ];

    // Function to dynamically load a JavaScript file
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.body.appendChild(script);
        });
    }

    // Function to dynamically fetch a JSON file
    function fetchJson(url) {
        return fetch(url, {
            method: 'GET',
            mode: 'same-origin' // Use 'same-origin' mode since we are now on the same domain
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${url}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error(`Error fetching JSON file ${url}:`, error);
            return null;
        });
    }

    // Load all JavaScript files sequentially
    jsFiles.reduce((promise, file) => {
        return promise.then(() => loadScript(file));
    }, Promise.resolve())
    .then(() => {
        console.log('All JavaScript files loaded successfully.');
    })
    .catch(error => {
        console.error('Error loading JavaScript files:', error);
    });

    // Fetch all JSON files
    Promise.all(jsonFiles.map(url => fetchJson(url)))
        .then(results => {
            const [validationMessages, approvedPostcodes] = results;
            console.log('Validation Messages:', validationMessages);
            console.log('Approved Postcodes:', approvedPostcodes);
            // Add any further processing or handling of the JSON data here
        });
});
