const companies = [
  "alkemy-x",
  "fellow",
  "gradient-pictures",
  "kroma-digital-cosmetics",
  "picture-north",
  "tessa-films",
];

const indexedDBVersion = 25;
const loadBtn = document.querySelector("#btnLoad");
const companySelector = document.querySelector("#company-selector");
const currentCompany = document.querySelector("#current-company");
const vlmGradient = document.querySelector("#vlm-gradient");
const userSelectedColor1 = document.querySelector("#userselected-color-1");
const userSelectedColor2 = document.querySelector("#userselected-color-2");
const localStorageDisplay = document.querySelector("#code");
const removeCodeBtn = document.querySelector("#remove-code-btn");
const removeThisCodeBtn = document.querySelector("#remove-this-code-btn");
const numOfCompanyColors = 3;
const paletteContainer = document.getElementById("palette-1");
const paletteContainer2 = document.getElementById("palette-2");
const paletteContainer3 = document.getElementById("palette-3");
const paletteContainers = [
  document.getElementById("palette-1"),
  document.getElementById("palette-2"),
  document.getElementById("palette-3"),
];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const numPalettes = 3;
let colorStop1 = document.querySelector("#color-stop-1");
let colorStop2 = document.querySelector("#color-stop-2");
let colorStop3 = document.querySelector("#color-stop-3");
const colorsForSVGs = [colorStop1, colorStop2, colorStop3];
// let selectedCompany = "";
let currentIMG = "";
let hexColorArr = [];

window.onload = () => {
  selectedCompany = companies[0];
  loadBtn.addEventListener("click", processIMG);
  getIMGFromIndexedDB(selectedCompany);
  applyColorsToSVGs(selectedCompany);
  getCodeForCodeBox();
  const companyColors = [];
  let i = 0;
  while (i < numOfCompanyColors) {
    companyColors.push(localStorage.getItem(`${selectedCompany}${i + 1}`));
    i++;
  }
  retrieveSelectedCompanyPalettes(selectedCompany, companyColors);
};

removeCodeBtn.addEventListener("click", () => {
  const answer =
    prompt("Are you sure you want to remove all colors?", "yes") || "no";
  if (answer === "yes") {
    resetAllColors();
    localStorageSpace();
  }
});

removeThisCodeBtn.addEventListener("click", () => {
  const answer =
    prompt("Are you sure you want to remove this color?", "yes") || "no";
  if (answer === "yes") {
    let i = 1;
    while (i <= numPalettes) {
      localStorage.removeItem(`${selectedCompany}${i}`);
      i++;
    }
    localStorage.removeItem(`${selectedCompany}-hexcodes`);
    localStorage.removeItem(`${selectedCompany}IMG`);
    getCodeForCodeBox();
    resetColorStopsAndPalettes();
    clearCanvasImage();
    localStorageSpace();
    clearOneFromIndexedDB(selectedCompany);
  }
});

function clearCanvasImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetAllColors() {
  localStorage.clear();
  getCodeForCodeBox();
  resetColorStopsAndPalettes();
  clearCanvasImage();
  clearAllFromIndexedDB();
}

function resetColorStopsAndPalettes() {
  colorsForSVGs.forEach((colorStop, idx) => {
    idx === 2
      ? (colorStop.style.fill = "#000")
      : (colorStop.style.stopColor = "#000");
  });
  paletteContainers.forEach((paletteContainer) => {
    removeAllChildNodes(paletteContainer);
  });
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
function applyColorsToSVGs(selectedCompany) {
  colorsForSVGs.forEach((svgColor, idx) => {
    idx === 2
      ? (svgColor.style.fill = JSON.parse(
          localStorage.getItem(`${selectedCompany}${[3]}`)
        ))
      : (svgColor.style.stopColor = JSON.parse(
          localStorage.getItem(`${selectedCompany}${[idx + 1]}`)
        ));
  });
}

function retrieveSelectedCompanyPalettes(selectedCompany, companyColors) {
  const selectedCompanyHexCodes = localStorage.getItem(
    `${selectedCompany}-hexcodes`
  );
  if (selectedCompanyHexCodes) {
    selectedCompanyHexCodes.split(",").forEach((hexColor) => {
      buildPaletteElement(hexColor, companyColors);
    });
  }
}

companySelector.addEventListener("change", (e) => {
  clearPalettes();
  clearCanvasImage();
  selectedCompany = e.target.value;
  getIMGFromIndexedDB(selectedCompany);
  const companyColors = [];
  let i = 0;
  while (i < numOfCompanyColors) {
    companyColors.push(localStorage.getItem(`${selectedCompany}${i + 1}`));
    i++;
  }
  applyColorsToSVGs(selectedCompany);
  retrieveSelectedCompanyPalettes(selectedCompany, companyColors);
});

function visiblyIndicateColor(colorElements, selectedColor) {
  colorElements.forEach((colorEl) => {
    if (colorEl.textContent === selectedColor) {
      colorEl.style.borderRadius = "50%";
    } else {
      colorEl.style.borderRadius = "0%";
    }
  });
}

function saveColorToLocalStorage(colorPaletteNum, selectedColor) {
  localStorage.setItem(
    `${selectedCompany}${colorPaletteNum}`,
    `"${selectedColor}"`
  );
}
function handleColorPalette(e, colorPaletteNum) {
  let selectedColor = e.target.textContent;
  const colorElements = document.querySelectorAll(
    `#palette-${colorPaletteNum} .color-element`
  );
  visiblyIndicateColor(colorElements, selectedColor);
  setColorsInSVGs(colorPaletteNum, selectedColor);
  saveColorToLocalStorage(colorPaletteNum, selectedColor);
  getCodeForCodeBox();
}

function getCodeForCodeBox() {
  const formattedHexCodes = {};
  companies.forEach((company) => {
    let i = 1;
    while (i <= 3) {
      let companyHexCode = localStorage.getItem(`${company}${i}`);
      let formattedCompanyHexCode = companyHexCode?.slice(1, -1) || "#000";
      formattedHexCodes[`${company}${i}`] = formattedCompanyHexCode;
      i++;
    }
  });
  localStorageDisplay.textContent = `const colors = ${JSON.stringify(
    formattedHexCodes
  )};`;
  // localStorageDisplay.style.width = "50%";
  // localStorageDisplay.style.overflow = "hidden";
}

const processIMG = () => {
  const imgFile = document.getElementById("imgfile");
  const image = new Image();
  const file = imgFile.files[0];
  if (file.size > 500000) {
    alert("File size exceeds limit");
    return;
  } else {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      resetColorStopsAndPalettes();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let imgAsDataURL = canvas.toDataURL();
        // let imgAsDataURL = canvas.toDataURL("image/jpg");
        saveIMGToIndexedDB(selectedCompany, imgAsDataURL);
        const rgbArray = buildRgb(imageData.data);
        const quantColors = quantization(rgbArray, 0);
        buildPalette(quantColors);
      };
      image.src = fileReader.result;
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
    imgFile.value = "";
  }
};

function clearPalettes() {
  paletteContainers.forEach((palette) => {
    palette.innerHTML = "";
  });
}
function buildPaletteElement(hexColor, companyColors) {
  const colorElement1 = document.createElement("div");
  colorElement1.className = "color-element";
  colorElement1.style.backgroundColor = hexColor;
  if (hexColor !== "#FFFFFF") {
    colorElement1.appendChild(document.createTextNode(hexColor));
  }
  const colorElement2 = colorElement1.cloneNode(true);
  const colorElement3 = colorElement1.cloneNode(true);
  const colorElements = [colorElement1, colorElement2, colorElement3];
  colorElements.forEach((colorElement, idx) => {
    if (
      companyColors &&
      colorElement.textContent === JSON.parse(companyColors[idx])
    ) {
      colorElement.style.borderRadius = "50%";
    }
    colorElement.addEventListener("click", (e) => {
      handleColorPalette(e, idx + 1);
    });
  });
  if (colorElement1.style.backgroundColor !== "rgb(255, 255, 255)") {
    paletteContainers.forEach((paletteContainer, idx) => {
      paletteContainer.appendChild(colorElements[idx]);
    });
  }
}
function visiblyIndicateColor(colorElements, selectedColor) {
  colorElements.forEach((colorEl) => {
    if (colorEl.textContent === selectedColor) {
      colorEl.style.borderRadius = "50%";
    } else {
      colorEl.style.borderRadius = "0%";
    }
  });
}
function setColorsInSVGs(colorPaletteNum, selectedColor) {
  if (colorPaletteNum === 1) {
    colorStop1.style.stopColor = selectedColor;
  } else if (colorPaletteNum === 2) {
    colorStop2.style.stopColor = selectedColor;
  } else if (colorPaletteNum === 3) {
    colorStop3.style.fill = selectedColor;
  }
}
function saveColorToLocalStorage(colorPaletteNum, selectedColor) {
  localStorage.setItem(
    `${selectedCompany}${colorPaletteNum}`,
    `"${selectedColor}"`
  );
}

const buildPalette = (colorsList) => {
  localStorageSpace();
  hexColorArr = [];
  clearPalettes();
  const orderedByColor = orderByLuminance(colorsList);

  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHex(orderedByColor[i]);
    hexColorArr.push(hexColor);
    buildPaletteElement(hexColor);
  }
  colorArrFinal = Array.from(new Set(hexColorArr));
  localStorage.setItem(`${selectedCompany}-hexcodes`, colorArrFinal);
};

// https://stackoverflow.com/questions/60241398/how-to-download-and-svg-element-as-an-svg-file
function downloadSVGasTextFile() {
  const base64doc = btoa(
    unescape(encodeURIComponent(document.querySelector("svg").outerHTML))
  );
  const a = document.createElement("a");
  a.textContent = "Download your new SVG";
  const svgDownloadContainer = document.querySelector(
    "#svg-download-container"
  );
  svgDownloadContainer.appendChild(a);
  a.addEventListener("click", () => {
    a.download = "download.svg";
    a.href = "data:text/html;base64," + base64doc;
  });
}

const copyCodeBtn = document.getElementById("copy-code-btn");
copyCodeBtn.addEventListener("click", () => {
  var r = document.createRange();
  r.selectNode(document.getElementById("code"));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
});

const localStorageSpace = function () {
  var data = "";
  console.log("Current local storage: ");
  for (var key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      data += window.localStorage[key];
      console.log(
        key +
          " = " +
          ((window.localStorage[key].length * 16) / (8 * 1024)).toFixed(2) +
          " KB"
      );
    }
  }

  console.log(
    data
      ? "\n" +
          "Total space used: " +
          ((data.length * 16) / (8 * 1024)).toFixed(2) +
          " KB"
      : "Empty (0 KB)"
  );
  console.log(
    data
      ? "Approx. space remaining: " +
          (5120 - ((data.length * 16) / (8 * 1024)).toFixed(2)) +
          " KB"
      : "5 MB"
  );
};

/* https://www.youtube.com/watch?v=yZ26CXny3iI */
function clearOneFromIndexedDB(selectedCompany) {
  const request = indexedDB.open("VLMImages", indexedDBVersion);
  request.onsuccess = function (e) {
    const db = request.result;
    const transaction = db.transaction("images", "readwrite");
    const objectStore = transaction.objectStore("images");
    companies.forEach((company, idx) => {
      if (company === selectedCompany) {
        objectStore.delete(idx + 1);
      }
    });
    db.close();
  };
}
function clearAllFromIndexedDB() {
  const request = indexedDB.open("VLMImages", indexedDBVersion);
  request.onsuccess = function (e) {
    const db = request.result;
    const transaction = db.transaction("images", "readwrite");
    const objectStore = transaction.objectStore("images");
    objectStore.clear();
    db.close();
  };
}

function getIMGFromIndexedDB(selectedCompany) {
  let objectStore = null;
  try {
    const request = indexedDB.open("VLMImages", indexedDBVersion);
    request.addEventListener("upgradeneeded", (ev) => {
      db = ev.target.result;
      let oldVersion = ev.oldVersion;
      let newVersion = ev.newVersion || db.version;
      console.log("DB updated from version", oldVersion, "to", newVersion);
      if (!db.objectStoreNames.contains("images")) {
        objectStore = db.createObjectStore("images", { keyPath: "id" });
        objectStore.createIndex("roster_name", ["name"], { unique: true });
        objectStore.createIndex("img_data", ["imgData"], { unique: true });
      }
    });
    request.onsuccess = function (e) {
      const db = request.result;
      if (db.transaction("images", "readwrite")) {
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        let idQuery;
        companies.forEach((company, idx) => {
          if (company === selectedCompany) {
            idQuery = store.get(idx + 1);
          }
        });
        idQuery.onsuccess = function () {
          const img = new Image();
          if (idQuery.result) {
            img.src = idQuery.result.imgData;
          }
          transaction.oncomplete = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            db.close();
          };
        };
      }
    };
  } catch (error) {
    console.error(error);
  }
}
function saveIMGToIndexedDB(selectedCompany, base64Data) {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;
  let db = null;
  const request = indexedDB.open("VLMImages", indexedDBVersion);

  request.addEventListener("error", (err) => {
    console.warn(err);
  });

  request.addEventListener("success", (ev) => {
    db = ev.target.result;
    console.log("success", db);
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");
    const nameIndex = store.index("roster_name");
    companies.forEach((company, idx) => {
      if (company === selectedCompany) {
        store.put({ id: idx + 1, name: company, imgData: base64Data });
      }
    });
    const nameQuery = nameIndex.getAll();
    nameQuery.onsuccess = function () {
      console.log("nameQuery", nameQuery.result);
    };
    transaction.oncomplete = function () {
      db.close();
    };
  });
}
