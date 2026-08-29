// General assessment questions (10 questions)
export const generalQuestions = [
  {
    ar: "يُظهر قدرات معرفية متقدمة مقارنة بالأداء الأكاديمي الظاهر.",
    en: "Shows advanced cognitive abilities compared to apparent academic performance.",
  },
  {
    ar: "لديه اهتمامات نوعية أو غير مألوفة تدل على تفوق في مجالات محددة.",
    en: "Has specialized or unusual interests indicating excellence in specific domains.",
  },
  {
    ar: "يطرح أسئلة عميقة وغير تقليدية تكشف عن تفكير نقدي مميز.",
    en: "Asks deep, unconventional questions that reveal distinctive critical thinking.",
  },
  {
    ar: "يُظهر تفوقًا في مهارات محددة يتجاوز بها أقرانه.",
    en: "Demonstrates superiority in specific skills beyond peers.",
  },
  {
    ar: "يُعبّر عن وعي داخلي عميق بفجوة إمكاناته مما يدل على إدراك ذاتي متقدم.",
    en: "Expresses deep self-awareness of the gap in potential, indicating advanced self-perception.",
  },
  {
    ar: "يحقق أداءً أفضل عند توفير وقت إضافي أو دعم مخصص.",
    en: "Performs better when provided extra time or targeted support.",
  },
  {
    ar: "يتفاعل بفاعلية مع الأنشطة الإبداعية أو الاستكشافية.",
    en: "Engages effectively with creative or exploratory activities.",
  },
  {
    ar: "يفضل البيئات الداعمة التي تتيح له إبراز إمكاناته الفكرية والإبداعية.",
    en: "Prefers supportive environments that allow showcasing intellectual and creative potential.",
  },
  {
    ar: "يُظهر حاجة إلى تنظيم المهام بطرق مبتكرة كي يعكس قدراته الحقيقية.",
    en: "Shows a need to organize tasks in innovative ways to reflect true abilities.",
  },
  {
    ar: "يُبرز أداءً متميزًا في التقييمات الشفهية مقارنة بالتحريرية.",
    en: "Exhibits outstanding performance in oral assessments compared to written ones.",
  },
];
// Disability categories
export const disabilityCategories = [
  {
    id: "unified",
    ar: "البند السلوكي المرتبط بالتوحد والموهبة الشاملة",
    en: "Unified and Giftedness Related Behaviors",
  },
  {
    id: "learning-difficulties",
    ar: "البند السلوكي المرتبط بصعوبات التعلم والموهبة",
    en: "Learning Difficulties and Giftedness Related Behaviors",
  },
  {
    id: "hearing-impairment",
    ar: "البند السلوكي المرتبط بالإعاقة السمعية والموهبة",
    en: "Hearing Impairment and Giftedness Related Behaviors",
  },
  {
    id: "visual-impairment",
    ar: "البند السلوكي المرتبط بالإعاقة البصرية والموهبة",
    en: "Visual Impairment and Giftedness Related Behaviors",
  },
  {
    id: "physical-disability",
    ar: "البند السلوكي المرتبط بالإعاقة الجسدية والموهبة",
    en: "Physical Disability and Giftedness Related Behaviors",
  },
  {
    id: "intellectual-disability",
    ar: "البند السلوكي المرتبط بالإعاقة الفكرية والموهبة",
    en: "Intellectual Disability and Giftedness Related Behaviors",
  },
  {
    id: "adhd",
    ar: "البند السلوكي المرتبط بفرط الحركة وتشتت الانتباه والموهبة",
    en: "ADHD and Giftedness Related Behaviors",
  },
  {
    id: "borderline-intelligence",
    ar: "البند السلوكي المرتبط بالذكاء الحدي والموهبة",
    en: "Borderline Intelligence and Giftedness Related Behaviors",
  },
  {
    id: "multiple-disabilities",
    ar: "البند السلوكي المرتبط بالإعاقات المتعددة والموهبة",
    en: "Multiple Disabilities and Giftedness Related Behaviors",
  },
];

// Disability-specific questions - All 8 categories with 10 questions each
export const getDisabilityQuestions = (disabilityId: string) => {
  const questions = {
    unified: [
      {
        ar: "يُظهر قدرات عالية في الحفظ أو التذكر التفصيلي لمعلومات محددة",
        en: "Shows high abilities in memorization or detailed recall of specific information",
      },
      {
        ar: "يميل إلى الانخراط العميق في موضوعات محددة دون اهتمام بالمواضيع الأخرى",
        en: "Tends to deeply engage in specific topics without interest in other subjects",
      },
      {
        ar: "يُفضّل الأنشطة الفردية التي تتيح له إبراز تميزه وإبداعه الخاص",
        en: "Prefers individual activities that allow them to showcase their uniqueness and creativity",
      },
      {
        ar: "يفكر بطريقة غير تقليدية، ويقترح حلولًا مبتكرة لمشكلات معقدة",
        en: "Thinks unconventionally and suggests innovative solutions to complex problems",
      },
      {
        ar: "يُظهر اهتمامًا شديدًا بالتفاصيل الدقيقة أو الأنماط المتكررة",
        en: "Shows intense interest in fine details or repetitive patterns",
      },
      {
        ar: "يعبر عن مشاعره وأفكاره بطرق مميزة تكشف عن منظور مختلف",
        en: "Expresses emotions and thoughts in distinctive ways that reveal a different perspective",
      },
      {
        ar: "يُفضل الروتين كوسيلة لزيادة الإنتاجية والاستقرار",
        en: "Prefers routine as a means to enhance productivity and stability",
      },
      {
        ar: "يميل إلى التواصل غير اللفظي (مثل الرسم أو الكتابة) أكثر من الكلام المباشر",
        en: "Tends toward non-verbal communication (like drawing or writing) more than direct speech",
      },
      {
        ar: "يتفاعل بطريقة غير مألوفة في المواقف الاجتماعية تدل على نضج عقلي متقدم",
        en: "Interacts in unusual ways in social situations that indicate advanced mental maturity",
      },
      {
        ar: "يُظهر اهتمامًا مبكرًا بالقراءة أو المفاهيم المجردة",
        en: "Shows early interest in reading or abstract concepts",
      },
    ],
    "learning-difficulties": [
      {
        ar: "يُظهر فهمًا عاليًا للمفاهيم المجردة رغم ضعف الأداء في القراءة أو الإملاء",
        en: "Shows high understanding of abstract concepts despite weak reading or spelling performance",
      },
      {
        ar: "يمتلك مفردات غنية عند التحدث، لكنه يواجه صعوبات في التعبير الكتابي",
        en: "Has rich vocabulary when speaking but faces difficulties in written expression",
      },
      {
        ar: "يتفاعل بشكل مميز في النقاشات الشفهية لكنه يتجنب القراءة الجهرية",
        en: "Interacts distinctively in oral discussions but avoids reading aloud",
      },
      {
        ar: "يظهر أداء ممتازًا عند تنفيذ المهام الشفوية أو العملية مقارنة بالكتابية",
        en: "Shows excellent performance in oral or practical tasks compared to written ones",
      },
      {
        ar: "يُظهر تنظيمًا مميزًا لأفكاره في المناقشات الشفهية مقارنة بالكتابة",
        en: "Shows distinctive organization of ideas in oral discussions compared to writing",
      },
      {
        ar: "يتضايق من المهام التي تتطلب كتابة طويلة، ويفضل العرض الشفهي أو المرئي",
        en: "Gets frustrated with tasks requiring lengthy writing, prefers oral or visual presentation",
      },
      {
        ar: "يُظهر تفوقًا في التعبير الشفهي والمفاهيم المجردة أكثر من الجوانب الكتابية مثل الإملاء",
        en: "Excels in oral expression and abstract concepts more than in written aspects such as spelling",
      },
      {
        ar: "يفهم التعليمات عند شرحها له شفهيًا، لكنه لا يتبع التعليمات المكتوبة بسهولة",
        en: "Understands instructions when explained orally but doesn't easily follow written instructions",
      },
      {
        ar: "يتمتع بقدرات تحليلية أو منطقية قوية، لكنه يعاني من بطء في إنجاز المهام الورقية",
        en: "Has strong analytical or logical abilities but struggles with slow completion of paper tasks",
      },
      {
        ar: "يُظهر وعيًا بقدراته المتقدمة ورغبة في تحسين أدائه الأكاديمي ليتناسب مع موهبته",
        en: "Shows awareness of advanced abilities and a desire to improve academic performance to match their talent",
      },
    ],
    "hearing-impairment": [
      {
        ar: "يُظهر قدرات سمعية متقدمة في التعلم والاستيعاب",
        en: "Shows advanced auditory abilities in learning and comprehension",
      },
      {
        ar: "يتفوق في المهام اللفظية والحوارات المعقدة",
        en: "Excels in verbal tasks and complex dialogues",
      },
      {
        ar: "يمتلك مهارات استماع عالية ويلتقط التفاصيل الصوتية بدقة",
        en: "Has high listening skills and captures audio details accurately",
      },
      {
        ar: "يُظهر ذاكرة سمعية قوية ويحفظ المعلومات المنطوقة بسهولة",
        en: "Shows strong auditory memory and memorizes spoken information easily",
      },
      {
        ar: "يتميز في الأنشطة الموسيقية أو الأدبية أو اللغوية",
        en: "Excels in musical, literary, or linguistic activities",
      },
      {
        ar: "يعوّض تأخره النسبي في اللغة المنطوقة بتفوق واضح في مجالات معرفية أو إبداعية أخرى",
        en: "Compensates for relative delay in spoken language with clear excellence in other cognitive or creative areas",
      },
      {
        ar: "يستخدم حواسه الأخرى (اللمس والشم) بشكل إبداعي للتعلم",
        en: "Uses other senses (touch and smell) creatively for learning",
      },
      {
        ar: "يُظهر تركيزًا عاليًا في البيئات الهادئة المناسبة للاستماع",
        en: "Shows high concentration in quiet environments suitable for listening",
      },
      {
        ar: "يتفاعل إيجابيًا مع التقنيات المساعدة والمواد الصوتية",
        en: "Responds positively to assistive technologies and audio materials",
      },
      {
        ar: "يعاني من الإحباط عند عدم توفر المواد التعليمية بتنسيقات يمكن الوصول إليها",
        en: "Gets frustrated when educational materials are not available in accessible formats",
      },
    ],
    "visual-impairment": [
      {
        ar: "يُظهر قدرات بصرية عالية في التعلم والفهم",
        en: "Shows high visual abilities in learning and understanding",
      },
      {
        ar: "يتفوق في المهام التي تعتمد على الملاحظة البصرية والتفاصيل",
        en: "Excels in tasks that rely on visual observation and details",
      },
      {
        ar: "يستخدم الإشارات أو الرسوم للتعبير عن أفكار معقدة بوضوح",
        en: "Uses gestures or drawings to express complex ideas clearly",
      },
      {
        ar: "يُظهر فهمًا عميقًا للمفاهيم المجردة عند عرضها بصريًا",
        en: "Shows deep understanding of abstract concepts when presented visually",
      },
      {
        ar: "يميل إلى التركيز الشديد على المهام البصرية لفترات طويلة",
        en: "Tends to focus intensely on visual tasks for long periods",
      },
      {
        ar: "يبدع في الأنشطة الفنية أو التصميمية أو التكنولوجية",
        en: "Excels in artistic, design, or technological activities",
      },
      {
        ar: "يتفاعل إيجابيًا مع التعلم التفاعلي والألعاب التعليمية البصرية",
        en: "Responds positively to interactive learning and visual educational games",
      },
      {
        ar: "يُظهر مهارات قوية في حل المشكلات عند استخدام الأدوات البصرية",
        en: "Shows strong problem-solving skills when using visual tools",
      },
      {
        ar: "يعبر عن الإحباط عندما تكون المعلومات غير مصحوبة بدعم بصري",
        en: "Expresses frustration when information is not accompanied by visual support",
      },
      {
        ar: "يتميز بذاكرة بصرية قوية ويتذكر التفاصيل البصرية بدقة",
        en: "Has strong visual memory and remembers visual details accurately",
      },
    ],
    "physical-disability": [
      {
        ar: "يُظهر إبداعًا أو تفوقًا في مجالات عقلية (مثل: التحليل، التفكير النقدي، أو حل المشكلات) رغم التحديات الحركية.",
        en: "Shows creativity or excellence in mental domains (e.g., analysis, critical thinking, or problem-solving) despite motor challenges.",
      },
      {
        ar: "يوظّف بدائل أو أدوات مساعدة بمرونة لإبراز موهبته.",
        en: "Flexibly employs alternatives or assistive tools to showcase talent.",
      },
      {
        ar: "يعبر بوضوح عن أفكاره ومشاعره شفهيًا أو كتابيًا رغم محدودية الحركة.",
        en: "Clearly expresses thoughts and feelings verbally or in writing despite limited mobility.",
      },
      {
        ar: "يُبدي مثابرة عالية وإصرارًا على إنجاز المهام مقارنة بأقرانه.",
        en: "Demonstrates high perseverance and determination to complete tasks compared to peers.",
      },
      {
        ar: "يبتكر استراتيجيات للتغلب على القيود الجسدية لتحقيق أهدافه.",
        en: "Innovates strategies to overcome physical constraints to achieve goals.",
      },
      {
        ar: "يظهر حساسية عالية ودقة في الملاحظات الفكرية أو الإبداعية تعوّض التحديات البدنية.",
        en: "Shows high sensitivity and precision in intellectual or creative observations compensating for physical challenges.",
      },
      {
        ar: "يبرع في الأنشطة الذهنية أو الفنية (مثل: الرسم الرقمي، التأليف، البرمجة، الحساب الذهني).",
        en: "Excels in mental or artistic activities (e.g., digital drawing, writing, programming, mental arithmetic).",
      },
      {
        ar: "يتفاعل إيجابيًا مع زملائه في الأنشطة الجماعية رغم حاجته لدعم جسدي.",
        en: "Interacts positively with peers in group activities despite needing physical support.",
      },
      {
        ar: "يظهر وعيًا اجتماعيًا وعاطفيًا ناضجًا يفوق عمره الزمني.",
        en: "Shows mature social and emotional awareness beyond chronological age.",
      },
      {
        ar: "يُظهر حماسًا للمشاركة في الأنشطة الإثرائية أو البحثية إذا أُتيحت له التسهيلات المناسبة.",
        en: "Shows enthusiasm to participate in enrichment or research activities when appropriate accommodations are provided.",
      },
    ],
    "intellectual-disability": [
      {
        ar: "يُظهر مهارات خاصة في مجالات محددة رغم التأخر العام في التطور",
        en: "Shows special skills in specific areas despite general developmental delay",
      },
      {
        ar: "يتعلم بطريقة أفضل عند استخدام طرق تدريس مبسطة ومتدرجة",
        en: "Learns better when using simplified and gradual teaching methods",
      },
      {
        ar: "يُظهر قدرة على الإبداع في المجالات العملية أو الفنية",
        en: "Shows ability for creativity in practical or artistic fields",
      },
      {
        ar: "يحتاج لوقت إضافي لمعالجة المعلومات ولكنه يصل لنتائج مدهشة أحيانًا",
        en: "Needs extra time to process information but sometimes reaches amazing results",
      },
      {
        ar: "يستجيب بشكل إيجابي للتعزيز والتشجيع المستمر",
        en: "Responds positively to continuous reinforcement and encouragement",
      },
      {
        ar: "يُظهر مثابرة عالية في المهام التي يجدها ممتعة أو ذات معنى",
        en: "Shows high persistence in tasks that are enjoyable or meaningful to them",
      },
      {
        ar: "يتفاعل جيدًا في البيئات التعليمية الداعمة وغير المهددة",
        en: "Interacts well in supportive and non-threatening educational environments",
      },
      {
        ar: "يُظهر تحسنًا ملحوظًا عند تلقي التدريب المخصص لاحتياجاته",
        en: "Shows noticeable improvement when receiving training tailored to their needs",
      },
      {
        ar: "يميل إلى التعلم من خلال التجربة المباشرة والأنشطة العملية",
        en: "Tends to learn through direct experience and hands-on activities",
      },
      {
        ar: "يعبر عن إحباطه عند مواجهة توقعات غير واقعية أو مهام معقدة جداً",
        en: "Expresses frustration when facing unrealistic expectations or overly complex tasks",
      },
    ],
    adhd: [
      {
        ar: "يُظهر طاقة عالية وحماسًا في المجالات التي يهتم بها",
        en: "Shows high energy and enthusiasm in areas of interest",
      },
      {
        ar: "يتفوق في المهام التي تتطلب تفكيرًا سريعًا وحلولًا إبداعية",
        en: "Excels in tasks requiring quick thinking and creative solutions",
      },
      {
        ar: "يُظهر قدرة على التركيز العميق عندما يكون الموضوع مثيرًا لاهتمامه",
        en: "Shows ability for deep focus when the subject is of interest to them",
      },
      {
        ar: "يميل إلى تعدد المهام ويمكنه إدارة عدة أنشطة في وقت واحد",
        en: "Tends to multitask and can manage several activities at once",
      },
      {
        ar: "يبدع في البيئات التعليمية النشطة والتفاعلية",
        en: "Excels in active and interactive learning environments",
      },
      {
        ar: "يُظهر مرونة في التفكير وقدرة على الانتقال بين الأفكار بسرعة",
        en: "Shows flexibility in thinking and ability to shift between ideas quickly",
      },
      {
        ar: "يتضايق من المهام الروتينية أو المتكررة ويفضل التحديات الجديدة",
        en: "Gets frustrated with routine or repetitive tasks and prefers new challenges",
      },
      {
        ar: "يحتاج إلى فترات راحة منتظمة أو تغيير في الأنشطة للحفاظ على التركيز",
        en: "Needs regular breaks or activity changes to maintain focus",
      },
      {
        ar: "يتفاعل إيجابيًا مع الأنشطة التي تشمل الحركة أو التطبيق العملي",
        en: "Responds positively to activities that include movement or practical application",
      },
      {
        ar: "يُظهر قدرة على التفكير خارج الصندوق وإيجاد حلول غير تقليدية",
        en: "Shows ability to think outside the box and find unconventional solutions",
      },
    ],
    "borderline-intelligence": [
      {
        ar: "يُظهر أداءً متقلبًا، قد يتفوق في بعض المهام ويواجه صعوبة في أخرى",
        en: "Shows fluctuating performance, may excel in some tasks while struggling in others",
      },
      {
        ar: "يتعلم بشكل أفضل عندما تُقدم المعلومات بطريقة ملموسة ومرئية",
        en: "Learns better when information is presented in concrete and visual ways",
      },
      {
        ar: "يُظهر مهارات عملية قوية في الأنشطة اليومية أو المهنية",
        en: "Shows strong practical skills in daily or vocational activities",
      },
      {
        ar: "يحتاج لوقت إضافي لمعالجة المعلومات المعقدة ولكنه قادر على الفهم",
        en: "Needs extra time to process complex information but is capable of understanding",
      },
      {
        ar: "يستفيد من التكرار والممارسة المنتظمة لإتقان المهارات",
        en: "Benefits from repetition and regular practice to master skills",
      },
      {
        ar: "يُظهر حماسًا وإبداعًا في الأنشطة التي تناسب قدراته",
        en: "Shows enthusiasm and creativity in activities that match their abilities",
      },
      {
        ar: "يتفاعل جيدًا مع التوجيه والدعم الفردي المخصص",
        en: "Responds well to individualized guidance and support",
      },
      {
        ar: "يميل إلى الأداء الأفضل في البيئات التعليمية الهادئة وغير المضغوطة",
        en: "Tends to perform better in calm and pressure-free educational environments",
      },
      {
        ar: "يُظهر قدرة على التعلم الاجتماعي والاستفادة من النماذج والقدوة",
        en: "Shows ability for social learning and benefiting from models and role models",
      },
      {
        ar: "يشعر بالإحباط عندما تكون التوقعات عالية جداً أو عندما يُقارن بأقرانه",
        en: "Feels frustrated when expectations are too high or when compared to peers",
      },
    ],
    "multiple-disabilities": [
      {
        ar: "يُظهر قدرات مميزة في مجال واحد أو أكثر رغم وجود إعاقات متعددة",
        en: "Shows distinctive abilities in one or more areas despite having multiple disabilities",
      },
      {
        ar: "يتكيف مع التقنيات المساعدة المتنوعة ويستفيد منها بطريقة إبداعية",
        en: "Adapts to various assistive technologies and uses them creatively",
      },
      {
        ar: "يستجيب بشكل إيجابي للتعلم متعدد الحواس والطرق المتنوعة",
        en: "Responds positively to multisensory learning and diverse methods",
      },
      {
        ar: "يُظهر عزيمة قوية ومثابرة في التغلب على التحديات اليومية",
        en: "Shows strong determination and persistence in overcoming daily challenges",
      },
      {
        ar: "يتفاعل بشكل مميز مع الأنشطة المصممة خصيصًا لاحتياجاته المتعددة",
        en: "Interacts distinctively with activities specifically designed for their multiple needs",
      },
      {
        ar: "يُظهر تحسنًا ملحوظًا عند تلقي خدمات شاملة ومتكاملة",
        en: "Shows noticeable improvement when receiving comprehensive and integrated services",
      },
      {
        ar: "يميل إلى التعبير عن ذاته بطرق غير تقليدية ولكنها فعالة",
        en: "Tends to express themselves in unconventional but effective ways",
      },
      {
        ar: "يحتاج إلى بيئة تعليمية عالية التخصص ومرونة في التوقعات",
        en: "Needs a highly specialized educational environment and flexibility in expectations",
      },
      {
        ar: "يستفيد من العمل مع فريق متعدد التخصصات لدعم تطوره الشامل",
        en: "Benefits from working with a multidisciplinary team to support comprehensive development",
      },
      {
        ar: "يُظهر تقدمًا بطيئًا ولكنه مستمر في المهارات التي يتم التركيز عليها",
        en: "Shows slow but consistent progress in skills that are focused upon",
      },
    ],
  };

  return questions[disabilityId as keyof typeof questions] || [];
};
