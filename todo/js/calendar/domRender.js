import { calendarDom, monthTitleDom } from "../utils/domStore.js";
import { getDate, getDay, timeTransformer } from "../utils/time.js";

const generateBgAlpha = (count) => {
  if (count === 0) return 0;
  if (count > 10) return 1;
  return count / 10;
};

function updateDom(monthTimestamp, list) {
  const maxLength = 5 * 7;
  const domList = calendarDom.querySelectorAll(".calendarItem");

  if (domList.length === 0) {
    for (let i = 0; i < maxLength; i++) {
      const div = document.createElement("div");
      div.classList.add("calendarItem");
      const tip = document.createElement("div");
      tip.classList.add("calendarItemTip");
      const date = document.createElement("div");
      date.classList.add("date");
      const section = document.createElement("section");
      const todo = document.createElement("span");
      todo.classList.add("calendarItemTipTitle", "todo");
      const span_1 = document.createElement("span");
      span_1.textContent = "次添加，";
      const done = document.createElement("span");
      done.classList.add("calendarItemTipTitle", "done");
      const span_2 = document.createElement("span");
      span_2.textContent = "次完成。";
      section.append(todo, span_1, done, span_2);
      tip.append(date, section);
      div.appendChild(tip);
      calendarDom.appendChild(div);
    }
  }

  updateDom = function (monthTimestamp, list) {
    const domList = calendarDom.querySelectorAll(".calendarItem");
    const time = timeTransformer(monthTimestamp, "yyyy-mm");

    monthTitleDom.textContent = time;

    domList.forEach((item) => {
      item.classList.remove("exist");
      item.style.setProperty("--bg-alpha", 0);
    });

    const startIndex = getDay(monthTimestamp);
    for (const dateTimestamp in list) {
      const dateTimestampParseInt = parseInt(dateTimestamp);
      const date = getDate(dateTimestampParseInt);
      const index = startIndex + date - 1;
      const dom = domList[index];
      dom.classList.add("exist");
      const { todo, done } = list[dateTimestamp];

      dom.style.setProperty("--bg-alpha", generateBgAlpha(todo + done));

      const calendarItemTipTitle = dom.querySelector(".date");
      calendarItemTipTitle.textContent = timeTransformer(
        dateTimestampParseInt,
        "yyyy-mm-dd"
      );
      const calendarItemTipTitleTodo = dom.querySelector(
        ".calendarItemTipTitle.todo"
      );
      calendarItemTipTitleTodo.textContent = todo;
      const calendarItemTipTitleDone = dom.querySelector(
        ".calendarItemTipTitle.done"
      );
      calendarItemTipTitleDone.textContent = done;
    }
  };

  updateDom(monthTimestamp, list);
}

export { updateDom };
