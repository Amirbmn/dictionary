# 📖 persDic — English-Persian Dictionary

**persDic** is a simple and modern English-Persian dictionary web application designed for fast word lookup and an easy-to-use interface.

The project includes two approaches for handling dictionary data:

* **JSON-based dictionary** — searches directly through the local `dictionary.json` dataset.
* **MySQL-based dictionary** — uses a Node.js/Express backend to query dictionary data from a MySQL database.

## ✨ Features

*  Search English words and find their Persian meanings
*  Real-time search suggestions
*  Keyboard navigation with `Arrow Up`, `Arrow Down`, and `Enter`
*  Display definitions, Persian meanings, pronunciation, part of speech, and examples
*  Light/Dark theme with saved preference
*  Responsive design for desktop and mobile screens
*  Loading and error states
*  Modern UI with animations, gradients, and responsive cards

## 🛠️ Technologies

### Frontend

* HTML5
* CSS3
* JavaScript
* Google Fonts — Lora & Inter

### Backend

* Node.js
* Express.js
* MySQL
* MySQL2
* CORS

## 📁 Project Structure

```text
dictionary/
│
├── dictionary/
│   ├── dictionary.html
│   ├── dictionary.json
│   ├── script.js
│   ├── server.js
│   └── style.css
│
└── sql-dictionary/
    ├── dictionary.html
    ├── dictionary.json
    ├── script.js
    ├── server.js
    └── style.css
```

### `dictionary/`

The standalone version uses `dictionary.json` as its dictionary dataset. The frontend loads the data and provides word searching, suggestions, and detailed results.

### `sql-dictionary/`

The database-backed version communicates with an Express server through:

The server queries MySQL and returns dictionary results in a format that the frontend can display.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Amirbmn/dictionary.git
cd dictionary
```

### 2. Install backend dependencies

For the MySQL version:

```bash
npm install express mysql2 cors
```

### 3. Configure MySQL

Create a MySQL database named:

```text
persdic
```

Then configure the database connection in `server.js` according to your local MySQL setup.



### 4. Start the server

```bash
node server.js
```

The API runs on:

```text
http://localhost:3000
```

You can test the dictionary endpoint with:

```text
http://localhost:3000/words?q=hello
```

### 5. Open the frontend

Open `dictionary.html` in your browser through a local web server.

For example, with VS Code, you can use **Live Server**.

## 🔍 How It Works

The user enters a word into the search field.

```text
User Input
    ↓
Search / Suggestions
    ↓
Dictionary Data
    ↓
Word Details
    ↓
Persian Meaning + Definition + Examples
```

The frontend uses JavaScript to handle searching, suggestions, keyboard interaction, theme switching, loading states, and result rendering.

For the SQL version, searches are sent to the Express API, which queries MySQL and returns the matching words to the frontend.

## 🎯 Project Goals

This project was built to practice and demonstrate:

* Frontend web development
* Responsive UI design
* JavaScript DOM manipulation
* Asynchronous API requests
* REST API fundamentals
* Node.js and Express
* MySQL database integration
* Connecting a frontend application to a backend service

