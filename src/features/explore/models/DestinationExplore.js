// Resolve linked content from the owning modules' APIs. Explore stores only IDs.
import { cultureService } from '../../culture/api/cultureService.js';

const projectCulture = ({ id, title, titleVi, titleEn, summary, summaryVi, summaryEn, coverImage, destinationName }) =>
  ({ id, title, titleVi, titleEn, summary, summaryVi, summaryEn, coverImage, destinationName });
export const exploreCultures = async options =>
  (await cultureService.listArticlesFromApi(options)).map(projectCulture);
export const resolveExploreCultures = async (ids, options) => {
  if (!ids?.length) return [];
  return (await cultureService.getArticlesByIds(ids, options)).map(projectCulture);
};
// The Backend owns scenario availability; an ACTIVE API record is directly openable.
export const openableExploreScenarios = rows => rows.filter(item => item.status === 'ACTIVE');
