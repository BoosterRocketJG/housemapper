// Function to submit form data as JSON in a POST request
async function submitFormData(formData) {
    // Define the API endpoint (replace with your actual API URL)
    const apiUrl = 'https://02sfka.buildship.run/forms/?Form-Version=booking'; // Replace with your API endpoint
  
    try {
      // Make the POST request
      const response = await fetch(apiUrl, {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(formData), // Convert the form data to a JSON string
      });
  
      // Check if the response is OK (status code 200-299)
      if (response.ok) {
        const responseData = await response.json();
        console.log('Form submitted successfully:', responseData);
      } else {
        console.error('Error submitting form:', response.status, response.statusText);
      }
    } catch (error) {
      // Catch and log any errors during the fetch request
      console.error('Error during API call:', error);
    }
  }
  
  // Example form data
  const formData = {
    spaceType: "Office",               // STRING
    floors: 3,                         // INTEGER
    rooms: 10,                         // INTEGER
    resiMeterage: 100,                 // INTEGER
    commercialMeterage: 50,            // INTEGER
    habitable: true,                   // BOOLEAN
    dwg: false,                        // BOOLEAN
    pointCloud: true,                  // BOOLEAN
    3dModel: false,                    // BOOLEAN
    sections: 2,                       // INTEGER
    elevations: 4,                     // INTEGER
    firstName: "John",                 // STRING
    lastName: "Doe",                   // STRING
    phone: "+1234567890",              // STRING
    email: "john.doe@example.com",     // STRING
    company: "Acme Corp",              // STRING
    presentForScan: true,              // BOOLEAN
    accessProvider: "Building Manager",// STRING
    specialInstructions: "None",       // STRING
    otherInfo: "No additional info",   // STRING
    appointmentTimeDate: "2024-10-15T14:30:00Z", // ISO 8601 format for DateTime
    paymentConfirmed: true,            // BOOLEAN
    paymentAmount: 1500.75,            // Non-integer number
    totalPrice: 2000.00,               // Non-integer number
    totalDue: 500.25                   // Non-integer number
  };
  
  // Call the function to submit the form data
  submitFormData(formData);
  