
# JsGetWindow

A cross platform module to obtain GUI information and controlling application's windows. Based on the pyGetWindow module.

Still under development. Currently only the Windows platform is implemented.



## Installation

Install my-project with npm

```bash
  npm i jsgetwindow
```
    
## API Reference

#### Functions

| Function Name | Output | Description |
| :------------- | :---- | :---------- |
| `getAllTitles()` | `String[]` | Retrieves titles of all visible windows. |
| `getAllWindows()` | `BaseWindow[]` | Retrieves details of all visible windows. |
| `getActiveWindow()` | `BaseWindow` | Retrieves details of the currently active window. |
| `getActiveWindowTitle()` | `String` | Retrieves the title of the currently active window. |
| `getCursorPosition()` | `{ x: number, y: number }` | Retrieves the position of the cursor. |
| `getWindowsAt(x:number, y:number)` | `BaseWindow[]` | Retrieves details of windows at the given coordinates. |
| `getWindowsWithTitle(title:String)` | `BaseWindow[]` | Retrieves details of windows with the specified title. |


#### Window Methods: 

```
const window = getActiveWindow(); //BaseWindow object
window.close();
```

| Method | Description |
| :-------- | :---------- |
| `close()` | Closes the window. |
| `minimize()` | Minimizes the window. |
| `maximize()` | Maximizes the window. |
| `restore()` | Restores the window. |
| `show()` | Shows the window. |
| `hide()` | Hides the window. |
| `focus()` | Focuses on the window. |
| `resizeTo(width:number, height:number)` | Resizes the window to the given width and height. |
| `resizeOffset(widthOffset:number, heightOffset:number)` | Resizes the window by the given width and height offsets. |
| `moveTo(x:number, y:number)` | Moves the window to the given x, y coordinates. |
| `moveOffset(xOffset:number, yOffset:number)` | Moves the window by the given x, y offsets. |

#### Window Properties

```
const window = getActiveWindow(); //BaseWindow object
console.log(window.isActive); // true
```

| Property | Output | Description |
| :-------- | :----- | :---------- |
| `resolution` | `{ width: number, height: number }` | Gets the resolution of the window (width, height). |
| `x` | `number` | Gets the x coordinate of the window. |
| `y` | `number` | Gets the y coordinate of the window. |
| `isMaximized` | `boolean` | Checks if the window is maximized. |
| `isMinimized` | `boolean` | Checks if the window is minimized. |
| `isActive` | `boolean` | Checks if the window is active. |
| `isVisible` | `boolean` | Checks if the window is visible. |


BaseWindow object
```
{

    title: String,
    rect: Rect {
        left: number,
        top: number,
        right: number,
        bottom: number
    },
    handle: number

}
```
## Function Example

```
> const gw = require("jsGetWindow");
undefined

> gw.getAllTitles();
[ 'new.js - test - Visual Studio Code',  'readme.so - Google Chrome', 'main.js - libProj - Visual Studio Code', 'Hannibal (2013) - S01E12 - Relevés (1080p BluRay x265 RCVR).mkv - PotPlayer', 'Realtek Audio Console', 'Command Prompt - py  reader1.py',  'Settings',  'Settings', 'Windows Input Experience' 'Program Manager' ]

> gw.getActiveWindow()
BaseWindow {
  title: 'new.js - test - Visual Studio Code',
  rect: Rect { left: -7, top: -7, right: 1714, bottom: 920 },
  handle: 328462
}

> gw.getWindowsWithTitle("chrome")
[
BaseWindow {
    title: 'woustachemaxd/JsGetWindow - Google Chrome',
    rect: Rect { left: -7, top: -7, right: 1714, bottom: 920 },
    handle: 198404
  },
    BaseWindow {
    title: 'Toby - Google Chrome',
    rect: Rect { left: -7, top: -7, right: 1714, bottom: 920 },
    handle: 2361776
  }
]

> gw.getActiveWindow().title
'new.js - test - Visual Studio Code'

> gw.getAllWindows();
[
  BaseWindow {
    title: 'new.js - test - Visual Studio Code',
    rect: Rect { left: -7, top: -7, right: 1714, bottom: 920 },
    handle: 328462
  },
  BaseWindow {
    title: 'readme.so - Google Chrome',
    rect: Rect { left: -7, top: -7, right: 1714, bottom: 920 },
    handle: 198404
  },
    ...
  BaseWindow {
    title: 'Program Manager',
    rect: Rect { left: 0, top: 0, right: 1707, bottom: 960 },
    handle: 65942
  }
]

>
```


## Method and Properties Example

```
> chromeWindow = gw.getWindowsWithTitle("chrome")[0]
> chromeWindow.isMaximized
False
> chromeWindow.maximize()
> chromeWindow.isMaximized
True
> chromeWindow.minimize()
> chromeWindow.restore()
> chromeWindow.activate()
> chromeWindow.resizeOffset(10, 10) # increase by 10, 10
> chromeWindow.resizeTo(100, 100) # set size to 100x100
> chromeWindow.moveOffset(10, 10) # move 10 pixels right and 10 down
> chromeWindow.moveTo(10, 10) # move window to 10, 10
> chromeWindow.close()
```