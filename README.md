# 📊 GraphQL

A modern, responsive personal profile dashboard built with HTML, JavaScript, and GraphQL. This app connects to the 01Edu GraphQL API to fetch and display user data such as XP, grades, skills, and audit stats. Hosted online for easy access and real-time updates.

## 🚀 Features
- Login with your 01Edu credentials
- View your profile information (name, campus, email, phone, etc.)
- Visualize XP, level, and audit ratio with interactive SVG graphs
- See your skill progress in a radar chart
- Responsive design for desktop and mobile
- Secure JWT-based authentication

## 🛠️ Tech Stack
- HTML5, CSS3 (responsive, modern UI)
- JavaScript (ES6 modules)
- GraphQL (01Edu API)
- SVG for data visualization

## 📦 Project Structure
```
├── app.js           # Main app logic
├── auth.js          # JWT authentication helpers
├── graphql.js       # GraphQL query logic
├── svg-graphs.js    # SVG graph rendering
├── index.html       # Dashboard page
├── login.html       # Login page
├── styles.css       # App styles
└── README.md        # Project documentation
```

## ⚡ Getting Started
1. **Clone the repository:**
   ```sh
   git clone https://learn.zone01oujda.ma/git/abouachani/graphQL.git
   cd graphQL
   ```
2. **Open `login.html` in your browser.**
3. **Login with your 01Edu credentials.**
4. **Explore your dashboard!**

> No build step required. All logic runs in the browser.

## 🔒 Authentication
- Uses JWT stored in localStorage for secure API access.
- Automatically redirects to login if the token is missing or expired.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
MIT
