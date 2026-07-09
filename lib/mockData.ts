export type Lesson = {
  id: string;
  day: number;
  title: string;
  summary: string;
  content: string[];
  assignment: string;
  levelGoal: string;
  task: string;
  achievement: string;
  experience: string;
  assetTip: string;
};

export type MockProgress = {
  points: number;
  checkedInToday: boolean;
  completedLessonIds: string[];
  submittedLessonIds: string[];
};

export const camp = {
  name: "AI人生操作系统创造营",
  headline: "别再只会问AI了，开始打造你的AI人生操作系统",
  subtitle: "14天，把你的人生经验、知识和方法，沉淀成可复用的AI资产。",
  greeting: "人生不是被安排的流程，而是一场由你亲自设计的升级游戏。",
  todayTaskTitle: "今日升级任务",
  todayTaskDescription: "完成今天这一关，解锁你的新能力。",
  pathTitle: "14天升级路径",
  pathSubtitle: "从人生角色卡，到AI超级个体。",
  checkInDescription: "签到获得经验值，连续行动让系统生长。",
  assignmentDescription: "完成作业，解锁你的成长资产。",
  graduationTitle: "恭喜你完成AI人生操作系统V1.0",
  graduationSubtitle: "你已经不是只会问AI的人，而是开始拥有自己的AI系统的人。",
  upsellTitle: "14天只是新手村，真正的升级从毕业后开始。",
  upsellDescription:
    "如果你想让自己的知识库、SOP、Skill继续生长，欢迎进入AI资产共创营。这里不是普通陪伴群，而是你的AI资产持续升级基地。",
  checkInPoints: 5,
  submissionPoints: 20
};

export const lessons: Lesson[] = [
  {
    id: "day-1",
    day: 1,
    title: "创建人生角色卡",
    summary: "完成《人生现状诊断表》，明确当前状态、痛点、目标和期待。",
    levelGoal: "看清自己当前站在哪里，先完成玩家身份创建。",
    task: "填写人生现状诊断表，写清楚当前状态、主要困扰、想改变的方向和14天期待成果。",
    achievement: "觉醒者",
    experience: "+20经验值",
    assetTip: "真正的AI系统不是从工具开始，而是从让AI理解你是谁开始。",
    content: [
      "今天先创建你的人生角色卡：你的当前状态、资源、限制和期待，都是AI理解你的基础资料。",
      "不要追求宏大规划，先把真实情况写清楚。AI越了解你的现实边界，后续建议越不容易空泛。",
      "完成诊断表后，你会得到AI人生操作系统的第一份底层资料。"
    ],
    assignment: "提交《人生现状诊断表》，写清楚你的当前状态、痛点、目标和14天期待。"
  },
  {
    id: "day-2",
    day: 2,
    title: "完成人生说明书",
    summary: "让AI先认识你，完成基础版《人生说明书V1.0》。",
    levelGoal: "把你的背景、经历、优势、限制和偏好整理成AI可理解的说明书。",
    task: "整理个人背景、关键经历、优势短板、目标、偏好、禁区和期待。",
    achievement: "自我探索家",
    experience: "+20经验值",
    assetTip: "人生说明书未来可以用于咨询、个人IP定位、职业规划和AI助理训练。",
    content: [
      "普通AI回答泛，是因为它不知道你是谁。人生说明书就是给AI看的个人使用说明。",
      "说明书不需要一次写完美，先完成V1.0：背景、经历、能力、目标、限制和不想要什么。",
      "后续你的知识库、SOP、Skill和AI助理，都会以这份说明书为基础。"
    ],
    assignment: "提交《人生说明书V1.0》，让AI第一次系统认识你。"
  },
  {
    id: "day-3",
    day: 3,
    title: "设计人生操作系统目录",
    summary: "设计五层人生操作系统目录：认知层、事业层、素材层、生活层、效率层。",
    levelGoal: "为你的玩家基地画出第一张地图。",
    task: "完成《五层人生操作系统目录草图》，不用复杂，但要能放得下你的资料和经验。",
    achievement: "人生架构师预备役",
    experience: "+20经验值",
    assetTip: "目录是你的玩家基地地图，后续所有知识、经验、案例都要有地方存放。",
    content: [
      "没有目录的知识库会很快变成杂物间。今天先搭一个简单但可扩展的目录。",
      "五层结构足够第一版使用：认知层、事业层、素材层、生活层、效率层。",
      "你的目标不是做复杂系统，而是让资料能被找到、被复用、被AI调用。"
    ],
    assignment: "提交《五层人生操作系统目录草图》。"
  },
  {
    id: "day-4",
    day: 4,
    title: "搭建AI人生操作系统",
    summary: "在ima搭建AI人生操作系统知识库，把说明书、经验、故事和Prompt放进去。",
    levelGoal: "搭好你的AI背包，让关键资料开始进入系统。",
    task: "在ima建立知识库，上传人生说明书、经验、故事、常用Prompt和案例资料。",
    achievement: "人生架构师",
    experience: "+20经验值",
    assetTip: "AI知识库未来可以用于课程资料库、社群资料库、客户问答库和个人经验库。",
    content: [
      "今天开始把你的资料放进AI背包。背包越清晰，AI越能基于你的真实资料工作。",
      "优先上传最常用、最能代表你的资料：人生说明书、经历故事、常用话术、案例和Prompt。",
      "完成后截一张知识库截图，这就是你的AI人生操作系统V1.0雏形。"
    ],
    assignment: "提交《AI人生操作系统知识库截图》。"
  },
  {
    id: "day-5",
    day: 5,
    title: "建立个人核心档案",
    summary: "明确自己的优势、短板、适合与不适合。",
    levelGoal: "让AI帮你识别个人能力边界，不再被外部机会带偏。",
    task: "整理个人能力、资源、限制、偏好和风险边界，形成《个人核心档案》。",
    achievement: "项目猎人预备役",
    experience: "+20经验值",
    assetTip: "越清楚自己，越能过滤不适合自己的项目和机会。",
    content: [
      "很多人不是没有机会，而是不知道什么机会适合自己。",
      "个人核心档案要回答：我擅长什么、不擅长什么、有什么资源、不能接受什么。",
      "后续做项目判断时，AI会基于你的档案给出更贴近现实的建议。"
    ],
    assignment: "提交《个人核心档案》。"
  },
  {
    id: "day-6",
    day: 6,
    title: "解锁AI项目决策",
    summary: "用AI评估一个真实项目，判断它是GO / TEMP / PASS。",
    levelGoal: "学会用AI做项目筛选，而不是被情绪和营销文案带着走。",
    task: "选择一个真实项目，填写《项目决策评估表》。",
    achievement: "项目猎人",
    experience: "+20经验值",
    assetTip: "项目决策表未来可以用于副业筛选、咨询服务、陪跑工具和个人决策模型。",
    content: [
      "AI不是替你做决定，而是帮你把项目拆开看清楚。",
      "一个项目至少要看：适配度、资源要求、风险、回报周期、你当前是否具备入场条件。",
      "最终给出GO、TEMP或PASS，不是为了追热点，而是为了少踩坑。"
    ],
    assignment: "提交《项目决策评估表》，写出一个真实项目的GO / TEMP / PASS判断。"
  },
  {
    id: "day-7",
    day: 7,
    title: "盘点可蒸馏经验",
    summary: "理解经历不是资产，被结构化的经验才是资产。",
    levelGoal: "从你的过往经历里找出可以沉淀的经验主题。",
    task: "列出至少3个可沉淀的经验主题，形成《我的经验主题清单》。",
    achievement: "知识炼金师预备役",
    experience: "+20经验值",
    assetTip: "你过去做成过、踩坑过、反复做过的事情，都可能被蒸馏成资产。",
    content: [
      "不是所有经历都会自动变成资产。只有被结构化、可复用、可传递的经验，才会变成资产。",
      "今天先盘点：你做成过什么、被别人请教过什么、踩过什么坑、反复解决过什么问题。",
      "这些主题会成为后续SOP和Skill的原材料。"
    ],
    assignment: "提交《我的经验主题清单》，至少列出3个可蒸馏主题。"
  },
  {
    id: "day-8",
    day: 8,
    title: "打造第一套SOP",
    summary: "把一个经验整理成可复用的流程。",
    levelGoal: "把经验从脑子里拿出来，变成一份技能说明书。",
    task: "选择一个经验主题，整理出适用场景、执行步骤、注意事项和检查清单。",
    achievement: "知识炼金师",
    experience: "+20经验值",
    assetTip: "SOP未来可以用于模板售卖、企业培训、课程交付和社群作业。",
    content: [
      "SOP不是写给高手看的，而是让自己、团队或AI下次可以稳定复用。",
      "一份可用SOP至少包含：适用场景、输入信息、执行步骤、注意事项、检查清单。",
      "今天只做第一套，不追求完美，先让经验变成流程。"
    ],
    assignment: "提交《我的第一套SOP》。"
  },
  {
    id: "day-9",
    day: 9,
    title: "设计你的专属Skill",
    summary: "理解Skill是一个人能力的结构化载体，是未来AI助理和知识库产品化的基础。",
    levelGoal: "把SOP升级为可被AI调用的专属技能设计。",
    task: "选择一套SOP，设计它服务谁、解决什么问题、需要什么输入、输出什么结果。",
    achievement: "Skill设计师预备役",
    experience: "+20经验值",
    assetTip: "Skill未来可以用于AI助理、咨询工具、课程产品、社群工具和知识库产品化。",
    content: [
      "Skill不是玄学，也不是马上拿去卖钱的东西。它是能力的结构化载体。",
      "一个Skill要说清楚：使用场景、输入信息、执行流程、输出格式和边界。",
      "今天先完成草图，为明天制作Skill雏形做准备。"
    ],
    assignment: "提交《我的Skill设计草图》。"
  },
  {
    id: "day-10",
    day: 10,
    title: "制作Skill雏形",
    summary: "把SOP进一步整理为可被AI调用的Skill文档、提示词或流程说明。",
    levelGoal: "让你的专属技能开始能被AI稳定调用。",
    task: "完成一个Skill雏形，包含使用场景、输入信息、执行步骤和输出格式。",
    achievement: "Skill设计师",
    experience: "+20经验值",
    assetTip: "Skill不需要一开始就完美，先让它能被AI稳定调用，再持续迭代。",
    content: [
      "今天把昨天的Skill草图变成可使用的雏形。",
      "重点不是包装，而是让AI知道什么时候用、需要什么资料、按什么步骤做、输出什么格式。",
      "这会成为你未来AI助理能力的一部分。"
    ],
    assignment: "提交《我的第一个Skill雏形》。"
  },
  {
    id: "day-11",
    day: 11,
    title: "召唤AI助理",
    summary: "AI数字分身不是数字人，而是基于你资料工作的个人AI助理。",
    levelGoal: "完成AI助理角色设定，让它知道如何基于你的系统回答。",
    task: "设定AI助理的身份、任务、语气、知识来源和回答边界。",
    achievement: "AI助理创造者预备役",
    experience: "+20经验值",
    assetTip: "AI助理未来可以用于写作、复盘、项目分析、客户问答和私域运营辅助。",
    content: [
      "普通AI给通用回答，个人AI助理基于你的人生说明书、知识库、SOP和Skill回答。",
      "AI助理不是长得像你的数字人，而是能按你的资料和方法协助你工作。",
      "今天先完成角色设定，让它知道自己是谁、要做什么、不能做什么。"
    ],
    assignment: "提交《AI助理角色设定》。"
  },
  {
    id: "day-12",
    day: 12,
    title: "训练AI助理V1.0",
    summary: "用人生说明书、故事银行、SOP和Skill测试AI，让AI开始更像自己。",
    levelGoal: "通过测试让AI助理开始基于你的系统工作。",
    task: "完成至少3轮测试：写作、复盘、项目分析或客户问答。",
    achievement: "AI助理创造者",
    experience: "+20经验值",
    assetTip: "AI助理的价值不在于一次回答多惊艳，而在于长期越来越懂你。",
    content: [
      "今天进入实测：把人生说明书、知识库、SOP和Skill结合起来使用。",
      "至少测试三个场景：写作、复盘、项目分析或客户问答。",
      "如果回答不够像你，不是失败，而是提示你需要继续补充资料和规则。"
    ],
    assignment: "提交《AI助理测试截图》。"
  },
  {
    id: "day-13",
    day: 13,
    title: "启动成长飞轮",
    summary: "建立行动、记录、知识库、SOP、Skill、AI调用的持续升级机制。",
    levelGoal: "设计你的30天AI成长飞轮计划。",
    task: "写出行动 → 记录 → 知识库 → SOP → Skill → AI调用 → 新行动的循环计划。",
    achievement: "飞轮启动者",
    experience: "+20经验值",
    assetTip: "成长飞轮能让你的经验持续沉淀，让个人资产不断复利。",
    content: [
      "真正的增长不是每天学新工具，而是让经验持续沉淀、复用、升级。",
      "成长飞轮的核心路径是：行动、记录、知识库、SOP、Skill、AI调用、更高效行动。",
      "今天设计毕业后的30天计划，让系统继续生长。"
    ],
    assignment: "提交《我的30天AI成长飞轮计划》。"
  },
  {
    id: "day-14",
    day: 14,
    title: "AI超级个体毕业挑战",
    summary: "提交6大成果，完成AI人生操作系统V1.0通关认证。",
    levelGoal: "完成新手村通关，整理你的AI人生操作系统V1.0毕业包。",
    task: "提交人生说明书、知识库截图、项目决策表、第一套SOP、第一个Skill雏形和AI助理测试截图。",
    achievement: "AI超级个体",
    experience: "+50经验值",
    assetTip: "你已经不是只会问AI的人，而是开始拥有自己的AI系统的人。",
    content: [
      "今天不是结束，而是完成AI人生操作系统V1.0。",
      "整理并提交6大成果：人生说明书、知识库截图、项目决策表、SOP、Skill雏形和AI助理测试截图。",
      "14天只是新手村，真正的升级从毕业后开始。"
    ],
    assignment:
      "提交6大毕业成果：人生说明书V1.0、知识库截图、项目决策评估表、第一套SOP、第一个Skill雏形、AI助理测试截图。"
  }
];

export const initialProgress: MockProgress = {
  points: 128,
  checkedInToday: false,
  completedLessonIds: ["day-1", "day-2", "day-3"],
  submittedLessonIds: ["day-1", "day-2", "day-3"]
};

export const badges = [
  { id: "awakener", icon: "🌱", name: "觉醒者", requirement: 0 },
  { id: "explorer", icon: "🔎", name: "自我探索家", requirement: 40 },
  { id: "architect", icon: "🏗️", name: "人生架构师", requirement: 80 },
  { id: "hunter", icon: "🎯", name: "项目猎人", requirement: 120 },
  { id: "alchemist", icon: "⚗️", name: "知识炼金师", requirement: 160 },
  { id: "skill-designer", icon: "🧩", name: "Skill设计师", requirement: 200 },
  { id: "assistant-creator", icon: "🤖", name: "AI助理创造者", requirement: 240 },
  { id: "flywheel", icon: "🔁", name: "飞轮启动者", requirement: 280 },
  { id: "super-individual", icon: "✨", name: "AI超级个体", requirement: 320 }
];

export const leaderboard = [
  { name: "林晓", points: 186, avatar: "🌻" },
  { name: "你", points: 128, avatar: "🌱" },
  { name: "阿宁", points: 116, avatar: "🌙" },
  { name: "小禾", points: 98, avatar: "🍀" }
];

export function getLevel(points: number) {
  if (points >= 700) return { name: "Lv8 超级个体", nextAt: null };
  if (points >= 600) return { name: "Lv7 创造者", nextAt: 700 };
  if (points >= 500) return { name: "Lv6 设计师", nextAt: 600 };
  if (points >= 400) return { name: "Lv5 炼金师", nextAt: 500 };
  if (points >= 300) return { name: "Lv4 猎人", nextAt: 400 };
  if (points >= 200) return { name: "Lv3 架构师", nextAt: 300 };
  if (points >= 100) return { name: "Lv2 探索者", nextAt: 200 };
  return { name: "Lv1 新芽", nextAt: 100 };
}

export function applyCheckIn(progress: MockProgress): MockProgress {
  if (progress.checkedInToday) return progress;

  return {
    ...progress,
    checkedInToday: true,
    points: progress.points + camp.checkInPoints
  };
}

export function applySubmission(
  progress: MockProgress,
  lessonId: string
): MockProgress {
  if (progress.submittedLessonIds.includes(lessonId)) return progress;

  return {
    ...progress,
    points: progress.points + camp.submissionPoints,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
    submittedLessonIds: [...progress.submittedLessonIds, lessonId]
  };
}

export function getLessonStatus(
  progress: MockProgress,
  lesson: Lesson
): "completed" | "current" | "locked" {
  if (progress.completedLessonIds.includes(lesson.id)) return "completed";

  const nextDay =
    Math.max(
      0,
      ...progress.completedLessonIds.map((id) =>
        Number(id.replace("day-", ""))
      )
    ) + 1;

  return lesson.day === nextDay ? "current" : "locked";
}

export function getCurrentLesson(progress: MockProgress) {
  return (
    lessons.find((lesson) => getLessonStatus(progress, lesson) === "current") ??
    lessons[lessons.length - 1]
  );
}

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
