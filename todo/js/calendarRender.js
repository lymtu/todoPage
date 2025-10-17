import { mainDom, returnBtnDom } from "./utils/domStore.js";

returnBtnDom.addEventListener("click", () => {
  const exist = mainDom.classList.contains("calendar");
  if (!exist) return;
  mainDom.classList.remove("calendar");
});
