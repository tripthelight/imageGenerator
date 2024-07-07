function main() {
  const CREATE_BTN = document.getElementById("generate");
  if (!CREATE_BTN) return;
  CREATE_BTN.addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => response.json())
      .then((data) => {
        const resultDiv = document.getElementById("result");
        if (data.image_url) {
          resultDiv.innerHTML = `<img src="${data.image_url}" alt="Generated Image">`;
        } else {
          resultDiv.textContent = "Error generating image.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
