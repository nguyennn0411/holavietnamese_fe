# Hola Vietnamese Frontend

Ứng dụng React monolith: một entry point, router và bản build Vite cho toàn bộ chức năng học viên.

## Cấu trúc

```text
src/
├── api/httpClient.js     # Fetch, session cookie, CSRF và xử lý lỗi
├── services/            # Gọi REST API và kiểm tra dữ liệu đầu vào
├── models/              # Model dữ liệu và thuộc tính tính toán
├── hooks/               # State, tải dữ liệu và thao tác React
├── components/          # Component dùng chung và theo chức năng
├── pages/               # Các màn hình
├── layouts/             # Layout ứng dụng
├── constants/           # Đường dẫn router
├── assets/
├── App.jsx              # Router chung
├── main.jsx             # Entry point
└── styles.css
```

Luồng chính: page/component → hook hoặc service → HTTP client → backend.
Service dùng model để giữ các thuộc tính tính toán hiện có. Không còn repository interface,
repository implementation, use-case factory hoặc container khởi tạo dependency.

## Chạy

Dùng Node.js 22.22+ và npm:

```powershell
npm ci
npm run dev
```

FE: http://localhost:5173. Vite chuyển `/api` sang `VITE_PROXY_TARGET` (mặc định http://localhost:8080).
Trên máy hiện tại, `.env.local` dùng http://localhost:8088 vì cổng 8080 đã được dự án khác sử dụng.
Khởi động BE và MySQL từ thư mục `../../BE` bằng `./start-mysql.ps1 -StartBackend`.

```powershell
npm run build
npm run preview
```

Bản production nằm trong `dist/`. Khi triển khai cần proxy `/api` tới BE cùng origin.
Nếu dùng origin riêng, cấu hình `VITE_API_BASE_URL`, `FRONTEND_ORIGIN` và session cookie phù hợp.

Các route: `/login`, `/courses`, `/courses/:courseId`, `/my-courses`,
`/learn/:courseId`, `/learn/:courseId/lesson/:lessonId`, `/progress`, `/vocabulary`.
Các màn hình hiển thị trạng thái trống khi database chưa có dữ liệu; không dùng mock fallback.
