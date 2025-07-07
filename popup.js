document.getElementById("fetch-btn").addEventListener("click", async () => {
    const githubUser = document.getElementById("github-username").value.trim();
    if (!githubUser) return alert("Enter a GitHub username!");

    const projectsDiv = document.getElementById("projects");
    projectsDiv.innerHTML = "⏳ Fetching repositories...";

    try {
        const response = await fetch(`https://api.github.com/users/${githubUser}/repos`);
        const repos = await response.json();

        if (repos.length === 0) {
            projectsDiv.innerHTML = "❌ No repositories found.";
            return;
        }

        projectsDiv.innerHTML = "";
        repos.forEach(repo => {
            const project = document.createElement("div");
            project.className = "project-card";
            project.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description"}</p>
                <button>Add to LinkedIn</button>
            `;

            project.querySelector("button").addEventListener("click", async () => {
                try {
                    const rewritten = await rewriteWithGemini(repo.description || repo.name);
                    alert(`Rewritten description: ✨ ${rewritten}`);

                    // Inject into LinkedIn page
                    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            func: (title, desc) => {
                                function fillFields(retry = 0) {
                                    const titleInput = document.querySelector("input[aria-label='Project name']");
                                    const descTextarea = document.querySelector("textarea[aria-label='Description']");

                                    if (titleInput && descTextarea) {
                                        titleInput.value = title;
                                        descTextarea.value = desc;
                                        console.log("✅ LinkedIn fields filled");
                                    } else if (retry < 10) { // Retry up to 10 times
                                        console.log(`⏳ Fields not found, retrying (${retry + 1})...`);
                                        setTimeout(() => fillFields(retry + 1), 500);
                                    } else {
                                        alert("❌ LinkedIn fields not found.");
                                    }
                                }
                                fillFields();
                            },
                            args: [repo.name, rewritten]
                        });
                    });
                } catch (err) {
                    console.error("Error adding project to LinkedIn:", err);
                    alert("❌ Failed to add project to LinkedIn");
                }
            });

            projectsDiv.appendChild(project);
        });
    } catch (err) {
        console.error(err);
        projectsDiv.innerHTML = "❌ Error fetching repositories.";
    }
});

async function rewriteWithGemini(originalDesc) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { action: "rewriteWithGemini", text: originalDesc },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Runtime error:", chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                    return;
                }
                if (response && response.success) {
                    resolve(response.result);
                } else {
                    console.error("Gemini API error:", response.error);
                    reject(response?.error || "Unknown error");
                }
            }
        );
    });
}
