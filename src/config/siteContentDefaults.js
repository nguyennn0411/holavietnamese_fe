import guestPhoImage from '@/assets/images/guest-carousel/vietnam-pho-banner.jpg';
import guestTetImage from '@/assets/images/guest-carousel/vietnam-tet-banner.jpg';
import guestMidAutumnImage from '@/assets/images/guest-carousel/vietnam-mid-autumn-banner.jpg';
import guestHoiAnImage from '@/assets/images/guest-carousel/vietnam-hoi-an-banner.jpg';
import learnerBunChaImage from '@/assets/images/learner-carousel/bun-cha.webp';
import learnerMausoleumImage from '@/assets/images/learner-carousel/ho-chi-minh-mausoleum.webp';
import learnerTetImage from '@/assets/images/learner-carousel/vietnamese-tet.webp';
import learnerMidAutumnImage from '@/assets/images/learner-carousel/mid-autumn-festival.webp';

export const MENU_PLACEMENTS = Object.freeze({
  GUEST: 'GUEST_SIDEBAR',
  LEARNER: 'LEARNER_SIDEBAR',
});

export const BANNER_PLACEMENTS = Object.freeze({
  GUEST_HOME: 'GUEST_HOME_HERO',
  LEARNER_HOME: 'LEARNER_HOME_HERO',
});

export const DEFAULT_MENU_ITEMS = Object.freeze([
  {
    code: 'GUEST_HOME', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Trang chủ', labelEn: 'Home',
    path: '/', iconKey: 'home', displayOrder: 10, enabled: true, authRequired: false, mobilePrimary: false, featureKey: 'HOME',
  },
  {
    code: 'GUEST_LEARNING_PATH', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Lộ trình học', labelEn: 'Learning Path',
    path: '/edtech/dashboard', iconKey: 'compass', displayOrder: 20, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'LEARNING_PATH',
  },
  {
    code: 'GUEST_COURSES', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Khóa học', labelEn: 'Courses',
    path: '/courses', iconKey: 'graduation-cap', displayOrder: 30, enabled: true, authRequired: false, mobilePrimary: false, featureKey: 'COURSES',
  },
  {
    code: 'GUEST_ALPHABET', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Bảng chữ cái tiếng Việt', labelEn: 'Vietnamese Alphabet',
    path: '/alphabet', iconKey: 'languages', displayOrder: 40, enabled: true, authRequired: false, mobilePrimary: false, featureKey: 'ALPHABET',
  },
  {
    code: 'GUEST_VOCABULARY', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Từ vựng', labelEn: 'Vocabulary',
    path: '/vocabulary', iconKey: 'book-open', displayOrder: 50, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'VOCABULARY',
  },
  {
    code: 'GUEST_EXPLORE', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Khám phá Việt Nam', labelEn: 'Explore Vietnam',
    path: '/explore-vietnam', iconKey: 'compass', displayOrder: 60, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'EXPLORE',
  },
  {
    code: 'GUEST_CULTURE', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Văn hóa Việt Nam', labelEn: 'Vietnamese Culture',
    path: '/culture', iconKey: 'palette', displayOrder: 70, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'CULTURE',
  },
  {
    code: 'GUEST_BLOG', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Blog', labelEn: 'Blog',
    path: '/blog', iconKey: 'newspaper', displayOrder: 80, enabled: true, authRequired: false, mobilePrimary: false, featureKey: 'BLOG',
  },
  {
    code: 'GUEST_AI_TUTOR', placement: MENU_PLACEMENTS.GUEST, labelVi: 'Gia sư AI', labelEn: 'AI Tutor',
    path: '/ai-tutor', iconKey: 'bot', displayOrder: 90, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'AI_TUTOR',
  },
  {
    code: 'LEARNER_HOME', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Học tập', labelEn: 'Learn',
    path: '/', iconKey: 'home', displayOrder: 10, enabled: true, authRequired: false, mobilePrimary: true, featureKey: 'HOME',
  },
  {
    code: 'LEARNER_LEARNING_PATH', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Lộ trình học', labelEn: 'Learning Path',
    path: '/edtech/dashboard', iconKey: 'compass', displayOrder: 20, enabled: true, authRequired: true, mobilePrimary: true, featureKey: 'LEARNING_PATH',
  },
  {
    code: 'LEARNER_COURSES', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Khóa học', labelEn: 'Courses',
    path: '/courses', iconKey: 'book-open', displayOrder: 30, enabled: true, authRequired: false, mobilePrimary: true, featureKey: 'COURSES',
  },
  {
    code: 'LEARNER_MY_LEARNING', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Góc học tập', labelEn: 'My learning',
    path: '/my-learning', iconKey: 'graduation-cap', displayOrder: 40, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'MY_LEARNING',
  },
  {
    code: 'LEARNER_VOCABULARY', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Từ vựng', labelEn: 'Vocabulary',
    path: '/vocabulary', iconKey: 'languages', displayOrder: 50, enabled: true, authRequired: true, mobilePrimary: true, featureKey: 'VOCABULARY',
  },
  {
    code: 'LEARNER_EXPLORE', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Khám phá Việt Nam', labelEn: 'Explore Vietnam',
    path: '/explore', iconKey: 'compass', displayOrder: 60, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'EXPLORE',
  },
  {
    code: 'LEARNER_CULTURE', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Văn hóa Việt Nam', labelEn: 'Vietnamese Culture',
    path: '/culture', iconKey: 'palette', displayOrder: 70, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'CULTURE',
  },
  {
    code: 'LEARNER_BLOG', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Blog', labelEn: 'Blog',
    path: '/blog', iconKey: 'newspaper', displayOrder: 80, enabled: true, authRequired: false, mobilePrimary: false, featureKey: 'BLOG',
  },
  {
    code: 'LEARNER_PRONUNCIATION', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Phát âm', labelEn: 'Pronunciation',
    path: '/alphabet', iconKey: 'mic-2', displayOrder: 90, enabled: true, authRequired: false, mobilePrimary: true, featureKey: 'ALPHABET',
  },
  {
    code: 'LEARNER_LISTENING', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Luyện nghe', labelEn: 'Listening',
    path: null, iconKey: 'headphones', displayOrder: 100, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'LISTENING',
    available: false, statusVi: 'Trong bài học', statusEn: 'Inside lessons',
  },
  {
    code: 'LEARNER_SPEAKING', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Luyện nói', labelEn: 'Speaking Practice',
    path: '/ai-scenarios', iconKey: 'graduation-cap', displayOrder: 110, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'AI_SPEAKING',
  },
  {
    code: 'LEARNER_AI_CONVERSATION', placement: MENU_PLACEMENTS.LEARNER, labelVi: 'Hội thoại AI', labelEn: 'AI Conversation',
    path: '/ai-tutor', iconKey: 'bot', displayOrder: 120, enabled: true, authRequired: true, mobilePrimary: false, featureKey: 'AI_TUTOR',
  },
]);

export const DEFAULT_BANNERS = Object.freeze([
  {
    code: 'GUEST_PHO', placement: BANNER_PLACEMENTS.GUEST_HOME, displayOrder: 10, enabled: true, featureKey: 'GUEST_HOME_HERO',
    eyebrowVi: 'Ẩm thực Việt Nam · Phở', eyebrowEn: 'Vietnamese cuisine · Phở',
    titleVi: 'Khám phá Việt Nam qua từng hương vị.', titleEn: 'Discover Vietnam, One Flavor at a Time.',
    descriptionVi: 'Tìm hiểu ngôn ngữ và văn hóa Việt Nam qua những hương vị quen thuộc.', descriptionEn: 'Explore Vietnamese language and culture through the flavors of everyday life.',
    imageUrl: guestPhoImage,
    imageAltVi: 'Hai tô phở bò Việt Nam ăn cùng rau thơm và chanh', imageAltEn: 'Two authentic bowls of phở bò served with Vietnamese herbs and lime',
    photoLabelVi: 'Phở bò · Thành phố Hồ Chí Minh', photoLabelEn: 'Phở bò · Ho Chi Minh City',
    actionType: 'INTERNAL_ROUTE', actionLabelVi: 'Bắt đầu học', actionLabelEn: 'Start Learning', actionTarget: '/welcome',
  },
  {
    code: 'GUEST_TET', placement: BANNER_PLACEMENTS.GUEST_HOME, displayOrder: 20, enabled: true, featureKey: 'GUEST_HOME_HERO',
    eyebrowVi: 'Tết cổ truyền Việt Nam', eyebrowEn: 'Vietnamese Lunar New Year · Tết',
    titleVi: 'Khám phá nét đẹp Tết Việt.', titleEn: 'Experience the Magic of Vietnamese Tết.',
    descriptionVi: 'Tìm hiểu những phong tục và lời chúc ý nghĩa trong ngày Tết cổ truyền.', descriptionEn: 'Discover meaningful traditions and expressions that bring Vietnamese families together.',
    imageUrl: guestTetImage,
    imageAltVi: 'Gia đình Việt Nam quây quần gói bánh tét đón Tết', imageAltEn: 'A Vietnamese family gathering to prepare bánh tét for Lunar New Year',
    photoLabelVi: 'Truyền thống gia đình ngày Tết · Việt Nam', photoLabelEn: 'Tết family tradition · Vietnam',
    actionType: 'INTERNAL_ROUTE', actionLabelVi: 'Khám phá tiếng Việt', actionLabelEn: 'Explore Vietnamese', actionTarget: '/welcome',
  },
  {
    code: 'GUEST_MID_AUTUMN', placement: BANNER_PLACEMENTS.GUEST_HOME, displayOrder: 30, enabled: true, featureKey: 'GUEST_HOME_HERO',
    eyebrowVi: 'Lễ hội truyền thống · Tết Trung Thu', eyebrowEn: 'Mid-Autumn Festival · Tết Trung Thu',
    titleVi: 'Rực rỡ sắc màu Tết Trung Thu.', titleEn: 'Celebrate the Colors of Mid-Autumn Festival.',
    descriptionVi: 'Khám phá tiếng Việt qua những lễ hội và phong tục đầy màu sắc.', descriptionEn: 'Learn Vietnamese through the joyful festivals and traditions of Vietnam.',
    imageUrl: guestMidAutumnImage,
    imageAltVi: 'Những chiếc đèn ông sao đầy màu sắc cho Tết Trung Thu Việt Nam', imageAltEn: 'Colorful handmade star lanterns for Vietnamese Mid-Autumn Festival',
    photoLabelVi: 'Đèn ông sao · Kon Tum', photoLabelEn: 'Star lanterns · Kon Tum',
    actionType: 'INTERNAL_ROUTE', actionLabelVi: 'Khám phá thêm', actionLabelEn: 'Discover More', actionTarget: '/welcome',
  },
  {
    code: 'GUEST_HOI_AN', placement: BANNER_PLACEMENTS.GUEST_HOME, displayOrder: 40, enabled: true, featureKey: 'GUEST_HOME_HERO',
    eyebrowVi: 'Di sản Việt Nam · Hội An', eyebrowEn: 'Vietnamese heritage · Hội An',
    titleVi: 'Ngôn ngữ kết nối những câu chuyện văn hóa.', titleEn: 'A Language Full of Culture and Stories.',
    descriptionVi: 'Bắt đầu hành trình học tiếng Việt và khám phá những nét đẹp của đất nước, con người Việt Nam.', descriptionEn: 'Begin your Vietnamese journey and discover the places, people, and traditions behind every word.',
    imageUrl: guestHoiAnImage,
    imageAltVi: 'Phố cổ và dòng sông Hội An rực sáng bởi đèn lồng về đêm', imageAltEn: 'Hoi An ancient town and river illuminated by lanterns at night',
    photoLabelVi: 'Phố cổ Hội An · Việt Nam', photoLabelEn: 'Hội An ancient town · Vietnam',
    actionType: 'INTERNAL_ROUTE', actionLabelVi: 'Bắt đầu hành trình', actionLabelEn: 'Begin Your Journey', actionTarget: '/welcome',
  },
  {
    code: 'LEARNER_BUNCHA', placement: BANNER_PLACEMENTS.LEARNER_HOME, displayOrder: 10, enabled: true, featureKey: 'LEARNER_HOME_HERO',
    eyebrowVi: 'Ẩm thực Việt Nam · Hà Nội', eyebrowEn: 'Vietnamese Cuisine · Hà Nội',
    titleVi: 'Khám phá Việt Nam qua từng hương vị', titleEn: 'Discover Vietnam Through Its Flavors',
    descriptionVi: 'Học tiếng Việt và trải nghiệm nét đẹp truyền thống của ẩm thực Việt Nam đậm đà bản sắc.', descriptionEn: 'Learn Vietnamese while exploring the delicious traditions of Vietnamese cuisine.',
    imageUrl: learnerBunChaImage,
    imageAltVi: 'Bún chả Hà Nội truyền thống với thịt nướng, bún tươi, rau sống và nước chấm', imageAltEn: 'Authentic Hanoi bún chả with grilled pork, rice noodles, fresh herbs, and dipping sauce',
    actionType: 'CONTINUE_LEARNING', actionLabelVi: 'Tiếp tục học', actionLabelEn: 'Continue Learning', actionTarget: null,
  },
  {
    code: 'LEARNER_MAUSOLEUM', placement: BANNER_PLACEMENTS.LEARNER_HOME, displayOrder: 20, enabled: true, featureKey: 'LEARNER_HOME_HERO',
    eyebrowVi: 'Lịch sử & Di sản · Hà Nội', eyebrowEn: 'History & Heritage · Hà Nội',
    titleVi: 'Khám phá lịch sử và di sản Việt Nam', titleEn: "Explore Vietnam's History and Heritage",
    descriptionVi: 'Khám phá tiếng Việt qua các dấu ấn lịch sử và danh lam văn hóa tiêu biểu của Việt Nam.', descriptionEn: 'Discover Vietnamese language through the history and cultural landmarks of Vietnam.',
    imageUrl: learnerMausoleumImage,
    imageAltVi: 'Lăng Chủ tịch Hồ Chí Minh tại Quảng trường Ba Đình, Hà Nội', imageAltEn: 'Ho Chi Minh Mausoleum in Ba Đình Square, Hanoi',
    actionType: 'INTERNAL_ROUTE', actionLabelVi: 'Khám phá di sản', actionLabelEn: 'Explore Landmarks', actionTarget: '/culture',
  },
  {
    code: 'LEARNER_TET', placement: BANNER_PLACEMENTS.LEARNER_HOME, displayOrder: 30, enabled: true, featureKey: 'LEARNER_HOME_HERO',
    eyebrowVi: 'Tết Cổ Truyền · Tết Nguyên Đán', eyebrowEn: 'Lunar New Year · Tết Nguyên Đán',
    titleVi: 'Hòa mình vào không khí Tết Việt', titleEn: 'Celebrate the Spirit of Vietnamese Tết',
    descriptionVi: 'Tìm hiểu phong tục, lời chúc và nét đẹp văn hóa ngày lễ quan trọng nhất trong năm.', descriptionEn: "Discover the traditions, greetings, and customs of Vietnam's most important holiday.",
    imageUrl: learnerTetImage,
    imageAltVi: 'Mâm cỗ Tết truyền thống với bánh chưng, giò lụa và món ăn ngày Tết', imageAltEn: 'Traditional Vietnamese Tết spread with square bánh chưng, giò lụa, and festive accompaniments',
    actionType: 'CONTINUE_LEARNING', actionLabelVi: 'Khám phá truyền thống', actionLabelEn: 'Explore Traditions', actionTarget: null,
  },
  {
    code: 'LEARNER_MID_AUTUMN', placement: BANNER_PLACEMENTS.LEARNER_HOME, displayOrder: 40, enabled: true, featureKey: 'LEARNER_HOME_HERO',
    eyebrowVi: 'Lễ hội truyền thống · Trung Thu', eyebrowEn: 'Traditional Festivals · Trung Thu',
    titleVi: 'Trải nghiệm sắc màu Tết Trung Thu', titleEn: 'Experience the Magic of Mid-Autumn Festival',
    descriptionVi: 'Khám phá văn hóa Việt Nam qua lễ hội rực rỡ sắc màu và những phong tục đầy ý nghĩa.', descriptionEn: 'Explore Vietnamese culture through colorful festivals and meaningful traditions.',
    imageUrl: learnerMidAutumnImage,
    imageAltVi: 'Đêm hội Tết Trung Thu Việt Nam với đoàn múa lân sư rồng và đèn lồng truyền thống', imageAltEn: 'Authentic Vietnamese Trung Thu celebration with traditional lion dances and festival lanterns',
    actionType: 'INTERNAL_ROUTE', actionLabelVi: 'Khám phá lễ hội', actionLabelEn: 'Explore Festivals', actionTarget: '/ai-tutor',
  },
]);

export const BUNDLED_BANNER_IMAGES = Object.freeze({
  ...Object.fromEntries(DEFAULT_BANNERS.map((banner) => [banner.code, banner.imageUrl])),
  // Cultural alias fallbacks for Guest banners
  GUEST_HERO_1: guestPhoImage,
  GUEST_HERO_2: guestTetImage,
  GUEST_HERO_3: guestMidAutumnImage,
  GUEST_HERO_4: guestHoiAnImage,
  GUEST_1: guestPhoImage,
  GUEST_2: guestTetImage,
  GUEST_3: guestMidAutumnImage,
  GUEST_4: guestHoiAnImage,
  SLIDE_1: guestPhoImage,
  SLIDE_2: guestTetImage,
  SLIDE_3: guestMidAutumnImage,
  SLIDE_4: guestHoiAnImage,
  SLIDE_5: learnerMidAutumnImage,
  // Cultural alias fallbacks for Learner banners
  LEARNER_HERO_1: learnerBunChaImage,
  LEARNER_HERO_2: learnerMausoleumImage,
  LEARNER_HERO_3: learnerTetImage,
  LEARNER_HERO_4: learnerMidAutumnImage,
  LEARNER_1: learnerBunChaImage,
  LEARNER_2: learnerMausoleumImage,
  LEARNER_3: learnerTetImage,
  LEARNER_4: learnerMidAutumnImage,
});
