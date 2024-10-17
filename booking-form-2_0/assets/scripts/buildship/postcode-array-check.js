export default function checkArrayContainsValue({
    postcodes,
    stub
}) {
    // Log the input values
    console.log("Postcodes array:", postcodes);
    console.log("Postcode stub to check:", stub);
    
    // Perform the check
    const result = postcodes.includes(stub);
    
    // Log the result of the check
    console.log(`Does the postcodes array contain the stub ${stub}? ${result}`);
    
    // Return the result
    return result;
}
