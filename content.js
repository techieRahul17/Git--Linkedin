function updateLinkedInProject(title, description) {
    // Simulate adding to LinkedIn Projects section
    alert(`Add "${title}" with description "${description}" to LinkedIn`);
    // TODO: Automate filling LinkedIn form fields
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "addProject") {
        console.log("Received project details:", message);

        // Try to find LinkedIn "Add Project" fields
        const projectTitleInput = document.querySelector('input[name="title"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');

        if (projectTitleInput && descriptionInput) {
            projectTitleInput.value = message.title;
            descriptionInput.value = message.description;
            alert(`✅ Project "${message.title}" added!`);
        } else {
            alert("⚠️ Please open LinkedIn's 'Add Project' form before adding.");
        }
    }
});
