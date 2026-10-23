// AI Roleplay & Scenarios Service (Người 4: /ai-scenarios, /ai-scenarios/:id, /ai-roleplay/:id, /ai-sessions/:id/result)

import axiosClient from '../infrastructure/api/axiosClient.js';

export const SCENARIO_LEVELS = [
  { id: 'all', label: 'Tất cả trình độ', labelVi: 'Tất cả trình độ', labelEn: 'All Levels' },
  { id: 'A1', label: 'A1 - Sơ cấp 1', labelVi: 'A1 - Sơ cấp 1', labelEn: 'A1 - Beginner 1' },
  { id: 'A2', label: 'A2 - Sơ cấp 2', labelVi: 'A2 - Sơ cấp 2', labelEn: 'A2 - Beginner 2' },
  { id: 'B1', label: 'B1 - Trung cấp 1', labelVi: 'B1 - Trung cấp 1', labelEn: 'B1 - Intermediate 1' },
  { id: 'B2', label: 'B2 - Trung cấp 2', labelVi: 'B2 - Trung cấp 2', labelEn: 'B2 - Intermediate 2' },
  { id: 'C1', label: 'C1 - Nâng cao', labelVi: 'C1 - Nâng cao', labelEn: 'C1 - Advanced' },
];

export const SCENARIO_TOPICS = [
  { id: 'all', label: 'Tất cả chủ đề', labelVi: 'Tất cả chủ đề', labelEn: 'All Topics' },
  { id: 'dining', label: '🍜 Ẩm thực & Quán xá', labelVi: '🍜 Ẩm thực & Quán xá', labelEn: '🍜 Dining & Eateries' },
  { id: 'shopping', label: '🛍️ Mua sắm & Mặc cả', labelVi: '🛍️ Mua sắm & Mặc cả', labelEn: '🛍️ Shopping & Bargaining' },
  { id: 'travel', label: '🛵 Di chuyển & Du lịch', labelVi: '🛵 Di chuyển & Du lịch', labelEn: '🛵 Travel & Transport' },
  { id: 'hospitality', label: '🏨 Khách sạn & Nghỉ dưỡng', labelVi: '🏨 Khách sạn & Nghỉ dưỡng', labelEn: '🏨 Hotel & Hospitality' },
  { id: 'social', label: '🏡 Gia đình & Bạn bè', labelVi: '🏡 Gia đình & Bạn bè', labelEn: '🏡 Family & Friends' },
  { id: 'work', label: '💼 Giao tiếp công sở', labelVi: '💼 Giao tiếp công sở', labelEn: '💼 Business & Workplace' },
];

export const SCENARIOS = [
  {
    id: 'goi-mon-pho-ha-noi',
    title: 'Gọi món tại quán Phở gia truyền Hà Nội',
    titleVi: 'Gọi món tại quán Phở gia truyền Hà Nội',
    titleEn: 'Ordering at a Traditional Hanoi Pho Restaurant',
    level: 'A1',
    levelLabel: 'A1 • Sơ cấp 1',
    levelLabelVi: 'A1 • Sơ cấp 1',
    levelLabelEn: 'A1 • Beginner 1',
    topic: 'dining',
    topicLabel: 'Ẩm thực & Quán xá',
    topicLabelVi: 'Ẩm thực & Quán xá',
    topicLabelEn: 'Dining & Eateries',
    destination: 'Hà Nội',
    destinationVi: 'Hà Nội',
    destinationEn: 'Hanoi',
    difficulty: 'Dễ',
    difficultyVi: 'Dễ',
    difficultyEn: 'Easy',
    duration: '5-10 phút',
    durationVi: '5-10 phút',
    durationEn: '5-10 mins',
    thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn vừa đặt chân đến phố cổ Hà Nội vào một buổi sáng sớm se lạnh và ghé vào một quán phở bò gia truyền đông đúc trên phố Bát Đàn.',
    overviewVi: 'Bạn vừa đặt chân đến phố cổ Hà Nội vào một buổi sáng sớm se lạnh và ghé vào một quán phở bò gia truyền đông đúc trên phố Bát Đàn.',
    overviewEn: 'You just arrived in Hanoi Old Quarter on a crisp early morning and stopped by a bustling traditional beef pho eatery on Bat Dan Street.',
    aiRole: {
      name: 'Cô Mai (Chủ quán Phở)',
      role: 'Chủ quán phở Hà Nội nhanh nhẹn, xưng hô "cô - cháu"',
      roleVi: 'Chủ quán phở Hà Nội nhanh nhẹn, xưng hô "cô - cháu"',
      roleEn: 'Prompt Hanoi pho shop owner, addressing as "auntie - nephew/niece"',
      avatar: '👩‍🍳',
      tone: 'Thân thiện, xởi lởi, giọng Bắc chuẩn Tràng An, phục vụ nhanh nhẹn',
      toneVi: 'Thân thiện, xởi lởi, giọng Bắc chuẩn Tràng An, phục vụ nhanh nhẹn',
      toneEn: 'Friendly, generous, standard Northern Hanoi accent, quick service',
      initialGreeting: 'Chào cháu! Quán cô đang có bàn trống trong góc kìa, vào ngồi đi cháu! Hôm nay cháu muốn ăn phở bò tái, chín, hay nạm gầu nào?',
    },
    learnerRole: {
      role: 'Du khách lần đầu thưởng thức phở truyền thống',
      roleVi: 'Du khách lần đầu thưởng thức phở truyền thống',
      roleEn: 'First-time traveler enjoying traditional pho',
      context: 'Bạn cần tìm chỗ ngồi, gọi một bát phở bò theo khẩu vị riêng (ít hành, không cay) và gọi thêm đồ uống.',
      contextVi: 'Bạn cần tìm chỗ ngồi, gọi một bát phở bò theo khẩu vị riêng (ít hành, không cay) và gọi thêm đồ uống.',
      contextEn: 'Find a seat, order a bowl of beef pho tailored to your taste (less scallion, non-spicy), and order drinks.',
    },
    objectives: [
      { id: 'task-1', label: 'Chào hỏi và xác nhận chỗ ngồi tại quán', labelVi: 'Chào hỏi và xác nhận chỗ ngồi tại quán', labelEn: 'Greet and confirm seating at the eatery', completed: false },
      { id: 'task-2', label: 'Gọi một bát phở bò (tái/chín) kèm yêu cầu đặc biệt (ít hành/ớt)', labelVi: 'Gọi một bát phở bò (tái/chín) kèm yêu cầu đặc biệt (ít hành/ớt)', labelEn: 'Order beef pho (rare/well-done) with special requests (less scallion/chili)', completed: false },
      { id: 'task-3', label: 'Gọi thêm đồ uống (trà đá/sữa đậu nành) và quẩy giòn', labelVi: 'Gọi thêm đồ uống (trà đá/sữa đậu nành) và quẩy giòn', labelEn: 'Order drinks (iced green tea/soy milk) and crispy fried dough sticks', completed: false },
      { id: 'task-4', label: 'Hỏi giá tiền và cảm ơn thanh toán', labelVi: 'Hỏi giá tiền và cảm ơn thanh toán', labelEn: 'Ask for the bill and thank politely', completed: false },
    ],
    vocabularyHints: [
      { word: 'Bát phở tái chín', meaning: 'Bowl of pho with rare and well-done beef' },
      { word: 'Cho cháu ít hành thôi ạ', meaning: 'Please give me just a little scallion' },
      { word: 'Một đĩa quẩy giòn', meaning: 'A plate of crispy fried dough sticks' },
      { word: 'Một ly trà đá', meaning: 'An iced green tea' },
      { word: 'Hết bao nhiêu tiền ạ?', meaning: 'How much does it cost in total?' },
    ],
    culturalTip: 'Tại các quán phở truyền thống miền Bắc, quẩy được nhúng trực tiếp vào nước dùng phở để hút trọn vị ngọt béo của xương bò.',
    culturalTipVi: 'Tại các quán phở truyền thống miền Bắc, quẩy được nhúng trực tiếp vào nước dùng phở để hút trọn vị ngọt béo của xương bò.',
    culturalTipEn: 'In Northern traditional pho shops, crispy fried crullers are dipped directly into the broth to absorb the savory bone broth flavor.',
  },
  {
    id: 'tra-gia-cho-ben-thanh',
    title: 'Trả giá quà lưu niệm tại Chợ Bến Thành',
    titleVi: 'Trả giá quà lưu niệm tại Chợ Bến Thành',
    titleEn: 'Bargaining for Souvenirs at Ben Thanh Market',
    level: 'A2',
    levelLabel: 'A2 • Sơ cấp 2',
    levelLabelVi: 'A2 • Sơ cấp 2',
    levelLabelEn: 'A2 • Beginner 2',
    topic: 'shopping',
    topicLabel: 'Mua sắm & Mặc cả',
    topicLabelVi: 'Mua sắm & Mặc cả',
    topicLabelEn: 'Shopping & Bargaining',
    destination: 'TP. Hồ Chí Minh',
    destinationVi: 'TP. Hồ Chí Minh',
    destinationEn: 'Ho Chi Minh City',
    difficulty: 'Trung bình',
    difficultyVi: 'Trung bình',
    difficultyEn: 'Medium',
    duration: '8-12 phút',
    durationVi: '8-12 phút',
    durationEn: '8-12 mins',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn ghé thăm chợ Bến Thành ở Sài Gòn để mua quà lưu niệm cho bạn bè: nón lá vẽ tay và cà phê Robusta rang xay thơm lừng.',
    overviewVi: 'Bạn ghé thăm chợ Bến Thành ở Sài Gòn để mua quà lưu niệm cho bạn bè: nón lá vẽ tay và cà phê Robusta rang xay thơm lừng.',
    overviewEn: 'You visit Ben Thanh Market in Saigon to buy souvenirs for friends: hand-painted conical hats and aromatic roasted Robusta coffee.',
    aiRole: {
      name: 'Chị Ba Bến Thành',
      role: 'Tiểu thương sành sỏi, hoạt ngôn, xưng hô "chị - em"',
      roleVi: 'Tiểu thương sành sỏi, hoạt ngôn, xưng hô "chị - em"',
      roleEn: 'Savvy, eloquent market vendor, addressing as "older sister - younger sibling"',
      avatar: '🧣',
      tone: 'Niềm nở, dẻo miệng, giọng Nam Bộ ngọt ngào nhưng báo giá hơi cao',
      toneVi: 'Niềm nở, dẻo miệng, giọng Nam Bộ ngọt ngào nhưng báo giá hơi cao',
      toneEn: 'Welcoming, persuasive, sweet Southern accent, initially quoting higher prices',
      initialGreeting: 'Ủa em trai / em gái, ghé sạp chị Ba coi nón lá với cà phê nè! Hàng xịn thủ công loại một đó cưng, mở hàng cho chị một món lấy hên đi!',
    },
    learnerRole: {
      role: 'Khách du lịch muốn mua quà lưu niệm với giá hợp lý',
      roleVi: 'Khách du lịch muốn mua quà lưu niệm với giá hợp lý',
      roleEn: 'Tourist wanting to buy souvenirs at a reasonable price',
      context: 'Hỏi giá, khen sản phẩm đẹp, nhưng khéo léo thương lượng giảm từ 20-30% hoặc mua combo để được giá tốt.',
      contextVi: 'Hỏi giá, khen sản phẩm đẹp, nhưng khéo léo thương lượng giảm từ 20-30% hoặc mua combo để được giá tốt.',
      contextEn: 'Ask prices, compliment the items, and tactfully negotiate 20-30% off or combo discount.',
    },
    objectives: [
      { id: 'task-1', label: 'Hỏi giá món đồ lưu niệm bằng tiếng Việt', labelVi: 'Hỏi giá món đồ lưu niệm bằng tiếng Việt', labelEn: 'Ask for the souvenir price in Vietnamese', completed: false },
      { id: 'task-2', label: 'Khen món đồ và đưa ra đề xuất giảm giá lịch sự', labelVi: 'Khen món đồ và đưa ra đề xuất giảm giá lịch sự', labelEn: 'Praise the item and suggest a polite discount', completed: false },
      { id: 'task-3', label: 'Đàm phán mua số lượng 2 món để được bớt thêm', labelVi: 'Đàm phán mua số lượng 2 món để được bớt thêm', labelEn: 'Negotiate buying 2 items for an extra discount', completed: false },
      { id: 'task-4', label: 'Chốt giá thân thiện và hoàn tất thanh toán', labelVi: 'Chốt giá thân thiện và hoàn tất thanh toán', labelEn: 'Agree on price amicably and complete payment', completed: false },
    ],
    vocabularyHints: [
      { word: 'Cái nón này bao nhiêu tiền chị?', meaning: 'How much is this conical hat, sister?' },
      { word: 'Đắt quá, bớt cho em chút đi!', meaning: 'Too expensive, give me a discount please!' },
      { word: 'Nếu em lấy 2 cái thì chị tính bao nhiêu?', meaning: 'If I take 2, how much will you charge?' },
      { word: 'Giá hữu nghị / Giá mở hàng', meaning: 'Friendly price / First-sale good luck price' },
    ],
    culturalTip: 'Ở miền Nam, nụ cười tươi và cách xưng hô thân mật "Chị Ba ơi, bớt em xíu nghen" luôn là vũ khí trả giá hiệu quả nhất!',
    culturalTipVi: 'Ở miền Nam, nụ cười tươi và cách xưng hô thân mật "Chị Ba ơi, bớt em xíu nghen" luôn là vũ khí trả giá hiệu quả nhất!',
    culturalTipEn: 'In Southern Vietnam, a bright smile and friendly address like "Chị Ba ơi, bớt em xíu nghen" are always the most effective bargaining approach!',
  },
  {
    id: 'bat-xe-om-cong-nghe',
    title: 'Đón xe ôm công nghệ & Chỉ đường đến điểm hẹn',
    titleVi: 'Đón xe ôm công nghệ & Chỉ đường đến điểm hẹn',
    titleEn: 'Taking a Ride-Hailing Motorbike & Directing Route',
    level: 'A2',
    levelLabel: 'A2 • Sơ cấp 2',
    levelLabelVi: 'A2 • Sơ cấp 2',
    levelLabelEn: 'A2 • Beginner 2',
    topic: 'travel',
    topicLabel: 'Di chuyển & Du lịch',
    topicLabelVi: 'Di chuyển & Du lịch',
    topicLabelEn: 'Travel & Transport',
    destination: 'Hà Nội / Sài Gòn',
    destinationVi: 'Hà Nội / Sài Gòn',
    destinationEn: 'Hanoi / Saigon',
    difficulty: 'Dễ - Trung bình',
    difficultyVi: 'Dễ - Trung bình',
    difficultyEn: 'Easy - Medium',
    duration: '6-10 phút',
    durationVi: '6-10 phút',
    durationEn: '6-10 mins',
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn vừa đặt một chuyến xe ôm công nghệ trên app và bác tài xế gọi điện thoại xác nhận điểm đón.',
    overviewVi: 'Bạn vừa đặt một chuyến xe ôm công nghệ trên app và bác tài xế gọi điện thoại xác nhận điểm đón.',
    overviewEn: 'You booked a motorbike ride on an app and the driver calls to confirm the pickup point.',
    aiRole: {
      name: 'Bác Hùng (Tài xế công nghệ)',
      role: 'Tài xế xe ôm nhiều năm kinh nghiệm, nhiệt tình và mến khách',
      roleVi: 'Tài xế xe ôm nhiều năm kinh nghiệm, nhiệt tình và mến khách',
      roleEn: 'Experienced motorbike driver, enthusiastic and welcoming',
      avatar: '🛵',
      tone: 'Chân chất, hào sảng, xưng "chú - cháu/con"',
      toneVi: 'Chân chất, hào sảng, xưng "chú - cháu/con"',
      toneEn: 'Down-to-earth, hearty, addressing as "uncle - nephew/niece"',
      initialGreeting: 'A lô, cháu có phải là người đặt chuyến xe đi Bảo tàng Lịch sử không? Chú đang chạy tới gần rồi, cháu mặc áo màu gì, đứng chỗ nào để chú tấp vào đón?',
    },
    learnerRole: {
      role: 'Hành khách đang chờ đón ở cổng địa điểm',
      roleVi: 'Hành khách đang chờ đón ở cổng địa điểm',
      roleEn: 'Passenger waiting at the pickup entrance',
      context: 'Mô tả vị trí đang đứng, nhận diện biển số xe, yêu cầu tài xế chạy cẩn thận và hỏi han giao thông trên đường.',
      contextVi: 'Mô tả vị trí đang đứng, nhận diện biển số xe, yêu cầu tài xế chạy cẩn thận và hỏi han giao thông trên đường.',
      contextEn: 'Describe your location, confirm license plate, ask driver to ride safely, and chat about traffic.',
    },
    objectives: [
      { id: 'task-1', label: 'Mô tả vị trí và trang phục nhận diện cho tài xế', labelVi: 'Mô tả vị trí và trang phục nhận diện cho tài xế', labelEn: 'Describe your location and clothes to the driver', completed: false },
      { id: 'task-2', label: 'Xác nhận biển số xe và đội mũ bảo hiểm', labelVi: 'Xác nhận biển số xe và đội mũ bảo hiểm', labelEn: 'Confirm license plate and put on helmet', completed: false },
      { id: 'task-3', label: 'Trò chuyện ngắn về đường xá hoặc thời tiết hôm nay', labelVi: 'Trò chuyện ngắn về đường xá hoặc thời tiết hôm nay', labelEn: 'Have a short chat about traffic or today’s weather', completed: false },
      { id: 'task-4', label: 'Hỏi quét mã QR thanh toán và gửi lời cảm ơn', labelVi: 'Hỏi quét mã QR thanh toán và gửi lời cảm ơn', labelEn: 'Ask to scan QR code for payment and say thank you', completed: false },
    ],
    vocabularyHints: [
      { word: 'Cháu đang đứng trước cổng', meaning: 'I am standing in front of the gate' },
      { word: 'Biển số xe của chú là 29-B1...', meaning: 'Your license plate is 29-B1...' },
      { word: 'Đoạn này có hay bị kẹt xe không chú?', meaning: 'Does this stretch often get traffic jams, uncle?' },
      { word: 'Cháu quét mã QR chuyển khoản nhé', meaning: 'I will scan the QR code to transfer money' },
    ],
    culturalTip: 'Các bác tài xế xe ôm Việt Nam rất thích trò chuyện vui vẻ về cuộc sống và sẵn sàng chỉ cho bạn các quán ăn địa phương ngon nhất.',
    culturalTipVi: 'Các bác tài xế xe ôm Việt Nam rất thích trò chuyện vui vẻ về cuộc sống và sẵn sàng chỉ cho bạn các quán ăn địa phương ngon nhất.',
    culturalTipEn: 'Vietnamese ride-hailing drivers love cheerful chats about daily life and are always eager to recommend top authentic local food stalls.',
  },
  {
    id: 'checkin-khach-san-da-nang',
    title: 'Nhận phòng khách sạn & Hỏi dịch vụ tại Đà Nẵng',
    titleVi: 'Nhận phòng khách sạn & Hỏi dịch vụ tại Đà Nẵng',
    titleEn: 'Hotel Check-in & Inquiring Services in Da Nang',
    level: 'B1',
    levelLabel: 'B1 • Trung cấp 1',
    levelLabelVi: 'B1 • Trung cấp 1',
    levelLabelEn: 'B1 • Intermediate 1',
    topic: 'hospitality',
    topicLabel: 'Khách sạn & Nghỉ dưỡng',
    topicLabelVi: 'Khách sạn & Nghỉ dưỡng',
    topicLabelEn: 'Hotel & Hospitality',
    destination: 'Đà Nẵng',
    destinationVi: 'Đà Nẵng',
    destinationEn: 'Da Nang',
    difficulty: 'Trung bình',
    difficultyVi: 'Trung bình',
    difficultyEn: 'Medium',
    duration: '8-12 phút',
    durationVi: '8-12 phút',
    durationEn: '8-12 mins',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn vừa đến khách sạn 4 sao ven biển Mỹ Khê Đà Nẵng sau chuyến bay dài và làm thủ tục check-in tại quầy lễ tân.',
    overviewVi: 'Bạn vừa đến khách sạn 4 sao ven biển Mỹ Khê Đà Nẵng sau chuyến bay dài và làm thủ tục check-in tại quầy lễ tân.',
    overviewEn: 'You just arrived at a 4-star beachfront hotel in My Khe, Da Nang after a long flight and check in at reception.',
    aiRole: {
      name: 'Lễ tân Như Ý',
      role: 'Nhân viên lễ tân khách sạn Đà Nẵng chuyên nghiệp, chu đáo',
      roleVi: 'Nhân viên lễ tân khách sạn Đà Nẵng chuyên nghiệp, chu đáo',
      roleEn: 'Professional and attentive Da Nang hotel receptionist',
      avatar: '🛎️',
      tone: 'Lịch thiệp, chuẩn mực dịch vụ, giọng miền Trung nhẹ nhàng dễ thương',
      toneVi: 'Lịch thiệp, chuẩn mực dịch vụ, giọng miền Trung nhẹ nhàng dễ thương',
      toneEn: 'Courteous, service-oriented, soft and lovely Central accent',
      initialGreeting: 'Dạ em chào quý khách! Chào mừng anh/chị đã đến với Danang Sun Beach Hotel. Em có thể hỗ trợ anh/chị nhận phòng hoặc ký gửi hành lý ạ?',
    },
    learnerRole: {
      role: 'Khách du lịch đã đặt phòng trực tuyến',
      roleVi: 'Khách du lịch đã đặt phòng trực tuyến',
      roleEn: 'Tourist who booked a room online',
      context: 'Cung cấp mã đặt phòng, đề xuất đổi sang phòng tầng cao ngắm biển, hỏi thời gian buffet sáng và xin tư vấn thuê xe máy.',
      contextVi: 'Cung cấp mã đặt phòng, đề xuất đổi sang phòng tầng cao ngắm biển, hỏi thời gian buffet sáng và xin tư vấn thuê xe máy.',
      contextEn: 'Provide reservation code, request high floor ocean view, ask breakfast buffet hours, and ask for motorbike rental info.',
    },
    objectives: [
      { id: 'task-1', label: 'Cung cấp tên và mã đặt phòng kèm giấy tờ tùy thân', labelVi: 'Cung cấp tên và mã đặt phòng kèm giấy tờ tùy thân', labelEn: 'Provide name and booking code with ID', completed: false },
      { id: 'task-2', label: 'Yêu cầu phòng tầng cao có ban công hướng biển', labelVi: 'Yêu cầu phòng tầng cao có ban công hướng biển', labelEn: 'Request high floor room with sea view balcony', completed: false },
      { id: 'task-3', label: 'Hỏi giờ phục vụ ăn sáng và mật khẩu WiFi', labelVi: 'Hỏi giờ phục vụ ăn sáng và mật khẩu WiFi', labelEn: 'Inquire breakfast serving hours and WiFi password', completed: false },
      { id: 'task-4', label: 'Hỏi thủ tục thuê xe máy vi vu bán đảo Sơn Trà', labelVi: 'Hỏi thủ tục thuê xe máy vi vu bán đảo Sơn Trà', labelEn: 'Ask motorbike rental procedure for Son Tra peninsula trip', completed: false },
    ],
    vocabularyHints: [
      { word: 'Tôi đã đặt phòng qua mạng', meaning: 'I have booked a room online' },
      { word: 'Phòng ban công hướng biển', meaning: 'Balcony room with ocean view' },
      { word: 'Buffet sáng phục vụ từ mấy giờ?', meaning: 'What time is the breakfast buffet served?' },
      { word: 'Khách sạn có dịch vụ thuê xe máy không?', meaning: 'Does the hotel offer motorbike rental service?' },
    ],
    culturalTip: 'Người Đà Nẵng nổi tiếng thân thiện và mến khách bậc nhất cả nước, luôn sẵn sàng hướng dẫn bạn các quán hải sản người bản địa hay ăn.',
    culturalTipVi: 'Người Đà Nẵng nổi tiếng thân thiện và mến khách bậc nhất cả nước, luôn sẵn sàng hướng dẫn bạn các quán hải sản người bản địa hay ăn.',
    culturalTipEn: 'Da Nang locals are famous for supreme hospitality, always eager to recommend where residents eat fresh seafood.',
  },
  {
    id: 'ra-mat-gia-dinh-ban',
    title: 'Gặp gỡ và chào hỏi gia đình bạn người Việt',
    titleVi: 'Gặp gỡ và chào hỏi gia đình bạn người Việt',
    titleEn: 'Meeting & Greeting a Vietnamese Friend’s Family',
    level: 'B2',
    levelLabel: 'B2 • Trung cấp 2',
    levelLabelVi: 'B2 • Trung cấp 2',
    levelLabelEn: 'B2 • Intermediate 2',
    topic: 'social',
    topicLabel: 'Gia đình & Bạn bè',
    topicLabelVi: 'Gia đình & Bạn bè',
    topicLabelEn: 'Family & Friends',
    destination: 'Toàn quốc',
    destinationVi: 'Toàn quốc',
    destinationEn: 'Nationwide',
    difficulty: 'Nâng cao',
    difficultyVi: 'Nâng cao',
    difficultyEn: 'Advanced',
    duration: '10-15 phút',
    durationVi: '10-15 phút',
    durationEn: '10-15 mins',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn được một người bạn thân mời về thăm nhà dùng cơm trưa nhân dịp cuối tuần. Đây là lần đầu bạn gặp mặt bố mẹ của bạn mình.',
    overviewVi: 'Bạn được một người bạn thân mời về thăm nhà dùng cơm trưa nhân dịp cuối tuần. Đây là lần đầu bạn gặp mặt bố mẹ của bạn mình.',
    overviewEn: 'You are invited by a close friend to visit their home for weekend lunch. This is your first time meeting your friend’s parents.',
    aiRole: {
      name: 'Bác Hai (Bố của bạn)',
      role: 'Chủ nhà nồng hậu, quý mến bạn của con cái',
      roleVi: 'Chủ nhà nồng hậu, quý mến bạn của con cái',
      roleEn: 'Warm host parent, fond of children’s friends',
      avatar: '👴',
      tone: 'Ấm áp, ân cần, coi trọng lễ nghĩa gia phong',
      toneVi: 'Ấm áp, ân cần, coi trọng lễ nghĩa gia phong',
      toneEn: 'Warm, attentive, values traditional family etiquette',
      initialGreeting: 'Dạ chào cháu! Bác nghe Nam kể nhiều về cháu lắm rồi, hôm nay mới có dịp gặp mặt. Vào nhà uống nước xơi trầu cho mát nhé cháu!',
    },
    learnerRole: {
      role: 'Người bạn ngoại quốc đến thăm nhà dùng cơm',
      roleVi: 'Người bạn ngoại quốc đến thăm nhà dùng cơm',
      roleEn: 'Foreign friend visiting family for lunch',
      context: 'Chào hỏi lễ phép với kính ngữ chuẩn mực, trao món quà nhỏ kèm lời chúc, khen ngợi món ăn và mời cơm đúng phép tắc.',
      contextVi: 'Chào hỏi lễ phép với kính ngữ chuẩn mực, trao món quà nhỏ kèm lời chúc, khen ngợi món ăn và mời cơm đúng phép tắc.',
      contextEn: 'Politely greet with proper honorifics, offer a small gift with well wishes, praise food, and invite elders to eat.',
    },
    objectives: [
      { id: 'task-1', label: 'Chào hỏi bằng kính ngữ "Dạ con chào hai bác ạ"', labelVi: 'Chào hỏi bằng kính ngữ "Dạ con chào hai bác ạ"', labelEn: 'Greet politely using "Dạ con chào hai bác ạ"', completed: false },
      { id: 'task-2', label: 'Tặng quà lưu niệm và giải thích ý nghĩa lịch sự', labelVi: 'Tặng quà lưu niệm và giải thích ý nghĩa lịch sự', labelEn: 'Present souvenir gift and politely explain its meaning', completed: false },
      { id: 'task-3', label: 'Mời cơm người lớn trước khi cầm đũa', labelVi: 'Mời cơm người lớn trước khi cầm đũa', labelEn: 'Politely invite elders to start eating before picking up chopsticks', completed: false },
      { id: 'task-4', label: 'Cảm ơn lòng hiếu khách trước khi xin phép ra về', labelVi: 'Cảm ơn lòng hiếu khách trước khi xin phép ra về', labelEn: 'Thank for generous hospitality before bidding farewell', completed: false },
    ],
    vocabularyHints: [
      { word: 'Dạ, con chào hai bác ạ!', meaning: 'Polite greeting to the host parents' },
      { word: 'Con có chút hoa quả biếu hai bác', meaning: 'I have some fruits as a gift for you two' },
      { word: 'Con mời hai bác xơi cơm', meaning: 'Polite invitation to eat before starting meal' },
      { word: 'Bác gái nấu ăn ngon quá ạ!', meaning: 'Auntie cooks so deliciously!' },
    ],
    culturalTip: 'Khi đến thăm nhà người Việt, mang theo một giỏ trái cây tươi hoặc trà ngon làm quà biếu là hành động cực kỳ tinh tế và được quý trọng.',
    culturalTipVi: 'Khi đến thăm nhà người Việt, mang theo một giỏ trái cây tươi hoặc trà ngon làm quà biếu là hành động cực kỳ tinh tế và được quý trọng.',
    culturalTipEn: 'When visiting a Vietnamese home, bringing fresh fruits or fine tea as a gift is an appreciated, refined gesture.',
  },
  {
    id: 'phong-van-xin-viec-cong-so',
    title: 'Phỏng vấn xin việc tại doanh nghiệp Việt Nam',
    titleVi: 'Phỏng vấn xin việc tại doanh nghiệp Việt Nam',
    titleEn: 'Job Interview at a Vietnamese Enterprise',
    level: 'C1',
    levelLabel: 'C1 • Nâng cao',
    levelLabelVi: 'C1 • Nâng cao',
    levelLabelEn: 'C1 • Advanced',
    topic: 'work',
    topicLabel: 'Giao tiếp công sở',
    topicLabelVi: 'Giao tiếp công sở',
    topicLabelEn: 'Business & Workplace',
    destination: 'Hà Nội / TP.HCM',
    destinationVi: 'Hà Nội / TP.HCM',
    destinationEn: 'Hanoi / HCMC',
    difficulty: 'Thử thách',
    difficultyVi: 'Thử thách',
    difficultyEn: 'Challenging',
    duration: '12-18 phút',
    durationVi: '12-18 phút',
    durationEn: '12-18 mins',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn đang tham gia vòng phỏng vấn chuyên sâu cho vị trí Chuyên viên Hợp tác Quốc tế tại một tập đoàn công nghệ lớn ở Việt Nam.',
    overviewVi: 'Bạn đang tham gia vòng phỏng vấn chuyên sâu cho vị trí Chuyên viên Hợp tác Quốc tế tại một tập đoàn công nghệ lớn ở Việt Nam.',
    overviewEn: 'You are participating in an in-depth interview for an International Cooperation Specialist position at a tech corporation in Vietnam.',
    aiRole: {
      name: 'Chị Lan Hương (Giám đốc Nhân sự)',
      role: 'Nhà tuyển dụng chuyên nghiệp, đặt câu hỏi logic và tình huống thực tế',
      roleVi: 'Nhà tuyển dụng chuyên nghiệp, đặt câu hỏi logic và tình huống thực tế',
      roleEn: 'Professional HR Director asking structured logic and situational questions',
      avatar: '💼',
      tone: 'Trang trọng, chuyên nghiệp, đánh giá cao sự lưu loát và hòa nhập văn hóa',
      toneVi: 'Trang trọng, chuyên nghiệp, đánh giá cao sự lưu loát và hòa nhập văn hóa',
      toneEn: 'Formal, professional, highly values fluency and cultural adaptation',
      initialGreeting: 'Chào bạn. Cảm ơn bạn đã quan tâm đến cơ hội nghề nghiệp tại công ty chúng tôi. Trước hết, bạn vui lòng giới thiệu ngắn gọn về bản thân và lý do bạn muốn làm việc tại Việt Nam nhé.',
    },
    learnerRole: {
      role: 'Ứng viên sáng giá cho vị trí công việc chuyên nghiệp',
      roleVi: 'Ứng viên sáng giá cho vị trí công việc chuyên nghiệp',
      roleEn: 'Promising candidate for professional position',
      context: 'Trình bày bản thân bằng tiếng Việt chuẩn mực, nêu bật kỹ năng thế mạnh, cách thích nghi môi trường đa văn hóa và hỏi lại nhà tuyển dụng.',
      contextVi: 'Trình bày bản thân bằng tiếng Việt chuẩn mực, nêu bật kỹ năng thế mạnh, cách thích nghi môi trường đa văn hóa và hỏi lại nhà tuyển dụng.',
      contextEn: 'Present yourself in standard Vietnamese, highlight core skills, multicultural adaptability, and ask thoughtful questions.',
    },
    objectives: [
      { id: 'task-1', label: 'Tự giới thiệu bản thân và kinh nghiệm chuyên môn lưu loát', labelVi: 'Tự giới thiệu bản thân và kinh nghiệm chuyên môn lưu loát', labelEn: 'Introduce yourself and professional background fluently', completed: false },
      { id: 'task-2', label: 'Trình bày động lực làm việc và tình cảm với môi trường Việt Nam', labelVi: 'Trình bày động lực làm việc và tình cảm với môi trường Việt Nam', labelEn: 'Express work motivation and affinity for Vietnamese environment', completed: false },
      { id: 'task-3', label: 'Trả lời câu hỏi xử lý bất đồng văn hóa trong làm việc nhóm', labelVi: 'Trả lời câu hỏi xử lý bất đồng văn hóa trong làm việc nhóm', labelEn: 'Answer question on handling cross-cultural team conflicts', completed: false },
      { id: 'task-4', label: 'Đặt câu hỏi thông minh về định hướng phát triển của công ty', labelVi: 'Đặt câu hỏi thông minh về định hướng phát triển của công ty', labelEn: 'Ask insightful questions about company strategic direction', completed: false },
    ],
    vocabularyHints: [
      { word: 'Kinh nghiệm chuyên môn', meaning: 'Professional expertise and experience' },
      { word: 'Thích ứng môi trường đa văn hóa', meaning: 'Adapting to multicultural environment' },
      { word: 'Tinh thần làm việc nhóm', meaning: 'Teamwork spirit and collaboration' },
      { word: 'Đóng góp vào sự phát triển', meaning: 'Contribute to the growth/development' },
    ],
    culturalTip: 'Trong văn hóa doanh nghiệp Việt Nam, sự tôn trọng đồng nghiệp, tinh thần đoàn kết và tính khiêm tốn được đánh giá cao ngang bằng với năng lực chuyên môn.',
    culturalTipVi: 'Trong văn hóa doanh nghiệp Việt Nam, sự tôn trọng đồng nghiệp, tinh thần đoàn kết và tính khiêm tốn được đánh giá cao ngang bằng với năng lực chuyên môn.',
    culturalTipEn: 'In Vietnamese corporate culture, respect for peers, solidarity, and humility are valued equally alongside technical capability.',
  },
];

const ROLEPLAY_SESSION_STORAGE = 'hola_ai_roleplay_session_';
const ROLEPLAY_RESULT_STORAGE = 'hola_ai_roleplay_result_';
const AI_PROVIDER = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_PROVIDER) || 'openrouter';
const AI_MODEL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_MODEL) || 'openrouter/free';
const AI_REQUEST_TIMEOUT_MS = Math.max(5000, Number(typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_REQUEST_TIMEOUT_MS) || 30000);

const unwrapAiPayload = (response) => response?.result ?? response?.data ?? response ?? {};

const getAiText = (payload) => (
  payload?.text
  ?? payload?.content
  ?? payload?.answer
  ?? payload?.reply
  ?? payload?.message?.text
  ?? payload?.choices?.[0]?.message?.content
  ?? payload?.choices?.[0]?.text
  ?? payload?.output_text
  ?? payload?.output?.[0]?.content?.[0]?.text
  ?? null
);

const normalizeAiPayload = (payload) => {
  const rawText = getAiText(payload);
  if (typeof rawText !== 'string') return payload;
  const candidate = rawText.trim();
  if (!candidate.startsWith('{') || !candidate.endsWith('}')) return payload;
  try {
    const parsed = JSON.parse(candidate);
    return parsed && typeof parsed === 'object' ? { ...payload, ...parsed } : payload;
  } catch {
    return payload;
  }
};

const buildRoleplayContext = (scenario, session) => {
  const completed = new Set(session.completedTasks || []);
  const remainingObjectives = (scenario.objectives || [])
    .filter(objective => !completed.has(objective.id))
    .map(objective => `- ${objective.id}: ${objective.label}`)
    .join('\\n');
  const recentMessages = (session.messages || [])
    .slice(-8)
    .map(message => `${message.sender === 'user' ? 'HỌC VIÊN' : scenario.aiRole.name}: ${message.text}`)
    .join('\\n');

  return [
    'Bạn đang tham gia roleplay học tiếng Việt theo kịch bản bắt buộc.',
    `KỊCH BẢN: ${scenario.title}`,
    `BỐI CẢNH: ${scenario.overview}`,
    `VAI AI: ${scenario.aiRole.name} — ${scenario.aiRole.role}`,
    `GIỌNG ĐIỆU: ${scenario.aiRole.tone}`,
    `VAI HỌC VIÊN: ${scenario.learnerRole?.role}`,
    `MỤC TIÊU: ${scenario.learnerRole?.context}`,
    'MỤC TIÊU CHƯA HOÀN THÀNH:',
    remainingObjectives || '- Không còn mục tiêu bắt buộc; hãy kết thúc tự nhiên.',
    `TỪ/CỤM TỪ NÊN KHUYẾN KHÍCH: ${(scenario.vocabularyHints || []).map(item => item.word).join(', ')}`,
    `LƯU Ý VĂN HÓA: ${scenario.culturalTip}`,
    'LỊCH SỬ GẦN ĐÂY:',
    recentMessages,
    'QUY TẮC: Luôn ở trong vai và bám kịch bản. Nếu học viên nói lệch chủ đề, trả lời ngắn tối đa một câu rồi kéo họ về mục tiêu gần nhất bằng câu hỏi/gợi ý tiếng Việt. Không đổi vai, không mở chủ đề mới, không giảng dài. Trả JSON hợp lệ gồm text, translation, explanation, completedTasks; không bọc markdown.',
  ].join('\\n');
};

let dynamicScenarios = [...SCENARIOS];
if (typeof localStorage !== 'undefined') {
  try {
    const cached = localStorage.getItem('hola_cached_ai_scenarios');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dynamicScenarios = parsed;
      }
    }
  } catch {}
}

export const aiRoleplayService = {
  getLevels() {
    return SCENARIO_LEVELS;
  },

  getTopics() {
    return SCENARIO_TOPICS;
  },

  async fetchScenarios() {
    try {
      let token = '';
      if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
      }
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/ai/scenarios', { headers });
      if (res.ok) {
        const data = await res.json();
        const list = data.result || data;
        if (Array.isArray(list) && list.length > 0) {
          dynamicScenarios = list.map(item => {
            const fallback = SCENARIOS.find(s => s.id === item.id) || {};
            return {
              ...fallback,
              ...item,
              aiRole: item.aiRole || fallback.aiRole,
              learnerRole: item.learnerRole || fallback.learnerRole,
              objectives: Array.isArray(item.objectives) && item.objectives.length > 0 ? item.objectives : fallback.objectives,
              vocabularyHints: Array.isArray(item.vocabularyHints) && item.vocabularyHints.length > 0 ? item.vocabularyHints : fallback.vocabularyHints,
            };
          });
          if (typeof localStorage !== 'undefined') {
            try {
              localStorage.setItem('hola_cached_ai_scenarios', JSON.stringify(dynamicScenarios));
            } catch {}
          }
          return dynamicScenarios;
        }
      }
    } catch {
      // fallback
    }
    return dynamicScenarios;
  },

  listScenarios({ search = '', level = 'all', topic = 'all' } = {}) {
    let result = [...dynamicScenarios];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.overview.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
      );
    }

    if (level && level !== 'all') {
      result = result.filter(s => s.level === level);
    }

    if (topic && topic !== 'all') {
      result = result.filter(s => s.topic === topic);
    }

    return result;
  },

  getScenario(id) {
    return dynamicScenarios.find(s => s.id === id) || SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
  },

  getRoleplaySession(scenarioId) {
    const scenario = this.getScenario(scenarioId);
    try {
      const stored = localStorage.getItem(ROLEPLAY_SESSION_STORAGE + scenarioId);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }

    // Default new session
    const session = {
      scenarioId,
      scenarioTitle: scenario.title,
      startTime: new Date().toISOString(),
      messages: [
        {
          id: `rp-${Date.now()}-ai-0`,
          sender: 'ai',
          name: scenario.aiRole.name,
          avatar: scenario.aiRole.avatar,
          text: scenario.aiRole.initialGreeting,
          translation: 'Hello! Our stall has an empty table in the corner, please take a seat! Would you like rare, cooked, or brisket beef pho today?',
          explanation: 'Cô Mai chào đón niềm nở và hỏi bạn muốn ăn loại phở bò nào. Bạn có thể chọn loại phở mình thích và yêu cầu lượng hành/ớt.',
          timestamp: new Date().toISOString(),
        },
      ],
      completedTasks: [],
    };
    this.saveRoleplaySession(scenarioId, session);
    return session;
  },

  saveRoleplaySession(scenarioId, session) {
    try {
      localStorage.setItem(ROLEPLAY_SESSION_STORAGE + scenarioId, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save roleplay session', e);
    }
  },

  resetRoleplaySession(scenarioId) {
    localStorage.removeItem(ROLEPLAY_SESSION_STORAGE + scenarioId);
    return this.getRoleplaySession(scenarioId);
  },

  getSuggestions(scenarioId, messagesCount) {
    const scenario = this.getScenario(scenarioId);
    if (scenarioId === 'goi-mon-pho-ha-noi') {
      if (messagesCount <= 2) {
        return [
          { text: 'Dạ, chào cô ạ! Cho cháu một bát phở bò tái chín, ít hành ít ớt nhé cô!', meaning: 'Hello auntie! Please give me a bowl of rare & cooked beef pho, less scallions and less chili!' },
          { text: 'Dạ cháu chào cô, quán mình còn quẩy giòn không ạ? Cho cháu một bát phở bò chín nhé!', meaning: 'Hello auntie, do you still have crispy dough sticks? Please give me a cooked beef pho!' },
        ];
      }
      if (messagesCount <= 4) {
        return [
          { text: 'Cô cho cháu thêm một đĩa quẩy giòn và một cốc trà đá với ạ!', meaning: 'Auntie, please give me a plate of crispy dough sticks and an iced green tea!' },
          { text: 'Dạ cho cháu xin thêm một chén trứng chần và quả chanh nhé cô!', meaning: 'Please give me a poached egg bowl and a lime, auntie!' },
        ];
      }
      return [
        { text: 'Cô ơi, của cháu hết tất cả bao nhiêu tiền ạ? Cháu gửi cô nhé!', meaning: 'Auntie, how much is my bill in total? Here is the money for you!' },
        { text: 'Phở cô nấu ngon lắm ạ! Cho cháu thanh toán bằng tiền mặt nhé cô!', meaning: 'Your pho is so delicious! Let me pay in cash please!' },
      ];
    }

    if (scenarioId === 'tra-gia-cho-ben-thanh') {
      if (messagesCount <= 2) {
        return [
          { text: 'Dạ chào chị Ba! Cái nón lá thêu hoa sen này chị bán bao nhiêu tiền vậy chị?', meaning: 'Hello sister Ba! How much do you sell this lotus-embroidered conical hat for?' },
          { text: 'Dạ em chào chị, cà phê hạt loại này xuất xứ ở đâu và giá cả thế nào chị ha?', meaning: 'Hello sister, where is this coffee bean from and what is its price?' },
        ];
      }
      return [
        { text: 'Giá ba trăm nghìn hơi cao chị ơi! Bớt cho em chút lấy may mắn đi, hai trăm nhé chị?', meaning: '300,000 VND is a bit high sister! Give me a discount for good luck, 200,000 okay?' },
        { text: 'Nếu em mua 2 cái nón luôn thì chị tính giá hữu nghị cho em bao nhiêu nè?', meaning: 'If I buy 2 hats together, what friendly price will you offer me?' },
      ];
    }

    // Default suggestions
    return [
      { text: `Dạ vâng ạ, tôi hiểu rồi. Tôi rất muốn biết thêm chi tiết về điều này!`, meaning: 'Yes, I understand. I would love to know more details about this!' },
      { text: `Cảm ơn bạn rất nhiều! Bạn có thể hướng dẫn cụ thể hơn cho tôi được không?`, meaning: 'Thank you very much! Could you guide me more specifically?' },
    ];
  },

  async sendRoleplayMessage(scenarioId, userText) {
    const session = this.getRoleplaySession(scenarioId);
    const scenario = this.getScenario(scenarioId);

    const userMsg = {
      id: `rp-${Date.now()}-u`,
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Roleplay pages can be opened by guests. Avoid sending an unauthenticated
    // request to the protected backend; logged-in learners still get the real
    // AI response and the axios client can refresh an expired token.
    if (localStorage.getItem('token')) {
      try {
        const backendSessionId = session.backendSessionId || `roleplay-${scenarioId}`;
        const apiRes = await axiosClient.post(
          `/api/ai/sessions/${backendSessionId}/messages`,
          {
            text: userMsg.text,
            mode: 'roleplay',
            provider: AI_PROVIDER,
            model: AI_MODEL,
            scenarioId,
            scenarioContext: buildRoleplayContext(scenario, session),
          },
          { timeout: AI_REQUEST_TIMEOUT_MS },
        );
        const response = normalizeAiPayload(unwrapAiPayload(apiRes));
        const responseText = getAiText(response);

        if (responseText) {
          const updatedSession = {
            ...session,
            backendSessionId,
            messages: [...(session.messages || []), userMsg, {
              id: response.id || `rp-${Date.now()}-ai`,
              sender: 'ai',
              name: scenario.aiRole.name,
              avatar: scenario.aiRole.avatar,
              text: responseText,
              translation: response.translation || '',
              explanation: response.explanation || '',
              timestamp: response.timestamp || new Date().toISOString(),
            }],
            completedTasks: response.completedTasks || session.completedTasks || [],
          };
          this.saveRoleplaySession(scenarioId, updatedSession);
          return {
            userMsg,
            aiMsg: updatedSession.messages[updatedSession.messages.length - 1],
            session: updatedSession,
          };
        }
      } catch (error) {
        console.warn('[AI Roleplay] Backend AI unavailable; using local scenario fallback:', error.message);
      }
    }

    // Simulate smart roleplay response
    await new Promise(r => setTimeout(r, 400));

    const totalUserMsgs = session.messages.filter(m => m.sender === 'user').length + 1;
    let aiText = '';
    let translation = '';
    let explanation = '';
    const newCompletedTasks = [...(session.completedTasks || [])];

    // Evaluate tasks based on message content & turn
    if (scenarioId === 'goi-mon-pho-ha-noi') {
      if (totalUserMsgs === 1) {
        aiText = 'Được rồi cháu ơi! Một bát tái chín ít hành nhé. Cháu có muốn dùng thêm quẩy giòn nhúng nước dùng hay uống trà đá mát lạnh không? Quẩy nhà cô vừa mới rán giòn tan luôn!';
        translation = 'Alright! One rare and well-done pho with less scallions. Would you like crispy dough sticks or cold iced green tea? Our sticks are freshly fried and very crispy!';
        explanation = 'Cô Mai đã ghi nhận món ăn và chủ động gợi ý đồ ăn kèm (quẩy) cùng thức uống (trà đá). Bạn hãy gọi thêm món nhé!';
        if (!newCompletedTasks.includes('task-1')) newCompletedTasks.push('task-1');
        if (!newCompletedTasks.includes('task-2')) newCompletedTasks.push('task-2');
      } else if (totalUserMsgs === 2) {
        aiText = 'Có ngay đây cháu! Một đĩa quẩy vàng ruộm và cốc trà đá bớt ngọt đây. Cháu ăn thử miếng thịt bò xem có vừa miệng không, bên cạnh có dấm tỏi với tương ớt cay đấy nhé!';
        translation = 'Here you go! One golden plate of crispy dough sticks and a green tea. Try the beef and see if it fits your taste, garlic vinegar and chili sauce are right beside you!';
        explanation = 'Cô Mai mang đồ ăn ra và dặn bạn cách nêm nếm gia vị chuẩn Hà Nội (dấm tỏi, tương ớt). Bạn có thể khen ngon và chuẩn bị xin thanh toán.';
        if (!newCompletedTasks.includes('task-3')) newCompletedTasks.push('task-3');
      } else {
        aiText = 'Của cháu bát phở bốn mươi lăm nghìn, quẩy mười nghìn, trà đá năm nghìn, tất cả tròn sáu mươi nghìn đồng cháu nhé! Cảm ơn cháu nhiều, chúc cháu có chuyến đi chơi Hà Nội vui vẻ nha!';
        translation = 'Your bill is 45k for pho, 10k for dough sticks, 5k for iced tea, total is exactly 60,000 VND! Thank you very much, have a wonderful trip in Hanoi!';
        explanation = 'Cô Mai đã báo chi tiết từng món và tổng tiền rất rõ ràng. Nhiệm vụ thanh toán hoàn tất xuất sắc!';
        if (!newCompletedTasks.includes('task-4')) newCompletedTasks.push('task-4');
      }
    } else {
      // Generic smart roleplay
      aiText = `Hay quá bạn ơi! Nghe bạn nói bằng tiếng Việt tự nhiên thế này tôi mừng lắm. Tôi rất tán thành ý của bạn. Bạn còn thắc mắc hay muốn tìm hiểu thêm điều gì nữa không?`;
      translation = `Awesome! Hearing you speak Vietnamese so naturally makes me so glad. I completely agree with your point. Do you have any other questions or things you want to know?`;
      explanation = `Đối phương tiếp nhận phản hồi của bạn rất tích cực và cởi mở. Bạn đang hoàn thành rất tốt vai diễn của mình!`;
      if (totalUserMsgs >= 1 && !newCompletedTasks.includes('task-1')) newCompletedTasks.push('task-1');
      if (totalUserMsgs >= 2 && !newCompletedTasks.includes('task-2')) newCompletedTasks.push('task-2');
      if (totalUserMsgs >= 3 && !newCompletedTasks.includes('task-3')) newCompletedTasks.push('task-3');
      if (totalUserMsgs >= 4 && !newCompletedTasks.includes('task-4')) newCompletedTasks.push('task-4');
    }

    const aiMsg = {
      id: `rp-${Date.now()}-ai`,
      sender: 'ai',
      name: scenario.aiRole.name,
      avatar: scenario.aiRole.avatar,
      text: aiText,
      translation,
      explanation,
      timestamp: new Date().toISOString(),
    };

    session.messages.push(userMsg, aiMsg);
    session.completedTasks = newCompletedTasks;
    this.saveRoleplaySession(scenarioId, session);

    return { userMsg, aiMsg, session };
  },

  finishRoleplayAndGetResult(scenarioId) {
    const session = this.getRoleplaySession(scenarioId);
    const scenario = this.getScenario(scenarioId);

    const userMessages = session.messages.filter(m => m.sender === 'user');
    const taskCount = scenario.objectives.length;
    const completedCount = Math.max(session.completedTasks.length, Math.min(taskCount, userMessages.length + 1));

    const fluencyScore = Math.min(95, 75 + userMessages.length * 5);
    const vocabScore = Math.min(92, 78 + userMessages.length * 4);
    const grammarScore = Math.min(90, 80 + userMessages.length * 3);
    const cultureScore = Math.min(98, 85 + userMessages.length * 3);
    const totalScore = Math.round((fluencyScore + vocabScore + grammarScore + cultureScore) / 4);

    const result = {
      sessionId: `session-${scenarioId}-${Date.now()}`,
      scenarioId,
      scenarioTitle: scenario.title,
      level: scenario.levelLabel,
      completedDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      totalScore,
      rating: totalScore >= 90 ? 'Xuất sắc' : totalScore >= 80 ? 'Rất tốt' : 'Đạt yêu cầu',
      ratingVi: totalScore >= 90 ? 'Xuất sắc' : totalScore >= 80 ? 'Rất tốt' : 'Đạt yêu cầu',
      ratingEn: totalScore >= 90 ? 'Excellent' : totalScore >= 80 ? 'Very Good' : 'Satisfactory',
      stats: {
        fluency: fluencyScore,
        vocabulary: vocabScore,
        grammar: grammarScore,
        culture: cultureScore,
      },
      completedTasksRatio: `${completedCount}/${taskCount}`,
      aiFeedback: `Bạn đã hoàn thành xuất sắc vai diễn trong kịch bản "${scenario.titleVi || scenario.title}"! Khả năng phản xạ và nắm bắt ngữ cảnh văn hóa rất ấn tượng. Bạn đã sử dụng đúng kính ngữ phù hợp với vai trò của nhân vật và biểu đạt mong muốn một cách lịch sự, tự nhiên.`,
      aiFeedbackVi: `Bạn đã hoàn thành xuất sắc vai diễn trong kịch bản "${scenario.titleVi || scenario.title}"! Khả năng phản xạ và nắm bắt ngữ cảnh văn hóa rất ấn tượng. Bạn đã sử dụng đúng kính ngữ phù hợp với vai trò của nhân vật và biểu đạt mong muốn một cách lịch sự, tự nhiên.`,
      aiFeedbackEn: `You completed your role in "${scenario.titleEn || scenario.title}" excellently! Your conversational reflexes and grasp of cultural context are very impressive. You used proper honorifics suited to your character's role and expressed requests politely and naturally.`,
      corrections: [
        {
          original: 'Cho tôi một phở bò tái.',
          nativeSuggestion: 'Dạ cho cháu một bát phở bò tái chín, ít hành nhé cô!',
          reason: 'Thêm kính ngữ "Dạ... nhé cô" và từ chỉ loại bát phở "một bát" để câu nói mang đậm phong thái giao tiếp Hà Nội.',
          reasonVi: 'Thêm kính ngữ "Dạ... nhé cô" và từ chỉ loại bát phở "một bát" để câu nói mang đậm phong thái giao tiếp Hà Nội.',
          reasonEn: 'Adding honorifics "Dạ... nhé cô" and the classifier "một bát" (a bowl) creates the authentic Hanoi conversational style.',
        },
        {
          original: 'Cái này hết bao nhiêu?',
          nativeSuggestion: 'Dạ của cháu hết tất cả bao nhiêu tiền ạ?',
          reason: 'Dùng từ "bao nhiêu tiền ạ" với người bán lớn tuổi thể hiện sự tôn trọng và lễ phép đúng chuẩn mực người Việt.',
          reasonVi: 'Dùng từ "bao nhiêu tiền ạ" với người bán lớn tuổi thể hiện sự tôn trọng và lễ phép đúng chuẩn mực người Việt.',
          reasonEn: 'Using "bao nhiêu tiền ạ" with older sellers shows standard Vietnamese respect and courtesy.',
        },
      ],
      practicedExpressions: [
        { phrase: 'Bát phở tái chín ít hành', meaning: 'Bowl of rare & cooked pho with less scallions' },
        { phrase: 'Cho cháu xin thêm trà đá', meaning: 'Please give me extra iced green tea' },
        { phrase: 'Của cháu hết bao nhiêu tiền ạ?', meaning: 'How much is my bill in total please?' },
        { phrase: 'Cảm ơn cô nhiều ạ!', meaning: 'Thank you very much auntie!' },
      ],
      nextScenario: SCENARIOS.find(s => s.id !== scenarioId) || SCENARIOS[1],
    };

    localStorage.setItem(ROLEPLAY_RESULT_STORAGE + scenarioId, JSON.stringify(result));
    return result;
  },

  getResult(scenarioId) {
    try {
      const stored = localStorage.getItem(ROLEPLAY_RESULT_STORAGE + scenarioId);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return this.finishRoleplayAndGetResult(scenarioId);
  },
};

