import { isTodayDone } from "./time.js";
import { getStorage } from "./storage.js";
import { todoCountDom, doneCountDom } from "./domStore.js";
import { partialDeepClone } from "./deepClone.js";

const STORE = {
  todoList: {},
  todoCount: 0,
  doneList: {},
  doneCount: 0,
  todayDoneList: {},
  todayDoneCount: 0,
};

let STORE_CACHE = {};

export const getStore = () => STORE_CACHE;
export const getOriginStore = () => STORE;

export const synchronizeCache = () => {
  STORE_CACHE = partialDeepClone(STORE, 2);
  return STORE_CACHE;
};

export const init = async () => {
  const localStore = await getStorage();

  if (localStore) {
    STORE.todoList = localStore.todoList;
    STORE.todoCount = localStore.todoCount;
    STORE.doneList = localStore.doneList;
    STORE.doneCount = localStore.doneCount;

    Object.keys(STORE.doneList).forEach((id) => {
      if (isTodayDone(parseInt(id))) {
        STORE.todayDoneList[id] = STORE.doneList[id];
        STORE.todayDoneCount++;
      }
    });
  }

  todoCountDom.textContent = STORE.todoCount;
  doneCountDom.textContent = STORE.doneCount;
  synchronizeCache();
  return STORE_CACHE;
};

export const addTodo = (todo) => {
  if (todo.id in STORE.todoList) return -1;
  STORE.todoList[todo.id] = todo;
  STORE.todoCount++;
  return STORE.todoCount;
};

const deleteTodo = (id) => {
  if (id in STORE.todoList) {
    delete STORE.todoList[id];
    STORE.todoCount--;
    return 1;
  }
  return -1;
};

const deleteDone = (id) => {
  if (id in STORE.doneList) {
    delete STORE.doneList[id];
    STORE.doneCount--;
    return 1;
  }
  return -1;
};

export const updateEventHandler = (data) => {
  if (data.completed) {
    // 未完成 -> 完成
    const result = deleteTodo(data.id);

    if (result === 1 && !(data.id in STORE.doneList)) {
      STORE.doneList[data.id] = data;
      STORE.doneCount++;

      if (isTodayDone(data.id)) {
        STORE.todayDoneList[data.id] = data;
        STORE.todayDoneCount++;
      }
    }
  } else {
    // 完成 -> 未完成
    const result = deleteDone(data.id);
    if (result === 1 && data.id in STORE.todayDoneList) {
      delete STORE.todayDoneList[data.id];
      STORE.todayDoneCount--;
    }
    addTodo(data);
  }

  STORE_CACHE.doneList[data.id] &&
    (STORE_CACHE.doneList[data.id].completed = data.completed);

  STORE_CACHE.todayDoneList[data.id] &&
    (STORE_CACHE.todayDoneList[data.id].completed = data.completed);

  STORE_CACHE.todoList[data.id] &&
    (STORE_CACHE.todoList[data.id].completed = data.completed);

  return {
    todoCount: STORE.todoCount,
    doneCount: STORE.doneCount,
  };
};

export const deleteEventHandler = (id) => {
  const result_deleteTodo = deleteTodo(id);
  if (result_deleteTodo === -1 && id in STORE.doneList) {
    const result_deleteDone = deleteDone(id);
    if (result_deleteDone === 1 && id in STORE.todayDoneList) {
      delete STORE.todayDoneList[id];
      STORE.todayDoneCount--;
    }
  }

  return {
    todoCount: STORE.todoCount,
    doneCount: STORE.doneCount,
  };
};

export const clearEventHandler = () => {
  STORE.todoList = {};
  STORE.todoCount = 0;
  STORE.doneList = {};
  STORE.doneCount = 0;
  STORE.todayDoneList = {};
  STORE.todayDoneCount = 0;
};
