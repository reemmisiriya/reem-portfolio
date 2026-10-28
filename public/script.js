
const form = document.getElementById("contactForm");
const statusMessage = document.getElementById("status");

console.log("Contact form script loaded!");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Send Message button clicked!");

    const contactData = {
        name: form.elements.namedItem("name").value.trim(),
        email: form.elements.namedItem("email").value.trim(),
        message: form.elements.namedItem("message").value.trim()
    };

    statusMessage.textContent = "Sending message...";

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        // Read the response as text first so we can identify the error.
        const responseText = await response.text();
        console.log("Server response:", response.status, responseText);

        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error(
                "The server returned HTML instead of JSON. Check the browser console."
            );
        }

        if (!response.ok) {
            throw new Error(result.message || "Request failed.");
        }

        statusMessage.textContent = result.message;
        form.reset();

    } catch (error) {
        console.error("Contact form error:", error);
        statusMessage.textContent = error.message;
    }
});
