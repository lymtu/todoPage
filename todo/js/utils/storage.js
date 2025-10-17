import {
  addEvent,
  createObjectStore,
  deleteEvent,
  readEvent,
  updateEvent,
} from "./indexDB.js";

const storeName = "todo";
const key = "todo";

createObjectStore(storeName, { keyPath: "name" });

export const getStorage = async () => {
  const result = await readEvent(storeName, key);

  if (result === undefined) {
    await addEvent(storeName, {
      name: key,
      store: {
        todoList: {},
        todoCount: 0,
        doneList: {},
        doneCount: 0,
      },
    });
  }

  return result ? result?.store : undefined;
};

export const setStorage = async (store) => {
  await updateEvent(storeName, {
    name: key,
    store: {
      todoList: store.todoList,
      todoCount: store.todoCount,
      doneList: store.doneList,
      doneCount: store.doneCount,
    },
  });
};

export const clearStorage = () => {
  deleteEvent(storeName, key);
};
