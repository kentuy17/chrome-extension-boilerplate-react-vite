/**
 * Storage area type for persisting and exchanging data.
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#overview
 */
export let StorageType = /*#__PURE__*/function (StorageType) {
  StorageType["Local"] = "local";
  StorageType["Sync"] = "sync";
  StorageType["Managed"] = "managed";
  StorageType["Session"] = "session";
  return StorageType;
}({});

/**
 * Global access level requirement for the {@link StorageType.Session} Storage Area.
 * @implements Chromes [Session Access Level](https://developer.chrome.com/docs/extensions/reference/storage/#method-StorageArea-setAccessLevel)
 */
export let SessionAccessLevel = /*#__PURE__*/function (SessionAccessLevel) {
  SessionAccessLevel["ExtensionPagesOnly"] = "TRUSTED_CONTEXTS";
  SessionAccessLevel["ExtensionPagesAndContentScripts"] = "TRUSTED_AND_UNTRUSTED_CONTEXTS";
  return SessionAccessLevel;
}({});
/**
 * Sets or updates an arbitrary cache with a new value or the result of an update function.
 */
async function updateCache(valueOrUpdate, cache) {
  // Type guard to check if our value or update is a function
  function isFunction(value) {
    return typeof value === 'function';
  }

  // Type guard to check in case of a function, if its a Promise
  function returnsPromise(func) {
    // Use ReturnType to infer the return type of the function and check if it's a Promise
    return func instanceof Promise;
  }
  if (isFunction(valueOrUpdate)) {
    // Check if the function returns a Promise
    if (returnsPromise(valueOrUpdate)) {
      return await valueOrUpdate(cache);
    } else {
      return valueOrUpdate(cache);
    }
  } else {
    return valueOrUpdate;
  }
}

/**
 * If one session storage needs access from content scripts, we need to enable it globally.
 * @default false
 */
let globalSessionAccessLevelFlag = false;

/**
 * Checks if the storage permission is granted in the manifest.json.
 */
function checkStoragePermission(storageType) {
  if (chrome.storage[storageType] === undefined) {
    throw new Error(`Check your storage permission in manifest.json: ${storageType} is not defined`);
  }
}

/**
 * Creates a storage area for persisting and exchanging data.
 */
export function createStorage(key, fallback, config) {
  let cache = null;
  let listeners = [];
  const storageType = config?.storageType ?? StorageType.Local;
  const liveUpdate = config?.liveUpdate ?? false;

  // Set global session storage access level for StoryType.Session, only when not already done but needed.
  if (globalSessionAccessLevelFlag === false && storageType === StorageType.Session && config?.sessionAccessForContentScripts === true) {
    checkStoragePermission(storageType);
    chrome.storage[storageType].setAccessLevel({
      accessLevel: SessionAccessLevel.ExtensionPagesAndContentScripts
    });
    globalSessionAccessLevelFlag = true;
  }

  // Register life cycle methods
  const _getDataFromStorage = async () => {
    checkStoragePermission(storageType);
    const value = await chrome.storage[storageType].get([key]);
    return value[key] ?? fallback;
  };
  const _emitChange = () => {
    listeners.forEach(listener => listener());
  };
  const set = async valueOrUpdate => {
    cache = await updateCache(valueOrUpdate, cache);
    await chrome.storage[storageType].set({
      [key]: cache
    });
    _emitChange();
  };
  const subscribe = listener => {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  const getSnapshot = () => {
    return cache;
  };
  _getDataFromStorage().then(data => {
    cache = data;
    _emitChange();
  });

  // Listener for live updates from the browser
  async function _updateFromStorageOnChanged(changes) {
    // Check if the key we are listening for is in the changes object
    if (changes[key] === undefined) return;
    const valueOrUpdate = changes[key].newValue;
    if (cache === valueOrUpdate) return;
    cache = await updateCache(valueOrUpdate, cache);
    _emitChange();
  }

  // Register listener for live updates for our storage area
  if (liveUpdate) {
    chrome.storage[storageType].onChanged.addListener(_updateFromStorageOnChanged);
  }
  return {
    get: _getDataFromStorage,
    set,
    getSnapshot,
    subscribe
  };
}