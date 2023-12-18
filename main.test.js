const gw = require("./main.js");

test("get all active windows", () => {
  expect(gw.getAllWindows()).not.toBeNull();
  expect(gw.getAllWindows()).not.toBeUndefined();
  expect(gw.getAllWindows()) instanceof Array;
  for (let window of gw.getAllWindows()) {
    expect(window) instanceof gw.BaseWindow;
  }
});

test("get all active window titles", () => {
  expect(gw.getAllTitles()).not.toBeNull();
  expect(gw.getAllTitles()).not.toBeUndefined();
  expect(gw.getAllTitles()) instanceof Array;
  for (let title of gw.getAllTitles()) {
    expect(title) instanceof String;
  }
});

test("get active window title", () => {
  expect(gw.getActiveWindowTitle()).not.toBeNull();
  expect(gw.getActiveWindowTitle()).not.toBeUndefined();
  expect(gw.getActiveWindowTitle()) instanceof String;
});

test("get cursor position", () => {
  expect(gw.getCursorPosition()).not.toBeNull();
  expect(gw.getCursorPosition()).not.toBeUndefined();
  expect(gw.getCursorPosition()) instanceof Object;
  expect(gw.getCursorPosition().x) instanceof Number;
  expect(gw.getCursorPosition().y) instanceof Number;
});

test("get active window", () => {
  expect(gw.getActiveWindow()) instanceof gw.BaseWindow;
});

test("get window at position", () => {
  expect(gw.getWindowsAt(0, 0)) instanceof Array;
  for (let window of gw.getWindowsAt(0, 0)) {
    expect(window) instanceof gw.BaseWindow;
  }
});

test("get window by title", () => {
  expect(gw.getWindowsWithTitle("chrome")) instanceof Array;
  for (let window of gw.getWindowsWithTitle("chrome")) {
    expect(window) instanceof gw.BaseWindow;
  }
});
