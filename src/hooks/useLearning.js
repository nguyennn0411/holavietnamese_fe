import { useCallback } from "react";
import { courseService } from "@/features/shared/services";
import { useAsyncResource } from "./useAsyncResource";
export function useResumeCourse(courseId) {
  return useAsyncResource(useCallback(async () => {
    const course = await courseService.getCourse(courseId);
    const lessons = course.modules.flatMap(m=>m.lessons).filter(l=>!l.isLocked);
    const target = lessons.find(l=>l.id===course.enrollment?.lastAccessedLessonId)
      || lessons.find(l=>l.learningStatus!=="COMPLETED") || lessons[0];
    return target?.id || null;
  },[courseId]));
}
