const inputSlider = document.querySelector("[data-lengthSlider]");
const lenthDisplay = document.querySelector("[data-length]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const Uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#numbers");
const symobolscheck = document.querySelector("#symobols");

const indicator = document.querySelector("[data-indicator]");
const generatorBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");

const symobols = '~!@#$%^&*(){}:"?><|,;';

//initially
let password = "";
let passwordlength = 10;
let checkcount = 1;
handelSlider();
setIndictor("#ccc");
// site length circle color to grey

function handelSlider() {
  inputSlider.value = passwordlength;
  lenthDisplay.innerText = passwordlength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordlength - min) * 100) / (max - min) + "%100%";
}

function setIndictor(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// // genrate random password

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function genrateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function genrateSymbol() {
  const randomNum = getRndInteger(0, symobols.length);
  return symobols.charAt(randomNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (Uppercasecheck.checked) hasUpper = true;
  if (lowercasecheck.checked) hasLower = true;
  if (numberscheck.checked) hasNum = true;
  if (symobolscheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
    setIndictor("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordlength >= 6
  ) {
    setIndictor("#ff0");
  } else {
    setIndictor("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// checkBox Counting  kitne check box select kiya hai use count karega
function handleCheckBoxChange() {
  checkCount = 0;
  allcheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }
}

allcheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handelSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generatorBtn.addEventListener("click", () => {
  // m=none of the chechbox are selected
  if (checkcount == 0) return;
  if (passwordlength < checkcount) {
    passwordlength = checkcount;
    handelSlider();
  }

  //let's start the jouney to find new password
  console.log("Starting the Journey");

  // remove the old password
  password = "";

  //let's put the stuff mentioned by checkbox
  let funcArr = [];

  if (Uppercasecheck.checked) funcArr.push(generateUpperCase);

  if (lowercasecheck.checked) funcArr.push(generateLowerCase);

  if (numberscheck.checked) funcArr.push(genrateRandomNumber);

  if (symobolscheck.checked) funcArr.push(genrateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("COmpulsory adddition done");

  //remaining adddition
  for (let i = 0; i < passwordlength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  console.log("Remaining adddition done");

  //shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling done");
  //show in UI
  passwordDisplay.value = password;
  console.log("UI adddition done");
  //calculate strength
  calcStrength();
});
