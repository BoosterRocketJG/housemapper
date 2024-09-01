document.addEventListener('DOMContentLoaded', function () {
    // Sample file structure - Replace this with dynamic data as needed
    const fileStructure = {
        "folder1": {
            "file1.txt": null,
            "file2.txt": null
        },
        "folder2": {
            "subfolder1": {
                "file3.txt": null
            },
            "file4.txt": null
        },
        "file5.txt": null
    };

    // Function to create the file tree HTML recursively
    function createFileTree(structure) {
        const ul = document.createElement('ul'); // Create a new unordered list element

        Object.keys(structure).forEach(key => {
            const li = document.createElement('li'); // Create a new list item for each key
            li.textContent = key; // Set the text content of the list item to the folder/file name

            if (structure[key] && typeof structure[key] === 'object') {
                li.classList.add('folder'); // Add a 'folder' class
                const subTree = createFileTree(structure[key]); // Recursively create the subtree
                li.appendChild(subTree); // Append the subtree to the current list item
            } else {
                li.classList.add('file'); // Add a 'file' class
            }

            ul.appendChild(li); // Append the list item to the unordered list
        });

        return ul; // Return the unordered list
    }

    // Get the container element
    const container = document.getElementById('file-tree-container');

    // Check if container is found
    if (container) {
        const fileTree = createFileTree(fileStructure); // Generate the file tree
        container.appendChild(fileTree); // Attach the generated file tree to the container

        console.log("File tree generated successfully."); // Debugging: Check in the console
    } else {
        console.error("Container element not found."); // Debugging: Log error if container not found
    }

    // Add click functionality to toggle folders
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('folder')) {
            const subTree = event.target.querySelector('ul');
            if (subTree) {
                subTree.style.display = subTree.style.display === 'none' ? 'block' : 'none';
            }
        }
    });
});
