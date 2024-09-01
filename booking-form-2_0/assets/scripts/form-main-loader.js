document.addEventListener('DOMContentLoaded', function () {
    // List of JavaScript files to load
    const jsFiles = [
        'https://assets.housemapper.co.uk/booking-form-2_0/assets/scripts/forms/webflow-js-test.js'
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
});
