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
    };
  
    const hideStubCheckButton = () => {
      stubCheckButton.classList.add("hidden");
      stubCheckButton.classList.add("disabled");
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
      responseTextUpdate(false, validationMessages["postcodeTooLong"], "error");
    };
  
    const areaServed = () => {
      responseTextUpdate(false, validationMessages["exactMatch"], "success");
      typeformButton.classList.remove("hidden");
      typeformButton.classList.remove("disabled");
      hideStubCheckButton();
    };
  
    const areaNotServed = () => {
      responseTextUpdate(false, validationMessages["noCoverage"], "error");
      typeformButton.classList.add("disabled");
      hideStubCheckButton();
    };
  
    // On pageload, check localStorage for saved postcode
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
        responseTextUpdate(
          false,
          validationMessages["invalidPostcode"],
          "error"
        );
        hideStubCheckButton();
      }
  
      // Further checks based on input length
      if (input.length > 8) {
        postcodeTooLong();
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
      } else {
        console.warn("Input did not meet the criteria for formatting and storage");
      }
  
      // Extract postcode stub from the formatted input
      const postcodeStub = postcodeInput.value.split(" ")[0]; // Get only the part before the whitespace
      localStorage.setItem("postcodeStub", postcodeStub);
  
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
      fetch("https://02sfka.buildship.run/forms/?Form-Version=Stub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postcodeStub: postcodeStub }),
      })
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then((data) => {
          console.log("Successfully submitted:", data);
        })
        .catch((error) => {
          console.error("Error submitting to the API:", error);
        });
    });
  
    // Submit progress button functionality
    typeformButton.addEventListener("click", (event) => {
      if (typeformButton.classList.contains("disabled")) {
        event.preventDefault();
      }
    });
  });
  