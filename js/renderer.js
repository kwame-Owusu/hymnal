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
    console.log("Layout: Two columns");
  } else {
    container.className = "container single-column";
    rightPanel.classList.add("hidden");
    console.log("Layout: One column");
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
    const hymnsData = data.hymns[0]; //hymns array
    console.log(hymnsData);
    // Render the data
    renderHymn(hymnsData);
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

  const engHymnElement = document.createElement("p");
  const twiHymnElement = document.createElement("p");
  hymns.english.verses.forEach((verse) => {
    engHymnElement.innerHTML += `${currVerseNum} ${verse}<br><br>`;
    currVerseNum++;
  });
  leftPanel.appendChild(headingEng);
  leftPanel.appendChild(engHymnElement);

  // twi section
  currVerseNum = 1;
  hymns.twi.verses.forEach((verse) => {
    twiHymnElement.innerHTML += `${currVerseNum} ${verse}<br><br>`;
    currVerseNum++;
  });

  rightPanel.appendChild(headingTwi);
  rightPanel.appendChild(twiHymnElement);
}

renderJsonData();
