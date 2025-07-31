# Todo List Web App

This is a simple Todo List application built using **HTML**, **Tailwind CSS**, and **JavaScript (ES6)**. It uses the DummyJSON API to manage todos through real API calls.

## ✨ Features

- ✅ View todos (with pagination)
- ➕ Add new todos (POST to API)
- 🔍 Search todos by content
- 📅 Filter todos by date range
- ⏳ Loading states & error messages
- 💾 Todos added by user
- 🧠 Built with Fetch API and Tailwind CSS

## 📁 Tech Stack

- **HTML + Tailwind CSS** (via CDN)
- **Vanilla JavaScript** (ES6 modules)
- **Fetch API** for HTTP requests
- **DummyJSON API** as backend

## 🧩 Functionality

- Fetches todos from `https://dummyjson.com/todos`
- Add new todos via `POST /todos/add`
- Each todo can be marked as complete
- User-added todos are assigned custom IDs starting from 255
- Pagination: 10 todos per page
- Filter by keyword or date
- Handles errors and shows loading spinners

## 🚀 How to Run

1. Clone this repo
2. Open `index.html` in your browser
3. Start managing your tasks!

You can also deploy it easily on GitHub Pages or Netlify.

## 📦 Folder Structure

```
📁 /public
├─ index.html
├─ script.js
└─ style.css
```

## 🌐 API Integration

This app integrates with the [DummyJSON API](https://dummyjson.com/) for todo management:

- **GET** `/todos` - Fetch all todos
- **POST** `/todos/add` - Add new todo

## 🎨 Styling

The application uses Tailwind CSS for responsive design and modern UI components. The interface is clean, minimal, and mobile-friendly.

## 📱 Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers

