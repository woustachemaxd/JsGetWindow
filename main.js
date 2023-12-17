// Importing the ffi library for interfacing with native functions.
const ffi = require("ffi-napi");

// Constants for various window states and messages.
const SW_MINIMIZE = 6;
const SW_MAXIMIZE = 3;
const SW_HIDE = 0;
const SW_SHOW = 5;
const SW_RESTORE = 9;
const HWND_TOP = 0;
const WM_CLOSE = 0x0010;

// Define a library object for user32.dll functions using ffi.
const user32 = ffi.Library("user32", {
  EnumWindows: ["bool", ["pointer", "int32"]],
  GetWindowTextW: ["int", ["int", "string", "int"]],
  GetWindowTextLengthW: ["int", ["int"]],
  IsWindowVisible: ["bool", ["int"]],
  GetForegroundWindow: ["long", []],
  GetCursorPos: ["bool", ["pointer"]],
  FindWindowW: ["long", ["string"]],
  GetWindowRect: ["bool", ["long", "void*"]],
});

// Function to retrieve titles of all visible windows.
function getAllTitles() {
  let titles = [];
  const enumWindowsCallback = ffi.Callback(
    "bool",
    ["long", "long"],
    function (hWnd, lParam) {
      if (user32.IsWindowVisible(hWnd)) {
        titles.push(getWindowName(hWnd));
      }
      return true;
    }
  );
  user32.EnumWindows(enumWindowsCallback, 0);
  return titles;
}

// Function to retrieve the title of the currently active window.
function getActiveWindowTitle() {
  const activeWindow = getActiveWindowHWnd();
  if (activeWindow === 0) return "No active window";
  return getWindowName(activeWindow);
}

//Function to retrieve the position of the cursor.
function getCursorPosition() {
  const pointBuffer = Buffer.alloc(8);
  if (user32.GetCursorPos(pointBuffer)) {
    const x = pointBuffer.readInt32LE(0);
    const y = pointBuffer.readInt32LE(4);
    return { x, y: y };
  } else {
    return null;
  }
}

// Function to retrieve delails of all visible windows.
function getAllWindows() {
  let windows = [];
  const enumWindowsCallback = ffi.Callback(
    "bool",
    ["long", "long"],
    function (hWnd, lParam) {
      if (user32.IsWindowVisible(hWnd)) {
        windows.push({
          title: cleanTitle(getWindowName(hWnd)),
          rect: getRect(hWnd),
          handle: hWnd,
        });
      }
      return true;
    }
  );
  user32.EnumWindows(enumWindowsCallback, 0);
  return windows;
}

// Function to retrieve the details of the currently active window.
function getActiveWindow() {
  const activeWindow = getActiveWindowHWnd();
  if (activeWindow === 0) return "No active window";
  return {
    title: getWindowName(activeWindow),
    rect: getRect(activeWindow),
    handle: activeWindow,
  };
}

/////////////////////HELPER FUNCTIONS////////////////////

// Function to retrieve the title of a window from its handle.
function getWindowName(hWnd) {
  let length = user32.GetWindowTextLengthW(hWnd) + 1;
  let buffer = Buffer.alloc(length * 2);
  user32.GetWindowTextW(hWnd, buffer, length);
  return cleanTitle(buffer.toString("ucs2"));
}

// Function to clean the title of a window.
function cleanTitle(element) {
  return element.replace(/\u0000/g, "").trim();
}

// Function to retrieve the position of a window from its handle.
function getRect(hWnd) {
  const rect = Buffer.alloc(16);
  user32.GetWindowRect(hWnd, rect);
  return {
    left: rect.readInt32LE(0),
    top: rect.readInt32LE(4),
    right: rect.readInt32LE(8),
    bottom: rect.readInt32LE(12),
  };
}

// Function to retrieve the handle of the currently active window.
function getActiveWindowHWnd() {
  return user32.GetForegroundWindow();
}

// DONE:
//      getCursorPosition():
//      getActiveWindow(); with position
//      getAllWindows():
// TODO:
//METHODS:
//      getWindowsAt(x, y):
//      getWindowsWithTitle(title):
//WindowSpecific
//      close();
//      minimize();
//      maximize();
//      restore();
//      activate();
//      resizeTo(width, height);
//      resize(width, height); relative
//      moveTo(x, y);
//      move(x, y); relative
//      focus();
//      unfocus();
//      show();
//      hide();
//properties:
//      isMaximized();
//      isMinimized();
//      isActive();
//      isVisible();
//      title();
//      resolution(); >> width, height
//      x();
//      y();
