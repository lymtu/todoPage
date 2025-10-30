function processList(list, callback, onComplete) {
  const keys = Object.keys(list);
  let index = 0;

  function processNext(deadline) {
    while (index < keys.length && deadline.timeRemaining() > 1) {
      const key = keys[index];
      callback(key);
      index++;
    }

    if (index < keys.length) {
      requestIdleCallback(processNext);
    } else {
      onComplete();
    }
  }

  requestIdleCallback(processNext);
}

export { processList };
