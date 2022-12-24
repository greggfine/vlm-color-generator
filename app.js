const companies = [
  "alkemy-x",
  "fellow",
  "gradient-pictures",
  "kroma-digital-cosmetics",
  "picture-north",
  "tessa-films",
];
const loadBtn = document.querySelector("#btnLoad");
const companySelector = document.querySelector("#company-selector");
const currentCompany = document.querySelector("#current-company");
const vlmGradient = document.querySelector("#vlm-gradient");
const userSelectedColor1 = document.querySelector("#userselected-color-1");
const userSelectedColor2 = document.querySelector("#userselected-color-2");
const localStorageDisplay = document.querySelector("#code");
const removeCodeBtn = document.querySelector("#remove-code-btn");
const removeThisCodeBtn = document.querySelector("#remove-this-code-btn");
const paletteContainer = document.getElementById("palette-1");
const paletteContainer2 = document.getElementById("palette-2");
const paletteContainer3 = document.getElementById("palette-3");
const paletteContainers = [
  paletteContainer,
  paletteContainer2,
  paletteContainer3,
];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const numPalettes = 3;
let colorStop1 = document.querySelector("#color-stop-1");
let colorStop2 = document.querySelector("#color-stop-2");
let colorStop3 = document.querySelector("#color-stop-3");
const colorStops = [colorStop1, colorStop2, colorStop3];
let selectedCompany = "";
let currentIMG = "";
let hexColorArr = [];

removeCodeBtn.addEventListener("click", () => {
  const answer = prompt("Are you sure you want to remove all colors?", "yes");
  if (answer) {
    resetAllColors();
    localStorageSpace();
  }
});

removeThisCodeBtn.addEventListener("click", () => {
  const answer = prompt("Are you sure you want to remove this color?", "yes");
  if (answer) {
    let i = 1;
    while (i <= numPalettes) {
      localStorage.removeItem(`${selectedCompany}${i}`);
      i++;
    }
    localStorage.removeItem(`${selectedCompany}-hexcodes`);
    localStorage.removeItem(`${selectedCompany}IMG`);
    getCodeFromLocalStorage();
    resetColorStopsAndPalettes();
    clearCanvasImage();
    localStorageSpace();
  }
});

function clearCanvasImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetAllColors() {
  localStorage.clear();
  getCodeFromLocalStorage();
  resetColorStopsAndPalettes();
  clearCanvasImage();
  clearIndexedDb();
}
function resetColorStopsAndPalettes() {
  colorStops.forEach((colorStop, idx) => {
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

window.onload = () => {
  getCodeFromLocalStorage();
  selectedCompany = companies[0];
  const colors = [];
  let i = 1;
  while (i <= numPalettes) {
    colors[i] = JSON.parse(localStorage.getItem(`${selectedCompany}${[i]}`));
    i++;
  }
  colorStops.forEach((colorStop, idx) => {
    idx === 2
      ? (colorStop.style.fill = colors[3])
      : (colorStop.style.stopColor = colors[idx + 1]);
  });
  loadBtn.addEventListener("click", () => {
    main();
  });
  localStorageSpace();
};

companySelector.addEventListener("change", (e) => {
  clearPalettes();
  // clearCanvasImage();
  selectedCompany = e.target.value;
  getIMGFromIndexedDB(selectedCompany);
  const color1 = localStorage.getItem(`${selectedCompany}1`);
  const color2 = localStorage.getItem(`${selectedCompany}2`);
  const color3 = localStorage.getItem(`${selectedCompany}3`);
  colorStop1.style.stopColor = JSON.parse(color1);
  colorStop2.style.stopColor = JSON.parse(color2);
  colorStop3.style.fill = JSON.parse(color3);
  const selectedCompanyHexCodes = localStorage.getItem(
    `${selectedCompany}-hexcodes`
  );
  if (selectedCompanyHexCodes) {
    // const stringArr = localStorage.getItem(`${selectedCompany}-hexcodes`);
    const stringArr = selectedCompanyHexCodes;
    const splitStringArr = stringArr.split(",");
    splitStringArr.forEach((hexColor) => {
      const colorElement = document.createElement("div");
      colorElement.className = "color-element";
      colorElement.style.backgroundColor = hexColor;
      colorElement.appendChild(document.createTextNode(hexColor));
      let colorElement2 = colorElement.cloneNode(true);
      let colorElement3 = colorElement.cloneNode(true);
      colorElement.addEventListener("click", (e) => {
        handleColorPalette(e, 1);
      });
      colorElement2.addEventListener("click", (e) => {
        handleColorPalette(e, 2);
      });
      colorElement3.addEventListener("click", (e) => {
        handleColorPalette(e, 3);
      });
      if (colorElement.style.backgroundColor != "rgb(255, 255, 255)") {
        paletteContainer.appendChild(colorElement);
        paletteContainer2.appendChild(colorElement2);
        paletteContainer3.appendChild(colorElement3);
      }
      if (colorElement.textContent === JSON.parse(color1)) {
        colorElement.style.border = "3px solid #000";
        colorElement.style.borderRadius = "50%";
      }
      if (colorElement2.textContent === JSON.parse(color2)) {
        colorElement2.style.border = "3px solid #000";
        colorElement2.style.borderRadius = "50%";
      }
      if (colorElement3.textContent === JSON.parse(color3)) {
        colorElement3.style.border = "3px solid #000";
        colorElement3.style.borderRadius = "50%";
      }
    });
  }
});

function visiblyIndicateColor(colorElements, selectedColor) {
  // loop through the NodeList and, if the element's hex code matches the color that was clicked on
  // visually indicate it with a circular border
  // Else, reset the border style
  colorElements.forEach((colorEl) => {
    if (colorEl.textContent === selectedColor) {
      colorEl.style.border = "3px solid #000";
      colorEl.style.borderRadius = "50%";
    } else {
      colorEl.style.border = "none";
      colorEl.style.borderRadius = "0%";
    }
  });
}
function setColorStopsInLogo(colorPaletteNum, selectedColor) {
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
  // localStorageSpace();
}
function handleColorPalette(e, colorPaletteNum) {
  // get the hex code for the color that was clicked on
  let selectedColor = e.target.textContent;
  // get a NodeList of all the color elements depending on which palette was clicked on
  const colorElements = document.querySelectorAll(
    `#palette-${colorPaletteNum} .color-element`
  );
  visiblyIndicateColor(colorElements, selectedColor);
  setColorStopsInLogo(colorPaletteNum, selectedColor);
  saveColorToLocalStorage(colorPaletteNum, selectedColor);
  getCodeFromLocalStorage();
}

function getCodeFromLocalStorage() {
  let stringifiedBlack = JSON.stringify("#000");
  localStorageDisplay.textContent = `const colors = {
	alkemyX1: ${localStorage.getItem("alkemy-x1") || stringifiedBlack},
	alkemyX2: ${localStorage.getItem("alkemy-x2") || stringifiedBlack},
	alkemyX3: ${localStorage.getItem("alkemy-x3") || stringifiedBlack},
	fellow1: ${localStorage.getItem("fellow1") || stringifiedBlack},
	fellow2: ${localStorage.getItem("fellow2") || stringifiedBlack},
	fellow3: ${localStorage.getItem("fellow3") || stringifiedBlack},
	gradientPictures1: ${
    localStorage.getItem("gradient-pictures1") || stringifiedBlack
  },
	gradientPictures2: ${
    localStorage.getItem("gradient-pictures2") || stringifiedBlack
  },
	gradientPictures3: ${
    localStorage.getItem("gradient-pictures3") || stringifiedBlack
  },
	kromaDigitalCosmetics1: ${
    localStorage.getItem("kroma-digital-cosmetics1") || stringifiedBlack
  },
	kromaDigitalCosmetics2: ${
    localStorage.getItem("kroma-digital-cosmetics2") || stringifiedBlack
  },
	kromaDigitalCosmetics3: ${
    localStorage.getItem("kroma-digital-cosmetics3") || stringifiedBlack
  },
	pictureNorth1: ${localStorage.getItem("picture-north1") || stringifiedBlack},
	pictureNorth2: ${localStorage.getItem("picture-north2") || stringifiedBlack},
	pictureNorth3: ${localStorage.getItem("picture-north3") || stringifiedBlack},
	tessaFilms1: ${localStorage.getItem("tessa-films1") || stringifiedBlack},
	tessaFilms2: ${localStorage.getItem("tessa-films2") || stringifiedBlack},
	tessaFilms3: ${localStorage.getItem("tessa-films3") || stringifiedBlack},
  };`;
}

const main = () => {
  const imgFile = document.getElementById("imgfile");
  const image = new Image();
  const file = imgFile.files[0];
  const fileReader = new FileReader();

  // Whenever file & image is loaded procced to extract the information from the image
  fileReader.onload = () => {
    image.onload = () => {
      // Set the canvas size to be the same as of the uploaded image
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      /**
       * getImageData returns an array full of RGBA values
       * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
       * (transparency). For array value consistency reasons,
       * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
       */
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      /* ======================================================= */
      /* ======================================================= */
      /* ======================================================= */
      /* GREGG IMAGE EXPERIMENT!!!!! */
      let imgAsDataURL = canvas.toDataURL("image/jpg");
      saveIMGToIndexedDB(selectedCompany, imgAsDataURL);
      // console.log(window.btoa(imgAsDataURL));
      // localStorage.setItem(`${selectedCompany}IMG`, window.btoa(imgAsDataURL));
      // localStorage.setItem(`${selectedCompany}IMG`, imgAsDataURL);
      /* GREGG IMAGE EXPERIMENT END!!!!! */
      /* ======================================================= */
      /* ======================================================= */
      /* ======================================================= */

      // Convert the image data to RGB values so its much simpler
      const rgbArray = buildRgb(imageData.data);

      /**
       * Color quantization
       * A process that reduces the number of colors used in an image
       * while trying to visually maintin the original image as much as possible
       */
      const quantColors = quantization(rgbArray, 0);

      // Create the HTML structure to show the color palette
      buildPalette(quantColors);
      //   downloadSVGasTextFile();
    };
    image.src = fileReader.result;
  };
  if (file) {
    fileReader.readAsDataURL(file);
  }
  // fileReader.readAsDataURL(file);
  imgFile.value = "";
  // colorStops.forEach((colorStop, idx) => {
  //   idx === 2
  //     ? (colorStop.style.fill = "#000")
  //     : (colorStop.style.stopColor = "#000");
  // });
};

function clearPalettes() {
  paletteContainers.forEach((palette) => {
    palette.innerHTML = "";
  });
}
function buildPaletteElement(hexColor) {
  const colorElement = document.createElement("div");
  colorElement.className = "color-element";
  colorElement.style.backgroundColor = hexColor;
  if (hexColor !== "#FFFFFF") {
    colorElement.appendChild(document.createTextNode(hexColor));
  }

  let colorElement2 = colorElement.cloneNode(true);
  let colorElement3 = colorElement.cloneNode(true);
  colorElement.addEventListener("click", (e) => {
    handleColorPalette(e, 1);
  });
  colorElement2.addEventListener("click", (e) => {
    handleColorPalette(e, 2);
  });
  colorElement3.addEventListener("click", (e) => {
    handleColorPalette(e, 3);
  });
  if (colorElement.style.backgroundColor != "rgb(255, 255, 255)") {
    paletteContainer.appendChild(colorElement);
    paletteContainer2.appendChild(colorElement2);
    paletteContainer3.appendChild(colorElement3);
  }
}
function visiblyIndicateColor(colorElements, selectedColor) {
  colorElements.forEach((colorEl) => {
    if (colorEl.textContent === selectedColor) {
      colorEl.style.border = "3px solid #000";
      colorEl.style.borderRadius = "50%";
    } else {
      colorEl.style.border = "none";
      colorEl.style.borderRadius = "0%";
    }
  });
}
function setColorStopsInLogo(colorPaletteNum, selectedColor) {
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

function handleColorPalette(e, colorPaletteNum) {
  // get the hex code for the color that was clicked on
  let selectedColor = e.target.textContent;
  // get a NodeList of all the color elements depending on which palette was clicked on
  const colorElements = document.querySelectorAll(
    `#palette-${colorPaletteNum} .color-element`
  );
  visiblyIndicateColor(colorElements, selectedColor);
  setColorStopsInLogo(colorPaletteNum, selectedColor);
  saveColorToLocalStorage(colorPaletteNum, selectedColor);
  getCodeFromLocalStorage();
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

//   Gregg extra code to download the new SVG
// https://stackoverflow.com/questions/60241398/how-to-download-and-svg-element-as-an-svg-file
function downloadSVGasTextFile() {
  const base64doc = btoa(
    unescape(encodeURIComponent(document.querySelector("svg").outerHTML))
  );
  const a = document.createElement("a");
  // Gregg Code
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
  // console.log("Current local storage: ");
  // for (var key in window.localStorage) {
  //   if (window.localStorage.hasOwnProperty(key)) {
  //     data += window.localStorage[key];
  //     console.log(
  //       key +
  //         " = " +
  //         ((window.localStorage[key].length * 16) / (8 * 1024)).toFixed(2) +
  //         " KB"
  //     );
  //   }
  // }

  // console.log(
  //   data
  //     ? "\n" +
  //         "Total space used: " +
  //         ((data.length * 16) / (8 * 1024)).toFixed(2) +
  //         " KB"
  //     : "Empty (0 KB)"
  // );
  // console.log(
  //   data
  //     ? "Approx. space remaining: " +
  //         (5120 - ((data.length * 16) / (8 * 1024)).toFixed(2)) +
  //         " KB"
  //     : "5 MB"
  // );
};

/* INDEXEDDB STUFF!!!!!!!!!! */
/* https://www.youtube.com/watch?v=yZ26CXny3iI */
function clearIndexedDb() {
  const request = indexedDB.open("VLMImages", 2);
  request.onsuccess = function (e) {
    const db = request.result;
    const transaction = db.transaction("images", "readwrite");
    const objectStore = transaction.objectStore("images");
    objectStore.clear();
  };
}

function getIMGFromIndexedDB(selectedCompany) {
  console.log(selectedCompany);
  const request = indexedDB.open("VLMImages", 2);
  request.onsuccess = function (e) {
    const db = request.result;
    const transaction = db.transaction("images", "readwrite");
    // Get a reference to your objectStore
    const store = transaction.objectStore("images");
    let idQuery;
    if (selectedCompany === "alkemy-x") {
      idQuery = store.get(1);
    }
    if (selectedCompany === "fellow") {
      idQuery = store.get(2);
    }
    if (selectedCompany === "gradient-pictures") {
      idQuery = store.get(3);
    }
    if (selectedCompany === "kroma-digital-cosmetics") {
      idQuery = store.get(4);
    }
    if (selectedCompany === "picture-north") {
      idQuery = store.get(5);
    }
    if (selectedCompany === "tessa-films") {
      idQuery = store.get(6);
    }
    idQuery.onsuccess = function () {
      console.log("idQuery", idQuery.result);
      // console.log(idQuery.result.imgData);
      // currentIMG = idQuery.result.imgData;
      const img = new Image();
      // img.src = currentIMG;
      img.src = idQuery.result.imgData;
      transaction.oncomplete = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        db.close();
      };
    };
  };
}
function saveIMGToIndexedDB(selectedCompany, base64Data) {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;
  // let db;
  // Makes a request to the user to open up a database
  // If it doesn't exist yet, it's created. If it does exist, it's simply opened.
  // The second arg is the version of the database. The coder gives this number so that, whenever the
  // db schema is updated(structure/schema is changed), the version number can be upgraded.
  // If this number is changed and the user opens the app, the onupgradeneeded function will run
  // telling the user the db needs to be upgraded
  const request = indexedDB.open("VLMImages", 2);

  request.onerror = function (e) {
    console.error(`Database error: ${event.target.errorCode}`);
  };

  // onupgradeneeded is run when: new db is created or changed/upgraded
  // Since this runs when db is created, it gives you opportunity to set up the structure/schema

  request.onupgradeneeded = (event) => {
    // Save the IDBDatabase interface
    // const db = event.target.result;
    const db = request.result;
    // console.log("onupgrade");
    // Create an objectStore for this database
    // objectStore is like an SQL table or NoSQL collection
    // keyPath is like a Primary Key
    const objectStore = db.createObjectStore("images", { keyPath: "id" });
    // createIndex (how do you want to be able to look up the data?)
    // The 2nd arg is the property on the object?
    // The 1st arg is the name of the index?
    // objectStore.createIndex("customer_name", ["name"], { unique: false });
    // objectStore.createIndex("customer_email", ["email"], { unique: true });
    // Compound Index Experiment
    // objectStore.createIndex("name_and_email", ["name", "email"], {
    //   unique: true,
    // });

    // const transaction = db.transaction(["customers"], "readwrite");
    // console.log(transaction);
    objectStore.createIndex("roster_name", ["name"], { unique: true });
    objectStore.createIndex("img_data", ["imgData"], { unique: true });
  };

  // onsuccess will run after onupgradeneeded
  request.onsuccess = function (e) {
    // const db = e.target.result;
    const db = request.result;
    // // A transaction makes several DB actions occur all together(at the same time)
    // // If one of them fails, they all fail.
    const transaction = db.transaction("images", "readwrite");
    // Get a reference to your objectStore
    const store = transaction.objectStore("images");
    const nameIndex = store.index("roster_name");
    // NOW, ADD SOME DATA
    if (selectedCompany === "alkemy-x") {
      store.put({ id: 1, name: "alkemy-x", imgData: base64Data });
    }
    if (selectedCompany === "fellow") {
      store.put({ id: 2, name: "fellow", imgData: base64Data });
    }
    if (selectedCompany === "gradient-pictures") {
      store.put({ id: 3, name: "gradient-pictures", imgData: base64Data });
    }
    if (selectedCompany === "kroma-digital-cosmetics") {
      store.put({
        id: 4,
        name: "kroma-digital-cosmetics",
        imgData: base64Data,
      });
    }
    if (selectedCompany === "picture-north") {
      store.put({ id: 5, name: "picture-north", imgData: base64Data });
    }
    if (selectedCompany === "tessa-films") {
      store.put({ id: 6, name: "tessa-films", imgData: base64Data });
    }
    // For compound queries
    // store.put({id: 1, name: "GFine", email: "gf@gmail.com"});
    // MAKE QUERIES
    // gets the first one found
    // const idQuery = store.get(1);
    // gets all that are found
    // const nameQuery = nameIndex.getAll(["GFine"]);
    const nameQuery = nameIndex.getAll();
    // You can make one of these for each query you run
    // idQuery.onsuccess = function () {
    //   console.log("idQuery", idQuery.result);
    // };
    nameQuery.onsuccess = function () {
      console.log("nameQuery", nameQuery.result);
    };
    // DB CLEANUP
    transaction.oncomplete = function () {
      db.close();
    };
    // objectStore.transaction.oncomplete = (event) => {
    //   // Store values in the newly created objectStore.
    //   const customerObjectStore = db
    //     .transaction("customers", "readwrite")
    //     .objectStore("customers");
    //   customerData.forEach((customer) => {
    //     customerObjectStore.add(customer);
    //   });
    // };
  };
}
