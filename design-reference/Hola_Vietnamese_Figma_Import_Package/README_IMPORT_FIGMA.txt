HOLA VIETNAMESE — FIGMA IMPORT PACKAGE
=======================================

CÁCH IMPORT NHANH NHẤT
1. Giải nén file ZIP.
2. Trong Figma, mở file/project của bạn.
3. Kéo file `Hola_Vietnamese_All_Screens.svg` trực tiếp vào canvas.
4. Figma sẽ import thành các vector/group có thể chỉnh sửa.
5. Dùng Ungroup (Shift+Cmd/Ctrl+G) nếu muốn tách sâu các layer.

IMPORT TỪNG MÀN
- Có thể kéo từng file SVG riêng vào Figma.
- Mỗi file được thiết kế ở desktop 1440px.
- File `Asset_Vietnam_Map.svg` là asset bản đồ Journey.
- File `Asset_Dong_Son_Watermark.svg` là watermark trống đồng.

LƯU Ý QUAN TRỌNG
- Đây là SVG import package, không phải .fig native. Figma không có định dạng .fig công khai để tự tạo bên ngoài Figma.
- Sau khi import, nên chuyển các khối lặp lại thành Figma Components/Variants và bật Auto Layout.
- Font chính: Inter. Font editorial dùng Georgia trong SVG để tương thích rộng; có thể đổi sang Cormorant Garamond/Lora trong Figma.
- Bản đồ Việt Nam trong gói được vector-trace theo đúng silhouette trên màn Explore Vietnam mà bạn gửi, để giữ style nhất quán.
- Nền các màn đều có watermark trống đồng opacity thấp theo yêu cầu.

CÁC MÀN TRONG GÓI
00 Design System
01 Login
02 Home Dashboard
03 Learn
04 Course Detail
05 Explore Vietnam
06 Destination Detail
07 Vocabulary
08 Vocabulary Review
09 Culture
10 Culture Detail
11 AI Tutor
12 My Learning
13 Profile
14 Achievements
15 Progress
16 Lesson Intro
17 Lesson Vocabulary
18 Lesson Listen
19 Lesson Dialogue
20 Lesson Practice
21 Lesson Quiz Gate
22 Quiz
23 Quiz Result
24 Blog Home
25 Blog Detail
26 Admin Course Builder
27 Admin Lesson Builder
28 Admin Question Bank
29 Admin Quiz Builder

GỢI Ý SAU KHI IMPORT
- Convert Navigation, Buttons, Badges, Cards, Inputs thành components.
- Dùng Auto Layout cho course cards, vocabulary cards, forms và admin lists.
- Tạo variants cho trạng thái Completed / Current / Available / Locked của Journey.
