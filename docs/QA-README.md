# Visual QA của HolaVietnamese

Demo chính chạy bằng `npm run dev` tại http://localhost:5173, dùng cấu hình, API và cơ chế xác thực của dự án.

Demo minh họa kiểm tra giao diện chạy bằng `npm run dev:qa` tại http://localhost:5174. Cấu hình riêng ở `qa/vite.config.js` dùng fixture auth và hai fixture API client. Entry production `src/main.jsx` và `vite.config.js` không import hoặc alias chúng. Không đưa fixture auth vào deployment production.

Ví dụ:

- Learner: http://localhost:5174/qa/index.html?screen=/
- Admin: http://localhost:5174/qa/index.html?screen=/admin
- Login: http://localhost:5174/qa/index.html?screen=/login&role=guest
- Chặn Admin: http://localhost:5174/qa/index.html?screen=/admin/courses&role=learner
- Lỗi API: http://localhost:5174/qa/index.html?screen=/admin/courses&fixture=error
- Sổ từ rỗng: http://localhost:5174/qa/index.html?screen=/vocabulary/review&fixture=empty

Fixture là dữ liệu trong bộ nhớ; reload sẽ khởi tạo lại các bản ghi. Một số service AI/văn hóa/Roleplay của dự án vốn sử dụng localStorage; bản QA sử dụng storage riêng theo origin cổng 5174. Kết quả quiz minh họa không phải chứng nhận server thật đã chấm bài. Fixtures chỉ đủ để kiểm tra giao diện và các flow tiêu biểu, không thay thế backend integration tests.

`npm test` chạy 9 kiểm tra bằng Node test runner. `npm run build` xây bundle production. Không cần dependency kiểm thử bổ sung.

Ảnh route ở `docs/screenshots/<ROUTE_KEY>-<WIDTH>.jpg`, với 1440/1280/768/375px. Ảnh `flow-*` và `state-*` ghi lại tương tác/empty/error/modal/drawer. `final-responsive-checks.json` chứa kết quả đọc layout cuối; `route-design-map.json` chứa route → mẫu Figma. Gallery tại `docs/screenshots/index.html` hỗ trợ tìm kiếm, lọc Admin/Learner/mới và chọn viewport. Mở qua http://localhost:5173/docs/screenshots/index.html hoặc mở tệp HTML cục bộ.

`node docs/create-report.mjs` tái tạo báo cáo và gallery từ routes cùng danh sách mẫu đã đối chiếu. Các script chuyển đổi một lần trong `design-reference/` là nhật ký thực hiện; không chạy lại đồng loạt vì một số script không idempotent.
