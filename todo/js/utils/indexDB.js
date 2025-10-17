const dbName = "todoListDB";
const version = 3;

const dbCollection = () => indexedDB.open(dbName, version);

export function createObjectStore(objectStoreName, config) {
  const db = dbCollection();
  db.onupgradeneeded = (event) => {
    const requset = event.target.result;
    if (!requset.objectStoreNames.contains(objectStoreName)) {
      requset.createObjectStore(objectStoreName, config);
      console.log(objectStoreName, "created successfully");
    }
  };
}

export function readEvent(objectStoreName, key) {
  const db = dbCollection();
  return new Promise((resolve, reject) => {
    db.onsuccess = (e) => {
      const result = e.target.result
        .transaction(objectStoreName)
        .objectStore(objectStoreName)
        .get(key);

      result.onsuccess = (e) => {
        resolve(e.target.result);
      };

      result.onerror = (e) => {
        console.error(e);
        reject(e.target.error);
      };
    };
  });
}

export function addEvent(objectStoreName, data) {
  const db = dbCollection();

  return new Promise((resolve, reject) => {
    db.onsuccess = (e) => {
      const requset = e.target.result
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName)
        .add(data);

      requset.onsuccess = (e) => {
        resolve(e.target);
      };

      requset.onerror = (e) => {
        console.error(e);
        reject(e.target.error);
      };
    };
  });
}

export function updateEvent(objectStoreName, data) {
  const db = dbCollection();

  return new Promise((resolve, reject) => {
    db.onsuccess = (e) => {
      const requset = e.target.result
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName)
        .put(data);
      requset.onsuccess = (e) => {
        resolve(e.target);
      };
      requset.onerror = (e) => {
        console.error(e);
        reject(e.target.error);
      };
    };
  });
}

export function deleteEvent(objectStoreName, key) {
  const db = dbCollection();
  return new Promise((resolve, reject) => {
    db.onsuccess = (e) => {
      const requset = e.target.result
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName)
        .delete(key);

      requset.onsuccess = (e) => {
        resolve(e.target);
      };

      requset.onerror = (e) => {
        console.error(e);
        reject(e.target.error);
      };
    };
  });
}
