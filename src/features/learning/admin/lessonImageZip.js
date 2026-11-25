import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import Papa from 'papaparse';

export const MAX_IMAGES = 100;
export const MAX_ZIP_SIZE = 50 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_MANIFEST_SIZE = 128 * 1024;
const IMAGE_TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
const MAX_PATH_LENGTH = 400;
const collator = new Intl.Collator('en', { numeric: true });

export const ASSET_LABELS = {
  '01-knowledge': ['Kiến thức', 'Knowledge'],
  '02-vocabulary': ['Từ vựng', 'Vocabulary'],
  '03-practice': ['Thực hành', 'Practice'],
  '04-picture-cards': ['Thẻ hình', 'Picture cards'],
};

const pathKey = path => path.normalize('NFC').toLowerCase();
const fileName = path => path.split('/').at(-1);
function imageMime(path) {
  const leaf = fileName(path);
  const dot = leaf.lastIndexOf('.');
  if (dot < 1) return undefined;
  const extension = leaf.slice(dot + 1).toLowerCase();
  return Object.hasOwn(IMAGE_TYPES, extension) ? IMAGE_TYPES[extension] : undefined;
}

function cleanPath(input) {
  const path = input.normalize('NFC').trim();
  const parts = path.split('/');
  if (path.length > MAX_PATH_LENGTH || /[\\:\x00-\x1f\x7f]/.test(path)
      || parts.some(part => !part || part === '.' || part === '..' || part.length > 255 || part !== part.trim())) {
    throw new Error(`Đường dẫn trong ZIP không hợp lệ: ${input.slice(0, MAX_PATH_LENGTH)}`);
  }
  return path;
}

function matchesImageType(data, mime) {
  if (mime === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => data[index] === byte);
  if (mime === 'image/jpeg') return data[0] === 255 && data[1] === 216 && data[2] === 255;
  return data.length >= 16 && strFromU8(data.subarray(0, 4), true) === 'RIFF'
    && strFromU8(data.subarray(8, 12), true) === 'WEBP';
}

export function readLessonImageZip(bytes) {
  if (bytes.length > MAX_ZIP_SIZE) throw new Error('File ZIP vượt quá 50 MB.');
  const paths = new Map();
  let expandedSize = 0;
  let entryCount = 0;
  let imageCount = 0;
  const archive = unzipSync(bytes, {
    filter({ name, originalSize }) {
      if (++entryCount > 500) throw new Error('ZIP chứa quá nhiều mục.');
      if (name.endsWith('/')) return false;
      const path = cleanPath(name);
      const leaf = fileName(path);
      if (path.split('/').includes('__MACOSX') || leaf.startsWith('._')) return false;
      const manifest = leaf.toLowerCase() === 'manifest.csv';
      if (!manifest && !imageMime(path)) return false;
      if (paths.has(pathKey(path))) throw new Error(`ZIP có đường dẫn trùng: ${path}`);
      if (manifest && originalSize > MAX_MANIFEST_SIZE) throw new Error('manifest.csv vượt quá 128 KB.');
      if (!manifest && ++imageCount > MAX_IMAGES) throw new Error(`ZIP chỉ hỗ trợ tối đa ${MAX_IMAGES} ảnh.`);
      expandedSize += originalSize;
      if (expandedSize > MAX_ZIP_SIZE) throw new Error('Tổng kích thước sau giải nén vượt quá 50 MB.');
      paths.set(pathKey(path), { originalName: name, path, originalSize, manifest });
      return manifest || originalSize <= MAX_IMAGE_SIZE;
    },
  });
  const manifests = [...paths.values()].filter(entry => entry.manifest);
  if (manifests.length !== 1) throw new Error('ZIP phải chứa đúng một file manifest.csv.');
  const manifest = manifests[0];
  const parent = manifest.path.slice(0, manifest.path.lastIndexOf('/') + 1);
  const parsed = Papa.parse(strFromU8(archive[manifest.originalName]), { header: true, delimiter: ',', skipEmptyLines: 'greedy' });
  const headers = parsed.meta.fields || [];
  if (parsed.errors.length || parsed.meta.renamedHeaders
      || !['lessonKey', 'file'].every(field => headers.includes(field))) {
    throw new Error('manifest.csv không hợp lệ. Cần ít nhất hai cột lessonKey và file.');
  }
  if (!parsed.data.length || parsed.data.length > MAX_IMAGES) {
    throw new Error(`manifest.csv phải có từ 1 đến ${MAX_IMAGES} dòng ảnh.`);
  }

  const seen = new Map();
  const referenced = new Set();
  const rows = parsed.data.map((record, index) => {
    const row = {
      id: index,
      lessonKey: (record.lessonKey || '').trim(),
      lessonTitleVi: (record.lessonTitleVi || '').trim(),
      assetType: (record.assetType || '').trim(),
      path: (record.file || '').trim(),
    };
    try {
      if (!row.lessonKey || row.lessonKey.length > 200) throw new Error('Thiếu mã bài học hợp lệ.');
      row.path = cleanPath(row.path);
      if (row.assetType.length > 200) throw new Error('Loại ảnh vượt quá 200 ký tự.');
      row.fileName = fileName(row.path);
      const mime = imageMime(row.path);
      if (!mime) throw new Error('Chỉ nhận ảnh PNG, JPG và WebP.');
      const entryKey = pathKey(parent + row.path);
      referenced.add(entryKey);
      const entry = paths.get(entryKey);
      if (!entry) throw new Error('Không tìm thấy ảnh trong ZIP.');
      if (entry.originalSize > MAX_IMAGE_SIZE) throw new Error('Ảnh vượt quá 5 MB.');
      const data = archive[entry.originalName];
      if (!data || data.length !== entry.originalSize || !matchesImageType(data, mime)) {
        throw new Error('Nội dung ảnh không khớp định dạng.');
      }
      const identity = `${pathKey(row.lessonKey)}\u0000${pathKey(row.fileName)}`;
      const earlier = seen.get(identity);
      if (earlier) {
        earlier.issue = 'Cùng tên ảnh xuất hiện nhiều lần trong bài.';
        throw new Error(earlier.issue);
      }
      seen.set(identity, row);
      row.blob = new Blob([data], { type: mime });
    } catch (error) {
      row.issue = error.message;
    }
    return row;
  });
  rows.sort((left, right) => collator.compare(left.lessonKey, right.lessonKey)
    || collator.compare(left.assetType || left.path, right.assetType || right.path)
    || left.id - right.id);
  const unused = [...paths].filter(([key, entry]) => !entry.manifest && !referenced.has(key))
    .map(([, entry]) => entry.path);
  return { rows, unused };
}

export function makeLessonImageTemplate(lesson, examplePng) {
  const entries = {};
  const records = Object.keys(ASSET_LABELS).slice(0, 3).map(assetType => {
    const file = `images/${assetType}.png`;
    entries[file] = examplePng;
    return { lessonKey: lesson.code, assetType, file, lessonTitleVi: lesson.titleVi || lesson.title };
  });
  entries['manifest.csv'] = strToU8('\ufeff' + Papa.unparse(records, { escapeFormulae: true }));
  entries['README.txt'] = strToU8([
    'MẪU NHẬP ẢNH BÀI HỌC · HOLA VIETNAMESE',
    '1. Giải nén và thay ảnh mẫu trong images/ bằng ảnh thật.',
    '2. Sửa manifest.csv (UTF-8). lessonKey là mã bài trong khóa, file là đường dẫn tương đối đến ảnh.',
    '3. Mỗi ảnh một dòng. assetType giúp gợi ý mục nội dung; lessonTitleVi dùng để tham khảo.',
    '4. Nén lại thành ZIP, rồi kiểm tra mục nội dung đích của từng ảnh trong Course Studio trước khi gắn.',
    'Giới hạn: JPG, PNG hoặc WebP tối đa 5 MB/ảnh; 100 ảnh và 50 MB mỗi gói.',
  ].join('\r\n'));
  return zipSync(entries, { level: 0 });
}
