import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Brand } from './Brand';

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__about"><Brand /><p><BilingualText>{"Học tiếng Việt tự nhiên qua bài học ngắn, tình huống thực tế và văn hóa bản địa."}</BilingualText></p></div>
        <nav className="site-footer__column" aria-label="Khám phá"><strong><BilingualText>{"Khám phá"}</BilingualText></strong><Link to="/courses"><BilingualText>{"Khóa học"}</BilingualText></Link><Link to="/explore"><BilingualText>{"Hành trình Việt Nam"}</BilingualText></Link><Link to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText>{"Sổ từ vựng"}</BilingualText></Link><Link to="/blog"><BilingualText>{"Blog"}</BilingualText></Link><Link to="/ai-scenarios"><BilingualText>{"Kịch bản Roleplay"}</BilingualText></Link></nav>
        <nav className="site-footer__column" aria-label="Tài khoản"><strong><BilingualText>{"Tài khoản"}</BilingualText></strong><Link to="/profile"><BilingualText>{"Hồ sơ"}</BilingualText></Link><Link to="/settings"><BilingualText>{"Cài đặt"}</BilingualText></Link><Link to="/achievements"><BilingualText>{"Thành tích"}</BilingualText></Link></nav>
      </div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} HolaVietnamese</span><span><BilingualText>{"Được thiết kế cho người yêu tiếng Việt."}</BilingualText></span></div>
    </footer>
  );
}
