// SwiftDictionary U2.9.0 — curriculum-led English permanent lesson expansion.
// Loaded after the main lesson catalogue so the existing reader, progress,
// translation and practice pipelines remain the single source of behaviour.
(() => {
  "use strict";
  if (window.__swiftEnglishLessonExpansionLoaded) return;
  if (typeof lessonData === "undefined" || typeof lessonZh === "undefined") return;
  window.__swiftEnglishLessonExpansionLoaded = true;

  const additions = {
    beginner: [{
      id: "b-question-forms-negatives",
      topic: "Sentence basics",
      title: "Ask questions and form negative statements",
      summary: "Use be, do and did to ask questions and make negatives.",
      explanation: "English questions often change the order of the subject and an auxiliary verb. With be, place am, is or are before the subject: Are you ready? For present simple verbs other than be, use do with I, you, we and they, and does with he, she and it. After do or does, keep the main verb in its base form. To make a negative statement, use do not/don't or does not/doesn't followed by the base verb. For past simple questions and negatives, use did or didn't and return the main verb to its base form. WH-words such as what, where, when, why and how usually come before the auxiliary. When the WH-word is the subject, do-support is not used: Who called you?",
      points: [
        "With be, place am, is or are before the subject in a yes/no question.",
        "Use do with I/you/we/they and does with he/she/it for present simple questions.",
        "Use don't or doesn't + base verb to form present simple negatives.",
        "Use did/didn't + base verb for past simple questions and negatives.",
        "After do, does or did, the main verb stays in its base form.",
        "A subject question such as Who called? does not need do-support."
      ],
      examples: [
        "Are you ready for the lesson?",
        "Does Maya work near the station?",
        "Where do your friends study?",
        "He doesn't drink coffee.",
        "Did you see the message yesterday?",
        "We didn't visit the museum last weekend.",
        "Who opened the window?"
      ],
      breakdown: {
        title: "Build a present simple question",
        intro: "Place the auxiliary before the subject and keep the main verb in its base form.",
        sentence: [
          { text: "Does", role: "auxiliary" },
          { text: "Maya", role: "subject" },
          { text: "work", role: "verb" },
          { text: "here?", role: "adverbial" }
        ],
        parts: [
          { text: "Does", label: "Auxiliary · forms the question" },
          { text: "Maya", label: "Subject · who the question is about" },
          { text: "work", label: "Main verb · base form after does" },
          { text: "here", label: "Place · where the action happens" }
        ]
      },
      mistakes: [
        "Incorrect: Does she likes tea? Correct: Does she like tea.",
        "Incorrect: Did you went home? Correct: Did you go home.",
        "Use Who called you? when who is the subject; do not add an unnecessary did."
      ],
      practices: [
        { q: "Choose the correct question.", options: ["Does Mia work here?", "Does Mia works here?", "Do Mia work here?"], answer: 0 },
        { q: "He ___ like coffee.", options: ["don't", "doesn't", "isn't"], answer: 1 },
        { q: "___ you call me yesterday?", options: ["Did", "Do", "Does"], answer: 0 },
        { q: "Choose the correct WH-question.", options: ["Where do they live?", "Where they do live?", "Where does they live?"], answer: 0 },
        { q: "Choose the correct subject question.", options: ["Who opened the door?", "Who did opened the door?", "Who does opened the door?"], answer: 0 }
      ]
    }],
    intermediate: [{
      id: "i-passive-voice",
      topic: "Verb tenses",
      title: "Use the passive voice when the action matters",
      summary: "Build passive sentences with be + past participle and decide when to name the agent.",
      explanation: "The passive voice shifts attention from the person or thing doing an action to the action itself or the person or thing receiving it. Form the passive with the appropriate form of be + the past participle. In the present simple, use is/are + past participle; in the past simple, use was/were + past participle; and in the present perfect, use has/have been + past participle. Add by + agent when the person or group responsible is important. Leave the agent out when it is unknown, obvious or less important. Passive voice is common in process descriptions, reports and notices. Choose the tense according to when the event happens, not simply because the sentence is passive.",
      points: [
        "Basic passive form: be + past participle.",
        "Present simple passive: is/are + past participle.",
        "Past simple passive: was/were + past participle.",
        "Present perfect passive: has/have been + past participle.",
        "Use by + agent when the person or group responsible matters.",
        "Omit the agent when it is unknown, obvious or not the focus."
      ],
      examples: [
        "The classroom is cleaned every evening.",
        "The bridge was built in 1998.",
        "The invitations have been sent.",
        "The report was prepared by the research team.",
        "English is spoken in many countries.",
        "The package was delivered this morning."
      ],
      breakdown: {
        title: "Understand a passive sentence",
        intro: "The receiver becomes the subject; the passive verb shows what happened to it.",
        sentence: [
          { text: "The report", role: "subject" },
          { text: "was prepared", role: "verb" },
          { text: "by the team.", role: "agent" }
        ],
        parts: [
          { text: "The report", label: "Subject · the thing receiving the action" },
          { text: "was prepared", label: "Passive verb · was + past participle" },
          { text: "by the team", label: "Agent · who performed the action" }
        ]
      },
      mistakes: [
        "Incorrect: The emails sent yesterday. Correct: The emails were sent yesterday.",
        "Incorrect: The report was wrote. Correct: The report was written."
      ],
      practices: [
        { q: "The bridge ___ in 1998.", options: ["built", "was built", "is building"], answer: 1 },
        { q: "The emails ___ every morning.", options: ["are checked", "check", "is checked"], answer: 0 },
        { q: "Choose the correct past simple passive sentence.", options: ["The room cleaned yesterday.", "The room was cleaned yesterday.", "The room was clean yesterday."], answer: 1 },
        { q: "Which sentence names the agent?", options: ["The portrait was painted by Lina.", "The portrait was painted yesterday.", "The portrait is displayed upstairs."], answer: 0 },
        { q: "Choose the present perfect passive form.", options: ["The results have published.", "The results have been published.", "The results are publish."], answer: 1 }
      ]
    }],
    advanced: [{
      id: "a-reported-speech",
      topic: "Advanced grammar",
      title: "Report statements, questions and requests accurately",
      summary: "Use reporting verbs, appropriate word order and changes in tense and reference.",
      explanation: "Reported speech communicates what someone said without repeating the exact words. Use said (that) for a statement, or told + object + (that): She said that she was busy; She told us that she was busy. When the reporting verb is in the past, tense often shifts back: present simple to past simple, present perfect to past perfect, and will to would. Pronouns and time expressions change only when the speaker's perspective or the time reference changes. Backshift is not always necessary for facts that remain true or when the reporting verb is in the present. Report yes/no questions with asked + if/whether and WH-questions with the question word, followed by statement word order. Do not use do/does/did inversion in a reported question. Report requests and instructions with asked/told + object + to-infinitive; use not to for a negative request. Different reporting verbs have different patterns, so keep their grammar in mind.",
      points: [
        "Use said (that) for statements; use told + object (that) when naming the listener.",
        "A past reporting verb often causes backshift: is → was, have finished → had finished, will → would.",
        "Change pronouns and time expressions when the reporting perspective changes.",
        "Use asked + if/whether for reported yes/no questions.",
        "Keep statement word order in reported questions: where + subject + verb.",
        "Use told/asked + object + to-infinitive for instructions and requests.",
        "Use not to + verb for a reported negative instruction."
      ],
      examples: [
        "Direct: “I am tired.” → She said that she was tired.",
        "Direct: “Where do you work?” → He asked where I worked.",
        "Direct: “Don't touch the wire.” → She warned us not to touch the wire.",
        "Direct: “We will arrive tomorrow.” → They said they would arrive the next day.",
        "Direct: “Have you finished?” → He asked whether I had finished.",
        "Direct: “Please wait here.” → The guide asked us to wait there."
      ],
      breakdown: {
        title: "Report a WH-question",
        intro: "Keep the question word, then use normal statement order rather than question inversion.",
        sentence: [
          { text: "He asked", role: "reporting-clause" },
          { text: "where", role: "question-word" },
          { text: "I worked.", role: "reported-clause" }
        ],
        parts: [
          { text: "He asked", label: "Reporting clause · introduces the question" },
          { text: "where", label: "Question word · keeps the original focus" },
          { text: "I worked", label: "Reported clause · subject before verb" }
        ]
      },
      mistakes: [
        "Incorrect: He asked where did I live. Correct: He asked where I lived.",
        "Use told with an object: She told me that she was ready.",
        "Do not change tomorrow to the next day unless the reporting time or viewpoint has changed."
      ],
      practices: [
        { q: "“I am busy,” she said. Choose the correct report.", options: ["She said she was busy.", "She said she is busy yesterday.", "She told that she busy."], answer: 0 },
        { q: "“Where do you work?” He asked ___.", options: ["where did I work", "where I worked", "where do I work"], answer: 1 },
        { q: "“Don't open the door.” She told us ___.", options: ["to not opened the door", "not to open the door", "don't open the door"], answer: 1 },
        { q: "“We will arrive tomorrow.” They said they ___ the next day.", options: ["will arrive", "would arrive", "had arrive"], answer: 1 },
        { q: "“Have you finished?” He asked whether I ___.", options: ["had finished", "have finished", "did finished"], answer: 0 }
      ]
    }]
  };

  const translations = {
    "b-question-forms-negatives": {
      topic: "句子基础",
      title: "提出疑问并使用否定句",
      summary: "使用 be、do 和 did 构成疑问句与否定句。",
      explanation: "英语疑问句通常需要调整主语与助动词的顺序。使用 be 动词时，把 am、is 或 are 放在主语之前，例如 Are you ready? 对于 be 以外的一般现在时动词，主语为 I、you、we、they 时使用 do；主语为 he、she、it 时使用 does。do 或 does 后面的主要动词必须使用原形。构成否定句时，使用 do not/don't 或 does not/doesn't，再接动词原形。一般过去时的疑问句和否定句使用 did 或 didn't，主要动词同样恢复原形。what、where、when、why 和 how 等疑问词通常放在助动词之前。如果疑问词本身就是主语，则不需要 do-support，例如 Who called you?",
      points: [
        "使用 be 动词提问时，把 am、is 或 are 放在主语之前。",
        "一般现在时中，I/you/we/they 搭配 do；he/she/it 搭配 does。",
        "一般现在时否定句使用 don't 或 doesn't + 动词原形。",
        "一般过去时疑问句和否定句使用 did/didn't + 动词原形。",
        "do、does 或 did 后面的主要动词必须使用原形。",
        "Who called? 这类主语疑问句不需要 do-support。"
      ],
      examples: [
        "你准备好上课了吗？",
        "Maya 在车站附近工作吗？",
        "你的朋友们在哪里学习？",
        "他不喝咖啡。",
        "你昨天看到那条消息了吗？",
        "我们上周末没有参观博物馆。",
        "是谁打开了窗户？"
      ],
      breakdown: {
        title: "构成一般现在时疑问句",
        intro: "把助动词放在主语之前，并让主要动词保持原形。",
        sentence: [
          { text: "Does", role: "auxiliary" },
          { text: "Maya", role: "subject" },
          { text: "work", role: "verb" },
          { text: "here?", role: "adverbial" }
        ],
        parts: [
          { text: "Does", label: "助动词 · 构成疑问句" },
          { text: "Maya", label: "主语 · 疑问句谈论的人" },
          { text: "work", label: "主要动词 · does 后使用原形" },
          { text: "here", label: "地点 · 动作发生的位置" }
        ]
      },
      mistakes: [
        "错误：Does she likes tea? 正确：Does she like tea.",
        "错误：Did you went home? 正确：Did you go home.",
        "Who 是主语时使用 Who called you?，不要额外加入 did。"
      ],
      practices: [
        { q: "选择正确的疑问句。", options: ["Does Mia work here?", "Does Mia works here?", "Do Mia work here?"] },
        { q: "He ___ like coffee.（他不喜欢咖啡。）", options: ["don't", "doesn't", "isn't"] },
        { q: "___ you call me yesterday?（你昨天给我打电话了吗？）", options: ["Did", "Do", "Does"] },
        { q: "选择正确的特殊疑问句。", options: ["Where do they live?", "Where they do live?", "Where does they live?"] },
        { q: "选择正确的主语疑问句。", options: ["Who opened the door?", "Who did opened the door?", "Who does opened the door?"] }
      ]
    },
    "i-passive-voice": {
      topic: "动词时态",
      title: "在强调动作时使用被动语态",
      summary: "使用 be + 过去分词构成被动语态，并判断何时需要说明动作执行者。",
      explanation: "被动语态会把注意力从动作执行者转移到动作本身或接受动作的人与事物。被动语态由适当形式的 be 动词加过去分词构成。一般现在时使用 is/are + 过去分词；一般过去时使用 was/were + 过去分词；现在完成时使用 has/have been + 过去分词。当动作执行者很重要时，可以使用 by + 执行者。如果执行者未知、显而易见或不重要，则可以省略。被动语态常见于流程说明、报告和通知。选择时态时，应根据事件发生的时间，而不是仅仅因为句子使用了被动语态。",
      points: [
        "基本被动语态结构：be + 过去分词。",
        "一般现在时被动语态：is/are + 过去分词。",
        "一般过去时被动语态：was/were + 过去分词。",
        "现在完成时被动语态：has/have been + 过去分词。",
        "动作执行者很重要时，使用 by + 执行者。",
        "执行者未知、显而易见或不是重点时，可以省略。"
      ],
      examples: [
        "教室每天晚上都会被打扫。",
        "这座桥建于 1998 年。",
        "邀请函已经寄出。",
        "报告由研究团队撰写。",
        "许多国家都使用英语。",
        "包裹今天早上已经送达。"
      ],
      breakdown: {
        title: "理解被动语态句子",
        intro: "动作的接受者成为主语；被动动词说明它经历了什么动作。",
        sentence: [
          { text: "The report", role: "subject" },
          { text: "was prepared", role: "verb" },
          { text: "by the team.", role: "agent" }
        ],
        parts: [
          { text: "The report", label: "主语 · 接受动作的事物" },
          { text: "was prepared", label: "被动动词 · was + 过去分词" },
          { text: "by the team", label: "动作执行者 · 实际执行动作的人" }
        ]
      },
      mistakes: [
        "错误：The emails sent yesterday. 正确：The emails were sent yesterday.",
        "错误：The report was wrote. 正确：The report was written."
      ],
      practices: [
        { q: "The bridge ___ in 1998.（这座桥建于 1998 年。）", options: ["built", "was built", "is building"] },
        { q: "The emails ___ every morning.（邮件每天早上都会被检查。）", options: ["are checked", "check", "is checked"] },
        { q: "选择正确的一般过去时被动语态句子。", options: ["The room cleaned yesterday.", "The room was cleaned yesterday.", "The room was clean yesterday."] },
        { q: "哪一个句子说明了动作执行者？", options: ["The portrait was painted by Lina.", "The portrait was painted yesterday.", "The portrait is displayed upstairs."] },
        { q: "选择正确的现在完成时被动语态。", options: ["The results have published.", "The results have been published.", "The results are publish."] }
      ]
    },
    "a-reported-speech": {
      topic: "进阶语法",
      title: "准确转述陈述、问题与请求",
      summary: "使用恰当的转述动词、语序以及时态和指代变化。",
      explanation: "间接引语用于表达别人说过的话，而不必逐字引用原句。转述陈述句时，可以使用 said (that)；如果说明听话者，则使用 told + 宾语 + (that)，例如 She said that she was busy 或 She told us that she was busy。当转述动词使用过去时，原句时态通常会后移：一般现在时变为一般过去时，现在完成时变为过去完成时，will 变为 would。只有当说话者视角或时间指向发生变化时，才需要调整代词和时间表达。对于仍然成立的事实，或使用现在时的转述动词，不一定需要时态后移。转述一般疑问句时使用 asked + if/whether；转述特殊疑问句时保留疑问词，并使用陈述句语序。转述请求或指示时，使用 asked/told + 宾语 + to 不定式；否定指示使用 not to + 动词原形。不同转述动词有不同的搭配结构，需要留意。",
      points: [
        "转述陈述句使用 said (that)；说明听话者时使用 told + 宾语。",
        "过去时转述动词通常引起时态后移：is → was、have finished → had finished、will → would。",
        "只有在视角或时间指向改变时，才调整代词和时间表达。",
        "转述一般疑问句时使用 asked + if/whether。",
        "转述特殊疑问句时使用疑问词 + 主语 + 动词的陈述句语序。",
        "转述请求或指示时，使用 told/asked + 宾语 + to 不定式。",
        "转述否定指示时，使用 not to + 动词原形。"
      ],
      examples: [
        "直接引语：“I am tired.” → 她说她累了。",
        "直接引语：“Where do you work?” → 他问我在哪里工作。",
        "直接引语：“Don't touch the wire.” → 她警告我们不要碰那根电线。",
        "直接引语：“We will arrive tomorrow.” → 他们说他们第二天会到。",
        "直接引语：“Have you finished?” → 他问我是否已经完成。",
        "直接引语：“Please wait here.” → 导游请我们在那里等候。"
      ],
      breakdown: {
        title: "转述特殊疑问句",
        intro: "保留疑问词，后面使用正常陈述句语序，而不是倒装疑问句语序。",
        sentence: [
          { text: "He asked", role: "reporting-clause" },
          { text: "where", role: "question-word" },
          { text: "I worked.", role: "reported-clause" }
        ],
        parts: [
          { text: "He asked", label: "转述部分 · 引出问题" },
          { text: "where", label: "疑问词 · 保留原问题的重点" },
          { text: "I worked", label: "转述从句 · 主语在动词之前" }
        ]
      },
      mistakes: [
        "错误：He asked where did I live. 正确：He asked where I lived.",
        "told 后面需要宾语：She told me that she was ready.",
        "只有当转述时间或视角发生变化时，才把 tomorrow 改为 the next day。"
      ],
      practices: [
        { q: "“I am busy,” she said. 选择正确的转述句。", options: ["She said she was busy.", "She said she is busy yesterday.", "She told that she busy."] },
        { q: "“Where do you work?” He asked ___.", options: ["where did I work", "where I worked", "where do I work"] },
        { q: "“Don't open the door.” She told us ___.", options: ["to not opened the door", "not to open the door", "don't open the door"] },
        { q: "“We will arrive tomorrow.” They said they ___ the next day.", options: ["will arrive", "would arrive", "had arrive"] },
        { q: "“Have you finished?” He asked whether I ___.", options: ["had finished", "have finished", "did finished"] }
      ]
    }
  };

  for (const [level, items] of Object.entries(additions)) {
    if (!Array.isArray(lessonData[level])) continue;
    for (const item of items) {
      if (!lessonData[level].some(existing => existing.id === item.id)) lessonData[level].push(item);
    }
  }
  Object.assign(lessonZh, translations);
  if (typeof renderLessons === "function") renderLessons();
})();
