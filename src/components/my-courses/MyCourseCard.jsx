import { CourseCard } from '@/features/course/LearnPage';
export function MyCourseCard({ course }) { return <CourseCard course={course} enrollment={{...course,progress:course}}/>; }
