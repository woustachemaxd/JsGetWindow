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
  return cleanArray(titles);
}

// Function to retrieve the title of the currently active window.
function getActiveWindowTitle() {
  const activeWindow = user32.GetForegroundWindow();
  if (activeWindow === 0) return "No active window";
  return getWindowName(activeWindow);
}

/////////////////////HELPER FUNCTIONS////////////////////

function getWindowName(hWnd) {
  let length = user32.GetWindowTextLengthW(hWnd) + 1;
  let buffer = Buffer.alloc(length * 2);

  user32.GetWindowTextW(hWnd, buffer, length);
  return buffer.toString("ucs2");
}

function cleanArray(array) {
  return array.map(function (element) {
    return element.replace(/\u0000/g, "");
  });
}

// TODO:
//METHODS:
//      getActiveWindow(); with position
//      getWindowsAt(x, y):
//      getWindowsWithTitle(title):
//      getAllWindows():
//      getCursorPosition():
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
