// Zoom Redirect Landing Page Logic
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load Configurations into DOM
  if (typeof ZOOM_CONFIG !== "undefined") {
    // Header
    const churchTitleEl = document.getElementById("church-title");
    const serviceSubtitleEl = document.getElementById("service-subtitle");
    const serviceTimeEl = document.getElementById("service-time");
    
    if (churchTitleEl) churchTitleEl.textContent = ZOOM_CONFIG.churchName || "교회";
    if (serviceSubtitleEl) serviceSubtitleEl.textContent = ZOOM_CONFIG.serviceSubTitle || "";
    if (serviceTimeEl) serviceTimeEl.textContent = ZOOM_CONFIG.serviceTime || "";
    
    // Zoom Link Join Button
    const btnJoinZoom = document.getElementById("btn-join-zoom");
    if (btnJoinZoom) {
      btnJoinZoom.href = ZOOM_CONFIG.zoomLink || "#";
    }
    
    // Connection Info
    const txtMeetingId = document.getElementById("txt-meeting-id");
    const txtPassword = document.getElementById("txt-password");
    
    if (txtMeetingId) txtMeetingId.textContent = ZOOM_CONFIG.meetingId || "";
    if (txtPassword) txtPassword.textContent = ZOOM_CONFIG.password || "";
    
    // Verse
    const txtBibleVerse = document.getElementById("txt-bible-verse");
    if (txtBibleVerse) txtBibleVerse.textContent = ZOOM_CONFIG.bibleVerse || "";
    
    // Instructions
    const txtInstructions = document.getElementById("txt-instructions");
    if (txtInstructions) txtInstructions.textContent = ZOOM_CONFIG.instructions || "";
  }

  // 2. Clipboard Copy Helper (with in-app webview fallback)
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or in-app webviews (like KakaoTalk browser)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      return new Promise((resolve, reject) => {
        try {
          const success = document.execCommand("copy");
          textArea.remove();
          if (success) {
            resolve();
          } else {
            reject(new Error("Copy command failed"));
          }
        } catch (error) {
          textArea.remove();
          reject(error);
        }
      });
    }
  }

  // 3. Bind Copy Buttons with UI feedback
  function setupCopyButton(buttonId, textToCopy) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener("click", () => {
      // Clean up copy value (e.g. remove spaces from Meeting ID if copying)
      const cleanText = textToCopy.replace(/\s+/g, "");
      
      copyToClipboard(cleanText)
        .then(() => {
          // Success State
          button.classList.add("copied");
          button.innerHTML = `<i class="fa-solid fa-check"></i> <span>복사 완료!</span>`;
          
          // Revert state after 2 seconds
          setTimeout(() => {
            button.classList.remove("copied");
            button.innerHTML = `<i class="fa-regular fa-copy"></i> <span>복사</span>`;
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          button.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>실패</span>`;
          setTimeout(() => {
            button.innerHTML = `<i class="fa-regular fa-copy"></i> <span>복사</span>`;
          }, 2000);
        });
    });
  }

  // Bind the events (passing clean values from configuration)
  if (typeof ZOOM_CONFIG !== "undefined") {
    setupCopyButton("btn-copy-id", ZOOM_CONFIG.meetingId);
    setupCopyButton("btn-copy-pwd", ZOOM_CONFIG.password);
  }
});
