import React from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { FixedHeritageBackdrop } from '@/components/home/common/HeritageWatermark';
import { GuestHome } from '@/components/home/guest/GuestHome';
import { LearnerDashboard } from '@/components/home/learner/LearnerDashboard';

/**
 * Master Homepage Controller
 * Renders the Learner Cockpit for authenticated learners,
 * or the immersive Guest Landing Page for visitors.
 */
export function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="homepage-heritage-root relative w-full min-h-screen">
      {/*
        Mặt trống đồng Đông Sơn - Nền chìm toàn màn hình (Cả Guest và Learner)
        - Cố định trung tâm màn hình (fixed inset-0), hiện diện trang trọng ở mọi vị trí cuộn
        - Hoa văn mặt trời, chim lạc và các vành đồng tâm bao phủ toàn bộ khung nhìn
        - Độ mờ tinh tế 6% tạo cảm giác nền giấy điệp truyền thống, văn bản và nút bấm 100% rõ nét
      */}
      <FixedHeritageBackdrop />

      {/* Nội dung trang chủ */}
      <div className="relative z-10 w-full">
        {isAuthenticated ? <LearnerDashboard user={user} /> : <GuestHome />}
      </div>
    </div>
  );
}

export default HomePage;
