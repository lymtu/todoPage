export const EventType = {
  INIT: "init",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear",
  UPDATE: "update",
};

const Event = {};
const Decorator = {};

for (const key in EventType) {
  Event[EventType[key]] = [];
  Decorator[EventType[key]] = [];
}

export const addEventListener = (type, cb, priority = 0) => {
  if (priority === 0) {
    Event[type].push({
      cb,
      priority,
    });
  } else {
    const lastPriorityIndex = Event[type].findIndex(
      (cb) => cb.priority < priority
    );
    if (lastPriorityIndex === -1) {
      Event[type].push({
        cb,
        priority,
      });
    } else {
      Event[type].splice(lastPriorityIndex - 1, 0, {
        cb,
        priority,
      });
    }
  }
};

// export const removeEventListener = (type, cb) => {
//   if (!Event[type]) {
//     return;
//   }
//   Event[type] = Event[type].filter((item) => item.cb !== cb);
// };

export const addDecorator = (typeList, cb, priority = 0) => {
  typeList.forEach((type) => {
    if (priority === 0) {
      Decorator[type].push({
        cb,
        priority,
      });
    } else {
      const lastPriorityIndex = Decorator[type].findIndex(
        (cb) => cb.priority < priority
      );
      if (lastPriorityIndex === -1) {
        Decorator[type].push({
          cb,
          priority,
        });
      } else {
        Decorator[type].splice(lastPriorityIndex - 1, 0, {
          cb,
          priority,
        });
      }
    }
  });
};

export const dispatchEvent = (type, data, oldData) => {
  if (!Event[type]) {
    return;
  }
  Event[type].forEach(({ cb }) => cb(data, oldData));
  Decorator[type].forEach(({ cb }) => cb(type, data));
};
