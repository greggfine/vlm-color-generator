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
let colorStop1 = document.querySelector("#color-stop-1");
let colorStop2 = document.querySelector("#color-stop-2");
let colorStop3 = document.querySelector("#color-stop-3");
const userSelectedColor1 = document.querySelector("#userselected-color-1");
const userSelectedColor2 = document.querySelector("#userselected-color-2");
const localStorageDisplay = document.querySelector("#code");
const removeCodeBtn = document.querySelector("#remove-code-btn");
const removeThisCodeBtn = document.querySelector("#remove-this-code-btn");
const paletteContainer = document.getElementById("palette-1");
const paletteContainer2 = document.getElementById("palette-2");
const paletteContainer3 = document.getElementById("palette-3");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let selectedCompany = "";
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
    localStorage.removeItem(`${selectedCompany}1`);
    localStorage.removeItem(`${selectedCompany}2`);
    localStorage.removeItem(`${selectedCompany}3`);
    localStorage.removeItem(`${selectedCompany}-hexcodes`);
    localStorage.removeItem(`${selectedCompany}IMG`);
    getCodeFromLocalStorage();
    colorStop1.style.stopColor = "#000";
    colorStop2.style.stopColor = "#000";
    colorStop3.style.fill = "#000";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    removeAllChildNodes(paletteContainer);
    removeAllChildNodes(paletteContainer2);
    removeAllChildNodes(paletteContainer3);
    localStorageSpace();
  }
});

function resetAllColors() {
  localStorage.clear();
  getCodeFromLocalStorage();
  colorStop1.style.stopColor = "#000";
  colorStop2.style.stopColor = "#000";
  colorStop3.style.fill = "#000";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  removeAllChildNodes(paletteContainer);
  removeAllChildNodes(paletteContainer2);
  removeAllChildNodes(paletteContainer3);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

window.onload = () => {
  // console.clear();
  // loadBtn.disabled = true;
  // loadBtn.style.disabled = "true";
  getCodeFromLocalStorage();
  selectedCompany = companies[0];
  const color1 = localStorage.getItem(`${selectedCompany}1`);
  const color2 = localStorage.getItem(`${selectedCompany}2`);
  colorStop1.style.stopColor = JSON.parse(color1);
  colorStop2.style.stopColor = JSON.parse(color2);
  loadBtn.addEventListener("click", () => {
    main();
  });
  localStorageSpace();
};

companySelector.addEventListener("change", (e) => {
  const currentCompanyIMG = window.atob(
    window.localStorage.getItem(`${selectedCompany}IMG`)
  );
  paletteContainer.innerHTML = "";
  paletteContainer2.innerHTML = "";
  paletteContainer3.innerHTML = "";
  selectedCompany = e.target.value;
  const color1 = localStorage.getItem(`${selectedCompany}1`);
  const color2 = localStorage.getItem(`${selectedCompany}2`);
  const color3 = localStorage.getItem(`${selectedCompany}3`);
  colorStop1.style.stopColor = JSON.parse(color1);
  colorStop2.style.stopColor = JSON.parse(color2);
  colorStop3.style.fill = JSON.parse(color3);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // const currentCompanyIMG = localStorage.getItem(`${selectedCompany}IMG`);
  // console.log(currentCompanyIMG);
  // const img = new Image();
  // img.src = currentCompanyIMG;
  // canvas.width = img.width;
  // canvas.height = img.height;
  // ctx.drawImage(img, 0, 0);
  const stringArr = localStorage.getItem(`${selectedCompany}-hexcodes`);
  const splitStringArr = stringArr.split(",");
  // Now, we have an array of hex values
  // We need to build the palettes
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

// console.log(splitStringArr);
// console.log(hexArray);
// console.log(typeof stringArr);
// });

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
  // loadBtn.disabled = false;
  // console.log(imgFile);
  // imgFile.addEventListener("click", function () {
  //   console.log("click");
  //   // this.value = null;
  //   // loadBtn.disabled = false;
  // });
  // imgFile.addEventListener("change", function () {
  //   console.log("hey");
  //   loadBtn.disabled = false;
  // });

  // Whenever file & image is loaded procced to extract the information from the image
  fileReader.onload = () => {
    image.onload = () => {
      // Set the canvas size to be the same as of the uploaded image
      // const canvas = document.getElementById("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      // const ctx = canvas.getContext("2d");
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
      // let imgAsDataURL = canvas.toDataURL("image/jpg");
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
  fileReader.readAsDataURL(file);
  imgFile.value = "";
};

const buildPalette = (colorsList) => {
  localStorageSpace();
  hexColorArr = [];
  paletteContainer.innerHTML = "";
  paletteContainer2.innerHTML = "";
  paletteContainer3.innerHTML = "";
  const orderedByColor = orderByLuminance(colorsList);

  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHex(orderedByColor[i]);
    hexColorArr.push(hexColor);

    const colorElement = document.createElement("div");
    colorElement.className = "color-element";
    colorElement.style.backgroundColor = hexColor;
    if (hexColor !== "#FFFFFF") {
      colorElement.appendChild(document.createTextNode(hexColor));
    }

    let colorElement2 = colorElement.cloneNode(true);
    let colorElement3 = colorElement.cloneNode(true);

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
