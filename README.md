# SEP490 Frontend - Vite React Clean Architecture

Frontend skeleton dùng Vite + React JavaScript theo hướng Clean Architecture.

Project này chỉ dựng khung:
- Chưa có business logic
- Chưa có authentication
- Chưa có CRUD
- Chưa có UI framework
- Chưa có state management
- Chưa có module nghiệp vụ cụ thể

## Tech stack

- React 19.3
- Vite 8.3
- React Router 8
- JavaScript
- Native Fetch API

## Requirements

Khuyến nghị dùng Node.js 22.22+.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Frontend mặc định chạy:

```text
http://localhost:5173
```

Backend mặc định:

```text
http://localhost:8080
```

Copy file:

```text
.env.example
```

thành:

```text
.env
```

## Structure

```text
src
├── app
│   ├── router
│   │   └── AppRouter.jsx
│   └── providers
│       └── AppProviders.jsx
│
├── domain
│   ├── entities
│   └── repositories
│
├── application
│   └── usecases
│
├── infrastructure
│   ├── api
│   │   └── httpClient.js
│   └── repositories
│
├── presentation
│   ├── pages
│   ├── layouts
│   ├── components
│   │   └── common
│   └── hooks
│
├── shared
│   ├── constants
│   └── utils
│
├── assets
│   └── images
│
├── App.jsx
├── main.jsx
└── styles.css
```

## Layer responsibilities

### domain

Business model thuần JavaScript.

Không import:
- React
- React Router
- API client
- UI library

### application

Chứa use case của application.

Use case phụ thuộc vào abstraction/repository từ domain.

### infrastructure

Chứa implementation giao tiếp bên ngoài:
- REST API
- Backend Spring Boot
- Local storage
- Repository implementation

### presentation

Chứa phần React:
- Pages
- Layouts
- Components
- Hooks

Presentation gọi application/use case, không nên gọi API trực tiếp khi project bắt đầu có nghiệp vụ thật.

### app

Bootstrap application:
- Router
- Global providers
- Global configuration

### shared

Các thành phần dùng chung không chứa business logic:
- constants
- utils

## Recommended dependency direction

```text
Presentation
     ↓
Application
     ↓
Domain
     ↑
Infrastructure
```

Ví dụ khi thêm module User:

```text
domain/entities/User.js
domain/repositories/UserRepository.js

application/usecases/user/GetProfile.js

infrastructure/repositories/UserRepositoryImpl.js

presentation/pages/profile/ProfilePage.jsx
presentation/components/profile/ProfileForm.jsx
```

Không đặt toàn bộ API, logic và JSX chung trong một page.
