import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, Tabs, Notice, EmptyState } from '@/components/common/Ui';

export function NotificationsPage() {
  const [filter,setFilter] = useState('all'), [error,setError] = useState(''), [busy,setBusy] = useState(false);
  const resource = useAsyncResource(useCallback(() => learnerService.getNotifications(), []));
  async function mark(id) {setBusy(true);setError('');try {if(id) await learnerService.markNotificationRead(id);else await learnerService.markAllNotificationsRead();resource.reload();}catch(err){setError(err.message);}finally{setBusy(false);}}
  return <section className="notification-page"><PageHeader title="Thông báo của bạn" description="Những cập nhật nhỏ trên hành trình học tiếng Việt." actions={<button className="secondary" disabled={busy || !resource.data?.some(item=>!item.read)} onClick={()=>mark()}><BilingualText>{"Đánh dấu tất cả đã đọc"}</BilingualText></button>}/>{error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}<Tabs value={filter} onChange={setFilter} items={[{id:'all',label:'Tất cả'},{id:'unread',label:'Chưa đọc'}]}/><ResourceState resource={resource}>{notifications => {const items=filter==='unread'?notifications.filter(item=>!item.read):notifications;return <div className="card notification-list">{items.length ? items.map(item=><article className={`notification-row ${item.read?'':'unread'}`} key={item.id}><span className="notification-icon" aria-hidden="true">{item.read?'✓':'♧'}</span><div><div className="notification-title"><h2><BilingualText vi={item.titleVi || item.title} en={item.title} /></h2><time className="muted">{item.time}</time></div><p className="muted">{item.message}</p><div className="actions">{item.link && <Link className="text-link" to={item.link} onClick={()=>{if(!item.read)mark(item.id);}}><BilingualText>{"Xem chi tiết →"}</BilingualText></Link>}{!item.read && <button className="secondary" disabled={busy} onClick={()=>mark(item.id)}><BilingualText>{"Đánh dấu đã đọc"}</BilingualText></button>}</div></div></article>) : <EmptyState title="Bạn đã xem hết thông báo" description="Các cập nhật mới sẽ xuất hiện tại đây."/>}</div>;}}</ResourceState></section>;
}
