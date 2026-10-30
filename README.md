# Hola Vietnamese Frontend

Ứng dụng React monolith: một entry point, router và bản build Vite cho toàn bộ chức năng học viên.

## Cấu trúc

```text
src/
├── app/                 # Provider, router và trang lỗi cấp ứng dụng
├── features/            # Mỗi tính năng chứa pages, components, api, hooks và models của mình
│   ├── auth/            # Đăng nhập và tài khoản
│   ├── learning/        # Khóa học, lesson, quiz và tiến độ
│   ├── vocabulary/      # Tra từ, sổ tay và ôn tập
│   ├── explore/         # Điểm đến và ngôn ngữ vùng miền
│   ├── content-import/  # Màn hình nhập giáo trình và Excel từ vựng dùng chung
│   ├── ai/              # Gia sư AI và hội thoại
│   └── ...              # Culture, home, admin, onboarding, account, blog, alphabet
├── shared/              # HTTP client, layout, hook và component dùng nhiều nơi
├── constants/           # Đường dẫn router và hằng số chung
├── i18n/                # Ngôn ngữ VI/EN
├── styles/              # CSS toàn ứng dụng
├── assets/
├── App.jsx              # Kết nối provider và router
├── main.jsx             # Entry point
└── styles.css
```

Luồng chính: page/component → hook hoặc API của feature → HTTP client dùng chung → backend.
File chỉ phục vụ một tính năng đặt trong `features/<tính năng>/`; file được nhiều tính năng dùng đặt trong `shared/`.

## Chạy

Dùng Node.js 22.22+ và npm:

```powershell
npm ci
npm run dev
```

FE: http://localhost:5173. Vite chuyển `/api` sang `VITE_PROXY_TARGET` (mặc định http://localhost:8080).
Nếu backend chạy ở cổng khác, đặt `VITE_PROXY_TARGET` trong `.env.local`.

```powershell
npm run build
npm run preview
```

Bản production nằm trong `dist/`. Khi triển khai cần proxy `/api` tới BE cùng origin.
Nếu dùng origin riêng, cấu hình `VITE_API_BASE_URL`, `FRONTEND_ORIGIN` và session cookie phù hợp.

Các route: `/login`, `/courses`, `/courses/:courseId`, `/my-courses`,
`/learn/:courseId`, `/learn/:courseId/lesson/:lessonId`, `/progress`, `/vocabulary`.
Các màn hình hiển thị trạng thái trống khi database chưa có dữ liệu; không dùng mock fallback.
