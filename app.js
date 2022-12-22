const companySelector = document.querySelector("#company-selector");
const currentCompany = document.querySelector("#current-company");
const vlmGradient = document.querySelector("#vlm-gradient");
let colorStop1 = document.querySelector("#color-stop-1");
let colorStop2 = document.querySelector("#color-stop-2");
const userSelectedColor1 = document.querySelector("#userselected-color-1");
const userSelectedColor2 = document.querySelector("#userselected-color-2");
const localStorageDisplay = document.querySelector("#code");
const removeCodeBtn = document.querySelector("#remove-code-btn");
const paletteContainer = document.getElementById("palette-1");
const paletteContainer2 = document.getElementById("palette-2");
let selectedCompany = "";
let hexColorArr = [];

removeCodeBtn.addEventListener("click", () => {
  const answer = prompt("Are you sure you want to remove all colors?", "yes");
  if (answer) {
    localStorage.clear();
    getFromLocalStorage();
  }
});

const loadBtn = document.querySelector("#btnLoad");
loadBtn.addEventListener("click", () => {
  main();
});

const companies = [
  "alkemy-x",
  "fellow",
  "gradient-pictures",
  "kroma-digital-cosmetics",
  "picture-north",
  "tessa-films",
];

window.onload = () => {
  console.clear();
  // loadBtn.disabled = true;
  getFromLocalStorage();
  selectedCompany = companies[0];
  const color1 = localStorage.getItem(`${selectedCompany}1`);
  const color2 = localStorage.getItem(`${selectedCompany}2`);
  colorStop1.style.stopColor = JSON.parse(color1);
  colorStop2.style.stopColor = JSON.parse(color2);
  // const canvas = document.getElementById("canvas");
  // const ctx = canvas.getContext("2d");
  // const image = new Image();
  // let imgStr = `${selectedCompany}IMG`;
  // image.src = localStorage.getItem(imgStr);
  // window.setTimeout(() => {
  //   canvas.width = image.width;
  //   canvas.height = image.height;
  //   ctx.drawImage(image, 0, 0);
  // }, 1);
};

companySelector.addEventListener("change", (e) => {
  document.getElementById("palette-1").innerHTML = "";
  document.getElementById("palette-2").innerHTML = "";
  selectedCompany = e.target.value;
  const color1 = localStorage.getItem(`${selectedCompany}1`);
  const color2 = localStorage.getItem(`${selectedCompany}2`);
  colorStop1.style.stopColor = JSON.parse(color1);
  colorStop2.style.stopColor = JSON.parse(color2);
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  // const image = new Image();
  // if (selectedCompany) {
  //   let imgStr = `${selectedCompany}IMG`;
  //   image.src = localStorage.getItem(imgStr);
  //   window.setTimeout(() => {
  //     canvas.width = image.width;
  //     canvas.height = image.height;
  //     ctx.drawImage(image, 0, 0);
  //   }, 1);
  // }
  // else {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // }
  // console.log(localStorage.getItem("fellowIMG"));
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
});
// getFromLocalStorage();

function getFromLocalStorage() {
  //   const items = { ...localStorage };
  let stringifiedBlack = JSON.stringify("#000");
  localStorageDisplay.textContent = `const colors = {
	alkemyX1: ${localStorage.getItem("alkemy-x1") || stringifiedBlack},
	alkemyX2: ${localStorage.getItem("alkemy-x2") || stringifiedBlack},
	fellow1: ${localStorage.getItem("fellow1") || stringifiedBlack},
	fellow2: ${localStorage.getItem("fellow2") || stringifiedBlack},
	gradientPictures1: ${
    localStorage.getItem("gradient-pictures1") || stringifiedBlack
  },
	gradientPictures2: ${
    localStorage.getItem("gradient-pictures2") || stringifiedBlack
  },
	kromaDigitalCosmetics1: ${
    localStorage.getItem("kroma-digital-cosmetics1") || stringifiedBlack
  },
	kromaDigitalCosmetics2: ${
    localStorage.getItem("kroma-digital-cosmetics2") || stringifiedBlack
  },
	pictureNorth1: ${localStorage.getItem("picture-north1") || stringifiedBlack},
	pictureNorth2: ${localStorage.getItem("picture-north2") || stringifiedBlack},
	tessaFilms1: ${localStorage.getItem("tessa-films1") || stringifiedBlack},
	tessaFilms2: ${localStorage.getItem("tessa-films2") || stringifiedBlack},
  };`;
}

const main = () => {
  const imgFile = document.getElementById("imgfile");
  const image = new Image();
  const file = imgFile.files[0];
  const fileReader = new FileReader();

  // Whenever file & image is loaded procced to extract the information from the image
  fileReader.onload = () => {
    // loadBtn.disabled = false;
    image.onload = () => {
      // Set the canvas size to be the same as of the uploaded image
      const canvas = document.getElementById("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
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
      colorStop1.style.stopColor = hexColorArr[12];
      colorStop2.style.stopColor = hexColorArr[15];
      //   downloadSVGasTextFile();
    };
    image.src = fileReader.result;
  };
  fileReader.readAsDataURL(file);
  imgFile.value = "";
};

const buildPalette = (colorsList) => {
  hexColorArr = [];
  paletteContainer.innerHTML = "";
  paletteContainer2.innerHTML = "";
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
      // set the VLM Logo's colorStop1
      if (colorPaletteNum === 1) {
        colorStop1.style.stopColor = selectedColor;
      } else if (colorPaletteNum === 2) {
        colorStop2.style.stopColor = selectedColor;
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
      getFromLocalStorage();
    }

    colorElement.addEventListener("click", (e) => {
      handleColorPalette(e, 1);
    });
    colorElement2.addEventListener("click", (e) => {
      handleColorPalette(e, 2);
    });
    if (colorElement.style.backgroundColor != "rgb(255, 255, 255)") {
      paletteContainer.appendChild(colorElement);
      paletteContainer2.appendChild(colorElement2);
    }
  }
  colorArrFinal = Array.from(new Set(hexColorArr));
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
