# TaskFlow — Blue, White & Gold To-Do App

A responsive task-management web application built with HTML, CSS, and vanilla JavaScript.

## Features
- Add tasks with a priority (High, Medium, Low)
- Edit task names
- Delete individual tasks
- Mark tasks completed or return them to in-progress
- Filter All Tasks, In Progress, and Completed
- Search tasks by name
- Live counters and a completion progress ring
- Automatically save tasks with browser Local Storage
- Clear completed tasks or delete all tasks
- Responsive layout for desktop, tablet, and mobile

## Run in Visual Studio Code
1. Extract the ZIP file.
2. Open Visual Studio Code.
3. Select **File → Open Folder** and choose the `TaskFlow-Blue-White-Gold` folder.
4. Open `index.html`.
5. If you have the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**. Otherwise, double-click `index.html` to open it in your browser.

## Publish on GitHub Pages
1. Sign in to GitHub and create a new public repository, such as `taskflow-to-do`.
2. In VS Code, open the project folder.
3. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository (or use Git source control to commit and push them).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Choose the `main` branch and `/ (root)` folder, then click **Save**.
7. Wait for GitHub Pages to publish the site. The published URL will appear in the Pages section.

## Notes
- Task data is stored in the browser's Local Storage on the device/browser where it was entered. It does not automatically sync between devices.
- Google Fonts are loaded online; the app still functions if the font service is unavailable.
- This is a front-end project and does not use a server or database.
