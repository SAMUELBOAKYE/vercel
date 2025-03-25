const answerHeaders = document.querySelectorAll(".answer-origgin");

answerHeaders.forEach(function (header) {
  const p = header.nextElementSibling;
  const arrow = header.querySelector(".toggle-arrow");

  header.addEventListener("click", function () {
    if (p.style.display === "none" || p.style.display === "") {
      p.style.display = "block";
      arrow.textContent = "↑";
      header.parentElement.classList.add("opened");
    } else {
      p.style.display = "none";
      arrow.textContent = "↓";
      header.parentElement.classList.remove("opened");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let isRecording = false;
  let mediaRecorder;
  let audioChunks = [];
  let recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  document.querySelector(".red-text").style.cursor = "pointer";

  document.querySelector(".red-text").addEventListener("click", function () {
    if (!isRecording) {
      confirmRecording();
    } else {
      stopRecording();
    }
  });

  function confirmRecording() {
    const userConfirmed = confirm(
      "You're about to record audio on Origgin. Do you want to proceed?"
    );
    if (userConfirmed) {
      startRecording();
    } else {
      console.log("Recording canceled by the user.");
    }
  }

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        isRecording = true;
        audioChunks = [];
        console.log("Recording started...");

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = document.createElement("audio");
          audio.controls = true;
          audio.src = audioUrl;

          const downloadButton = document.createElement("a");
          downloadButton.href = audioUrl;
          downloadButton.download = "recorded_audio.wav";
          downloadButton.innerText = "Download Recording";
          downloadButton.style.display = "block";
          downloadButton.style.marginTop = "10px";

          const container = document.createElement("div");
          container.appendChild(audio);
          container.appendChild(downloadButton);
          document.body.appendChild(container);

          downloadButton.addEventListener("click", function () {
            setTimeout(() => {
              container.remove();
              console.log("Audio and download link removed after download.");
            }, 1000);
          });

          console.log("Recording stopped.");
        };

        recognition.start();
        recognition.onresult = function (event) {
          let spokenText = event.results[0][0].transcript.toLowerCase();
          console.log("User said:", spokenText);

          fetchContentFromPage(spokenText);
        };
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
    }
  }

  function fetchContentFromPage(question) {
    fetch("http://127.0.0.1:5505/real%20(2)/real/index.html")
      .then((response) => response.text())
      .then((html) => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let bodyText = doc.body.innerText.toLowerCase();

        console.log("Fetched content:", bodyText); // Debugging

        let answer = extractRelevantAnswer(bodyText, question);
        if (answer) {
          alert("Answer: " + answer);
        } else {
          alert(
            "Sorry, I can only provide information from the specified page."
          );
        }
      })
      .catch((error) => console.error("Error fetching page content:", error));
  }

  function extractRelevantAnswer(content, question) {
    let sentences = content.split(". ");
    for (let sentence of sentences) {
      if (sentence.includes(question)) {
        return sentence + ".";
      }
    }
    return "I found related information but couldn't provide an exact answer.";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const url = this.getAttribute("data-url");
      window.open(url, "_blank");
    });
  });
});

document.querySelector(".menu-toggle").addEventListener("click", function () {
  this.classList.toggle("active");
  document.querySelector(".navbar-links").classList.toggle("active");
});
