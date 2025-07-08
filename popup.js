document.getElementById("fetch-btn").addEventListener("click", async () => {
    const githubUser = document.getElementById("github-username").value.trim();
    if (!githubUser) return alert("Enter a GitHub username!");

    const avatarImg = document.getElementById("github-avatar");
    const projectsDiv = document.getElementById("projects");
    projectsDiv.innerHTML = "⏳ Fetching repositories...";

    try {
        // Fetch user data for avatar
        const userResponse = await fetch(`https://api.github.com/users/${githubUser}`);
        if (!userResponse.ok) throw new Error("GitHub user not found");
        const userData = await userResponse.json();

        // Display avatar
        if (avatarImg) {
            avatarImg.src = userData.avatar_url;
            avatarImg.alt = `${githubUser}'s Avatar`;
            avatarImg.style.display = "block";
        }

        // Fetch repositories
        const response = await fetch(`https://api.github.com/users/${githubUser}/repos`);
        const repos = await response.json();

        if (!repos || repos.length === 0) {
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
                <button class="generate-btn">Generate</button>
                <div class="gemini-fields" style="display:none;"></div>
            `;

            project.querySelector(".generate-btn").addEventListener("click", async () => {
                const btn = project.querySelector(".generate-btn");
                btn.disabled = true;
                btn.textContent = "Generating...";
                const fieldsDiv = project.querySelector(".gemini-fields");
                fieldsDiv.style.display = "block";
                fieldsDiv.innerHTML = "<span>⏳ Generating with Gemini...</span>";
                try {
                    // Fetch README content
                    let readme = '';
                    try {
                        const readmeRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`);
                        if (readmeRes.ok) {
                            const readmeData = await readmeRes.json();
                            if (readmeData.content) {
                                readme = atob(readmeData.content.replace(/\n/g, ''));
                            }
                        }
                    } catch (e) { /* ignore */ }

                    const geminiFields = await rewriteWithGemini(readme || repo.description || repo.name);
                    fieldsDiv.innerHTML = `
                        <div class="field-row"><span class="field-label">Title:</span> <span class="field-value" id="title">${repo.name || "-"}</span> <button class="copy-btn" data-field="title">Copy</button></div>
                        <div class="field-row"><span class="field-label">Skills:</span> <span class="field-value" id="skills">${geminiFields.Skills || "-"}</span> <button class="copy-btn" data-field="skills">Copy</button></div>
                        <div class="field-row"><span class="field-label">Summary:</span> <span class="field-value" id="summary" style="white-space:normal;">${geminiFields.Summary || "-"}</span> <button class="copy-btn" data-field="summary">Copy</button></div>
                    `;
                    fieldsDiv.querySelectorAll('.copy-btn').forEach(copyBtn => {
                        copyBtn.addEventListener('click', (e) => {
                            const field = e.target.getAttribute('data-field');
                            const value = fieldsDiv.querySelector(`#${field}`).textContent;
                            navigator.clipboard.writeText(value);
                            e.target.textContent = 'Copied!';
                            setTimeout(() => e.target.textContent = 'Copy', 1000);
                        });
                    });
                } catch (err) {
                    console.error("Gemini API Error:", err);
                    fieldsDiv.innerHTML = `<span style='color:#ff6b6b;'>❌ Failed to generate fields</span>`;
                }
                btn.disabled = false;
                btn.textContent = "Generate";
            });

            projectsDiv.appendChild(project);
        });
    } catch (err) {
        console.error(err);
        projectsDiv.innerHTML = "❌ Error fetching repositories.";
    }
});

async function rewriteWithGemini(readmeText) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { action: "rewriteWithGemini", text: readmeText },
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
