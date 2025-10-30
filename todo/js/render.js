import { dispatchEvent, EventType } from "./utils/reducer.js";
import {
  todoListDom,
  doneListDom,
  todoListUl,
  doneListUl,
  todoUlPlaceholder,
  doneUlPlaceholder,
  deleteTodoDialogDom,
  deleteTodoInputDom,
  deleteTodoTitleDom,
} from "./utils/domStore.js";
import { partialDeepClone } from "./utils/deepClone.js";

const createTodoItemElement = (todo) => {
  const li = document.createElement("li");
  // li.dataset.id = todo.id.toString(36);
  li.dataset.completed = todo.completed;
  if (todo.completed) {
    li.dataset.completedDate = todo.completedDate;
  }
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "completed";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    li.dataset.completed = checkbox.checked;

    let completedDate = null;

    if (checkbox.checked) {
      completedDate = new Date().getTime();
      li.dataset.completedDate = completedDate;
    } else {
      completedDate = parseInt(li.dataset.completedDate);
      delete li.dataset.completedDate;
    }

    dispatchEvent(
      EventType.UPDATE,
      {
        ...todo,
        completed: checkbox.checked,
        completedDate: checkbox.checked ? completedDate : null,
      },
      partialDeepClone(
        {
          ...todo,
          completedDate: checkbox.checked ? null : completedDate,
        },
        1
      )
    );
  });
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = todo.title;
  const more = document.createElement("div");
  more.className = "more";
  const control = document.createElement("div");
  control.className = "control";
  const moreImg = document.createElement("img");
  moreImg.src = "./assets/more.svg";

  const time = document.createElement("div");
  time.className = "time diminish";
  time.textContent = new Date(todo.id).toLocaleString();

  const menu = document.createElement("div");
  menu.className = "menu";
  const deleteBtn = document.createElement("button");
  deleteBtn.title = "删除";
  const deleteSvg = document.createElement("img");
  deleteSvg.src = "./assets/delete.svg";
  deleteSvg.alt = "delete";
  const deleteText = document.createElement("span");
  deleteText.textContent = "删除";
  deleteBtn.addEventListener("click", () => {
    deleteTodoInputDom.value = todo.id;
    deleteTodoTitleDom.textContent = todo.title;
    deleteTodoDialogDom.show();
  });
  deleteBtn.append(deleteSvg, deleteText);
  menu.append(deleteBtn);
  control.append(moreImg, menu);
  more.append(control, time);
  li.append(checkbox, title, more);
  return li;
};

let listClientHeight = 0;

const setTodoUlPlaceholder = (todoCountAndTodayDoneCount) => {
  todoUlPlaceholder.style.height =
    todoCountAndTodayDoneCount * listClientHeight + "px";
};

const setDoneUlPlaceholder = (doneCount) => {
  doneUlPlaceholder.style.height = doneCount * listClientHeight + "px";
};

const renderTodoList = (store) => {
  const todoList = store.todoList;
  const todayDoneList = store.todayDoneList;
  const todoKeys = Object.keys(todoList).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const todayDoneKeys = Object.keys(todayDoneList).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  todoListUl.replaceChildren();
  if (listClientHeight === 0) {
    let testDom;
    if (todoKeys.length !== 0) {
      testDom = createTodoItemElement(todoList[todoKeys[0]]);
    } else if (todayDoneKeys.length !== 0) {
      testDom = createTodoItemElement(todayDoneList[todayDoneKeys[0]]);
    } else {
      return;
    }

    todoListUl.replaceChildren(testDom);
    listClientHeight = testDom.clientHeight;
    testDom.remove();
  }
  const renderCount = Math.ceil(todoListDom.clientHeight / listClientHeight);
  const renderStartIndex = Math.floor(todoListDom.scrollTop / listClientHeight);

  if (renderStartIndex < 0) return;

  if (renderStartIndex < todoKeys.length) {
    for (let i = renderStartIndex; i < renderCount + renderStartIndex; i++) {
      const todoId = todoKeys[i];
      if (!todoId) break;
      const todo = todoList[todoId];
      const todoDom = createTodoItemElement(todo);
      todoDom.style.top = `${i * listClientHeight}px`;
      todoListUl.appendChild(todoDom);
    }
  }

  const renderDoneCount = renderCount - (todoKeys.length - renderStartIndex);
  if (renderDoneCount > 0) {
    for (
      let i = renderDoneCount - 1;
      i > renderCount - renderStartIndex - 1;
      i--
    ) {
      const todoId = todayDoneKeys[i];
      if (!todoId) break;
      const todo = todayDoneList[todoId];
      const todoDom = createTodoItemElement(todo);
      todoDom.style.top = `${(i + todoKeys.length) * listClientHeight}px`;
      todoListUl.appendChild(todoDom);
    }
  }
};

const renderDoneList = (store) => {
  doneListUl.replaceChildren();
  const doneList = store.doneList;
  const doneKeys = Object.keys(doneList).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  if (doneKeys.length === 0) return;
  if (listClientHeight === 0) {
    const firstDone = doneKeys[0];
    if (!firstDone) return;
    const firstDoneDom = createTodoItemElement(doneList[firstDone]);
    doneListUl.replaceChildren(firstDoneDom);
    listClientHeight = firstDoneDom.clientHeight;
    firstDoneDom.remove();
  }
  const renderCount = Math.ceil(doneListDom.clientHeight / listClientHeight);
  const renderStartIndex = Math.floor(doneListDom.scrollTop / listClientHeight);

  if (renderStartIndex < 0) return;

  for (let i = renderStartIndex; i < renderCount + renderStartIndex; i++) {
    const doneId = doneKeys[i];
    if (!doneId) break;
    const done = doneList[doneId];
    const doneDom = createTodoItemElement(done);
    doneDom.style.top = `${i * listClientHeight}px`;
    doneListUl.appendChild(doneDom);
  }
};

export {
  renderTodoList,
  renderDoneList,
  setTodoUlPlaceholder,
  setDoneUlPlaceholder,
};
