document.addEventListener("DOMContentLoaded", () => {
    // Define valid patterns based on new requirements
    const patterns = [
      /^[A-Za-z]\d\s\d[A-Za-z]{2}$/,       // Pattern for ansnaa (e.g., "A1 BCD")
      /^[A-Za-z]{2}\d\s\d[A-Za-z]{2}$/,    // Pattern for aansnaa (e.g., "AB1 CDE")
      /^[A-Za-z]\d{2}\s\d[A-Za-z]{2}$/,    // Pattern for annsnaa (e.g., "A12 DEF")
      /^[A-Za-z]{2}\d{2}\s\d[A-Za-z]{2}$/  // Pattern for aannsnaa (e.g., "AB12 GHI")
    ];
  
    let approvedPostcodes = [];
    let validationMessages = {};
  
    // Function to load postcodes
    const loadPostcodes = () => {
      return fetch("https://assets.housemapper.co.uk/booking-form-2_0/assets/data/approved-postcodes.json")
        .then((response) => {
          console.log("Response Status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched Postcodes:", data);
          if (Array.isArray(data)) {
            approvedPostcodes = data;
            console.log("Approved Postcodes is an array:", approvedPostcodes);
          } else {
            console.error("Error: Expected an array but got", typeof data, data);
          }
        })
        .catch((error) => console.error("Error fetching approved postcodes:", error));
    };
  
    // Function to load validation messages
    const loadValidationMessages = () => {
      return fetch("https://assets.housemapper.co.uk/booking-form-2_0/assets/data/validation-messages.json")
        .then((response) => {
          console.log("Validation Messages Response Status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched Validation Messages:", data);
          if (typeof data === "object" && data !== null) {
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
            console.log("Parsed Validation Messages:", validationMessages);
          } else {
            console.error("Error: Expected an object but got", typeof data, data);
          }
        })
        .catch((error) => console.error("Error fetching validation messages:", error));
    };
  
    // Load postcodes and validation messages, then initialize the rest of the code
    Promise.all([loadPostcodes(), loadValidationMessages()])
      .then(() => {
        // Elements
        const postcodeInput = document.getElementById("postcode-area"); // Input Field
        const postcodeClear = document.getElementById("postcodeClear"); // Clear Button
        const stubCheckButton = document.getElementById("stubCheck"); // Check Button
        const typeformButtonContainer = document.getElementById("typeform-button"); // Typeform Button Container
        const responseElement = document.getElementById("postcode-check-response"); // Message
  
        // Ensure elements are found
        if (!postcodeInput || !postcodeClear || !stubCheckButton || !typeformButtonContainer || !responseElement) {
          console.error("One or more elements not found in the DOM.");
          return;
        }
  
        // Helper functions
        const showStubCheckButton = () => {
          stubCheckButton.classList.remove("hidden");
        };
  
        const hideStubCheckButton = () => {
          stubCheckButton.classList.add("hidden");
        };
  
        const responseTextUpdate = (hidden, message, cssClass) => {
          if (hidden) {
            responseElement.classList.add("hidden");
          } else {
            responseElement.classList.remove("hidden");
          }
          responseElement.textContent = message || "";
          responseElement.className = `paragraph postcode-check-response ${cssClass}`;
        };
  
        const postcodeTooLong = () => {
          const message = validationMessages["postcodeTooLong"] || "Postcode is too long.";
          responseTextUpdate(false, message, "error");
        };
  
        const areaServed = () => {
          const message = validationMessages["exactMatch"] || "We serve your area!";
          responseTextUpdate(false, message, "success");
          typeformButtonContainer.classList.remove("hidden"); // Show Typeform Button Container
          hideStubCheckButton();
        };
  
        const areaNotServed = () => {
          const message = validationMessages["noCoverage"] || "We do not serve your area.";
          responseTextUpdate(false, message, "error");
          typeformButtonContainer.classList.add("hidden"); // Hide Typeform Button Container
          hideStubCheckButton();
        };
  
        // On page load, check localStorage for saved postcode
        const savedPostcode = localStorage.getItem("postcode");
        if (savedPostcode && savedPostcode.length > 4 && /\s/.test(savedPostcode)) {
          postcodeInput.value = savedPostcode;
          showStubCheckButton();
        }
  
        // Input field restrictions and checks
        postcodeInput.addEventListener("input", (event) => {
          let input = event.target.value.toUpperCase(); // Convert to uppercase
  
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
  
          // Check if input matches any of the valid patterns
          const isValid = patterns.some((pattern) => pattern.test(input));
  
          if (isValid) {
            // Clear the warning message if the input matches any pattern
            responseTextUpdate(true, "", "");
            showStubCheckButton();
          } else {
            // Show the warning message if input deviates from all patterns
            const message = validationMessages["invalidPostcode"] || "Invalid postcode format.";
            responseTextUpdate(false, message, "error");
            hideStubCheckButton();
          }
  
          // Further checks based on input length
          if (input.length > 8) {
            postcodeTooLong();
          }
        });
  
        // Clear button functionality
        postcodeClear.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default action if it's an anchor tag
          postcodeInput.value = "";
          localStorage.removeItem("postcode");
          hideStubCheckButton();
          typeformButtonContainer.classList.add("hidden");
          responseTextUpdate(true, "", "");
        });
  
        // Check Button functionality
        stubCheckButton.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default action if it's an anchor tag
          console.log("Check Button clicked");
  
          // Retrieve and format the postcode
          let input = postcodeInput.value.trim().toUpperCase();
          console.log("Original input:", input);
  
          // Format input and save to localStorage
          if (!/\s/.test(input) && input.length >= 5) {
            const formattedInput = input.slice(0, -3) + " " + input.slice(-3);
            postcodeInput.value = formattedInput;
            localStorage.setItem("postcode", formattedInput);
            input = formattedInput; // Update input variable
          } else if (/\s/.test(input)) {
            // Input already contains a space; ensure proper formatting
            const parts = input.split(" ");
            if (parts.length === 2 && parts[1].length === 3) {
              const formattedInput = parts[0] + " " + parts[1];
              postcodeInput.value = formattedInput;
              localStorage.setItem("postcode", formattedInput);
              input = formattedInput; // Update input variable
            } else {
              console.warn("Input is not properly formatted");
            }
          } else {
            console.warn("Input did not meet the criteria for formatting and storage");
          }
  
          // Extract postcode stub
          const postcodeStub = postcodeInput.value.split(" ")[0];
          console.log("Postcode stub:", postcodeStub);
          localStorage.setItem("postcodeStub", postcodeStub);
  
          // Proceed only if postcodeStub is valid
          if (!postcodeStub) {
            console.error("Postcode stub is invalid");
            return;
          }
  
          // Check if postcode stub exists in approved postcodes
          if (approvedPostcodes.includes(postcodeStub)) {
            areaServed();
          } else {
            areaNotServed();
          }
  
          // Make the API call
          console.log("About to make API call");
          fetch("https://02sfka.buildship.run/forms/?Form-Version=Stub", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postcodeStub: postcodeStub }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Successfully submitted:", data);
            })
            .catch((error) => {
              console.error("Error submitting to the API:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  });
  