document.addEventListener("DOMContentLoaded", () => {
    // Fetch the approved postcodes and validation messages on initialization
    let approvedPostcodes = [];
    let validationMessages = {};
  
    // Use a flag to ensure postcodes are loaded only once
    let postcodesLoaded = false;
  
    // Function to load postcodes
    const loadPostcodes = () => {
      if (postcodesLoaded) return; // Prevent reloading if already loaded
  
      // Fetch approved postcodes
      fetch("https://assets.housemapper.co.uk/booking-form-2_0/assets/data/approved-postcodes.json")
        .then((response) => {
          console.log("Response Status:", response.status); // Debugging: Check the response status
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched Postcodes:", data); // Debugging: Log fetched data
  
          // Check if the fetched data is an array
          if (Array.isArray(data)) {
            approvedPostcodes = data; // Assign data if it's a valid array
            postcodesLoaded = true; // Set the flag to true after loading
            console.log("Approved Postcodes is an array:", approvedPostcodes); // Confirm it is an array
          } else {
            console.error("Error: Expected an array but got", typeof data, data); // Log if data is not an array
          }
        })
        .catch((error) => console.error("Error fetching approved postcodes:", error));
    };
  
    // Function to load validation messages
    const loadValidationMessages = () => {
      fetch("https://assets.housemapper.co.uk/booking-form-2_0/assets/data/validation-messages.json")
        .then((response) => {
          console.log("Validation Messages Response Status:", response.status); // Debugging: Check the response status
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched Validation Messages:", data); // Debugging: Log fetched data
  
          // Check if data is an object
          if (typeof data === "object" && data !== null) {
            // Iterate over the object's keys
            Object.keys(data).forEach((key) => {
              const item = data[key];
              if (item.fields) {
                const messageName = item.fields["Message Name"];
                const messageContent = item.fields.Message;
                if (messageName && messageContent) {
                  validationMessages[messageName] = messageContent;
                }
              }
            });
          } else {
            console.error("Error: Expected an object but got", typeof data, data);
          }
  
          console.log("Parsed Validation Messages:", validationMessages); // Debugging: Log parsed messages
        })
        .catch((error) => console.error("Error fetching validation messages:", error));
    };
  
    // Load postcodes and validation messages once
    loadPostcodes();
    loadValidationMessages();
  
    const postcodeInput = document.getElementById("postcode-area");
    const postcodeClear = document.getElementById("postcodeClear");
    const stubCheckButton = document.getElementById("stubCheck");
    const typeformButton = document.getElementById("typeform-button-embed");
    const responseElement = document.getElementById("postcode-check-response");
  
    // Helper functions
    const showStubCheckButton = () => {
      stubCheckButton.classList.remove("hidden");
      stubCheckButton.classList.remove("disabled");
      console.log("Stub Check Button shown"); // Debugging: Log button state
    };
  
    const hideStubCheckButton = () => {
      stubCheckButton.classList.add("hidden");
      stubCheckButton.classList.add("disabled");
      console.log("Stub Check Button hidden"); // Debugging: Log button state
    };
  
    const responseTextUpdate = (hidden, message, cssClass) => {
      if (hidden) {
        responseElement.classList.add("hidden");
      } else {
        responseElement.classList.remove("hidden");
      }
      responseElement.textContent = message || ""; // Ensure no undefined message
      responseElement.className = `paragraph postcode-check-response ${cssClass}`;
      console.log("Response Text Updated:", message); // Debugging: Log response text
    };
  
    const postcodeTooLong = () => {
      responseTextUpdate(false, validationMessages["postcodeTooLong"], "error");
    };
  
    const areaServed = () => {
      responseTextUpdate(false, validationMessages["exactMatch"], "success");
      typeformButton.classList.remove("hidden");
      typeformButton.classList.remove("disabled");
      hideStubCheckButton();
      console.log("Area served"); // Debugging: Log state change
    };
  
    const areaNotServed = () => {
      responseTextUpdate(false, validationMessages["noCoverage"], "error");
      typeformButton.classList.add("disabled");
      hideStubCheckButton();
      console.log("Area not served"); // Debugging: Log state change
    };
  
    // On pageload, check localStorage for saved postcode
    const savedPostcode = localStorage.getItem("postcode");
    if (savedPostcode && savedPostcode.length > 4 && /\s/.test(savedPostcode)) {
      postcodeInput.value = savedPostcode;
      showStubCheckButton();
    }
  
   // Input field restrictions and checks
postcodeInput.addEventListener("input", (event) => {
    let input = event.target.value.toUpperCase();

    // Restrict input to alphanumeric characters and spaces
    input = input.replace(/[^A-Z0-9\s]/g, "");

    // If a whitespace already exists, remove any additional whitespace
    const firstWhitespaceIndex = input.indexOf(" ");
    if (firstWhitespaceIndex !== -1) {
        input =
            input.substring(0, firstWhitespaceIndex + 1) +
            input.substring(firstWhitespaceIndex + 1).replace(/\s/g, "");
    }

    // Ensure no leading whitespace and limit to 8 characters total
    input = input.replace(/^\s/, "").slice(0, 8);

    event.target.value = input;
    localStorage.setItem("postcode", input);

    // Check for specific format: [space][Number][Letter][Letter]
    const validFormat = /\s\d[A-Z]{2}$/; // Regular expression to match "space, digit, letter, letter"

    // Check for invalid format: [space][letter]
    const invalidFormat = /\s[A-Z]$/; // Regular expression to match "space, letter"

    if (invalidFormat.test(input)) {
        // Show the invalid postcode message if input matches the invalid format
        responseTextUpdate(false, validationMessages["invalidPostcode"], "error");
        hideStubCheckButton();
    } else {
        // Hide the invalid message if the [space][letter] combination is no longer present
        responseTextUpdate(true, '', '');

        if (input.length > 8) {
            // If input is too long, show the "too long" message
            postcodeTooLong();
        } else if (validFormat.test(input)) {
            // If the input matches the valid format, show the button
            showStubCheckButton();
        } else {
            // Hide the button if input is incomplete
            hideStubCheckButton();
        }
    }
});


  
    // Clear button functionality
    postcodeClear.addEventListener("click", () => {
      postcodeInput.value = "";
      localStorage.removeItem("postcode");
      hideStubCheckButton();
      typeformButton.classList.add("hidden");
      typeformButton.classList.add("disabled");
      responseTextUpdate(true, "", "");
      console.log("Postcode cleared"); // Debugging: Log clear action
    });
  
    // Stub check button functionality
    stubCheckButton.addEventListener("click", () => {
      const input = postcodeInput.value.trim();
      console.log("Original input:", input); // Debugging: Log original input
  
      // Format input and save to localStorage
      if (!/\s/.test(input) && input.length >= 5) {
        const formattedInput = input.slice(0, -3) + " " + input.slice(-3);
        postcodeInput.value = formattedInput;
        localStorage.setItem("postcode", formattedInput);
        console.log("Formatted input stored in local storage:", formattedInput); // Debugging: Log formatted value
      } else {
        console.warn("Input did not meet the criteria for formatting and storage"); // Debugging: Warn if input does not meet criteria
      }
  
      // Extract postcode stub from the formatted input
      const postcodeStub = postcodeInput.value.split(" ")[0]; // Get only the part before the whitespace
      localStorage.setItem("postcodeStub", postcodeStub);
      console.log("Checking postcode stub:", postcodeStub); // Debugging: Log postcode stub
  
      // Check if postcode stub exists in approved postcodes
      if (
        postcodeStub &&
        Array.isArray(approvedPostcodes) &&
        approvedPostcodes.includes(postcodeStub)
      ) {
        areaServed();
      } else {
        areaNotServed();
      }
  
      // Submit the postcode stub to the API
      console.log("Preparing to submit API request with postcodeStub:", postcodeStub); // Debugging: Log before API call
      fetch("https://02sfka.buildship.run/forms/?Form-Version=Stub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postcodeStub: postcodeStub }), // Replace 'NW6' with dynamic stub if needed
      })
        .then((response) => {
          console.log("API response received:", response); // Debugging: Log raw response
  
          // Check if the response is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json(); // Parse as JSON
          } else {
            return response.text(); // Parse as plain text
          }
        })
        .then((data) => {
          console.log("Successfully submitted:", data); // Debugging: Log successful response
        })
        .catch((error) => {
          console.error("Error submitting to the API:", error); // Debugging: Log any errors
        });
    });
  
    // Submit progress button functionality
    typeformButton.addEventListener("click", (event) => {
      if (typeformButton.classList.contains("disabled")) {
        event.preventDefault();
      }
    });
  });
  