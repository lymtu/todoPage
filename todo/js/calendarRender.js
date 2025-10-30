import { mainDom, returnBtnDom, calendarDom } from "./utils/domStore.js";
import { processList } from "./utils/processList.js";

import { addDecorator, addEventListener, EventType } from "./utils/reducer.js";
import {
  getDateTimestamp,
  getMonthTimestamp,
} from "./utils/time.js";

import { updateDom } from "./calendar/domRender.js";

returnBtnDom.addEventListener("click", () => {
  const exist = mainDom.classList.contains("calendar");
  if (!exist) return;
  mainDom.classList.remove("calendar");
});

calendarDom.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY;
  if (delta > 0) {
    curIndex++;
  } else {
    curIndex--;
  }

  if (curIndex < 0) {
    curIndex = 0;
  } else if (curIndex >= computeCache.allMonthTimestamp.length) {
    curIndex = computeCache.allMonthTimestamp.length - 1;
  }
  const monthTimestamp = computeCache.allMonthTimestamp[curIndex];
  updateDom(monthTimestamp, computeCache.list[monthTimestamp]);
});

const computeCache = {
  /**
   * {[monthTimestamp]: {[dateTimestamp]: {todo: 1, done: 1}}}
   */
  list: {},
  allMonthTimestamp: [],
};
let curIndex = 0;

addEventListener(EventType.INIT, (data) => {
  const { todoList, doneList } = data;
  const monthSet = new Set();
  let timeoutId;

  const onComplete = () => {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      computeCache.allMonthTimestamp = Array.from(monthSet).sort();
      let monthTimestamp;
      if (computeCache.allMonthTimestamp.length === 0) {
        curIndex = 0;
        monthTimestamp = getMonthTimestamp(Date.now());
      } else {
        curIndex = computeCache.allMonthTimestamp.length - 1;
        monthTimestamp = computeCache.allMonthTimestamp[curIndex];
      }
      updateDom(monthTimestamp, computeCache.list[monthTimestamp]);
    }, 500);
  };

  const compute = (timestamp, isDoneKey = false) => {
    const monthTimestamp = getMonthTimestamp(timestamp);
    monthSet.add(monthTimestamp);
    const dateTimestamp = getDateTimestamp(timestamp);
    addOne(monthTimestamp, dateTimestamp, isDoneKey);
  };

  processList(
    todoList,
    (key) => {
      compute(todoList[key].date);
    },
    onComplete
  );

  processList(
    doneList,
    (key) => {
      compute(doneList[key].completedDate, true);
    },
    onComplete
  );
});

addEventListener(EventType.ADD, (data) => {
  const monthTimestamp = getMonthTimestamp(data.date);
  const dateTimestamp = getDateTimestamp(data.date);
  addOne(monthTimestamp, dateTimestamp);
});

addEventListener(EventType.DELETE, (data) => {
  const { date, completed } = data;
  const dateTimestamp = getDateTimestamp(date);
  if (completed) {
    const doneDateTimestamp = getDateTimestamp(data.completedDate);
    reduceOne(doneDateTimestamp, true);
  }

  reduceOne(dateTimestamp);
});

addEventListener(EventType.UPDATE, (data, oldData) => {
  const { completed } = data;
  const doneDateTimestamp = getDateTimestamp(
    completed ? data.completedDate : oldData.completedDate
  );
  const doneMonthTimestamp = getMonthTimestamp(doneDateTimestamp);

  if (completed) {
    // todo -> done
    addOne(getMonthTimestamp(doneDateTimestamp), doneDateTimestamp, true);
  } else {
    // done -> todo
    reduceOne(doneDateTimestamp, true);
  }

  if (doneMonthTimestamp === computeCache.allMonthTimestamp[curIndex]) {
    updateDom(doneMonthTimestamp, computeCache.list[doneMonthTimestamp]);
  }
});

addEventListener(EventType.CLEAR, () => {
  computeCache.list = {};
  computeCache.allMonthTimestamp = [];
  curIndex = 0;
  updateDom(getMonthTimestamp(Date.now()), {});
});

addDecorator([EventType.ADD, EventType.DELETE], (type, data) => {
  const { date, completed, completedDate } = data;
  const activeMonth = computeCache.allMonthTimestamp[curIndex];
  let curMonth;

  if (completed) {
    curMonth = getMonthTimestamp(completedDate);
  } else {
    curMonth = getMonthTimestamp(date);
  }

  if (activeMonth === curMonth) {
    updateDom(activeMonth, computeCache.list[activeMonth]);
  }
});

const addOne = (monthTimestamp, dateTimestamp, isDone = false) => {
  if (!computeCache.list[monthTimestamp]) {
    computeCache.allMonthTimestamp.push(monthTimestamp);
    computeCache.allMonthTimestamp.sort();
    computeCache.list[monthTimestamp] = {};
  }

  if (!computeCache.list[monthTimestamp][dateTimestamp]) {
    computeCache.list[monthTimestamp][dateTimestamp] = {
      todo: 0,
      done: 0,
    };
  }

  computeCache.list[monthTimestamp][dateTimestamp][isDone ? "done" : "todo"]++;
};

const reduceOne = (dateTimestamp, isDone = false) => {
  const key = isDone ? "done" : "todo";
  const monthTimestamp = getMonthTimestamp(dateTimestamp);
  computeCache.list[monthTimestamp][dateTimestamp][key]--;
  if (
    computeCache.list[monthTimestamp][dateTimestamp][key] === 0 &&
    computeCache.list[monthTimestamp][dateTimestamp][
      !isDone ? "done" : "todo"
    ] === 0
  ) {
    delete computeCache.list[monthTimestamp][dateTimestamp];
  }

  if (Object.keys(computeCache.list[monthTimestamp]).length === 0) {
    delete computeCache.list[monthTimestamp];
    computeCache.allMonthTimestamp = computeCache.allMonthTimestamp.filter(
      (item) => item !== monthTimestamp
    );
  }
};
