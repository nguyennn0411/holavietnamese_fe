import { useState } from 'react';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import '@/presentation/styles/admin.css';

export function AdminAiReviewsPage() {
  const [reviews, setReviews] = useState(() => adminCultureAiService.getReviews());
  const [selectedReview, setSelectedReview] = useState(null);
  const [toast, setToast] = useState('');

  // Interactive Test Sandbox State
  const [testScenarioId, setTestScenarioId] = useState('goi-mon-pho-ha-noi');
  const [testPrompt, setTestPrompt] = useState('Dạ cho cháu một bát phở tái lăn, không cho hành lá nhé cô!');
  const [testOutput, setTestOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = adminCultureAiService.updateReviewStatus(id, newStatus);
    setReviews(adminCultureAiService.getReviews());
    setSelectedReview(updated);
    showToast(`Đã cập nhật trạng thái kiểm tra chất lượng: ${newStatus}`);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestOutput('');

    // Simulate backend test execution through admin evaluation pipeline
    setTimeout(() => {
      setIsTesting(false);
      setTestOutput(`[AI Test Runner - v2.2.0-stable | Model: Gemini 1.5 Flash]
✓ Nhận diện vai trò: Cô Mai (Chủ quán phở Hà Nội)
✓ Phân tích câu thoại người học: "Dạ cho cháu một bát phở tái lăn, không cho hành lá nhé cô!"
✓ Kính ngữ: Rất chuẩn xác (Dạ... nhé cô)
✓ Xử lý yêu cầu khẩu vị: Không hành lá -> Đã ghi nhận chính xác

➔ Câu trả lời của AI tạo ra:
"Được rồi cháu ơi! Một bát tái lăn không hành nhé. Thịt bò xào lăn thơm phức đang sẵn trên chảo đây. Cháu có muốn dùng thêm đĩa quẩy giòn nhúng nước dùng hay uống trà đá không nào?"

➔ Đánh giá tự động:
- Lỗi sai kiến thức ẩm thực: 0
- Lỗi ngữ pháp tiếng Việt: 0
- Tính phù hợp văn hóa: 100%`);
    }, 600);
  };

  return (
    <div className="admin-content">
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#245c48', color: '#fff', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#a62a24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          AI QUALITY ASSURANCE & AUDITING • NGƯỜI 4
        </span>
        <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}>Kiểm tra chất lượng AI & Đánh giá phản hồi</h1>
        <p style={{ margin: 0, color: '#665349', fontSize: '14px' }}>
          Xem các phiên hội thoại được phép truy cập theo chính sách riêng tư, kiểm tra phản hồi học viên, đánh dấu lỗi và kiểm thử prompt kịch bản.
        </p>
      </div>

      {/* Privacy Notice */}
      <div style={{ background: '#f5ebe0', border: '1px solid #ebd9c8', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>🔒</span>
        <div style={{ fontSize: '13px', color: '#553c30' }}>
          <strong>Chính sách quyền riêng tư lịch sử hội thoại:</strong> Chỉ hiển thị các phiên được người học cấp quyền gửi đánh giá, phản hồi báo lỗi, hoặc các phiên thuộc tập kiểm thử (Test Bench). Dữ liệu cá nhân nhạy cảm đã được ẩn danh hóa.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: User Feedback & Sessions Review Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #ebd9c8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '17px', color: '#381e18' }}>
              Danh sách phản hồi & Phiên cần kiểm tra ({reviews.length})
            </h2>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Học viên & Kịch bản</th>
                <th>Đánh giá</th>
                <th>Phản hồi học viên</th>
                <th>Vấn đề ghi nhận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedReview(r)}
                  style={{ cursor: 'pointer', background: selectedReview?.id === r.id ? '#fbf4ea' : 'transparent' }}
                >
                  <td>
                    <strong style={{ fontSize: '13.5px', color: '#381e18', display: 'block' }}>
                      {r.scenarioTitle}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#7a6053' }}>
                      {r.userIdentifier} • {r.createdAt}
                    </span>
                  </td>

                  <td>
                    <span style={{ color: '#d97706', fontWeight: 750 }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </td>

                  <td style={{ fontSize: '12.5px', color: '#4a3227', maxWidth: '240px' }}>
                    "{r.userFeedback}"
                  </td>

                  <td>
                    {r.taggedIssues.length === 0 ? (
                      <span className="admin-badge admin-badge-success">Không có lỗi</span>
                    ) : (
                      r.taggedIssues.map((issue, idx) => (
                        <span key={idx} className="admin-badge admin-badge-danger" style={{ display: 'inline-block', margin: '2px 0' }}>
                          {issue}
                        </span>
                      ))
                    )}
                  </td>

                  <td>
                    {r.status === 'APPROVED' ? (
                      <span className="admin-badge admin-badge-success">Đã duyệt</span>
                    ) : r.status === 'NEEDS_PROMPT_TUNING' ? (
                      <span className="admin-badge admin-badge-warning">Cần sửa Prompt</span>
                    ) : (
                      <span className="admin-badge admin-badge-danger">Cần xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column: Review Details Action & Test Sandbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Detail Card if selected */}
          {selectedReview ? (
            <div className="admin-card" style={{ background: '#fff' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#381e18' }}>
                Chi tiết đánh giá phiên: {selectedReview.id}
              </h3>

              <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#4d362b' }}>
                <div><strong>Kịch bản:</strong> {selectedReview.scenarioTitle}</div>
                <div><strong>Mã phiên:</strong> <code>{selectedReview.sessionId}</code></div>
                <div><strong>Đánh giá:</strong> {selectedReview.rating}/5 sao</div>
                <div style={{ marginTop: '8px', padding: '10px 12px', background: '#faf3e8', borderRadius: '8px' }}>
                  💬 <em>"{selectedReview.userFeedback}"</em>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <strong>Thao tác kiểm toán chất lượng:</strong>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="button secondary"
                      style={{ fontSize: '12px', padding: '6px 12px', color: '#1b5e20' }}
                      onClick={() => handleUpdateStatus(selectedReview.id, 'APPROVED')}
                    >
                      ✓ Duyệt đạt chuẩn
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      style={{ fontSize: '12px', padding: '6px 12px', color: '#b45309' }}
                      onClick={() => handleUpdateStatus(selectedReview.id, 'NEEDS_PROMPT_TUNING')}
                    >
                      ⚠️ Cần chỉnh Prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-card" style={{ textAlign: 'center', padding: '24px', color: '#8c7367' }}>
              Bấm vào một phiên trong bảng bên trái để xem chi tiết và thực hiện kiểm toán chất lượng.
            </div>
          )}

          {/* Test Sandbox (Kiểm thử kịch bản) */}
          <div className="admin-card" style={{ background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>🧪</span>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#381e18' }}>
                Kiểm thử kịch bản AI (Prompt Sandbox)
              </h3>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#7a6054' }}>
              Kiểm tra trực tiếp phản hồi của mô hình với phiên bản System Prompt hiện hành trước khi xuất bản rộng rãi.
            </p>

            <label>
              Chọn kịch bản kiểm thử:
              <select value={testScenarioId} onChange={e => setTestScenarioId(e.target.value)}>
                <option value="goi-mon-pho-ha-noi">Gọi món tại quán Phở gia truyền Hà Nội</option>
                <option value="tra-gia-cho-ben-thanh">Trả giá quà lưu niệm tại Chợ Bến Thành</option>
                <option value="bat-xe-om-cong-nghe">Đón xe ôm công nghệ & Chỉ đường</option>
              </select>
            </label>

            <label style={{ marginTop: '12px' }}>
              Prompt câu nói thử nghiệm của học viên:
              <textarea
                rows={2}
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="button"
              onClick={handleRunTest}
              disabled={isTesting}
              style={{ width: '100%', marginTop: '12px', fontSize: '13px' }}
            >
              {isTesting ? 'Đang kiểm thử...' : '▶ Chạy kiểm thử phản hồi'}
            </button>

            {testOutput && (
              <div style={{ marginTop: '14px', padding: '12px', background: '#24382b', color: '#e8f5e9', borderRadius: '10px', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {testOutput}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
