/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const leftPanel = document.querySelector(".left-panel");
const rightPanel = document.querySelector(".right-panel");
const container = document.querySelector(".container");
const divider = document.querySelector(".divider");

/**
 *
 * @param {number} factor - factor to increase or decrease font size by.
 */
function adjustFontSize(factor) {
  // Get current font size of one of the panels
  const currentFontSize = parseFloat(
    window.getComputedStyle(leftPanel).fontSize,
  );

  // Calculate new font size
  const newSize = currentFontSize * factor + "px";

  // Apply new font size
  leftPanel.style.fontSize = newSize;
  rightPanel.style.fontSize = newSize;

  return newSize;
}

const incrBtn = document.querySelector(".incr-btn");
const decrBtn = document.querySelector(".decr-btn");

incrBtn.addEventListener("click", () => {
  adjustFontSize(1.2);
});

decrBtn.addEventListener("click", () => {
  adjustFontSize(0.9);
});

const sliderCheck = document.querySelector(
  '.checkbox-slide input[type="checkbox"]',
);

/**
 * Represents toggling dual mode, changes the state of the panels.
 */
function toggleLayout() {
  if (!sliderCheck || !container || !rightPanel) {
    console.error("Required elements not found");
    return;
  }

  if (sliderCheck.checked) {
    container.className = "container two-column";
    rightPanel.classList.remove("hidden");
  } else {
    container.className = "container single-column";
    rightPanel.classList.add("hidden");
  }
}

// Initial check
toggleLayout();

// Listen for changes
if (sliderCheck) {
  sliderCheck.addEventListener("change", toggleLayout);
}

/**
 * Load and render JSON data
 * @param {JSON} hymns - .
 */
async function renderJsonData() {
  try {
    const data = await window.electronAPI.loadJsonData("hymns.json");
    const hymns = data.hymns;
    // Render the data
    renderHymn(hymns[0]);
    return hymns;
  } catch (error) {
    console.error("Failed to load data:", error);
    showErrorMessage("Failed to load data");
  }
}

function capitalize(string) {
  string = string.toLowerCase();
  const splitted = string.split(" ");
  for (let i = 0; i < splitted.length; i++) {
    splitted[i] = splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1);
  }
  return splitted.join(" ");
}

/**
 * renders the hymns to left and right panels based on JSON data
 * by creating new <p> elements and appending them to left panel and right parent
 * @param {JSON} hymns - .
 */
function renderHymn(hymns) {
  rightPanel.innerHTML = "";
  leftPanel.innerHTML = "";
  let currVerseNum = 1;

  const headingEng = document.createElement("h2");
  const headingTwi = document.createElement("h2");
  headingEng.innerHTML = `${capitalize(hymns.english.title)}`;
  headingTwi.innerHTML = `${capitalize(hymns.twi.title)}`;

  leftPanel.appendChild(headingEng);
  // Loop through the English verses and create separate <p> elements
  hymns.english.verses.forEach((verse, index) => {
    const verseElement = document.createElement("p");
    verseElement.innerHTML = `${currVerseNum} ${verse}`;
    leftPanel.appendChild(verseElement);

    // Insert chorus after the first verse
    if (index === 0) {
      const chorus = document.createElement("p");
      chorus.innerHTML = `${hymns.english.chorus}`;
      chorus.classList.add("chorus");
      if (hymns.english.chorus.length == 0) {
        chorus.classList.add("not-exist");
      }
      leftPanel.appendChild(chorus);
    }

    currVerseNum++;
  });

  currVerseNum = 1;
  rightPanel.appendChild(headingTwi);

  hymns.twi.verses.forEach((verse, index) => {
    const verseElement = document.createElement("p");
    verseElement.innerHTML = `${currVerseNum} ${verse}`;
    rightPanel.appendChild(verseElement);

    if (index === 0) {
      const chorus = document.createElement("p");
      chorus.innerHTML = `${hymns.twi.chorus}`;
      chorus.classList.add("chorus");
      if (hymns.twi.chorus.length == 0) {
        chorus.classList.add("not-exist");
      }
      rightPanel.appendChild(chorus);
    }
    currVerseNum++;
  });
}
function removeSpecialChars(str, keepSpaces = false) {
  const pattern = keepSpaces ? /[^a-zA-Z0-9 ]/g : /[^a-zA-Z0-9]/g;
  return str.replace(pattern, "");
}

/**
 * allows user to search through the search bar for a specific hymn
 * @param {Array} data .
 */
function searchHymn(data) {
  const userSearch = document.getElementById("search-input");
  const errorMessage = document.getElementById("error-message");

  userSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const searchTerm = userSearch.value.toLowerCase().trim();

      const result = data.filter((hymn) => {
        return (
          hymn.number.toLowerCase().trim() === searchTerm ||
          removeSpecialChars(hymn.english.title.toLowerCase().trim(), true) ===
            searchTerm ||
          removeSpecialChars(hymn.twi.title.toLowerCase().trim(), true) ===
            searchTerm
        );
      });

      if (result.length > 0) {
        console.log("Found hymn:", result[0]);
        console.log(result[0].english.verses);
        userSearch.classList.remove("input-error");
        // renderHymn function here if you want to display it
        renderHymn(result[0]);
        userSearch.value = "";

        // Reset error state if successful
        userSearch.classList.remove("input-error");
        errorMessage.classList.add("error-hidden");
        errorMessage.classList.remove("error-visible");
        errorMessage.textContent = "";
      } else {
        userSearch.classList.add("input-error");
        errorMessage.innerText =
          "Hymn not found. Please check hymn number or title.";
        errorMessage.classList.remove("error-hidden");

        //Show red border
        userSearch.classList.add("input-error");

        //Show error message
        errorMessage.textContent =
          "Hymn not found. Please check hymn number or title.";
        errorMessage.classList.remove("error-hidden");
        errorMessage.classList.add("error-visible");

        // Remove red border and error message after 2 seconds
        setTimeout(() => {
          userSearch.classList.remove("input-error");
          errorMessage.classList.add("error-hidden");
          errorMessage.classList.remove("error-visible");
          errorMessage.textContent = "";
        }, 2500);
      }
    }
  });
}

const data = await renderJsonData();
searchHymn(data);
