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

//
/**
 * Load and render JSON data
 * @param {JSON} hymns - .
 */
async function renderJsonData() {
  try {
    const data = await window.electronAPI.loadJsonData("hymns.json");
    const hymns = data.hymns;
    // Render thedata
    renderHymn(hymns[0]);
    return hymns;
  } catch (error) {
    console.error("Failed to load data:", error);
    showErrorMessage("Failed to load data");
  }
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
  headingEng.innerHTML = "English";
  headingTwi.innerHTML = "Twi";

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
      rightPanel.appendChild(chorus);
    }

    currVerseNum++;
  });
}

function searching() {
  const userSearch = document.getElementById("search-input");
  userSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      console.log(userSearch.value);
    }
  });
}

/**
 * allows user to search through the search bar for a specific hymn
 * @param {} hymns - .
 */
function searchHymn(data) {
  const userSearch = document.getElementById("search-input");

  userSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const searchTerm = userSearch.value.toLowerCase();

      const result = data.filter((hymn) => {
        return (
          hymn.number.toLowerCase() === searchTerm ||
          hymn.english.title.toLowerCase() === searchTerm
        );
      });

      if (result.length > 0) {
        console.log("Found hymn:", result[0]);
        console.log(result[0].english.verses);
        // You can call your renderHymn function here if you want to display it
        //renderHymn(result[0]);
      } else {
        console.log("Hymn not found");
      }
    }
  });
}

const data = await renderJsonData();
const search = searchHymn(data);
console.log(search[0].english.verses);
