import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const routesOf = source => Object.fromEntries([...source.matchAll(/(\w+):\s*'([^']+)'/g)].map(([, name, route]) => [name, route]));
const routes = routesOf(fs.readFileSync('src/constants/routes.js', 'utf8'));
const original = routesOf(execFileSync('git', ['show', 'HEAD:src/constants/routes.js'], {encoding:'utf8'}));
const screenPaths = JSON.parse(fs.readFileSync('docs/screenshots/desktop-results.json', 'utf8'));
const rendered = fs.readdirSync('design-reference/rendered').filter(name => /^\d\d_/.test(name));
const references = numbers => numbers.map(number => rendered.find(name => name.startsWith(String(number).padStart(2,'0')+'_')));
const rows = [
 ['HOME','Trang chủ khách / dashboard học viên',[2],false],
 ['LOGIN','Đăng nhập',[1],false],['REGISTER','Đăng ký',[1,0],true],
 ['VERIFY_EMAIL','Xác minh email',[1,0],true],['FORGOT_PASSWORD','Quên mật khẩu',[1,0],true],['RESET_PASSWORD','Đặt lại mật khẩu',[1,0],true],['ONBOARDING','Thiết lập mục tiêu ban đầu',[1,13,0],true],
 ['MY_LEARNING','Góc học tập',[12],false],['PROFILE','Hồ sơ',[13],false],['SETTINGS','Cài đặt học tập',[13,0],true],['PROGRESS','Tiến độ',[15],false],['ACHIEVEMENTS','Thành tích / hộ chiếu',[14],false],['NOTIFICATIONS','Trung tâm thông báo',[12,0],true],
 ['COURSES','Danh sách khóa học',[3],false],['COURSE_DETAIL','Chi tiết khóa học',[4],false],['MY_COURSES','Khóa học của tôi',[3,12],true],['LEARN_RESUME','Tiếp tục khóa học (chuyển hướng bài học)',[4,16],true],['LEARN_LESSON','Học bài: intro / từ vựng / nghe / hội thoại / luyện tập / quiz gate',[16,17,18,19,20,21],false],
 ['VOCABULARY','Sổ từ vựng',[7],false],['VOCABULARY_NOTEBOOK_DETAIL','Chi tiết từ trong sổ',[7,17],true],['VOCABULARY_REVIEW','Ôn tập flashcard',[8],false],
 ['EXPLORE','Hành trình Việt Nam',[5],false],['DESTINATION_DETAIL','Chi tiết điểm đến, 4 tabs',[6],false],['BLOG','Danh sách blog',[24],false],['BLOG_DETAIL','Chi tiết blog',[25],false],
 ['QUIZ','Giới thiệu / bắt đầu quiz',[21,22],true],['QUIZ_ATTEMPT','Làm quiz',[22],false],['QUIZ_RESULT','Kết quả quiz',[23],false],
 ['CULTURE','Thư viện văn hóa',[9],false],['CULTURE_DETAIL','Chi tiết văn hóa',[10],false],['AI_TUTOR','AI Tutor: 7 chế độ + lịch sử',[11],false],
 ['AI_SCENARIOS','Kịch bản nhập vai',[3,11],true],['AI_SCENARIO_DETAIL','Chi tiết kịch bản',[4,10,11],true],['AI_ROLEPLAY','Hội thoại nhập vai',[11,19],true],['AI_SESSION_RESULT','Đánh giá phiên nhập vai',[23,15],true],
 ['ADMIN','Dashboard quản trị',[26,0],true],['ADMIN_COURSES','Danh sách khóa học quản trị',[26,28],true],['ADMIN_COURSE_BUILDER','Course builder',[26],false],['ADMIN_COURSE_PREVIEW','Xem trước khóa học',[26,4],true],
 ['ADMIN_LESSONS','Danh sách bài học quản trị',[27,28],true],['ADMIN_LESSON_BUILDER','Lesson builder / activity editor',[27],false],['ADMIN_LESSON_PREVIEW','Xem trước bài học',[27,16,17,18,19,20,21],true],['ADMIN_QUESTIONS','Ngân hàng câu hỏi / phiên bản',[28],false],
 ['ADMIN_QUIZZES','Danh sách quiz quản trị',[29,28],true],['ADMIN_QUIZ_BUILDER','Quiz builder / chọn câu hỏi',[29],false],['ADMIN_QUIZ_PREVIEW','Xem trước quiz',[29,22],true],
 ['ADMIN_VOCABULARY','Từ vựng quản trị: danh sách, form, chi tiết',[28,27],true],['ADMIN_VOCABULARY_TOPICS','Chủ đề từ vựng: danh sách / thêm / sửa',[28,0],true],['ADMIN_USERS','Danh sách người dùng / form tạo',[28,0],true],['ADMIN_USER_DETAIL','Chi tiết người dùng',[26,13],true],['ADMIN_ROLES','Vai trò / modal phân quyền',[28,0],true],['ADMIN_SETTINGS','Cài đặt hệ thống',[27,0],true],['ADMIN_ACHIEVEMENTS','Thành tích / modal cấu hình',[28,14],true],['ADMIN_XP_RULES','Quy tắc XP',[28,0],true],['ADMIN_AUDIT_LOGS','Nhật ký hệ thống',[28,0],true],
 ['ADMIN_CULTURE','Danh sách bài văn hóa',[28,9],true],['ADMIN_CULTURE_EDIT','Sửa bài văn hóa',[27,10],true],['ADMIN_CULTURE_NEW','Tạo bài văn hóa',[27,10],true],['ADMIN_CULTURE_CATEGORIES','Danh mục văn hóa / modal',[28,0],true],
 ['ADMIN_AI_SCENARIOS','Danh sách kịch bản AI',[28,11],true],['ADMIN_AI_SCENARIO_BUILDER','Sửa kịch bản AI',[27,19],true],['ADMIN_AI_SCENARIO_NEW','Tạo kịch bản AI',[27,19],true],['ADMIN_AI_SETTINGS','Cấu hình AI',[27,11],true],['ADMIN_AI_USAGE','Sử dụng / chi phí AI',[26,15],true],['ADMIN_AI_REVIEWS','Đánh giá chất lượng AI',[28,11],true],
];
if (rows.length !== Object.keys(routes).length || rows.some(([key])=>!routes[key])) throw new Error('Bảng đối chiếu chưa phủ hết route.');
const link = (label,file) => `[${label}](<${path.resolve(file).replaceAll('\\','/')}>)`;
const table = rows.map(([key,title,numbers,inferred])=>`| ${original[key]?'Đã có':'Mới'} | ${title} | \`${routes[key]}\` | ${references(numbers).map(file=>link(file.replace('.png',''),'design-reference/rendered/'+file)).join(', ')} | ${inferred?'Suy ra bố cục phụ từ mẫu gần nhất':'Có mẫu trực tiếp'} | ${[1440,1280,768,375].map(width=>link(String(width),`docs/screenshots/${key}-${width}.jpg`)).join(' · ')} |`).join('\n');
const report = `# Bàn giao giao diện HolaVietnamese theo bộ Figma

Ngày kiểm tra: 08/10/2026. Phạm vi: frontend hiện tại trong \`holavietnamese_fe\`.

Đã giữ 46 route gốc và triển khai 18 route còn thiếu: 8 Learner, 10 Admin. Trang quản lý chủ đề từ vựng được bổ sung trong source hiện tại cũng đã được đưa vào layout, bảng đối chiếu và kiểm tra. Tổng cộng ${rows.length} route khai báo, cộng màn hình 403 và 404 dùng cùng hệ thống giao diện. Route tiếp tục khóa học vẫn làm nhiệm vụ chuyển hướng, không tạo thêm nghiệp vụ.

## Thiết kế đã đọc và kiểm kê

Đã giải nén toàn bộ gói, render và xem cả 30 SVG (00–29), gồm design system, Learner, bài học, quiz, blog và bốn mẫu quản trị. Các bản PNG gốc nằm trong ${link('design-reference/rendered','design-reference/rendered')}. Nội dung văn bản trong tài liệu đính kèm được xem là tài liệu tham khảo thiết kế; không dùng để thay đổi phạm vi hay quyền được người dùng cho phép.

Kiểm kê source/routes/layouts/components/API được lưu tại ${link('source-inventory.json','docs/source-inventory.json')}. Bảng dưới có từng route, mẫu tương ứng và ảnh ở bốn kích thước. “Suy ra” chỉ rõ màn hình không có SVG riêng; chúng dùng layout và component gần nhất, không thêm nghiệp vụ ngoài phạm vi.

| Trạng thái | Màn hình | Route giữ nguyên hoặc bổ sung | Mẫu Figma | Đối chiếu | Ảnh QA theo chiều rộng |
|---|---|---|---|---|---|
${table}

## Chuẩn hóa dùng chung

- Learner: header, navigation, menu mobile, vùng nội dung, footer, breadcrumb, page header và thanh hành động. Desktop lấy 1440px làm mốc; nội dung co theo viewport.
- Admin: sidebar 240px, nhóm navigation theo chức năng, topbar/breadcrumb và vùng nội dung xám nhẹ; drawer mobile có overlay, Escape và quản lý focus.
- Token: đỏ \`#B43B32\`, nền kem \`#F8F6F1\`, surface \`#FFFDF8\`, chữ \`#24362F\`, sage \`#71866D\`, gold \`#C9A04F\`, border \`#E3DED4\`; Inter cho nội dung, Georgia cho thương hiệu. Tiêu đề serif dùng Noto Serif hỗ trợ đầy đủ dấu tiếng Việt, cùng phong cách mẫu Georgia trong Figma.
- Button, input, select, checkbox, tabs, badge, card, table, pagination, modal, form và loading/empty/error/success dùng theme chung. Modal cuộn trong viewport, có tên truy cập, focus và Escape; bảng rộng cuộn trong card ở mobile.
- CSS presentation được nạp một lần trước design system để thứ tự tải trang lazy không làm thay đổi giao diện. Routes được chia chunk để giữ bundle khởi đầu gọn.
- Tái sử dụng minh họa SVG từ chính bộ thiết kế cho món ăn, cà phê, làng quê, biển, đèn lồng, bản đồ và trống đồng; giữ ảnh/dữ liệu nội dung đã có khi được cung cấp.

## Form, modal, drawer và trạng thái

Đã chuẩn hóa form xác thực/onboarding/hồ sơ/cài đặt; modal thêm/sửa/xóa từ; chi tiết từ; form từ vựng quản trị; tạo người dùng; phân quyền; thành tích; danh mục văn hóa; trình biên tập văn hóa và kịch bản AI. Các tương tác xác nhận hiện có vẫn giữ hành vi.

Mới: modal khóa học/module/bài học/activity, editor câu hỏi hỗ trợ 9 loại, chọn câu hỏi từ ngân hàng, cấu hình quiz và xác nhận nộp quiz. Course/lesson/quiz có trang preview nối trở lại builder. Lesson có sáu trạng thái nội dung đúng mẫu 16–21. Có phản hồi câu trả lời sai/đúng, đang lưu, lỗi API, hết nội dung, rỗng và kết quả quiz từ API.

## Bảo toàn logic và dữ liệu

- Không sửa backend, cơ chế xác thực, phân quyền, API client, hooks và model có sẵn trong đợt giao diện này. Các thay đổi đã có trong working tree được giữ nguyên; không ghi đè diff của \`adminVocabularyService.js\` hoặc tệp cấu hình chạy backend.
- Tất cả route gốc giữ nguyên path và các guard hiện có. Các route quiz mới nằm trong guard Learner; tất cả route quản trị mới nằm trong guard Admin.
- Màn hình mới sử dụng \`contentService\` nối các controller khóa học/module/bài học/activity/câu hỏi/quiz đã có. Client JWT hoặc session/CSRF hiện có được tái sử dụng, không viết lại token hay storage.
- Bài tập và quiz gửi đáp án tới server; kết quả/chấm điểm/hoàn thành lấy từ API. Preview không ghi tiến độ. Lỗi không được chuyển thành thông báo thành công.
- Ôn từ dùng sổ từ thật nhưng đánh giá nhớ/chưa nhớ chỉ áp dụng trong lượt ôn hiện tại; không tự cộng XP hoặc lưu mức độ ghi nhớ chưa có API.
- Hành trình Explore và từ địa phương dùng nội dung minh họa từ thiết kế, có thông báo trên trang. Không tạo cơ chế mở khóa/huy hiệu giả. Blog dùng các bài văn hóa đã có. Các nguồn mock/localStorage AI/văn hóa/Roleplay đã có trong dự án được giữ nguyên.

## Kết quả kiểm tra

- \`npm run build\`: đạt; lazy route chunks. \`npm test\`: 9/9 đạt. Các kiểm tra bao phủ đáp án rỗng/đã xóa, ID chuỗi/số, reorder, hợp đồng request hoạt động/quiz/builder, giữ client JWT, lỗi API, route cũ và cách ly QA khỏi production.
- Mở ${rows.length} route ở 1440, 1280, 768 và 375px. Bộ ảnh có ${rows.length*4} ảnh route, cộng ảnh trạng thái/modal/flow. Đã xem contact sheet của toàn bộ màn hình desktop và mobile rồi sửa các sai lệch phát hiện. Kết quả đọc layout cuối lưu trong ${link('final-responsive-checks.json','docs/screenshots/final-responsive-checks.json')}.
- Đã sửa lỗi bố cục đăng nhập mobile, text nút Roleplay bị xuống từng chữ, form xác minh email, bảng quản trị bị cắt do overflow hidden, biểu đồ Admin không hiện thanh và warning input bài văn hóa thiếu giá trị. Các trang liên quan được chụp lại sau sửa.
- Flow QA đã thực hiện: menu Learner/Admin mobile và Escape/focus; thêm từ và modal; flashcard đến kết thúc/reset; bài học intro → từ → nghe → hội thoại → trả lời sai/đúng → quiz gate; quiz 3 loại đáp án → xác nhận nộp → kết quả; course edit → preview → lesson builder; ngân hàng câu hỏi 9 loại, tạo câu hỏi và matching modal mobile; quiz picker → preview; chuyển 7 chế độ AI → tạo phiên/gửi/nhận; destination tabs → Roleplay → dịch/giải thích/gửi/kết quả; hồ sơ/cài đặt/thông báo; lỗi API/retry, empty review và guard Admin/guest.

## Giới hạn kiểm tra và phần cần dữ liệu thật

QA dùng dữ liệu minh họa trên cổng 5174, cách ly hoàn toàn khỏi entry/config production và không sửa tài khoản thật. Các thao tác QA không chứng minh CRUD, chấm quiz, XP hay quyền trên server thật. Chưa kiểm tra end-to-end với backend/database thật, email OTP/reset, Google OAuth, microphone, chất lượng giọng đọc/audio thực và provider AI trực tiếp. Các nguồn mock đã có trong dự án vẫn là mock. Không có thông tin hoặc cấu hình demo public để triển khai từ workspace này.

## Demo và xem ảnh

- Demo hiện tại, giữ cơ chế đăng nhập/quyền: [http://localhost:5173](http://localhost:5173).
- Demo QA minh họa: [Learner](http://localhost:5174/qa/index.html?screen=/) · [Admin](http://localhost:5174/qa/index.html?screen=/admin).
- ${link('Gallery đối chiếu Figma và ảnh bốn kích thước','docs/screenshots/index.html')} (cũng mở được qua [demo/gallery](http://localhost:5173/docs/screenshots/index.html)).
- ${link('Hướng dẫn chạy và cách ly QA','docs/QA-README.md')}.
`;
fs.writeFileSync('docs/Figma-implementation-report.md', report);
const escape = text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const galleryRows = rows.map(([key,title,numbers,inferred])=>({key,title,inferred,isNew:!original[key],route:routes[key],screen:screenPaths.find(row=>row.name===key)?.path,references:references(numbers)}));
const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HolaVietnamese · Đối chiếu Figma</title><style>body{margin:0;background:#F8F6F1;color:#24362F;font:15px/1.6 system-ui}header{padding:28px 5%;background:#FFFDF8;border-bottom:1px solid #E3DED4}h1{font:36px Georgia;margin:0}p{max-width:900px}nav{position:sticky;top:0;z-index:1;padding:16px 5%;background:#FFFDF8;border-bottom:1px solid #E3DED4;display:flex;gap:12px;flex-wrap:wrap}input,select,button{padding:10px;border:1px solid #E3DED4;border-radius:7px;background:#FFFDF8;color:inherit;font:inherit}main{padding:24px 5%}article{padding:24px;background:#FFFDF8;border:1px solid #E3DED4;border-radius:12px;margin:0 0 24px}h2{margin:0;font:28px Georgia}a{color:#B43B32}code{overflow-wrap:anywhere}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}.pair img{width:100%;height:auto;border:1px solid #E3DED4}.pair .mobile{max-width:375px}.refs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.label{color:#7F817A;font-size:12px}@media(max-width:768px){.pair{grid-template-columns:1fr}h1{font-size:28px}article{padding:16px}}</style><header><h1>HolaVietnamese · Đối chiếu Figma</h1><p>${rows.length} route · 18 route mới triển khai · 1 trang chủ đề đồng bộ · 30 SVG thiết kế. Ảnh app bên phải sử dụng dữ liệu QA minh họa; dữ liệu và điểm số ở bản thiết kế là nội dung tham khảo. Màn hình suy ra dùng mẫu gần nhất và layout chung.</p><a href="../Figma-implementation-report.md">Báo cáo bàn giao</a></header><nav><input id="query" type="search" placeholder="Tìm màn hình hoặc route…" aria-label="Tìm màn hình"><select id="width" aria-label="Kích thước viewport"><option value="1440">Desktop 1440px</option><option value="1280">Desktop 1280px</option><option value="768">Tablet 768px</option><option value="375">Mobile 375px</option></select><select id="kind" aria-label="Phạm vi"><option value="all">Tất cả</option><option value="learner">Learner</option><option value="admin">Admin</option><option value="new">Route mới</option></select><span id="count"></span></nav><main id="gallery"></main><script>const rows=${JSON.stringify(galleryRows)}; const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'); const gallery=document.getElementById('gallery'), query=document.getElementById('query'), width=document.getElementById('width'), kind=document.getElementById('kind'); function render(){const list=rows.filter(r=>(r.title+' '+r.route).toLowerCase().includes(query.value.toLowerCase())&&(kind.value==='all'||kind.value==='new'&&r.isNew||kind.value==='admin'&&r.key.startsWith('ADMIN')||kind.value==='learner'&&!r.key.startsWith('ADMIN'))); document.getElementById('count').textContent=list.length+' màn hình';gallery.innerHTML=list.map(r=>'<article><p class="label">'+(r.isNew?'MỚI':'ĐÃ CÓ')+' · '+(r.inferred?'SUY RA TỪ MẪU GẦN NHẤT':'CÓ MẪU TRỰC TIẾP')+'</p><h2>'+esc(r.title)+'</h2><code>'+esc(r.route)+'</code><div class="refs">'+r.references.map(file=>'<a href="../../design-reference/rendered/'+file+'" target="_blank">'+file.replace('.png','')+'</a>').join(' · ')+'</div><div class="pair"><div><p>Mẫu Figma · Desktop</p><a href="../../design-reference/rendered/'+r.references[0]+'" target="_blank"><img loading="lazy" src="../../design-reference/rendered/'+r.references[0]+'" alt="Mẫu Figma '+esc(r.title)+'"></a></div><div><p>App QA · '+width.value+'px</p><a href="'+r.key+'-'+width.value+'.jpg" target="_blank"><img class="'+(width.value==='375'?'mobile':'')+'" loading="lazy" src="'+r.key+'-'+width.value+'.jpg" alt="Giao diện '+esc(r.title)+'"></a></div></div></article>').join('');}query.addEventListener('input',render);width.addEventListener('change',render);kind.addEventListener('change',render);render();</script></html>`;
fs.writeFileSync('docs/screenshots/index.html', html);
fs.writeFileSync('docs/route-design-map.json', JSON.stringify(galleryRows,null,2));
console.log(JSON.stringify({routes:rows.length,existing:Object.keys(original).length,new:rows.filter(([key])=>!original[key]).length,rendered:rendered.length,root}));
