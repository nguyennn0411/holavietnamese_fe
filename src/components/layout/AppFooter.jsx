import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Brand } from './Brand';

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__about"><Brand /><p>Học tiếng Việt tự nhiên qua bài học ngắn, tình huống thực tế và văn hóa bản địa.</p></div>
        <nav className="site-footer__column" aria-label="Khám phá"><strong>Khám phá</strong><Link to="/courses">Khóa học</Link><Link to="/explore">Hành trình Việt Nam</Link><Link to={ROUTES.VOCABULARY_NOTEBOOK}>Sổ từ vựng</Link><Link to="/blog">Blog</Link><Link to="/ai-scenarios">Kịch bản Roleplay</Link></nav>
        <nav className="site-footer__column" aria-label="Tài khoản"><strong>Tài khoản</strong><Link to="/profile">Hồ sơ</Link><Link to="/settings">Cài đặt</Link><Link to="/achievements">Thành tích</Link></nav>
      </div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} HolaVietnamese</span><span>Được thiết kế cho người yêu tiếng Việt.</span></div>
    </footer>
  );
}
