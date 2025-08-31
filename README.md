# KesaContainer ICT Monitoring System

A comprehensive Next.js-based ICT Container Monitoring System for managing IT equipment, tracking issues, and maintaining knowledge bases for technical support.

## Features

- **Equipment Management**: Track IT assets with detailed specifications and issue history
- **Component Inventory**: Manage reusable hardware components with compatibility tracking
- **Knowledge Base**: Technical documentation with approval workflow
- **User Management**: Role-based access control (Employee, Technician, HOS, HOD, Admin)
- **Analytics**: Performance metrics and forecasting
- **AI Integration**: Google AI-powered chatbot for technical support
- **Work Logs**: Maintenance and repair tracking

## Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google AI (Gemini 2.5 Flash) via Genkit
- **Authentication**: Custom auth context

## Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition on your machine
2. Start MongoDB service
3. Create a database named `kesacontainer`

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/kesacontainer
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kesacontainer
```

### 4. Seed the Database

Run the database seeder to populate initial data:

```bash
npm run seed
```

This will create:
- Sample users with different roles
- Example IT equipment items
- Reusable components
- Knowledge base entries
- Work logs

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## Database Models

### Users
- Role-based access control
- Department and section assignments
- Login tracking

### Items
- IT equipment tracking
- Detailed specifications
- Issue history
- Location management
- Reusable parts extraction

### Components
- Reusable hardware parts
- Compatibility tags
- Condition tracking
- Quantity management

### Knowledge Base
- Technical documentation
- Approval workflow
- Version control
- Related components

### Work Logs
- Maintenance tracking
- Issue resolution
- Component usage
- Status management

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create item
- `GET /api/items/[id]` - Get item by ID
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Soft delete item

### Components
- `GET /api/components` - Get all components
- `POST /api/components` - Create component
- `GET /api/components/[id]` - Get component by ID
- `PUT /api/components/[id]` - Update component
- `DELETE /api/components/[id]` - Soft delete component

### Knowledge Base
- `GET /api/knowledge-base` - Get all KB entries
- `POST /api/knowledge-base` - Create KB entry

### Work Logs
- `GET /api/work-logs` - Get all work logs
- `POST /api/work-logs` - Create work log

## User Roles

- **EMPLOYEE**: Basic access, can report issues
- **TECHNICIAN**: Technical support, can manage items and components
- **HOS**: Head of Section, can approve knowledge base entries
- **HOD**: Head of Department, full management access
- **ADMIN**: Complete system access

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run seed` - Seed database with initial data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── (app)/             # Protected app routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── pages/            # Page-specific components
│   └── ui/               # Reusable UI components
├── context/              # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities and models
│   ├── models/           # MongoDB models
│   └── types.ts          # TypeScript types
└── ai/                   # AI integration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
