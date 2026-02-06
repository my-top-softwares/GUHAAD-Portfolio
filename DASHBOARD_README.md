# Dashboard Documentation

## Overview
This is a comprehensive admin dashboard for managing your portfolio website. It includes full CRUD operations for Services, Portfolios, Testimonials, and Categories with real-time analytics and data visualization.

## Features

### 1. **Dashboard Overview** (`/dashboard`)
- Real-time statistics cards showing:
  - Total Services
  - Total Portfolios
  - Total Testimonials
  - Total Categories
- **Bar Chart Visualization**: Shows portfolio distribution across categories
- **Category Distribution Panel**: Lists all categories with project counts
- **Quick Stats**: Displays total content items, most popular category, and average projects per category

### 2. **Services Management** (`/dashboard/services`)
- View all services in a grid layout
- **Create**: Add new services with title, description, and icon
- **Update**: Edit existing service details
- **Delete**: Remove services with confirmation modal
- Empty state with helpful call-to-action

### 3. **Portfolio Management** (`/dashboard/portfolio`)
- View all portfolio projects with images
- **Create**: Add new portfolios with:
  - Title and description
  - Image URL
  - Project link
  - Category selection
  - Likes count
  - Technologies (comma-separated)
- **Update**: Edit existing portfolio details
- **Delete**: Remove portfolios with confirmation modal
- Category badges with custom colors
- Image preview on cards

### 4. **Testimonials Management** (`/dashboard/testimonials`)
- View all client testimonials
- **Create**: Add new testimonials with:
  - Client name
  - Position and company
  - Testimonial message
  - Avatar image URL
- **Update**: Edit existing testimonials
- **Delete**: Remove testimonials with confirmation modal
- 5-star rating display
- Avatar support with fallback initials

### 5. **Categories Management** (`/dashboard/categories`)
- View all categories with color-coded cards
- **Create**: Add new categories with:
  - Name and description
  - Custom color picker (8 presets + custom color)
- **Update**: Edit category details and colors
- **Delete**: Remove categories with confirmation modal
- Visual color representation on cards

## Technical Features

### Custom Components
1. **DashboardLayout**: 
   - Responsive sidebar navigation
   - Mobile-friendly with hamburger menu
   - User profile display
   - Logout functionality

2. **Modal Component**:
   - Animated modal for add/edit operations
   - Smooth transitions with Framer Motion
   - Backdrop blur effect

3. **DeleteModal Component**:
   - Confirmation dialog for delete operations
   - Prevents accidental deletions
   - Loading state support

### Data Visualization
- **Chart.js** integration for bar charts
- Real-time data fetching from backend API
- Category-based portfolio distribution
- Color-coded chart bars matching category colors

### Backend Integration
All pages connect to the backend API at `http://localhost:5000/api/`:
- `/services` - Services CRUD
- `/projects` - Portfolio/Projects CRUD
- `/testimonials` - Testimonials CRUD
- `/categories` - Categories CRUD

## Navigation Structure

```
/dashboard
├── /dashboard (Overview with analytics)
├── /dashboard/services (Services CRUD)
├── /dashboard/portfolio (Portfolio CRUD)
├── /dashboard/testimonials (Testimonials CRUD)
└── /dashboard/categories (Categories CRUD)
```

## Backend Updates

### New Models
1. **Category Model** (`categoryModel.js`):
   - name (String, required, unique)
   - description (String)
   - color (String, default: "#3b82f6")

### Updated Models
1. **Project Model** (`projectModel.js`):
   - Added `category` field (ObjectId reference)
   - Added `likes` field (Number, default: 0)

### New Routes
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/categories/:id` - Get single category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Updated Controllers
- **projectController.js**: Now populates category data in responses

## Usage Instructions

### Accessing the Dashboard
1. Navigate to `/dashboard` after logging in
2. Use the sidebar to navigate between different sections

### Creating Content
1. Click the "Add [Item]" button on any page
2. Fill in the required fields in the modal
3. Click "Create" to save

### Editing Content
1. Hover over any card to reveal edit/delete buttons
2. Click the edit icon (pencil)
3. Modify the fields in the modal
4. Click "Update" to save changes

### Deleting Content
1. Hover over any card to reveal edit/delete buttons
2. Click the delete icon (trash)
3. Confirm deletion in the confirmation modal
4. Click "Delete" to permanently remove

### Logout
- Click the "Logout" button in the sidebar
- You'll be redirected to the login page
- Authentication token will be cleared from localStorage

## Styling & Design
- **Dark Mode Support**: All components support dark mode
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Animations**: Smooth transitions and hover effects
- **Color Coding**: Categories have custom colors for easy identification
- **Modern UI**: Uses gradients, shadows, and rounded corners

## Dependencies Added
```json
{
  "chart.js": "^4.x.x",
  "react-chartjs-2": "^5.x.x"
}
```

## API Response Format

### Services
```json
{
  "_id": "...",
  "title": "Web Development",
  "description": "Custom web applications...",
  "icon": "code-icon",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Portfolios
```json
{
  "_id": "...",
  "title": "E-commerce Platform",
  "description": "Full-stack e-commerce...",
  "image": "https://...",
  "link": "https://...",
  "category": {
    "_id": "...",
    "name": "Web Development",
    "color": "#3b82f6"
  },
  "likes": 150,
  "technologies": ["React", "Node.js"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Testimonials
```json
{
  "_id": "...",
  "name": "John Doe",
  "position": "CEO",
  "company": "Acme Inc",
  "message": "Excellent work!",
  "image": "https://...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Categories
```json
{
  "_id": "...",
  "name": "Web Development",
  "description": "Web development projects",
  "color": "#3b82f6",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Future Enhancements
- Image upload functionality
- Drag-and-drop reordering
- Bulk operations
- Export data to CSV/JSON
- Advanced filtering and search
- User role management
- Activity logs
