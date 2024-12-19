# Task Management Application

## Features Implemented

### Required Features
- ✅ Task Creation with Name, Description, and Due Date
- ✅ Task Status Management (Not urgent, Due soon, Overdue)
- ✅ Task Editing Functionality
- ✅ Automatic Status Updates based on Due Date

### Should Have Features
- ✅ Sorting by Due Date and Create Date
- ✅ Search by Task Name
- ✅ PostgreSQL Database Integration
- ✅ RESTful API Backend

## Design Decisions

### 1. Component Structure
- **TaskForm**: Handles both creation and editing of tasks
- **TaskList**: Manages task display, sorting, and searching
- **TaskEditDialog**: Modal dialog for editing tasks

### 2. State Management
- Used React's useState for local state management
- Implemented in App.tsx as the single source of truth for tasks

### 3. Date Handling
- Utilized date-fns for consistent date formatting and calculations
- Automatic status updates based on due date proximity

### 4. UI Framework
- Material-UI (MUI) for consistent and responsive design
- TableSortLabel for intuitive sorting interface
- Dialog component for task editing

### 5. Task Status Logic
- Automatically calculated based on due date:
  - Overdue: Due date < Today
  - Due Soon: Due date within 7 days
  - Not Urgent: Due date > 7 days

### 6. Backend Architecture
- Express.js REST API
- PostgreSQL database for persistence
- Environment-based configuration
- Pagination support for task listing

## Future Improvements

1. **Performance Optimization**
   - Implement pagination for large task lists
   - Add virtualization for better scroll performance

2. **Enhanced Features**
   - Task categories/tags
   - Priority levels
   - Bulk actions (delete, status update)
   - Task completion tracking

3. **User Experience**
   - Drag-and-drop reordering
   - Rich text description editor
   - Task filters by status
   - Sort direction toggle
   - Responsive design improvements

4. **Data Persistence**
   - Offline support
   - Caching strategy
   - Real-time updates

5. **Code Quality**
   - Implement error boundaries
   - Add loading states
   - Form validation
   - Proper error handling

## Libraries Used
- Material-UI (@mui/material)
- date-fns
- @mui/x-date-pickers
- Express.js
- PostgreSQL
- cors
- dotenv

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials and other configurations

4. Start with Docker:
```bash
docker-compose up
```

OR

Start without Docker:
```bash
# Start development server
npm run dev

# Start backend server
npm run server
```

### Testing
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

## API Endpoints

- `GET /api/tasks` - List all tasks (with pagination)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `GET /api/tasks/search` - Search tasks by name


#The front end should be running on port 5173 and the backend on port 3000