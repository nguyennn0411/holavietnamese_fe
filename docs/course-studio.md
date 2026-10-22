# Course Studio

Mở `/admin/courses/new` bằng Content Manager hoặc bấm **Import khóa học** từ danh sách. Trang tạo mới chỉ dùng file Excel mẫu; form nhập thông tin thủ công chỉ xuất hiện khi mở **Chỉnh sửa** một khóa đã import.

## Quy trình

1. **Thông tin**: mở dưới dạng cửa sổ wizard nổi với ba phần theo thứ tự **Giới thiệu → Ảnh bìa → Thiết lập**. Chỉ có thể quay lại phần đã đi qua; lưu ở phần cuối sẽ tự chuyển sang Cấu trúc & bài học. Mã và slug tự tạo theo tên; mở thiết lập nâng cao để chỉnh. Lưu nháp chưa cần ảnh; khi gửi duyệt cần có ảnh và mục tiêu. File JPG/PNG/WebP tối đa 5 MB được tải lên Cloudinary qua cơ chế ký sẵn có.
2. **Cấu trúc**: thêm/sửa học phần và bài học, thay đổi thứ tự, mở trình bài học để thêm nội dung, ảnh/video, hoạt động và quiz. Mã bài học mới được tạo sẵn. Quiz cuối khóa liên kết qua API hiện có.
3. **Xem trước**: ảnh bìa, mô tả, mục tiêu và danh sách bài; chọn bài để xem hoạt động ngay trong màn này. Dùng chế độ preview của LessonActivities, không ghi tiến độ/lượt làm bài.
4. **Xuất bản**: kiểm tra từ backend, hiển thị từng mục còn thiếu và đường quay lại hoàn thiện. Content Manager chỉ gửi duyệt; Admin phê duyệt và xuất bản hoặc trả lại với nhận xét. Khóa đã gửi duyệt/xuất bản ở chế độ chỉ đọc.

Mỗi bước hiển thị trạng thái **Hoàn tất / Đang thực hiện / Chưa hoàn tất**, hướng dẫn cho công việc hiện tại và nút mang tên bước tiếp theo. Thanh tiến độ bên phải liên kết nhanh đến Thông tin, Bài học & hoạt động và Gửi kiểm duyệt. Khi thông tin có thay đổi chưa lưu, nút chuyển bước bị khóa và thanh lưu luôn hiện ở cuối màn hình.

Với Content Manager, sidebar chỉ còn một mục **Biên soạn khóa học**. Bài học, quiz, ngân hàng câu hỏi và đáp án được mở từ khóa học theo một luồng: **Khóa học → Bài học → Quiz → Câu hỏi & đáp án**. Các URL quản trị cũ vẫn hoạt động để giữ liên kết đã có; khi đang ở các trang con, mục Biên soạn khóa học tiếp tục được đánh dấu là mục hiện tại.

Mỗi màn con đều có đường quay lại rõ ràng: trình bài học quay lại Cấu trúc khóa học, trình quiz quay lại bài học hoặc khóa học, các màn xem trước quay lại đúng trình chỉnh sửa, và popup dùng nút Quay lại/Hủy/Đóng. URL ngân hàng câu hỏi độc lập của Content Manager được đưa về danh sách khóa học vì câu hỏi nay được tạo trực tiếp trong quiz.

## Tải file Excel mẫu và nhập khóa học

Ở bước **Thông tin khóa học**, tải file mẫu `.xlsx`, điền lần lượt các sheet `COURSE`, `MODULES`, `LESSONS`, `QUIZZES`, `QUESTIONS`, `ACTIVITIES`, rồi chọn file và bấm **Kiểm tra file**. Nếu không có lỗi, bấm **Nhập thành khóa học nháp**. Các cột `moduleKey`, `lessonKey`, `quizKey` liên kết các sheet; `questionKey` cho phép dùng lại cùng câu hỏi ở nhiều quiz. Cần giữ nguyên tên sheet và tên cột. File mẫu có ví dụ khóa học một bài, một quiz và một ảnh chờ bổ sung.

Mỗi lần nhập tạo **khóa học mới**. Mã `code` và `slug` phải khác khóa đã có. Backend kiểm tra toàn bộ file trước khi ghi và nhập trong một giao dịch. Khóa, bài, hoạt động, câu hỏi và quiz đều ở trạng thái nháp để biên soạn/kiểm duyệt theo luồng thông thường. `prerequisiteKeys` liên kết bài học bằng `lessonKey`. Hoạt động ngữ pháp hiện có thể tham chiếu các ID chủ đề trong cùng hệ thống qua `grammarTopicIds`. Ảnh bìa nằm ở cột `coverUrl`, có thể để trống. Với ảnh/âm thanh/video trong bài, ghi tên file ở `mediaFile`; sau khi nhập, mở bài học để tải file lên Cloudinary và xuất bản hoạt động. File Excel chỉ chứa nội dung và URL/tên tham chiếu, không chứa dữ liệu nhị phân của tệp.

Nút **Tải file Excel mẫu** chỉ xuất mẫu để điền nội dung; không xuất dữ liệu của khóa học hiện có. Có thể để trống media rồi bổ sung sau.

Nội dung được lưu khi bấm Lưu. Hiển thị trạng thái chưa lưu, nhắc khi chuyển bước và khi đóng/tải lại trang; không tự ghi dữ liệu lên server mỗi lần gõ. Khi đang lưu, khóa các nút chuyển bước và đóng modal.

## Kỹ thuật

- `src/components/admin/CourseStudio.jsx`: màn tạo và trình biên soạn 4 bước.
- `src/components/admin/course-studio.css`: giao diện có bố cục thích ứng chiều rộng.
- `AdminContentPages.jsx`: danh sách mở trang tạo mới; khóa có sẵn dùng cùng Course Studio. Giữ nguyên các URL builder/preview hiện có.
- Không sửa schema, Flyway hoặc tiến độ học. Tiếp tục dùng JWT, kiểm tra quyền và service quản lý nội dung hiện tại.

## Kiểm tra trên môi trường cục bộ

- Build production và 52 kiểm thử FE hiện có đã qua.
- Đăng nhập Content Manager; tạo nháp thật, mã/slug tự sinh; thêm học phần và bài học, lưu hoạt động, mở xem trước.
- Upload ảnh bìa mẫu và lưu Cloudinary thành công.
- Kiểm tra thiếu hoạt động/quiz: nút gửi duyệt bị vô hiệu hóa, các mục thiếu được hiển thị.
- Để lại khóa nháp **Tiếng Việt qua những chuyến đi — Nháp Studio**, ID cục bộ `19`, phục vụ xem luồng. Khóa này chưa gửi duyệt hoặc xuất bản.
