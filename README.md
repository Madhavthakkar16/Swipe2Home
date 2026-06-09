# 🏠 Swipe2Home

A lightweight Chrome Extension ⏰ that calculates your expected clock-out time directly from Keka attendance logs.

Instead of manually calculating break durations and remaining work hours, Swipe2Home automatically reads your punch logs, computes actual break time, and tells you exactly when you can leave 🏠.

---

## 🚀 Features

* 📋 Automatic punch log detection from Keka
* ⏱️ Calculates actual break duration using IN/OUT logs
* ☕ Supports multiple breaks throughout the day
* 📍 Handles floor changes and location-based punch logs
* ⚙️ Configurable working hours
* 🎯 One-click clock-out time calculation
* ⚡ Lightweight and fast
* 🔒 No data collection or external API calls

---

## ⚙️ How It Works

1. Reads your attendance logs from Keka
2. Identifies your first punch-in time
3. Calculates total break duration from all OUT → IN pairs
4. Adds your configured working hours
5. Displays your expected clock-out time

---

## 📦 Installation

### 🛠️ Method : Load Unpacked Extension

1. Download or clone this repository

```bash
git clone https://github.com/Madhavthakkar16/Swipe2Home.git
```

2. Open Chrome

3. Navigate to:

```text
chrome://extensions
```

4. Enable **Developer Mode**

5. Click **Load Unpacked**

6. Select the project folder

7. Pin the extension from the Chrome toolbar

8. Open Keka and click the extension icon

---

## 📖 Usage

1. Open your Keka attendance page
2. Click the Swipe2Home extension icon
3. If Keka is already open, refresh the page. Otherwise, open Keka and navigate to your attendance page.
4. The extension will automatically:

   * Load today's attendance logs
   * Calculate break duration
   * Calculate expected clock-out time
5. Optionally configure your required working hours

---

## ⚙️ Configuration

You can set your required working hours directly from the extension popup.

The setting is stored locally in your browser.

---

## 🗂️ Project Structure

```text
Swipe2Home/
│
├── manifest.json      # Chrome extension configuration
├── popup.html         # Extension UI
├── popup.js           # Popup logic and UI updates
├── content.js         # Keka attendance parsing & calculations
├── icon.png           # Extension icon
└── README.md
```

---

## 🔒 Privacy Policy

Swipe2Home does not:

* Collect user data
* Store attendance records
* Send information to external servers
* Use analytics or tracking

All calculations are performed locally inside your browser.

---

## 🏷️ Current Version

Version: 1.0.2

---

## 🤝 Contributing

Suggestions, bug reports, and improvements are always welcome.

Feel free to create an issue or submit a pull request.

---

## 👨‍💻 Author

Madhav Thakkar

Built to solve the daily question:

> "When can I go home today?" 😄
