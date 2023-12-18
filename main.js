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

//baseWindow class definition
/**
 * Represents a base window with common window operations.
 */
class BaseWindow {
  constructor(title, rect, handle) {
    this.title = title;
    this.rect = rect;
    this.handle = handle;
  }
  //methods:
  //close the window
  close() {
    user32.SendMessageA(this.handle, WM_CLOSE, 0, 0);
  }
  //minimize the window
  minimize() {
    user32.ShowWindow(this.handle, SW_MINIMIZE);
  }
  //maximize the window
  maximize() {
    user32.ShowWindow(this.handle, SW_MAXIMIZE);
  }
  //restore the window
  restore() {
    user32.ShowWindow(this.handle, SW_RESTORE);
  }
  //show the window
  show() {
    user32.ShowWindow(this.handle, SW_SHOW);
  }
  //hide the window
  hide() {
    user32.ShowWindow(this.handle, SW_HIDE);
  }
  //focus the window
  focus() {
    const result = user32.SetForegroundWindow(this.handle);
    if (!result) {
      throw new Error("Unable to focus window");
    }
  }
  //resize the window to the given width and height
  resizeTo(width, height) {
    const result = user32.SetWindowPos(
      this.handle,
      HWND_TOP,
      this.rect.left,
      this.rect.top,
      width,
      height,
      0
    );
    if (!result) {
      throw new Error("Unable to resize window");
    }
  }
  //resize the window by the given width and height
  resizeOffset(widthOffset, heightOffset) {
    const result = user32.SetWindowPos(
      this.handle,
      HWND_TOP,
      this.rect.left,
      this.rect.top,
      this.rect.right + widthOffset,
      this.rect.bottom + heightOffset,
      0
    );
    if (!result) {
      throw new Error("Unable to resize window");
    }
  }
  //move the window to the given x,y coordinates
  moveTo(x, y) {
    const result = user32.SetWindowPos(
      this.handle,
      HWND_TOP,
      x,
      y,
      this.rect.right - this.rect.left,
      this.rect.bottom - this.rect.top,
      0
    );
  }
  //move the window by the given x,y coordinates
  moveOffset(xOffset, yOffset) {
    const result = user32.SetWindowPos(
      this.handle,
      HWND_TOP,
      this.rect.left + xOffset,
      this.rect.top + yOffset,
      this.rect.right - this.rect.left,
      this.rect.bottom - this.rect.top,
      0
    );
  }
  //properties:
  //get the resolution of the window (width, height)
  get resolution() {
    return {
      width: this.rect.right - this.rect.left,
      height: this.rect.bottom - this.rect.top,
    };
  }
  //get the x coordinate of the window
  get x() {
    return this.rect.left;
  }
  //get the y coordinate of the window
  get y() {
    return this.rect.top;
  }
  //boolean properties:
  //check if the window is maximized
  get isMaximized() {
    return user32.IsZoomed(this.handle) != 0;
  }
  //check if the window is minimized
  get isMinimized() {
    return user32.IsIconic(this.handle) != 0;
  }
  //check if the window is active
  get isActive() {
    return this.handle == getActiveWindowHWnd();
  }
  //check if the window is visible
  get isVisible() {
    return user32.IsWindowVisible(this.handle);
  }
}
class Rect {
  constructor(left = 0, top = 0, right = 0, bottom = 0) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }
}

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
  SendMessageA: ["long", ["long", "uint", "long", "long"]],
  ShowWindow: ["bool", ["long", "int"]],
  SetForegroundWindow: ["bool", ["long"]],
  SetWindowPos: ["bool", ["long", "long", "int", "int", "int", "int", "uint"]],
  IsZoomed: ["bool", ["long"]],
  IsIconic: ["bool", ["long"]],
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
  const windows = new Array(); // Use a fixed-size array
  let index = 0;

  const enumWindowsCallback = ffi.Callback(
    "bool",
    ["long", "long"],
    function (hWnd, lParam) {
      if (user32.IsWindowVisible(hWnd)) {
        windows[index++] = new BaseWindow(
          getWindowName(hWnd),
          getRect(hWnd),
          hWnd
        );
      }
      return true;
    },
    "stdcall"
  );

  user32.EnumWindows(enumWindowsCallback, 0);
  return windows;
}

// Function to retrieve the details of the currently active window.
function getActiveWindow() {
  const activeWindow = getActiveWindowHWnd();
  if (activeWindow === 0) return "No active window";
  return new BaseWindow(
    getWindowName(activeWindow),
    getRect(activeWindow),
    activeWindow
  );
}

// Function to retrieve the details of the window which are at the given x,y coordinates.
function getWindowsAt(x, y) {
  let windowsAtXY = [];
  for (let window of getAllWindows()) {
    if (checkIfInBounds(x, y, window.rect)) {
      windowsAtXY.push(window);
    }
  }
  return windowsAtXY;
}

// Function to retrieve the details of windows which have the given input as part of their name.
function getWindowsWithTitle(inputTitle) {
  let windows = getAllWindows();
  let windowsWithTitle = [];
  for (let window of windows) {
    if (
      window.title
        .trim()
        .toLowerCase()
        .includes(inputTitle.trim().toLowerCase())
    ) {
      windowsWithTitle.push(window);
    }
  }
  return windowsWithTitle;
}

console.log(getAllTitles());
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
  return new Rect(
    rect.readInt32LE(0),
    rect.readInt32LE(4),
    rect.readInt32LE(8),
    rect.readInt32LE(12)
  );
}

//check if the x,y coordinates are within the bounds of the rect
function checkIfInBounds(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

// Function to retrieve the handle of the currently active window.
function getActiveWindowHWnd() {
  return user32.GetForegroundWindow();
}

//exporting the functions
if (process.env.npm_lifecycle_event === "test") {
  module.exports = {
    getAllWindows,
    getAllTitles,
    getActiveWindowTitle,
    getCursorPosition,
    getActiveWindow,
    getWindowsAt,
    getWindowsWithTitle,
    BaseWindow,
  };
} else {
  module.exports = {
    getAllTitles,
    getActiveWindowTitle,
    getCursorPosition,
    getAllWindows,
    getActiveWindow,
    getWindowsAt,
    getWindowsWithTitle,
  };
}
