import { useCallback, useEffect, useState } from 'react';
import { BilingualText, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useSiteContent } from '@/features/admin/context/SiteContentContext';
import { siteContentService } from '@/features/admin/api/siteContentService';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';
import { AdminSwitchToggle } from '@/shared/components/common/AdminSwitchToggle';
import {
  LayoutGrid,
  Menu as MenuIcon,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  AlertTriangle,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export function AdminSiteContentPage() {
  const lang = useTextLanguage();
  const [content, setContent] = useState({ menus: [], banners: [], features: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'features' | 'menus' | 'banners'
  const { refresh: refreshPublicContent } = useSiteContent();

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [menus, banners, features] = await Promise.all([
        siteContentService.getAdminMenus(),
        siteContentService.getAdminBanners(),
        siteContentService.getAdminFeatures(),
      ]);
      setContent({
        menus: Array.isArray(menus) ? menus : [],
        banners: Array.isArray(banners) ? banners : [],
        features: Array.isArray(features) ? features : [],
      });
    } catch (requestError) {
      setError(requestError.message || 'Không thể tải cấu hình menu và banner.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (kind, item, enabled) => {
    const identity = kind === 'features' ? item.key : item.id;
    const token = `${kind}:${identity}`;
    setBusy(token);
    setError('');
    try {
      const updated =
        kind === 'menus'
          ? await siteContentService.setMenuEnabled(item.id, enabled)
          : kind === 'banners'
          ? await siteContentService.setBannerEnabled(item.id, enabled)
          : await siteContentService.setFeatureEnabled(item.key, enabled);

      setContent((current) => ({
        ...current,
        [kind]: current[kind].map((entry) => {
          const matches = kind === 'features' ? entry.key === item.key : entry.id === item.id;
          return matches ? { ...entry, ...(updated || {}), enabled } : entry;
        }),
      }));
      await refreshPublicContent();
    } catch (requestError) {
      setError(requestError.message || 'Không thể cập nhật trạng thái.');
    } finally {
      setBusy('');
    }
  };

  const tabs = [
    { id: 'all', labelVi: 'Tất cả cấu hình', labelEn: 'All Content', icon: LayoutGrid, count: content.features.length + content.menus.length + content.banners.length },
    { id: 'features', labelVi: 'Nhóm chức năng', labelEn: 'Feature Flags', icon: Layers, count: content.features.length },
    { id: 'menus', labelVi: 'Menu điều hướng', labelEn: 'Navigation Menus', icon: MenuIcon, count: content.menus.length },
    { id: 'banners', labelVi: 'Banner trang chủ', labelEn: 'Home Banners', icon: ImageIcon, count: content.banners.length },
  ];

  return (
    <div className="admin-site-content-page">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#FFF7ED', border: '1px solid #FFEDD5', color: '#C2410C', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
            <LayoutGrid size={13} />
            <BilingualText vi="HỆ THỐNG · GIAO DIỆN & NỘI DUNG" en="SYSTEM · INTERFACE & CONTENT" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
            <BilingualText vi="Quản lý Menu & Banner" en="Menus & Banners Management" />
          </h1>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.92rem' }}>
            <BilingualText
              vi="Bật hoặc tắt menu điều hướng, banner quảng bá và các nhóm tính năng hiển thị cho học viên."
              en="Enable or disable navigation menus, home promotional banners, and active feature flags."
            />
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          disabled={loading || Boolean(busy)}
          onClick={load}
        >
          <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
          <BilingualText vi="Tải lại dữ liệu" en="Reload Data" />
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', marginBottom: 20, fontSize: 13, fontWeight: 600 }}>
          <AlertTriangle size={17} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid #E2E8F0', paddingBottom: 14 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`admin-btn ${isActive ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ height: 36, padding: '0 14px', fontSize: 12.5 }}
            >
              <Icon size={14} />
              <span><BilingualText vi={tab.labelVi} en={tab.labelEn} /></span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1px 6px',
                borderRadius: '999px',
                fontSize: 11,
                fontWeight: 700,
                background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#64748B',
                marginLeft: 4,
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
          <RefreshCw size={28} className="spin-animation" style={{ color: '#EA580C', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>
            <BilingualText vi="Đang tải cấu hình hệ thống…" en="Loading system configuration…" />
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* SECTION 1: NHÓM CHỨC NĂNG (FEATURE FLAGS) */}
          {(activeTab === 'all' || activeTab === 'features') && (
            <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={17} />
                  </div>
                  <div>
                    <h2 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 750, color: '#1E293B' }}>
                      <BilingualText vi="Nhóm tính năng hệ thống" en="System Feature Groups" />
                    </h2>
                    <small style={{ color: '#64748B', fontSize: 12 }}>
                      <BilingualText vi="Tắt một nhóm tính năng sẽ tự động ẩn tất cả menu và banner liên kết." en="Disabling a group automatically hides all associated navigation menus and banners." />
                    </small>
                  </div>
                </div>
                <span className="admin-status-badge admin-status-badge--review admin-status-badge--sm">
                  {content.features.length} <BilingualText vi="nhóm" en="features" />
                </span>
              </div>

              <div className="admin-table-container" style={{ border: 'none', borderRadius: 0, marginBottom: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}><BilingualText vi="Tên nhóm tính năng" en="Feature Name" /></th>
                      <th><BilingualText vi="Mã định danh (Key)" en="Feature Key" /></th>
                      <th style={{ textAlign: 'center' }}><BilingualText vi="Trạng thái" en="Status" /></th>
                      <th style={{ textAlign: 'right', paddingRight: 24 }}><BilingualText vi="Kích hoạt" en="Enable" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.features.map((feature) => {
                      const isEnabled = feature.enabled !== false;
                      const token = `features:${feature.key}`;
                      const isRowBusy = busy === token;
                      return (
                        <tr key={feature.key}>
                          <td>
                            <strong style={{ color: '#0F172A', display: 'block', marginBottom: 2 }}>
                              <BilingualText vi={feature.nameVi || feature.key} en={feature.nameEn || feature.nameVi || feature.key} />
                            </strong>
                            {feature.description && (
                              <span style={{ fontSize: 12, color: '#64748B' }}>{feature.description}</span>
                            )}
                          </td>
                          <td>
                            <code style={{ padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569', fontSize: 12, fontWeight: 600 }}>
                              {feature.key}
                            </code>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <AdminStatusBadge status={isEnabled ? 'ACTIVE' : 'INACTIVE'} />
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: 24 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              {isRowBusy && <RefreshCw size={13} className="spin-animation" style={{ color: '#EA580C' }} />}
                              <AdminSwitchToggle
                                checked={isEnabled}
                                disabled={Boolean(busy)}
                                onChange={(checked) => toggle('features', feature, checked)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION 2: MENU ĐIỀU HƯỚNG (NAVIGATION MENUS) */}
          {(activeTab === 'all' || activeTab === 'menus') && (
            <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MenuIcon size={17} />
                  </div>
                  <div>
                    <h2 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 750, color: '#1E293B' }}>
                      <BilingualText vi="Menu điều hướng website" en="Website Navigation Menus" />
                    </h2>
                    <small style={{ color: '#64748B', fontSize: 12 }}>
                      <BilingualText vi="Kiểm soát các đường dẫn hiển thị trên Header, Sidebar và Footer của học viên." en="Control links displayed across the learner header, sidebar, and footer." />
                    </small>
                  </div>
                </div>
                <span className="admin-status-badge admin-status-badge--published admin-status-badge--sm">
                  {content.menus.length} <BilingualText vi="mục menu" en="menus" />
                </span>
              </div>

              <div className="admin-table-container" style={{ border: 'none', borderRadius: 0, marginBottom: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}><BilingualText vi="Tên hiển thị & Mã" en="Label & Code" /></th>
                      <th><BilingualText vi="Vị trí hiển thị" en="Placement" /></th>
                      <th><BilingualText vi="Đường dẫn (URL)" en="Path URL" /></th>
                      <th><BilingualText vi="Nhóm liên kết" en="Linked Feature" /></th>
                      <th style={{ textAlign: 'center' }}><BilingualText vi="Trạng thái" en="Status" /></th>
                      <th style={{ textAlign: 'right', paddingRight: 24 }}><BilingualText vi="Hiển thị" en="Visible" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.menus.map((menu) => {
                      const isEnabled = menu.enabled !== false;
                      const token = `menus:${menu.id}`;
                      const isRowBusy = busy === token;
                      return (
                        <tr key={menu.id ?? menu.code}>
                          <td>
                            <strong style={{ color: '#0F172A', display: 'block' }}>
                              <BilingualText vi={menu.labelVi || menu.code} en={menu.labelEn || menu.labelVi || menu.code} />
                            </strong>
                            <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{menu.code}</span>
                          </td>
                          <td>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 11.5, fontWeight: 650, color: '#475569' }}>
                              {menu.placement}
                            </span>
                          </td>
                          <td>
                            <code style={{ fontSize: 12, color: '#2563EB' }}>{menu.path || '—'}</code>
                          </td>
                          <td>
                            {menu.featureKey ? (
                              <span style={{ fontSize: 12, color: '#64748B' }}>{menu.featureKey}</span>
                            ) : (
                              <span style={{ color: '#CBD5E1' }}>—</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <AdminStatusBadge status={isEnabled ? 'ACTIVE' : 'INACTIVE'} />
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: 24 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              {isRowBusy && <RefreshCw size={13} className="spin-animation" style={{ color: '#EA580C' }} />}
                              <AdminSwitchToggle
                                checked={isEnabled}
                                disabled={Boolean(busy)}
                                onChange={(checked) => toggle('menus', menu, checked)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION 3: BANNER TRANG CHỦ (HOME BANNERS) */}
          {(activeTab === 'all' || activeTab === 'banners') && (
            <section className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FDF4FF', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={17} />
                  </div>
                  <div>
                    <h2 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 750, color: '#1E293B' }}>
                      <BilingualText vi="Banner quảng bá trang chủ" en="Home Promotional Banners" />
                    </h2>
                    <small style={{ color: '#64748B', fontSize: 12 }}>
                      <BilingualText vi="Banner đang tắt hoặc ngoài khoảng lịch hiển thị sẽ không xuất hiện trong vòng quay banner." en="Banners disabled or outside their schedule will not show on the carousel." />
                    </small>
                  </div>
                </div>
                <span className="admin-status-badge admin-status-badge--draft admin-status-badge--sm">
                  {content.banners.length} <BilingualText vi="banner" en="banners" />
                </span>
              </div>

              <div className="admin-table-container" style={{ border: 'none', borderRadius: 0, marginBottom: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '35%' }}><BilingualText vi="Tiêu đề banner" en="Banner Title" /></th>
                      <th><BilingualText vi="Vị trí" en="Placement" /></th>
                      <th><BilingualText vi="Lịch hiển thị" en="Schedule" /></th>
                      <th><BilingualText vi="Nhóm tính năng" en="Feature" /></th>
                      <th style={{ textAlign: 'center' }}><BilingualText vi="Trạng thái" en="Status" /></th>
                      <th style={{ textAlign: 'right', paddingRight: 24 }}><BilingualText vi="Bật / tắt" en="Toggle" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.banners.map((banner) => {
                      const isEnabled = banner.enabled !== false;
                      const token = `banners:${banner.id}`;
                      const isRowBusy = busy === token;
                      const schedule = [banner.startsAt, banner.endsAt].filter(Boolean).map((value) => new Date(value).toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')).join(' → ') || 'Luôn hiển thị';

                      return (
                        <tr key={banner.id ?? banner.code}>
                          <td>
                            <strong style={{ color: '#0F172A', display: 'block' }}>
                              <BilingualText vi={banner.titleVi || banner.code} en={banner.titleEn || banner.titleVi || banner.code} />
                            </strong>
                            <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{banner.code}</span>
                          </td>
                          <td>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 11.5, fontWeight: 650, color: '#475569' }}>
                              {banner.placement}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                              <Calendar size={13} style={{ color: '#94A3B8' }} />
                              <span>{schedule}</span>
                            </div>
                          </td>
                          <td>
                            {banner.featureKey ? (
                              <span style={{ fontSize: 12, color: '#64748B' }}>{banner.featureKey}</span>
                            ) : (
                              <span style={{ color: '#CBD5E1' }}>—</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <AdminStatusBadge status={isEnabled ? 'ACTIVE' : 'INACTIVE'} />
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: 24 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              {isRowBusy && <RefreshCw size={13} className="spin-animation" style={{ color: '#EA580C' }} />}
                              <AdminSwitchToggle
                                checked={isEnabled}
                                disabled={Boolean(busy)}
                                onChange={(checked) => toggle('banners', banner, checked)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminSiteContentPage;
