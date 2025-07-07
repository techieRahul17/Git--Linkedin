
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "rewriteWithGemini") {
        try {
            const apiKey = "AIzaSyC8g1Y2xOkQrAcULg1S5dXXA2H3wt8aNhk"; // <-- Replace this with your API key
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message.text }] }]
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0]) {
                const rewritten = data.candidates[0].content.parts[0].text;
                console.log("✅ Gemini rewrite success:", rewritten);
                sendResponse({ success: true, result: rewritten });
            } else {
                console.error("❌ Gemini API unexpected response:", data);
                sendResponse({
                    success: false,
                    error: "Gemini API returned no candidates"
                });
            }
        } catch (err) {
            console.error("❌ Gemini API error:", err);
            sendResponse({
                success: false,
                error: err.message || "API call failed"
            });
        }
        return true; // Keeps service worker alive for async response
    }
});
