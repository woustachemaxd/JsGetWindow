const ffi = require("ffi-napi");

const SW_MINIMIZE = 6;
const SW_MAXIMIZE = 3;
const SW_HIDE = 0;
const SW_SHOW = 5;
const SW_RESTORE = 9;
const HWND_TOP = 0;
const WM_CLOSE = 0x0010;

const user32 = ffi.Library("user32", {
  EnumWindows: ["bool", ["pointer", "int32"]],
  GetWindowTextW: ["int", ["int", "string", "int"]],
  GetWindowTextLengthW: ["int", ["int"]],
  IsWindowVisible: ["bool", ["int"]],
});

function getAllTitles() {
  let titles = [];
  const enumWindowsCallback = ffi.Callback(
    "bool",
    ["long", "long"],
    function (hWnd, lParam) {
      if (user32.IsWindowVisible(hWnd)) {
        let length = user32.GetWindowTextLengthW(hWnd) + 1;
        let buffer = Buffer.alloc(length * 2);

        user32.GetWindowTextW(hWnd, buffer, length);

        titles.push(buffer.toString("ucs2"));
      }
      return true;
    }
  );
  user32.EnumWindows(enumWindowsCallback, 0);
  return titles;
}

console.log(getAllTitles().length);
