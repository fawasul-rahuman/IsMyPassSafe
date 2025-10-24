// Function to handle password copy
function copyPassword() {
  var passwordInput = document.getElementById("passwordInput");
  var copyMessage = document.getElementById("copyMessage");

  // Check if the input is empty, if so, do not show the copied message
  if (passwordInput.value === "") {
      return; // Do nothing if the input is empty
  }

  // Select the text field
  passwordInput.select();
  passwordInput.setSelectionRange(0, 99999); // For mobile devices

  // Try to copy the text to the clipboard
  try {
      document.execCommand("copy");

      // Show the copied message
      copyMessage.style.display = "block";

      // Hide the message after 5.1 seconds
      setTimeout(function() {
          copyMessage.style.display = "none";
      }, 5100);
  } catch (err) {
      console.error("Failed to copy text: ", err);
  }
}

// Attach the copyPassword function to the input field click event
document.getElementById("passwordInput").addEventListener("click", copyPassword);


// === IsMyPassSafe Core ===

// Password input and UI elements
const passwordInput = document.getElementById("passwordInput");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const crackTime = document.getElementById("crackTime");

// Character sets for entropy calculations
const charset = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+[]{}|;:',.<>?/`~"
};

// Estimate how many possible characters the password could contain
function estimateCharsetSize(pass) {
  let size = 0;
  if (/[a-z]/.test(pass)) size += charset.lower.length;
  if (/[A-Z]/.test(pass)) size += charset.upper.length;
  if (/[0-9]/.test(pass)) size += charset.numbers.length;
  if (/[^a-zA-Z0-9]/.test(pass)) size += charset.symbols.length;
  return size || 1;
}

// Estimate entropy (bits of randomness)
function calculateEntropy(pass) {
  const charsetSize = estimateCharsetSize(pass);
  const entropy = pass.length * Math.log2(charsetSize);
  return entropy;
}

// Convert entropy to strength rating
function getStrengthLabel(entropy) {
  if (entropy < 28) return "Very Weak 😬";
  if (entropy < 36) return "Weak 😕";
  if (entropy < 60) return "Medium 🙂";
  if (entropy < 80) return "Strong 💪";
  return "Very Strong 🔐";
}

// Estimate time to crack based on entropy
function estimateCrackTime(entropy) {
  // Assume 10 billion guesses per second (10^10)
  const guesses = Math.pow(2, entropy);
  const seconds = guesses / 1e10;

  if (seconds < 1) return "< 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  return "Centuries 🏛️";
}

// Update UI dynamically as user types
passwordInput.addEventListener("input", () => {
  const pass = passwordInput.value;
  const entropy = calculateEntropy(pass);
  const strengthLabel = getStrengthLabel(entropy);
  const timeToCrack = estimateCrackTime(entropy);

  // Update text
  strengthText.textContent = strengthLabel;
  crackTime.textContent = timeToCrack;

  // Update bar width and color
  const percent = Math.min(entropy / 80, 1) * 100;
  strengthFill.style.width = `${percent}%`;

  let color;
  if (entropy < 28) color = "#ff4d4d";
  else if (entropy < 36) color = "#ff944d";
  else if (entropy < 60) color = "#ffd24d";
  else if (entropy < 80) color = "#7fff7f";
  else color = "#00e600";

  strengthFill.style.backgroundColor = color;
});

// === Optional: Random Strong Password Generator ===
function generatePassword(length = 16) {
  const allChars = Object.values(charset).join("");
  let password = "";
  for (let i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  passwordInput.value = password;
  passwordInput.dispatchEvent(new Event("input")); // trigger check
}

