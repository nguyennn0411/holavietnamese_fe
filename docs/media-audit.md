# Rà soát ảnh và thuộc tính media — 08/10/2026

Đã sửa lỗi Văn hóa và Blog bỏ qua `coverImage` và dùng SVG thay thế. Danh sách, bài nổi bật và trang chi tiết hiện dùng ảnh thật từ dữ liệu bài viết. Các URL và bản ghi gốc được giữ nguyên.

## Các điểm đã sửa

| Khu vực | Thuộc tính / lỗi | Kết quả |
| --- | --- | --- |
| Văn hóa: thư viện, nổi bật, chi tiết | `coverImage` bị bỏ qua | Dùng đúng ảnh của bài viết, có `alt`, vùng ảnh và cách cắt ảnh thống nhất |
| Blog: thư viện, nổi bật, chi tiết | `coverImage` bị bỏ qua; ảnh dọc làm hero quá cao | Dùng ảnh thật; vùng hero desktop tối thiểu 300px, mobile 220px, không phụ thuộc chiều cao tự nhiên của ảnh |
| Khóa học, khóa học đã đăng ký, chi tiết, preview Admin | `thumbnailUrl`; ảnh lỗi bị ẩn vĩnh viễn; preview dùng SVG | Dùng chung `CourseThumbnail` và tải lại khi URL thay đổi |
| Góc học tập | API overview dùng `image` | Đọc đúng trường `image`, cùng cơ chế xử lý lỗi |
| Hồ sơ | `avatarUrl` | Ảnh lỗi/trống trở về chữ cái tên người dùng, URL mới được tải lại |
| Roleplay: danh sách / chi tiết | `thumbnail` / `coverImage` | Giữ đúng hai trường của service; thêm trạng thái không tải được ảnh |
| Quản trị Văn hóa: bảng, editor, preview | `coverImage` | Preview và bảng dùng cùng component; mô tả ảnh theo tiêu đề bài viết |
| Hoạt động bài học / từ vựng | `imageUrl`, `audioUrl`, `videoUrl`, `captionVi/En`, `transcriptVi/En`, `promptEn` | Hiện các thuộc tính được backend hỗ trợ; bổ sung ảnh của từng từ và trường nhập ảnh trong Activity Editor |
| Quiz / preview quiz / lựa chọn câu hỏi | Ảnh và âm thanh cấp câu hỏi/lựa chọn | Xử lý lỗi và kích thước thống nhất; ảnh ở bài ghép cặp cũng được hiển thị |
| Question Bank editor | URL ảnh/âm thanh của từng lựa chọn chưa có trường sửa | Có trường nhập và preview ảnh; giữ ID, đáp án, phiên bản và payload hiện có |
| Sổ từ, ôn từ, cụm từ văn hóa | Bỏ qua `audioUrl` nếu có | Ưu tiên audio dữ liệu; dùng giọng đọc trình duyệt khi chưa có audio như hành vi hiện có |
| Trang chủ khách | Hình món ăn cho câu gọi cà phê | Đổi sang minh họa cà phê cùng bộ thiết kế |
| Bài văn hóa có điểm đến `all` | Sinh link `/explore/all` không tồn tại | Đi đến `/explore`; các điểm đến cụ thể giữ link hiện có |

`ContentImage` chỉ dùng ảnh dự phòng khi thiếu hoặc tải lỗi. Ảnh nội dung thiếu/lỗi hiện thông báo trung tính; ảnh khóa học thiếu dùng minh họa theo thiết kế; avatar thiếu dùng chữ cái. Không dùng một SVG bất kỳ để thay ảnh thật đang có.

`mediaSource` xử lý URL tại thời điểm render: bỏ khoảng trắng ngoài URL, loại giá trị null/undefined/object và scheme không phù hợp. URL tương đối, upload nội bộ và tham số của URL ký vẫn được giữ. Không thay đổi giá trị form gửi API, validation backend, dữ liệu, storage, quyền hoặc route gốc.

Âm thanh/video lỗi có phản hồi rõ ràng. Nút phát âm không nuốt lỗi tải/phát; việc chủ động ngắt giọng đọc hoặc dừng phát không bị báo thành lỗi. Các vùng ảnh giữ kích thước và `object-fit` phù hợp để tránh ảnh dọc kéo vỡ layout.

## Kiểm tra đã thực hiện

- `npm run build`: đạt, 215 modules.
- `npm test`: **12/12 đạt**. Bao gồm hợp đồng API/route/auth trước đó và kiểm tra URL media thiếu, sai kiểu, scheme không hợp lệ, URL upload và tham số ký.
- Mở lại **65 màn hình tại 1440px** trong môi trường QA riêng; kiểm tra thêm **19 màn hình có ảnh/media tại 1280, 768 và 375px**: tổng **122 cặp màn hình/kích thước**, có ảnh chụp.
- 188 phần tử ảnh trong các lượt kiểm tra, 23 URL ảnh khác nhau; không còn ảnh tải lỗi, thuộc tính `src/href/poster` chứa null/undefined/object/javascript, cảnh báo lỗi giao diện hoặc tràn ngang trong tập đã kiểm tra.
- Các ảnh lazy loading cuối trang đã được cuộn tới và kiểm tra tải hoàn tất.
- Mở **6 bài Văn hóa và 6 kịch bản Roleplay trên demo 5173**: cả 12 ảnh bìa tải thành công. Kiểm tra tìm bài cà phê, xóa bộ lọc và link điểm đến Toàn quốc.
- Kiểm tra riêng: ảnh lỗi → URL hợp lệ, URL trống, URL không hợp lệ, avatar fallback, ảnh lựa chọn, ghép cặp có ảnh, audio/video lỗi và phản hồi nút phát âm.
- Modal sửa câu hỏi được kiểm tra tại cả 4 kích thước: ảnh preview tải đúng, các ID `11/12/13/14` giữ nguyên, modal nằm trong viewport. Không lưu thay đổi vào dữ liệu thật.
- Không có lỗi console mới ngoài các lỗi tài nguyên được chủ động tạo ở trang thử lỗi QA.
- 8 SVG trong `public/design` và PNG trống đồng đang được tham chiếu đều tồn tại và đọc được. Build giải quyết thành công đường dẫn ảnh import.

Đã cập nhật 122 ảnh liên quan trong gallery đối chiếu chung để không tiếp tục hiển thị ảnh SVG cũ của Văn hóa/Blog.

## Giới hạn xác minh

Demo thật hiện trả danh sách khóa học trống và chưa có phiên đăng nhập để đọc avatar/upload riêng của tài khoản. Cơ chế hiển thị các URL này đã được kiểm tra bằng dữ liệu QA và các tình huống lỗi, nhưng chưa xác minh các tệp riêng trên server thật. Chưa kiểm tra chất lượng nội dung âm thanh/video thật; không có tệp media thật tương ứng trong dữ liệu QA. Các kiểm tra QA không chứng minh CRUD hoặc chấm điểm trên backend thật.

## Bằng chứng và demo

- [Văn hóa trên demo hiện tại](http://localhost:5173/culture) — giữ đăng nhập và quyền hiện có.
- [Blog trên demo hiện tại](http://localhost:5173/blog).
- [Gallery Figma/website](http://localhost:5173/docs/screenshots/index.html).
- [Tóm tắt kiểm tra](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/summary.json>), [122 quan sát màn hình](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/screen-checks.json>), [12 trang chi tiết public](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/public-detail-checks.json>), [modal editor](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/editor-checks.json>).
- [Ảnh Văn hóa thật](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/demo-culture.png>), [Blog sau khi giới hạn vùng ảnh](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/demo-blog-1440.png>), [editor mobile](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/question-media-editor-375.png>).
- [Trang thử lỗi media riêng](http://localhost:5174/?media-check=1). Chỉ chạy trên QA, không nằm trong entry production.

## Bổ sung: avatar trên header

Header đã dùng `user.avatarUrl` từ hồ sơ đăng nhập thay cho việc luôn hiển thị chữ cái. Avatar có kích thước 48px trên desktop/tablet và 40px trên mobile, cắt tròn với `object-fit: cover`; chữ cái chỉ xuất hiện khi chưa có ảnh hoặc ảnh tải lỗi. Giữ nguyên menu, điều hướng hồ sơ và logic đăng nhập.

Đã kiểm tra ảnh hợp lệ ở 1440/1280/768/375px, không tràn ngang; kiểm tra ảnh thiếu/lỗi, đóng menu bằng Escape và điều hướng đến hồ sơ. `npm test`: 12/12 đạt. `npm run build`: đạt. Ảnh kiểm tra dùng dữ liệu minh họa trên QA, chưa xác minh ảnh riêng của tài khoản người dùng trên server thật.

- [Header desktop trong QA](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/header-avatar-1440.png>), [header mobile](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/header-avatar-375.png>), [kết quả kiểm tra](<E:/Ky9/CapstoneProject/Holavietnamese/Code/holavietnamese_fe/docs/media-audit/header-avatar-checks.json>).
