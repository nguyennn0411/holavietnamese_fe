// Use the source modules' learner catalogues without copying content or changing their storage.
import { cultureService } from '../../culture/api/cultureService.js';
import { aiRoleplayService } from '../../ai/api/aiRoleplayService.js';

export const exploreCultures = () => cultureService.listArticles().map(({ id, title, summary, coverImage, destinationName }) => ({ id, title, summary, coverImage, destinationName }));
export const resolveExploreCultures = ids => ids.map(id => exploreCultures().find(item => item.id === id)).filter(Boolean);
// Existing scenario screens resolve their own catalogue by ID; only link IDs they can open.
export const openableExploreScenarios = rows => rows.filter(item => item.status === 'ACTIVE' && aiRoleplayService.getScenario(item.id)?.id === item.id);
