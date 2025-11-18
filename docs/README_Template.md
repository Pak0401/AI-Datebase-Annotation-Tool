# AI Dataset Annotation Tool (Basic Version) - Assignment 1

**Course:** Software Engineering and Professional Practice  
**Assignment:** Assignment 1 - Basic Web Application with AJAX and SQL  
**Group:** [Group Number]  
**Members:** [List all group members with student IDs]  
**Due Date:** 18-Nov-2025

## Project Overview

The AI Dataset Annotation Tool is a web application that allows users to upload images and add text labels for AI dataset creation. The application demonstrates the integration of front-end technologies (HTML, CSS, JavaScript) with back-end services (Node.js, Express) and database operations (SQLite with SQL queries).

### Key Features

- ✅ Upload image files (JPG, PNG, etc.)
- ✅ Add text labels to images
- ✅ View all labeled images in an organized gallery
- ✅ Edit and remove labels from images
- ✅ Delete images from the dataset
- ✅ Search and filter images by labels
- ✅ Responsive design for mobile and desktop

## Technology Stack

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Responsive design with Grid/Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features and AJAX
- **Fetch API**: Asynchronous server communication

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **SQLite3**: Lightweight database
- **Raw SQL**: Database queries without ORM

### Development Tools

- **Git**: Version control
- **GitHub/GitLab**: Repository hosting
- **VS Code**: Code editor (recommended)

## Installation and Setup

### Prerequisites

- Node.js (version 18.x or higher)
- Git
- A modern web browser

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone [your-repository-url]
   cd ai-dataset-annotation-tool
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Initialize the database**

   ```bash
   npm run init-db
   ```

4. **Start the application**

   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`

### Alternative Setup (Manual)

1. **Install Node.js dependencies**

   ```bash
   npm install express sqlite3 cors
   ```

2. **Create database tables**

   ```bash
   sqlite3 database/annotations.db < database/schema.sql
   ```

3. **Insert sample data**

   ```bash
   sqlite3 database/annotations.db < database/sample-data.sql
   ```

4. **Run the server**
   ```bash
   node server/server.js
   ```

## Project Structure

```
ai-dataset-annotation-tool/
├── public/                 # Frontend files
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   ├── js/
│   │   └── app.js         # Main JavaScript file
│   └── index.html         # Main HTML file
├── server/                # Backend files
│   ├── routes/
│   │   └── images.js      # Image API routes
│   ├── models/
│   │   └── database.js    # Database connection and queries
│   └── server.js          # Express server setup
├── database/              # Database files
│   ├── annotations.db    # SQLite database file
│   ├── schema.sql        # Database schema
│   └── sample-data.sql   # Sample data
├── docs/                  # Documentation
│   ├── AI_Usage_Declaration.md
│   └── Group_Collaboration_Log.md
├── package.json          # Node.js dependencies
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Get All Images

```http
GET /api/images
```

**Response:**

```json
[
  {
    "id": 1,
    "filename": "cat_001.jpg",
    "original_name": "my_cat.jpg",
    "file_path": "/uploads/images/cat_001.jpg",
    "file_size": 245760,
    "mime_type": "image/jpeg",
    "uploaded_at": "2025-10-14T10:00:00Z",
    "labels": [
      { "id": 1, "name": "cat", "confidence": 1.0 },
      { "id": 2, "name": "animal", "confidence": 1.0 }
    ]
  }
]
```

#### Get Image by ID

```http
GET /api/images/:id
```

#### Upload New Image

```http
POST /api/images
Content-Type: multipart/form-data

[image file]
```

#### Add Label to Image

```http
POST /api/images/:id/labels
Content-Type: application/json

{
  "label_name": "cat",
  "confidence": 1.0
}
```

#### Update Image Labels

```http
PUT /api/images/:id
Content-Type: application/json

{
  "labels": [
    {"name": "cat", "confidence": 1.0},
    {"name": "pet", "confidence": 0.9}
  ]
}
```

#### Delete Image

```http
DELETE /api/images/:id
```

#### Search Images by Label

```http
GET /api/images/search?label=cat&confidence=0.8
```

## Database Schema

### Tables

#### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Categories Table

```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATETIME,
    user_id INTEGER,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## Individual Contributions

### Pak Hoi Yi  - s24516778

**Primary Responsibilities:**

- coding and debug

**Code Contributions:**

- server and public folder

**Git Commits:**

- [List your significant commits]

**Challenges Faced:**

- [Describe any difficulties you encountered]

**Learning Outcomes:**

- Learned how to build a complete full-stack web application integrating Express, SQLite, and JavaScript.
  Designed and implemented the main RESTful APIs, backend logic, and CRUD operations.
  Connected frontend pages with backend APIs using fetch() and dynamic DOM rendering.

## Development Process

### Week 1: Planning and Setup

- [ ] Project requirements analysis
- [ ] Database design
- [ ] UI/UX wireframing
- [ ] Development environment setup

### Week 2: Backend Development

- [ ] Express server setup
- [ ] Database schema implementation
- [ ] API endpoint development
- [ ] Basic CRUD operations

### Week 3: Frontend Development

- [ ] HTML structure creation
- [ ] CSS styling and responsive design
- [ ] JavaScript functionality
- [ ] AJAX integration

### Week 4: Integration and Testing

- [ ] Frontend-backend integration
- [ ] Testing and debugging
- [ ] Code review and optimization
- [ ] Documentation completion

### Week 5: Final Review and Submission

- [ ] Final testing
- [ ] Code cleanup
- [ ] Documentation review
- [ ] Submission preparation

## Testing

### Manual Testing Checklist

- [ ] All CRUD operations work correctly
- [ ] AJAX calls handle errors gracefully
- [ ] Form validation works on client side
- [ ] Responsive design works on different screen sizes
- [ ] Database operations are secure (no SQL injection)
- [ ] Error messages are user-friendly

### Test Data

The application includes sample data with:

- 3 users (admin, user1, user2)
- 3 categories (Work, Personal, Study)
- 10+ sample tasks with different statuses and priorities

## Known Issues and Limitations

1. **Authentication**: No user authentication system implemented
2. **File Uploads**: No file attachment feature for tasks
3. **Real-time Updates**: No WebSocket implementation for live updates
4. **Advanced Search**: Limited search functionality
5. **Mobile App**: No native mobile application

## Future Enhancements

1. **User Authentication**: Implement login/logout system
2. **File Attachments**: Allow file uploads for tasks
3. **Real-time Collaboration**: Add WebSocket support
4. **Advanced Filtering**: More sophisticated search and filter options
5. **Mobile App**: Develop React Native or Flutter app
6. **API Rate Limiting**: Implement rate limiting for API endpoints
7. **Data Export**: Add CSV/PDF export functionality

## Resources and References

### Documentation

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Git Documentation](https://git-scm.com/doc)

### Tutorials Used

- [List any online tutorials or resources you used]

### AI Tools Used

- ChatGPT

## Group Collaboration

### Communication

- **Primary Method**: Whatsapp
- **Meeting Frequency**: [e.g., Twice per week]
- **Code Review Process**: We tested each feature step by step, verified API and SQL behaviour, checked logs, and ensured the frontend and backend interacted correctly. 
                           We fixed issues immediately during development.

### Git Workflow

- **Branching Strategy**: [e.g., Feature branches, main branch]
- **Commit Convention**: [e.g., Conventional commits]
- **Pull Request Process**: [Describe your PR process]

## Academic Integrity

This project was developed as part of the Software Engineering and Professional Practice course. All code is original work developed by the group members, with proper attribution given to any external resources or AI assistance used.

**AI Usage Declaration**: See `docs/AI_Usage_Declaration.md` for detailed information about AI tool usage.

**Group Collaboration**: See `docs/Group_Collaboration_Log.md` for detailed collaboration information.

## Contact Information

**Group Representative**: Pak Hoi Yi, s2451677@student.hkct.edu.hk
**Repository**: [GitHub/GitLab URL](https://github.com/Pak0401/AI-Datebase-Annotation-Tool)
**Course**: Software Engineering and Professional Practice 2025-2026
**Lecturer**: Beeno Tung

---

**Last Updated**: 11/18
**Version**: 1.0.0
