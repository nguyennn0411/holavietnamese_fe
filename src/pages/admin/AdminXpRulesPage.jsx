import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminXpRulesPage() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    adminService.getXpRules().then(setRules);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Quy tắc cộng điểm XP</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          Định lượng điểm thưởng cho từng hoạt động học tập, giới hạn hàng ngày và cơ chế chống spam/cộng trùng lặp.
        </p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã sự kiện</th>
              <th>Hành động / Sự kiện</th>
              <th>Điểm thưởng (XP)</th>
              <th>Giới hạn nhận thưởng</th>
              <th>Cơ chế chống gian lận (Anti-spam)</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.id}>
                <td><strong>{rule.id}</strong></td>
                <td><strong style={{ color: '#0f172a' }}>{rule.event}</strong></td>
                <td>
                  <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '1rem' }}>
                    +{rule.points} XP
                  </span>
                </td>
                <td>
                  <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {rule.limitPerDay}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                    🛡️ {rule.antiSpam}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ marginTop: '24px', background: '#fafafa', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0f172a' }}>ℹ️ Nguyên tắc Sổ cái giao dịch XP (XP Ledger)</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
          Mọi giao dịch cộng/trừ XP trong Hola Vietnamese đều được ghi vào bảng lịch sử sổ cái (Transaction Ledger). Mỗi khi học viên gửi yêu cầu hoàn thành bài học, backend sẽ kiểm tra trạng thái bài học trước khi cấp XP để đảm bảo tính minh bạch và chuẩn xác cho bảng xếp hạng.
        </p>
      </div>
    </div>
  );
}
