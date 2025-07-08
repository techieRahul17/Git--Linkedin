chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "rewriteWithGemini") {
        (async () => {
            try {
                const apiKey = "AIzaSyC8g1Y2xOkQrAcULg1S5dXXA2H3wt8aNhk"; // <-- Your API key
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

                const prompt = `
                    Given this GitHub project description/README, generate JSON like:
                    {
                        "Title": "...",
                        "Skills": "...",
                        "Summary": "...",
                        "Duration": "...",
                        "Contributors": [...]
                    }
                    Only output the JSON object. No extra text.

                    Project Content: ${message.text || "No details provided."}
                `.trim();

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();

                if (data.candidates && data.candidates[0]) {
                    let text = data.candidates[0].content.parts[0].text.trim();
                    // Clean any extra markdown formatting
                    text = text.replace(/^```json/i, '').replace(/```$/i, '').trim();

                    let result;
                    try {
                        result = JSON.parse(text);
                    } catch (e) {
                        console.warn("⚠️ Gemini returned invalid JSON. Falling back.");
                        result = {
                            Title: "Could not generate",
                            Skills: "-",
                            Summary: "Gemini could not create a valid response.",
                            Duration: "-",
                            Contributors: []
                        };
                    }
                    sendResponse({ success: true, result });
                } else {
                    console.error("❌ Gemini API empty response:", data);
                    sendResponse({ success: false, error: "Gemini API returned no candidates" });
                }
            } catch (err) {
                console.error("❌ Gemini API error:", err);
                sendResponse({
                    success: false,
                    error: err.message || "API call failed"
                });
            }
        })();
        return true; // For async sendResponse
    }
});
