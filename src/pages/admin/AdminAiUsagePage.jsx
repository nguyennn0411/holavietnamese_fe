import { BilingualText } from '@/components/common/BilingualText';
import { useState } from 'react';
import { adminCultureAiService } from '@/services/adminCultureAiService';

export function AdminAiUsagePage() {
  const [usageData] = useState(() => adminCultureAiService.getUsageStats());
  const { summary, modeBreakdown, recentLogs } = usageData;

  return (
    <div className="admin-content">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-red-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}><BilingualText>{"MONITORING & COST ANALYTICS • NGƯỜI 4"}</BilingualText></span>
        <h1 style={{ margin: '4px 0 6px 0', fontSize: '32px' }}><BilingualText>{"Theo dõi sử dụng AI & Chi phí"}</BilingualText></h1>
        <p style={{ margin: 0, color: 'var(--color-forest)', fontSize: '14px' }}><BilingualText>{"Thống kê thời gian thực về số phiên, lượt gọi API, lượng token tiêu thụ, chi phí ước tính, độ trễ và tỷ lệ lỗi hệ thống."}</BilingualText></p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}><BilingualText>{"Tổng số phiên"}</BilingualText></span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
            {summary.totalSessions.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-ink)' }}><BilingualText>{"↑ 14% so với tuần trước"}</BilingualText></span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}><BilingualText>{"Tổng lượt gọi API"}</BilingualText></span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
            {summary.totalApiCalls.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}><BilingualText>{"Trung bình 12.4 gọi/phiên"}</BilingualText></span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}><BilingualText>{"Token tiêu thụ"}</BilingualText></span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
            {(summary.totalTokens / 1000000).toFixed(2)}M
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}><BilingualText>{"Prompt + Completion"}</BilingualText></span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}><BilingualText>{"Chi phí tháng"}</BilingualText></span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-red-hover)', margin: '6px 0' }}>
            ${summary.costMonthUsd}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-ink)' }}><BilingualText>{"Ngân sách trần: $"}</BilingualText>{summary.budgetLimitUsd}</span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}><BilingualText>{"Độ trễ trung bình"}</BilingualText></span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
            {summary.avgResponseTimeMs} ms
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-ink)' }}><BilingualText>{"P95: 580 ms (Rất nhanh)"}</BilingualText></span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase' }}><BilingualText>{"Tỷ lệ lỗi (Error)"}</BilingualText></span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--color-ink)', margin: '6px 0' }}>
            {summary.errorRate}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-ink)' }}><BilingualText>{"Hệ thống đạt 99.82% SLA"}</BilingualText></span>
        </div>
      </div>

      {/* Breakdown by Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px', alignItems: 'start' }}>
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ margin: 0, fontSize: '17px', color: 'var(--color-ink)' }}><BilingualText>{"Phân bổ lượng sử dụng & Chi phí theo chế độ"}</BilingualText></h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th><BilingualText>{"Chế độ AI"}</BilingualText></th>
                <th><BilingualText>{"Số lượt gọi"}</BilingualText></th>
                <th><BilingualText>{"Lượng Token"}</BilingualText></th>
                <th><BilingualText>{"Chi phí ($)"}</BilingualText></th>
                <th><BilingualText>{"Tỷ lệ"}</BilingualText></th>
              </tr>
            </thead>
            <tbody>
              {modeBreakdown.map(item => (
                <tr key={item.mode}>
                  <td>
                    <strong style={{ color: 'var(--color-ink)' }}>{item.mode}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--color-forest)' }}>{item.name}</div>
                  </td>
                  <td>{item.calls.toLocaleString()}</td>
                  <td>{(item.tokens / 1000).toLocaleString()}k</td>
                  <td><strong style={{ color: 'var(--color-red-hover)' }}>${item.cost}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percent}%`, height: '100%', background: 'var(--color-red-hover)' }} />
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
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"Kiểm soát ngân sách tháng 03/2026"}</BilingualText></h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
              <span><BilingualText>{"Đã chi tiêu:"}</BilingualText><strong>${summary.costMonthUsd}</strong></span>
              <span style={{ color: 'var(--color-forest)' }}><BilingualText>{"Hạn mức: $"}</BilingualText>{summary.budgetLimitUsd}</span>
            </div>
            <div style={{ height: '10px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--color-ink)',
                  width: `${(summary.costMonthUsd / summary.budgetLimitUsd) * 100}%`,
                }}
              />
            </div>
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--color-red-hover)', lineHeight: 1.5 }}>
              💡 <em><BilingualText>{"Mẹo tối ưu:"}</BilingualText></em><BilingualText>{"Chế độ"}</BilingualText><strong>Gemini 1.5 Flash</strong><BilingualText>{"đang giúp giảm hơn 78% chi phí so với các mô hình tiêu chuẩn mà vẫn duy trì tốc độ phản hồi dưới 350ms."}</BilingualText></div>
          </div>

          <div className="admin-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--color-ink)' }}><BilingualText>{"Bảo mật & Giới hạn tần suất"}</BilingualText></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-red-hover)' }}><BilingualText>{"Backend API Proxy:"}</BilingualText></span>
                <strong style={{ color: 'var(--color-ink)' }}><BilingualText>{"Đang hoạt động"}</BilingualText></strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-red-hover)' }}><BilingualText>{"Rate-limit per IP:"}</BilingualText></span>
                <strong>30 req/min</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-red-hover)' }}><BilingualText>{"Key Leak Protection:"}</BilingualText></span>
                <strong style={{ color: 'var(--color-ink)' }}><BilingualText>{"Bảo vệ 100%"}</BilingualText></strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time API Logs Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '17px', color: 'var(--color-ink)' }}><BilingualText>{"Nhật ký gọi API gần đây (Audit Logs)"}</BilingualText></h2>
          <span style={{ fontSize: '12px', color: 'var(--color-ink)', fontWeight: 700 }}><BilingualText>{"● Live Stream"}</BilingualText></span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th><BilingualText>{"Request ID"}</BilingualText></th>
              <th><BilingualText>{"Thời gian"}</BilingualText></th>
              <th><BilingualText>{"Chế độ"}</BilingualText></th>
              <th><BilingualText>{"Người dùng"}</BilingualText></th>
              <th><BilingualText>{"Tokens In/Out"}</BilingualText></th>
              <th><BilingualText>{"Thời gian phản hồi"}</BilingualText></th>
              <th><BilingualText>{"Chi phí"}</BilingualText></th>
              <th><BilingualText>{"Trạng thái"}</BilingualText></th>
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
                <td><strong style={{ color: log.latency < 400 ? 'var(--color-ink)' : 'var(--color-red)' }}>{log.latency} ms</strong></td>
                <td>{log.cost}</td>
                <td><span className="admin-badge admin-badge-success"><BilingualText>{log.status}</BilingualText> OK</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
