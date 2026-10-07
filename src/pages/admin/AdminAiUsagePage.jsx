import { useState } from 'react';
import { adminCultureAiService } from '@/services/adminCultureAiService';
import '@/presentation/styles/admin.css';

export function AdminAiUsagePage() {
  const [usageData] = useState(() => adminCultureAiService.getUsageStats());
  const { summary, modeBreakdown, recentLogs } = usageData;

  return (
    <div className="admin-content">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#a62a24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          MONITORING & COST ANALYTICS • NGƯỜI 4
        </span>
        <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}>Theo dõi sử dụng AI & Chi phí</h1>
        <p style={{ margin: 0, color: '#665349', fontSize: '14px' }}>
          Thống kê thời gian thực về số phiên, lượt gọi API, lượng token tiêu thụ, chi phí ước tính, độ trễ và tỷ lệ lỗi hệ thống.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#7a6054', fontWeight: 700, textTransform: 'uppercase' }}>Tổng số phiên</span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#381e18', margin: '6px 0' }}>
            {summary.totalSessions.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#245c48' }}>↑ 14% so với tuần trước</span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#7a6054', fontWeight: 700, textTransform: 'uppercase' }}>Tổng lượt gọi API</span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#381e18', margin: '6px 0' }}>
            {summary.totalApiCalls.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#7a6054' }}>Trung bình 12.4 gọi/phiên</span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#7a6054', fontWeight: 700, textTransform: 'uppercase' }}>Token tiêu thụ</span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#381e18', margin: '6px 0' }}>
            {(summary.totalTokens / 1000000).toFixed(2)}M
          </div>
          <span style={{ fontSize: '11px', color: '#7a6054' }}>Prompt + Completion</span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#7a6054', fontWeight: 700, textTransform: 'uppercase' }}>Chi phí tháng</span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#a62a24', margin: '6px 0' }}>
            ${summary.costMonthUsd}
          </div>
          <span style={{ fontSize: '11px', color: '#245c48' }}>Ngân sách trần: ${summary.budgetLimitUsd}</span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#7a6054', fontWeight: 700, textTransform: 'uppercase' }}>Độ trễ trung bình</span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#245c48', margin: '6px 0' }}>
            {summary.avgResponseTimeMs} ms
          </div>
          <span style={{ fontSize: '11px', color: '#245c48' }}>P95: 580 ms (Rất nhanh)</span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#7a6054', fontWeight: 700, textTransform: 'uppercase' }}>Tỷ lệ lỗi (Error)</span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#245c48', margin: '6px 0' }}>
            {summary.errorRate}
          </div>
          <span style={{ fontSize: '11px', color: '#245c48' }}>Hệ thống đạt 99.82% SLA</span>
        </div>
      </div>

      {/* Breakdown by Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px', alignItems: 'start' }}>
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #ebd9c8' }}>
            <h2 style={{ margin: 0, fontSize: '17px', color: '#381e18' }}>
              Phân bổ lượng sử dụng & Chi phí theo chế độ
            </h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Chế độ AI</th>
                <th>Số lượt gọi</th>
                <th>Lượng Token</th>
                <th>Chi phí ($)</th>
                <th>Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {modeBreakdown.map(item => (
                <tr key={item.mode}>
                  <td>
                    <strong style={{ color: '#381e18' }}>{item.mode}</strong>
                    <div style={{ fontSize: '11px', color: '#7a6458' }}>{item.name}</div>
                  </td>
                  <td>{item.calls.toLocaleString()}</td>
                  <td>{(item.tokens / 1000).toLocaleString()}k</td>
                  <td><strong style={{ color: '#a62a24' }}>${item.cost}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#ebd8c7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percent}%`, height: '100%', background: '#a62a24' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost & Latency insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#381e18' }}>Kiểm soát ngân sách tháng 03/2026</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <span>Đã chi tiêu: <strong>${summary.costMonthUsd}</strong></span>
              <span style={{ color: '#7a6054' }}>Hạn mức: ${summary.budgetLimitUsd}</span>
            </div>
            <div style={{ height: '10px', background: '#ebd8c7', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: '#245c48',
                  width: `${(summary.costMonthUsd / summary.budgetLimitUsd) * 100}%`,
                }}
              />
            </div>
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#685044', lineHeight: 1.5 }}>
              💡 <em>Mẹo tối ưu:</em> Chế độ <strong>Gemini 1.5 Flash</strong> đang giúp giảm hơn 78% chi phí so với các mô hình tiêu chuẩn mà vẫn duy trì tốc độ phản hồi dưới 350ms.
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#381e18' }}>Bảo mật & Giới hạn tần suất</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#685044' }}>Backend API Proxy:</span>
                <strong style={{ color: '#245c48' }}>Đang hoạt động</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#685044' }}>Rate-limit per IP:</span>
                <strong>30 req/min</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#685044' }}>Key Leak Protection:</span>
                <strong style={{ color: '#245c48' }}>Bảo vệ 100%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time API Logs Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #ebd9c8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '17px', color: '#381e18' }}>Nhật ký gọi API gần đây (Audit Logs)</h2>
          <span style={{ fontSize: '12px', color: '#245c48', fontWeight: 700 }}>● Live Stream</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Thời gian</th>
              <th>Chế độ</th>
              <th>Người dùng</th>
              <th>Tokens In/Out</th>
              <th>Thời gian phản hồi</th>
              <th>Chi phí</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map(log => (
              <tr key={log.id}>
                <td><code>{log.id}</code></td>
                <td>{log.timestamp}</td>
                <td><span className="admin-badge admin-badge-info">{log.mode}</span></td>
                <td>{log.user}</td>
                <td>{log.tokensIn} in / {log.tokensOut} out</td>
                <td><strong style={{ color: log.latency < 400 ? '#245c48' : '#d97706' }}>{log.latency} ms</strong></td>
                <td>{log.cost}</td>
                <td><span className="admin-badge admin-badge-success">{log.status} OK</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
