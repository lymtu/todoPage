import {
  addDecorator,
  addEventListener,
  dispatchEvent,
  EventType,
} from "./utils/reducer.js";
import {
  renderTodoList,
  renderDoneList,
  setTodoUlPlaceholder,
  setDoneUlPlaceholder,
} from "./render.js";

import { clearStorage, setStorage } from "./utils/storage.js";

import {
  addTodo,
  clearEventHandler,
  deleteEventHandler,
  getOriginStore,
  getStore,
  init,
  synchronizeCache,
  updateEventHandler,
} from "./utils/store.js";

import {
  todoCountTitleDom,
  doneCountTitleDom,
  addTodoFormDom,
  addTodoDialogDom,
  todoListDom,
  doneListDom,
  deleteTodoFormDom,
  deleteTodoDialogDom,
  todoCountDom,
  doneCountDom,
  addTodoFormInputDom,
  clearAllFormDom,
  clearAllDialogDom,
  todoContainerDom,
  showCalendarBtnDom,
  mainDom,
} from "./utils/domStore.js";

const updateTodoView = () => {
  const store = synchronizeCache();
  setTodoUlPlaceholder(store.todoCount + store.todayDoneCount);
  renderTodoList(store);
};

const updateDoneView = () => {
  const store = synchronizeCache();
  setDoneUlPlaceholder(store.doneCount);
  renderDoneList(store);
};

window.addEventListener("resize", () => {
  const store = getStore();
  renderTodoList(store);
  renderDoneList(store);
  setTodoUlPlaceholder(store.todoCount + store.todayDoneCount);
  setDoneUlPlaceholder(store.doneCount);
});

showCalendarBtnDom.addEventListener("click", () => {
  const exist = mainDom.classList.contains("calendar");
  if (exist) return;
  mainDom.classList.add("calendar");
});

addTodoFormDom.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const todo = formData.get("todo");
  if (!todo) {
    addTodoFormInputDom.focus();
    return;
  }

  const date = Date.now();

  dispatchEvent(EventType.ADD, {
    id: date,
    title: todo,
    completed: false,
    date,
    completedDate: null,
  });
  e.target.reset();
  addTodoDialogDom.close();
});

deleteTodoFormDom.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const id = formData.get("todoId");
  if (!id) return;
  dispatchEvent(EventType.DELETE, {
    id,
  });
  deleteTodoDialogDom.close();
});

clearAllFormDom.addEventListener("submit", (e) => {
  e.preventDefault();
  dispatchEvent(EventType.CLEAR);
  clearAllDialogDom.close();
});

todoCountTitleDom.addEventListener("click", (e) => {
  const exist = todoContainerDom.classList.contains("done");
  if (!exist) return;
  todoContainerDom.classList.remove("done");
  e.target.scrollTo({ top: 0, behavior: "smooth" });
  updateTodoView();
});

doneCountTitleDom.addEventListener("click", (e) => {
  const exist = todoContainerDom.classList.contains("done");
  if (exist) return;
  todoContainerDom.classList.add("done");
  e.target.scrollTo({ top: 0, behavior: "smooth" });
  updateDoneView();
});

let id = null;

todoListDom.addEventListener("scroll", () => {
  if (id) cancelIdleCallback(id);
  id = requestIdleCallback(() => {
    const store = getStore();
    renderTodoList(store);
  });
});

doneListDom.addEventListener("scroll", () => {
  if (id) cancelIdleCallback(id);
  id = requestIdleCallback(() => {
    const store = getStore();
    renderDoneList(store);
  });
});

addEventListener(EventType.INIT, (data) => {
  renderTodoList(data);
  setTodoUlPlaceholder(data.todoCount + data.todayDoneCount);
});

addEventListener(EventType.ADD, (data) => {
  const count = addTodo(data);
  if (count === -1) return;
  todoCountDom.textContent = count;
  updateTodoView();
},1);

addEventListener(EventType.UPDATE, (data) => {
  const { todoCount, doneCount } = updateEventHandler(data);
  doneCountDom.textContent = doneCount;
  todoCountDom.textContent = todoCount;
},1);

addEventListener(EventType.DELETE, (data) => {
  const { todoCount, doneCount } = deleteEventHandler(data.id);
  updateTodoView();
  updateDoneView();
  doneCountDom.textContent = doneCount;
  todoCountDom.textContent = todoCount;
},1);

addEventListener(
  EventType.CLEAR,
  () => {
    clearStorage();
    clearEventHandler();
    updateDoneView();
    updateTodoView();
    doneCountDom.textContent = 0;
    todoCountDom.textContent = 0;
  },
  1
);

addDecorator([EventType.ADD, EventType.UPDATE, EventType.DELETE], () => {
  const store = getOriginStore();
  setStorage(store);
});

init().then((data) => {
  dispatchEvent(EventType.INIT, data);
});
