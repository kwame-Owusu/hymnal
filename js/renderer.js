/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

/**
 * Represents a book.
 * @param {number} factor - factor to increase or decrease by.
 */
function adjustFontSize(factor) {
  const leftPanel = document.querySelector(".left-panel");
  const rightPanel = document.querySelector(".right-panel");

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

/*TODO:
- Implement hymn data loading from json
- Display sample hymn content to left and right panel
- get value of checkbox slider and set opacity of right panel to 0 and resize the grid
*/
