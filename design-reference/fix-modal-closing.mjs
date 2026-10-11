import fs from 'node:fs/promises';
for(const path of ['src/pages/admin/AdminAchievementsPage.jsx','src/pages/admin/AdminCultureCategoriesPage.jsx']){let text=await fs.readFile(path,'utf8');text=text.replace(/<\/form>\s*<\/div>\s*<\/div>\s*\)}/,'</form>\n        </Modal>\n      )}');await fs.writeFile(path,text);}
