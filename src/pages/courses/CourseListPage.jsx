import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/course/CourseCard';
import { ResourceState } from '@/components/common/ResourceState';
import { PageHeader, Tabs, EmptyState } from '@/components/common/Ui';
export function CourseListPage() {
 const resource = useCourses();
 const [search,setSearch]=useState(''); const [level,setLevel]=useState('all');
 return <section><PageHeader eyebrow="Mỗi ngày một chút" title="Học tiếng Việt" description="Tìm điểm bắt đầu của bạn. Học ngôn ngữ theo cách của riêng mình." actions={<Link className="button secondary" to="/my-learning"><BilingualText>{"Góc học tập →"}</BilingualText></Link>}/>
 <div className="library-toolbar"><input aria-label="Tìm khóa học" placeholder={bilingualLabel("⌕ Tìm khóa học…")} value={search} onChange={e=>setSearch(e.target.value)}/><Tabs label="Trình độ khóa học" value={level} onChange={setLevel} items={['all','A0','A1','A2','B1','B2','C1'].map(id=>({id,label:id==='all'?'Tất cả':id}))}/></div>
 <ResourceState resource={resource}>{items=>{const filtered=items.filter(({course})=>(level==='all'||course.level===level)&&`${course.title} ${course.description}`.toLowerCase().includes(search.toLowerCase())); const enrolled=filtered.filter(i=>i.enrollment?.isEnrolled);return <>{enrolled.length>0&&<><h2><BilingualText>{"Tiếp nối hành trình của bạn"}</BilingualText></h2><div className="course-resume-strip"><div><strong>{enrolled[0].course.title}</strong><small><BilingualText>{"Khóa học đang theo học"}</BilingualText></small></div><Link className="button" to={`/learn/${enrolled[0].course.id}`}><BilingualText>{"Tiếp tục →"}</BilingualText></Link></div></>}<h2><BilingualText>{"Một thế giới để khám phá"}</BilingualText></h2>{filtered.length?<div className="card-grid">{filtered.map(({course,enrollment})=><CourseCard key={course.id} course={course} enrollment={enrollment}/>)}</div>:<EmptyState title={items.length?'Không tìm thấy khóa học':'Các khóa học sẽ sớm có mặt'} description={items.length?'Thử từ khóa hoặc trình độ khác.':'Hãy quay lại sau để khám phá bài học mới.'}/>}</>}}</ResourceState></section>;
}
