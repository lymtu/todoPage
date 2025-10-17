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
  synchronizeCache();
  setTodoUlPlaceholder();
  renderTodoList();
};

const updateDoneView = () => {
  synchronizeCache();
  setDoneUlPlaceholder();
  renderDoneList();
};

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

  dispatchEvent(EventType.ADD, {
    id: Date.now(),
    title: todo,
    completed: false,
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
    renderTodoList();
  });
});

doneListDom.addEventListener("scroll", () => {
  if (id) cancelIdleCallback(id);
  id = requestIdleCallback(() => {
    renderDoneList();
  });
});

addEventListener(EventType.ADD, (data) => {
  const count = addTodo(data);
  if (count === -1) return;
  todoCountDom.textContent = count;
  updateTodoView();
});

addEventListener(EventType.UPDATE, (data) => {
  const { todoCount, doneCount } = updateEventHandler(data);
  doneCountDom.textContent = doneCount;
  todoCountDom.textContent = todoCount;
});

addEventListener(EventType.DELETE, (data) => {
  const { todoCount, doneCount } = deleteEventHandler(data.id);
  updateTodoView();
  updateDoneView();
  doneCountDom.textContent = doneCount;
  todoCountDom.textContent = todoCount;
});

addEventListener(EventType.CLEAR, () => {
  clearStorage();
  clearEventHandler();
  updateDoneView();
  updateTodoView();
  doneCountDom.textContent = 0;
  todoCountDom.textContent = 0;
});

addDecorator([EventType.ADD, EventType.UPDATE, EventType.DELETE], () => {
  const store = getOriginStore();
  setStorage(store);
});

init().then(() => {
  renderTodoList();
  setTodoUlPlaceholder();
});
