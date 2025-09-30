# Faculty Leave Management System

A comprehensive leave management system built with Django REST Framework (Backend) and React (Frontend) for educational institutions to manage faculty leave requests, substitutions, and approvals.

## 🚀 Features

### Core Functionality
- **Leave Management**: Multiple leave types (Earned, Casual, Medical, Compensatory, etc.)
- **Substitution System**: Staff can request substitutions for their classes
- **Multi-level Approval**: HOD and Principal approval workflow
- **Real-time Notifications**: Live updates on request status
- **Calendar Integration**: Visual leave calendar
- **PDF Reports**: Automated leave reports and certificates

### User Roles
- **Staff**: Request leaves, arrange substitutions
- **HOD**: Approve/reject department staff leaves, view department statistics
- **Principal**: Final approval authority, view institution-wide data
- **Admin**: System administration and user management

## 🛠️ Technology Stack

### Backend
- **Django 5.2.5** - Python web framework
- **Django REST Framework** - API development
- **SQLite** (development) / PostgreSQL (production)
- **JWT Authentication** - Secure token-based auth
- **ReportLab** - PDF generation

### Frontend
- **React 19** - User interface
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **FullCalendar** - Calendar components

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## 🏗️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd faculty-leave-app
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
```bash
cp .env.example .env
# Edit .env file with your settings
```

#### Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
```

#### Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

### 4. Run the Application

#### Start Backend Server
```bash
cd backend
python manage.py runserver
```
Backend will be available at: http://localhost:8000

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will be available at: http://localhost:5173

## 🔧 Configuration

### Environment Variables (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### CORS Configuration
The backend is configured to accept requests from the React development server. For production, update `CORS_ALLOWED_ORIGINS` in `settings.py`.

## 📊 Database Models

### Core Models
- **User**: Custom user model with roles (Staff, HOD, Principal)
- **LeaveRequest**: Leave applications with status tracking
- **LeaveBalance**: Track leave balances for each user
- **Substitution**: Substitution arrangements for leave periods

### Supporting Models
- **HODAction**: Track HOD approvals/rejections
- **NightWorkRecord**: Track compensatory work
- **CompensatoryWork**: Compensatory leave records

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Short-lived (60 minutes)
- **Refresh Token**: Long-lived (1 day)
- **Token Refresh**: Automatic token renewal

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/auth/logout/` - User logout

### Staff Endpoints
- `GET /api/staff/leaves/` - View own leave requests
- `POST /api/staff/leaves/` - Create new leave request
- `GET /api/staff/balance/` - View leave balance

### HOD Endpoints
- `GET /api/hod/leaves/` - View department leave requests
- `POST /api/hod/leaves/{id}/approve/` - Approve leave
- `POST /api/hod/leaves/{id}/reject/` - Reject leave
- `GET /api/hod/leaves/department_stats/` - Department statistics

### Substitution Endpoints
- `GET /api/substitution/sent_requests/` - View sent requests
- `GET /api/substitution/received_requests/` - View received requests
- `POST /api/substitution/` - Create substitution request
- `POST /api/substitution/{id}/accept/` - Accept substitution
- `POST /api/substitution/{id}/reject/` - Reject substitution

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Staff/          # Staff dashboard components
│   ├── HOD/           # HOD dashboard components
│   ├── Principal/     # Principal dashboard components
│   └── Common/        # Shared components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── services/          # API service functions
```

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**:
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Frontend Changes**:
   ```bash
   cd frontend
   npm run dev  # Development server with hot reload
   ```

3. **Code Quality**:
   ```bash
   # Backend
   cd backend
   black .  # Format code
   flake8 . # Lint code

   # Frontend
   cd frontend
   npm run lint  # Lint code
   ```

## 🚀 Deployment

### Production Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn backend.wsgi:application
```

### Production Frontend
```bash
cd frontend
npm run build
# Serve the dist/ folder with your web server
```

## 📝 Usage Guide

### For Staff Users
1. **Login** with your credentials
2. **Check Leave Balance** on dashboard
3. **Request Leave** by filling the form
4. **Arrange Substitution** by searching for colleagues
5. **Wait for Approval** from HOD and Principal
6. **Track Status** in leave history

### For HOD Users
1. **Review Pending Leaves** in approval dashboard
2. **Check Substitution Details** before approval
3. **Approve/Reject** with optional comments
4. **View Department Statistics** and calendar

### For Principal Users
1. **Review Approved Leaves** from HODs
2. **Final Approval/Rejection** authority
3. **View Institution-wide** statistics and reports

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
   - Check if Django server is running

2. **Authentication Issues**:
   - Verify JWT token is included in requests
   - Check token expiration

3. **Database Issues**:
   - Run migrations: `python manage.py migrate`
   - Check database permissions

4. **Frontend Issues**:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check browser console for errors

## 📚 Additional Documentation

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Note**: This is a faculty leave management system designed for educational institutions. Ensure proper security measures are in place before deploying to production.
