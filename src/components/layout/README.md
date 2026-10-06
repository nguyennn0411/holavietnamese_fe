# Shared layout components

Các component trong thư mục này tạo khung giao diện chung cho khu vực người học.

```jsx
import { AppHeader, AppFooter, Brand } from '@/components/layout';
```

- `AppHeader`: logo, navigation, thống kê, thông báo và tài khoản.
- `MainNavigation`: danh sách route điều hướng chính.
- `UserMenu`: menu hồ sơ, cài đặt và đăng xuất.
- `AppFooter`: thông tin thương hiệu và liên kết dùng chung.
- `Brand`: logo dùng lại ở header/footer.
- `LayoutToast`: thông báo lỗi cấp layout.

Các trang thuộc `MainLayout` chỉ cần render nội dung trang. Không thêm lại header hoặc footer trong từng page.
Style dùng chung nằm tại `src/presentation/styles/layout.css`.
