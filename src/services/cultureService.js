// Culture Exploration Service (Người 4: /culture & /culture/:id)

export const CULTURE_CATEGORIES = [
  { id: 'all', label: 'Tất cả danh mục' },
  { id: 'culinary', label: '🍜 Ẩm thực' },
  { id: 'tradition', label: '🏮 Lễ hội & Phong tục' },
  { id: 'daily-life', label: '☕ Đời sống thường nhật' },
  { id: 'art', label: '🎭 Nghệ thuật & Di sản' },
  { id: 'travel-spots', label: '🏞️ Danh lam & Điểm đến' },
];

export const CULTURE_DESTINATIONS = [
  { id: 'all', label: 'Toàn quốc' },
  { id: 'hanoi', label: 'Hà Nội' },
  { id: 'hue', label: 'Huế' },
  { id: 'hoian', label: 'Hội An' },
  { id: 'hcmc', label: 'TP. Hồ Chí Minh' },
  { id: 'mientay', label: 'Miền Tây' },
  { id: 'sapa', label: 'Sa Pa' },
  { id: 'danang', label: 'Đà Nẵng' },
];

export const CULTURE_ARTICLES = [
  {
    id: 'van-hoa-ca-phe-viet-nam',
    title: 'Văn hóa cà phê Việt Nam: Từ Cà phê phin đến Cà phê trứng nức tiếng',
    subtitle: 'Nét văn hóa vỉa hè thong thả và cách người Việt thưởng thức từng giọt đắng thơm nồng',
    category: 'daily-life',
    categoryName: 'Đời sống thường nhật',
    destination: 'hanoi',
    destinationName: 'Hà Nội',
    readTime: '6 phút đọc',
    publishedDate: '15/03/2026',
    author: 'Nguyễn Thanh Thảo',
    authorRole: 'Nhà nghiên cứu văn hóa ẩm thực',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    summary: 'Cà phê tại Việt Nam không chỉ là một thức uống giúp tỉnh táo buổi sáng, mà là cả một phong cách sống thong dong, một không gian kết nối bạn bè và một di sản ẩm thực độc đáo vươn tầm thế giới.',
    content: `### ☕ Câu chuyện về chiếc phin cà phê chậm rãi

Người Pháp mang cây cà phê vào Việt Nam từ giữa thế kỷ 19, nhưng chính người Việt đã sáng tạo nên cách uống bằng **phin kim loại** – chiếc phin nhôm nhỏ nhắn đặt lên trên chiếc ly thủy tinh chứa sẵn lớp sữa đặc ngọt béo.

Từng giọt cà phê tí tách rơi xuống đòi hỏi người thưởng thức phải kiên nhẫn. Người Việt Nam không uống cà phê vội vã để mang đi (to-go), mà thích ngồi xuống chiếc ghế đẩu con con ven đường, ngắm phố xá chuyển mình và đàm đạo cùng bạn bè.

---

### 🥚 Sự ra đời kỳ diệu của "Cà phê trứng" Hà Nội

Vào những năm 1940 trong thời kỳ kháng chiến thiếu thốn sữa đặc, cụ Giảng – một chuyên gia pha chế tại khách sạn Metropole Hà Nội – đã nảy ra ý tưởng táo bạo: dùng **lòng đỏ trứng gà đánh bông** để tạo lớp bọt kem sánh mịn béo ngậy thay thế cho sữa.

Thức uống này ngày nay đã trở thành huyền thoại ẩm thực của thủ đô Hà Nội. Lớp kem trứng vàng ươm, ngọt thanh, thơm mùi vani hòa quyện hoàn hảo với vị đắng đậm đà của cà phê Robusta bên dưới, tạo nên trải nghiệm khó quên cho bất kỳ du khách nào.

---

### 🛵 Cà phê bệt Sài Gòn & Cà phê vợt xưa

Nếu Hà Nội chuộng cà phê phin trầm mặc trong ngõ nhỏ, thì Sài Gòn lại sôi động với **"cà phê bệt"** dưới tán cây công viên 30/4 hay những quán **cà phê vợt** đỏ lửa thâu đêm suốt sáng hơn nửa thế kỷ qua.

Uống cà phê ở Việt Nam là một cách tuyệt vời để bạn thực hành tiếng Việt: chỉ cần gọi *"Cho em một ly cà phê sữa đá, ít ngọt!"* là bạn đã hòa mình trọn vẹn vào nhịp đập của xứ sở này rồi!`,
    usefulPhrases: [
      {
        word: 'Cà phê phin',
        pronunciation: 'kà-phê-phin',
        meaning: 'Traditional Vietnamese drip filter coffee',
        context: 'Dùng khi muốn gọi cà phê pha bằng phin truyền thống.',
      },
      {
        word: 'Cà phê sữa đá',
        pronunciation: 'kà-phê-sữa-đá',
        meaning: 'Iced coffee with sweetened condensed milk',
        context: 'Thức uống quốc dân phổ biến nhất ở miền Nam.',
      },
      {
        word: 'Cà phê trứng',
        pronunciation: 'kà-phê-trứng',
        meaning: 'Hanoi specialty egg coffee with whipped egg yolk',
        context: 'Đặc sản trứ danh của Hà Nội, thường uống nóng.',
      },
      {
        word: 'Cà phê bệt',
        pronunciation: 'kà-phê-bệt',
        meaning: 'Sidewalk/park coffee sitting on newspaper sheets on the ground',
        context: 'Nét văn hóa trẻ trung, phóng khoáng tại TP. Hồ Chí Minh.',
      },
      {
        word: 'Ít ngọt / Ít đá',
        pronunciation: 'ít-ngọt / ít-đá',
        meaning: 'Less sweet / Less ice',
        context: 'Dùng để dặn người bán pha chế theo khẩu vị riêng.',
      },
    ],
    relatedArticles: ['bi-quyet-pho-ha-noi', 'van-hoa-xe-may-sai-gon'],
  },
  {
    id: 'bi-quyet-pho-ha-noi',
    title: 'Bí quyết thưởng thức Phở chuẩn vị Hà Nội và văn hóa ẩm thực Tràng An',
    subtitle: 'Nồi nước dùng ninh từ xương bò, bánh phở mềm mướt và phong vị tao nhã của người Hà Thành',
    category: 'culinary',
    categoryName: 'Ẩm thực',
    destination: 'hanoi',
    destinationName: 'Hà Nội',
    readTime: '5 phút đọc',
    publishedDate: '18/03/2026',
    author: 'Vũ Bằng',
    authorRole: 'Nhà báo chuyên mục ẩm thực',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    summary: 'Phở không chỉ là món ăn biểu tượng của Việt Nam trên bản đồ thế giới, mà còn mang trọn cốt cách tao nhã, tinh tế và sự kỹ tính của người Tràng An.',
    content: `### 🍲 Nước dùng - Linh hồn của bát phở

Một bát phở chuẩn vị Hà Nội trước hết phải có nồi nước dùng trong vắt nhưng ngọt đậm từ xương ống bò ninh kỹ từ 10 đến 12 tiếng. Hương thơm thoang thoảng của gừng nướng, hành nướng, hoa hồi, quế chi và thảo quả quyện vào nhau tạo nên một bản giao hưởng khứu giác khó cưỡng.

Người Hà Nội sành ăn không thích nước dùng nhiều mỡ màng hay lạm dụng hạt nêm, đường; vị ngọt phải thanh thoát, dịu êm và đọng lại nơi cuống họng.

---

### 🥢 Tái hay Chín? Nạc hay Gầu?

Khi bước vào quán phở truyền thống ở phố Hàng Đồng hay Bát Đàn, bạn sẽ nghe những âm thanh rộn rã:
- *"Cho một bát tái nạm, nhiều hành ít bánh!"*
- *"Một bát gầu giòn, thêm hai chiếc quẩy giòn và chén trứng chần!"*

Thịt bò tái được dần mỏng, trần vừa chín tới giữ trọn độ mọng nước ngọt ngào; trong khi thịt chín hay nạm lại thơm bùi, đậm đà gia vị.

---

### 🍋 Dấm tỏi hay Chanh?

Người Hà Nội xưa thường ăn phở với **dấm tỏi ớt ngâm** thay vì vắt chanh, bởi vị chua thanh của dấm không làm át đi hương thơm tự nhiên của nước dùng bò. Hãy thử một lần thưởng thức phở với vài giọt tương ớt cay nồng tự làm và lát tỏi ngâm giòn rụm!`,
    usefulPhrases: [
      {
        word: 'Nước dùng trong',
        pronunciation: 'nước-dùng-chong',
        meaning: 'Clear broth',
        context: 'Đặc trưng cốt lõi của phở Hà Nội.',
      },
      {
        word: 'Phở bò tái chín',
        pronunciation: 'phở-bò-tái-chín',
        meaning: 'Beef pho with both rare and well-done beef',
        context: 'Lựa chọn phổ biến nhất khi lần đầu gọi phở.',
      },
      {
        word: 'Quẩy giòn',
        pronunciation: 'quẩy-giòn',
        meaning: 'Crispy fried dough sticks',
        context: 'Món ăn kèm nhúng vào nước phở cực kỳ hấp dẫn.',
      },
      {
        word: 'Dấm tỏi',
        pronunciation: 'dấm-tỏi',
        meaning: 'Garlic-infused vinegar condiment',
        context: 'Gia vị truyền thống ăn kèm phở tại miền Bắc.',
      },
    ],
    relatedArticles: ['van-hoa-ca-phe-viet-nam', 'nghe-thuat-xung-ho-viet-nam'],
  },
  {
    id: 'nghe-thuat-xung-ho-viet-nam',
    title: 'Nghệ thuật xưng hô trong gia đình và xã hội Việt Nam: Tinh tế và tôn ti',
    subtitle: 'Khám phá thế giới đại từ nhân xưng phong phú bậc nhất thế giới và ý nghĩa đằng sau',
    category: 'tradition',
    categoryName: 'Lễ hội & Phong tục',
    destination: 'all',
    destinationName: 'Toàn quốc',
    readTime: '7 phút đọc',
    publishedDate: '20/03/2026',
    author: 'TS. Lê Hoàng Mai',
    authorRole: 'Giảng viên ngôn ngữ học',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    summary: 'Nếu như tiếng Anh chỉ có "I" và "You", thì tiếng Việt có hàng chục cách xưng hô phản ánh tuổi tác, mối quan hệ, cấp bậc và tình cảm yêu thương.',
    content: `### 👨‍👩‍👧‍👦 Xã hội như một gia đình mở rộng

Trong văn hóa Việt Nam, toàn bộ xã hội được nhìn nhận như một đại gia đình. Do đó, người lạ khi gặp nhau cũng ngay lập tức định vị tuổi tác để gọi nhau bằng:
- **Anh / Chị**: Người lớn hơn mình vài tuổi
- **Em**: Người nhỏ tuổi hơn mình
- **Cô / Chú / Bác**: Người bằng tuổi cha mẹ mình
- **Ông / Bà**: Người lớn tuổi thế hệ ông bà

---

### 🙏 Chữ "Dạ" và "Ạ" - Đỉnh cao của sự lễ phép

Trong tiếng Việt, một người ngoại quốc nói được chữ **"Dạ"** mở đầu và chữ **"ạ"** kết câu với người lớn tuổi sẽ nhận được nụ cười cảm tình và sự yêu mến tức thì từ người bản xứ:
> *"Dạ, con cảm ơn cô ạ!"*  
> *"Dạ, cháu chào bác ạ!"*

Đây không chỉ là ngữ pháp, mà là nhịp cầu văn hóa thể hiện sự khiêm nhường, kính cẩn.`,
    usefulPhrases: [
      {
        word: 'Kính trên nhường dưới',
        pronunciation: 'kính-trên-nhường-dưới',
        meaning: 'Respect elders and yield to youngsters',
        context: 'Đạo lý cốt lõi trong giao tiếp người Việt.',
      },
      {
        word: 'Dạ, chào bác ạ',
        pronunciation: 'dạ-chào-bác-ạ',
        meaning: 'Polite greeting to an elder uncle/aunt',
        context: 'Dùng khi chào hỏi người lớn tuổi hơn cha mẹ mình.',
      },
      {
        word: 'Anh / Chị / Em',
        pronunciation: 'anh / chị / em',
        meaning: 'Older brother / Older sister / Younger sibling',
        context: 'Cách xưng hô phổ biến nhất trong đời sống hàng ngày.',
      },
    ],
    relatedArticles: ['phong-tuc-tet-nguyen-dan', 'van-hoa-ca-phe-viet-nam'],
  },
  {
    id: 'phong-tuc-tet-nguyen-dan',
    title: 'Phong tục đón Tết Nguyên Đán: Những điều nên làm và kiêng kỵ để đón lộc',
    subtitle: 'Tết là dịp đoàn viên thiêng liêng nhất, nơi gói trọn ước vọng về một năm mới an khang thịnh vượng',
    category: 'tradition',
    categoryName: 'Lễ hội & Phong tục',
    destination: 'all',
    destinationName: 'Toàn quốc',
    readTime: '6 phút đọc',
    publishedDate: '22/03/2026',
    author: 'Trần Gia Bảo',
    authorRole: 'Nhà nghiên cứu phong tục cổ truyền',
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    summary: 'Tết Nguyên Đán không chỉ là kỳ nghỉ lễ đầu năm mà là thời khắc sum họp linh thiêng của gia đình Việt, với bánh chưng xanh, hoa mai, hoa đào và những phong bao lì xì đỏ may mắn.',
    content: `### 🌸 Hoa Đào miền Bắc & Hoa Mai miền Nam

Ngày Tết, mỗi gia đình miền Bắc không thể thiếu cành đào phai hay bích đào thắm đượm sắc hồng đón gió xuân se lạnh; còn ở miền Nam, sắc vàng rực rỡ của cành mai biểu trưng cho tài lộc, phú quý và hy vọng ngập tràn.

---

### 🧧 Phong tục mừng tuổi (Lì xì) & Xông đất

Sáng mùng Một Tết, con cháu chúc thọ ông bà, cha mẹ và nhận lại những phong bao lì xì đỏ may mắn tượng trưng cho lời chúc học hành đỗ đạt, hay ăn chóng lớn.

Người đầu tiên bước vào nhà sau thời khắc giao thừa gọi là **người xông đất**, được gia chủ lựa chọn kỹ càng để mang lại vượng khí cho cả năm.`,
    usefulPhrases: [
      {
        word: 'Chúc mừng năm mới',
        pronunciation: 'chúc-mừng-năm-mới',
        meaning: 'Happy New Year!',
        context: 'Lời chúc cửa miệng thân thuộc nhất dịp Tết.',
      },
      {
        word: 'An khang thịnh vượng',
        pronunciation: 'an-khang-thịnh-vượng',
        meaning: 'Peace, health, and prosperity',
        context: 'Lời chúc trang trọng dành tặng đối tác, gia đình.',
      },
      {
        word: 'Lì xì may mắn',
        pronunciation: 'lì-xì-may-mắn',
        meaning: 'Lucky red envelope money',
        context: 'Phong tục trao may mắn cho trẻ em và người già.',
      },
    ],
    relatedArticles: ['nghe-thuat-xung-ho-viet-nam', 'kham-pha-hoi-an'],
  },
  {
    id: 'kham-pha-hoi-an',
    title: 'Khám phá nét duyên phố cổ Hội An: Đèn lồng, ẩm thực và nếp sống mộc mạc',
    subtitle: 'Thương cảng sầm uất thế kỷ 17 được bảo tồn gần như nguyên vẹn bên dòng sông Hoài êm đềm',
    category: 'travel-spots',
    categoryName: 'Danh lam & Điểm đến',
    destination: 'hoian',
    destinationName: 'Hội An',
    readTime: '5 phút đọc',
    publishedDate: '25/03/2026',
    author: 'Hoàng Minh Châu',
    authorRole: 'Cây bút du lịch Heritage',
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hội An mê hoặc du khách bởi những bức tường vàng rêu phong, giàn hoa giấy rực rỡ, cây Chùa Cầu trăm năm và lễ hội hoa đăng lung linh huyền ảo mỗi đêm rằm.',
    content: `### 🏮 Lung linh đêm hoa đăng sông Hoài

Khi hoàng hôn buông xuống, toàn bộ khu phố cổ tắt bớt đèn điện hiện đại để nhường chỗ cho hàng vạn chiếc đèn lồng lụa rực rỡ sắc màu. Đi thuyền thả hoa đăng trên dòng sông Hoài là trải nghiệm lãng mạn và an yên bậc nhất miền Trung.

---

### 🍜 Ẩm thực Hội An: Cao lầu & Bánh mì nức tiếng

Đến Hội An, bạn nhất định phải thử **Cao lầu** – món mì đặc trưng mà tương truyền nước nhào bột phải lấy từ giếng nước cổ Bá Lễ, cùng tro củi cù lao Chàm; và **Bánh mì Phượng** hay **Bánh mì Madam Khánh** đã được nhiều đầu bếp quốc tế ca ngợi là bánh mì ngon nhất thế giới!`,
    usefulPhrases: [
      {
        word: 'Đèn lồng phố cổ',
        pronunciation: 'đèn-lồng-phố-cổ',
        meaning: 'Old town silk lanterns',
        context: 'Biểu tượng văn hóa đặc sắc của Hội An.',
      },
      {
        word: 'Thả hoa đăng',
        pronunciation: 'thả-hoa-đăng',
        meaning: 'Floating flower lanterns on the river to make wishes',
        context: 'Hoạt động trải nghiệm nổi tiếng trên sông Hoài.',
      },
      {
        word: 'Cao lầu Hội An',
        pronunciation: 'cao-lầu-hội-an',
        meaning: 'Hoi An signature noodle bowl with crispy pork and greens',
        context: 'Món ăn đặc sản nhất định phải thử khi đến Hội An.',
      },
    ],
    relatedArticles: ['van-hoa-ca-phe-viet-nam', 'cho-noi-mientay'],
  },
  {
    id: 'cho-noi-mientay',
    title: 'Nét đặc trưng văn hóa chợ nổi miền Tây sông nước Cái Răng',
    subtitle: 'Cây bẹo treo hàng hóa và nhịp sống độc đáo trên mênh mông sông rạch Đồng bằng sông Cửu Long',
    category: 'travel-spots',
    categoryName: 'Danh lam & Điểm đến',
    destination: 'mientay',
    destinationName: 'Miền Tây',
    readTime: '5 phút đọc',
    publishedDate: '27/03/2026',
    author: 'Út Trà Vinh',
    authorRole: 'Hướng dẫn viên bản địa',
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    summary: 'Từ 4-5 giờ sáng, hàng trăm chiếc ghe thuyền chở đầy hoa trái miệt vườn tụ hội trên ngã ba sông, tạo nên bức tranh thương hồ sống động và hào sảng của con người phương Nam.',
    content: `### 🛶 Độc đáo "Cây bẹo" chào hàng không lời

Giữa mênh mông sóng nước ồn ào tiếng động cơ thuyền, người buôn bán không thể cất tiếng rao từng món. Vì thế họ sáng tạo ra **"Cây bẹo"** – một cây sào tre dài dựng đứng trước mũi ghe, trên treo quả dưa hấu thì bán dưa, treo chùm nhãn thì bán nhãn. Khách hàng từ xa nhìn thấy là biết ghe đó bán thứ gì!

---

### 🍜 Ăn tô hủ tiếu bồng bềnh trên sóng nước

Còn gì thi vị bằng việc neo ghe cạnh một chiếc thuyền bán đồ ăn sáng, gọi một tô **hủ tiếu Nam Vang** hay **bún riêu cua** bốc khói nghi ngút, kèm ly cà phê sữa đá mát lạnh giữa ngọn gió sông ban mai trong lành!`,
    usefulPhrases: [
      {
        word: 'Cây bẹo',
        pronunciation: 'cây-bẹo',
        meaning: 'Bamboo pole used on boats to display merchandise for sale',
        context: 'Nét sáng tạo độc đáo của chợ nổi Nam Bộ.',
      },
      {
        word: 'Thương hồ',
        pronunciation: 'thương-hồ',
        meaning: 'River traders / boat merchants living on waters',
        context: 'Từ ngữ chỉ những người buôn bán lênh đênh trên sông.',
      },
      {
        word: 'Miệt vườn sông nước',
        pronunciation: 'miệt-vườn-sông-nước',
        meaning: 'Fruit orchard countryside along waterways',
        context: 'Cảnh quan đặc trưng của vùng đồng bằng sông Cửu Long.',
      },
    ],
    relatedArticles: ['kham-pha-hoi-an', 'van-hoa-ca-phe-viet-nam'],
  },
];

export const cultureService = {
  getCategories() {
    return CULTURE_CATEGORIES;
  },

  getDestinations() {
    return CULTURE_DESTINATIONS;
  },

  listArticles({ search = '', category = 'all', destination = 'all' } = {}) {
    let result = [...CULTURE_ARTICLES];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      result = result.filter(a => a.category === category);
    }

    if (destination && destination !== 'all') {
      result = result.filter(a => a.destination === destination);
    }

    return result;
  },

  getFeaturedArticles() {
    return CULTURE_ARTICLES.filter(a => a.isFeatured);
  },

  getArticle(id) {
    return CULTURE_ARTICLES.find(a => a.id === id) || null;
  },

  getRelatedArticles(id) {
    const article = this.getArticle(id);
    if (!article) return [];
    return CULTURE_ARTICLES.filter(
      a => a.id !== id && (article.relatedArticles?.includes(a.id) || a.destination === article.destination || a.category === article.category)
    ).slice(0, 3);
  },
};
