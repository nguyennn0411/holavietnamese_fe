import fs from 'node:fs/promises';
const edit=async(path,fn)=>fs.writeFile(path,fn(await fs.readFile(path,'utf8')));
await edit('src/pages/admin/AdminUsersPage.jsx',text=>"import { Modal } from '@/components/common/Modal';\n"+text.replace('<div className="admin-modal-overlay"><div className="admin-card" style={{ width: \'min(420px, calc(100% - 32px))\', padding: 28 }}>','<Modal title="Cập nhật vai trò" onClose={()=>setRoleUser(null)}>').replace('<h2>Cập nhật vai trò</h2>','').replace('</div></div>}','</Modal>}'));
await edit('src/pages/admin/AdminCultureCategoriesPage.jsx',text=>{
 text="import { Modal } from '@/components/common/Modal';\n"+text;
 const start=text.indexOf('<div className="admin-modal-overlay">'),form=text.indexOf('<form onSubmit={handleSave}>',start);
 text=text.slice(0,start)+'<Modal title={editingCategory.id ? "Chỉnh sửa danh mục" : "Thêm danh mục văn hóa"} onClose={()=>setEditingCategory(null)}>\n'+text.slice(form);
 return text.replace('</form>\n          </div>\n        </div>','</form>\n        </Modal>');
});
await edit('src/pages/admin/AdminAchievementsPage.jsx',text=>{
 text="import { Modal } from '@/components/common/Modal';\n"+text;
 const start=text.indexOf('<div style={{',text.indexOf('{showModal && (')),form=text.indexOf('<form onSubmit={handleCreate}',start);
 text=text.slice(0,start)+'<Modal title={editingId ? "Cập nhật huy hiệu" : "Khởi tạo huy hiệu mới"} onClose={()=>setShowModal(false)}>\n'+text.slice(form);
 text=text.replace('</form>\n          </div>\n        </div>','</form>\n        </Modal>');
 text=text.replace("const [msg, setMsg] = useState('');","const [msg, setMsg] = useState('');\n  const [error,setError]=useState('');");
 text=text.replace('adminService.getAchievements().then(setAchievements);','adminService.getAchievements().then(setAchievements).catch(err=>setError(err.message));');
 text=text.replace('const res = editingId','setError(\'\');\n    try {const res = editingId').replace("setTimeout(() => setMsg(''), 3000);","setTimeout(() => setMsg(''), 3000);\n    }catch(err){setError(err.message);}");
 text=text.replace('{msg && (','{error&&<div className="ui-notice ui-notice--error" role="alert">{error}</div>}\n      {msg && (');
 return text;
});
