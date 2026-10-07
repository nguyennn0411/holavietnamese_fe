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

FE: http://localhost:5173. Vite chuyển `/api` sang `VITE_PROXY_TARGET` (mặc định http://127.0.0.1:18080 cho Docker).
Backend Docker dùng `DOCKER_BACKEND_PORT=18080`; backend chạy trực tiếp từ IntelliJ dùng `BACKEND_PORT` (máy hiện tại là 8088). Đổi `VITE_PROXY_TARGET` nếu muốn dùng bản IntelliJ.
Khởi động BE và MySQL từ thư mục `../../BE` bằng `./start-mysql.ps1 -StartBackend`.

```powershell
npm run build
npm run preview
```

Bản production nằm trong `dist/`. Khi triển khai cần proxy `/api` tới BE cùng origin.
Nếu dùng origin riêng, cấu hình `VITE_API_BASE_URL`, `FRONTEND_ORIGIN` và session cookie phù hợp.

Các route: `/login`, `/courses`, `/courses/:courseId`, `/my-courses`,
`/learn/:courseId`, `/learn/:courseId/lesson/:lessonId`, `/progress`, `/vocabulary`.
Course/Grammar/Quiz và My Learning sử dụng API thật. Một số màn hình có sẵn từ nhánh Huy (OTP/forgot-password, settings, achievements, notifications và admin dashboard/users) vẫn có mock/local fallback do API tương ứng chưa được triển khai đầy đủ.

## Tích hợp Huy (03/10/2026)

Đã cập nhật `origin/main` tại `d9f4ec0`. Giữ AuthProvider, trang đăng nhập/đăng ký/profile, giao diện và admin layout của Huy; ghép Course/Grammar/Question Bank/Quiz vào router chung. Cả hai HTTP client dùng cùng API base và JWT trong `localStorage.token`.

`VITE_API_BASE_URL` có thể là `/api` hoặc origin backend; không cần thêm `/api` hai lần. Các màn hình Course mới: `/learn`, `/courses/:courseId`, `/lesson/:id`, `/quiz/:id`, `/quiz-attempts/:id`. Dashboard `/my-learning` lấy khóa học và lịch sử quiz từ `/api/users/progress`. Đăng nhập lại khi token cũ hết hạn.
