// Welcome Message
console.log("Welcome to Lumora!");

// Dark Mode Toggle
const toggleBtn = document.createElement("button");
toggleBtn.innerHTML = "🌙";
toggleBtn.className = "dark-toggle";
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleBtn.innerHTML = "☀️";
    } else {
        toggleBtn.innerHTML = "🌙";
    }
});

// Smooth Fade Animation
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

cards.forEach(card => {
    observer.observe(card);
});

// Inject styles via JS to keep script.js valid
const style = document.createElement("style");
style.textContent = `
.dark-mode {
    background: #111827;
    color: white;
}

.dark-mode .navbar {
    background: #1f2937;
}

.dark-mode .card {
    background: #1f2937;
    color: white;
}

.dark-mode footer {
    background: #000;
}

.dark-toggle {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 55px;
    height: 55px;
    border: none;
    border-radius: 50%;
    background: #4f46e5;
    color: white;
    font-size: 22px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(168, 55, 55, 0.3);
}

.card {
    opacity: 0;
    transform: translateY(40px);
}

.card.show {
    opacity: 1;
    transform: translateY(0);
    transition: 1s;
}
`;
document.head.appendChild(style);
async function answerQuestion() {

    const question = document.getElementById("question").value;

    if (!question.trim()) {
        alert("Please enter a question.");
        return;
    }

    document.getElementById("response").innerHTML = "🤖 Thinking...";

    try {

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        document.getElementById("response").innerHTML = data.answer;

    } catch (error) {

        console.error(error);

        document.getElementById("response").innerHTML =
            "❌ Unable to connect to AI.";

    }

}
function answerQuestion() {
    alert("Button is working!");
    
}
