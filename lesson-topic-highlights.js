(() => {
  "use strict";

  const rootSelector = "#lessonReaderContent";
  const curatedTopics = [
    ["Choose a, an or the", ["a", "an", "the"]],
    ["Use the present simple", ["present simple", "does not", "do not", "-s or -es"]],
    ["Use countable and uncountable nouns", ["countable", "uncountable", "a piece of", "many", "much"]],
    ["Build useful everyday vocabulary", ["do homework", "make breakfast", "take a break", "catch a bus"]],
    ["Use greetings and polite expressions", ["good morning", "thanks", "excuse me", "take care"]],
    ["Name everyday places around town", ["station", "market", "library", "hospital", "restaurant"]],
    ["Connect past actions to the present", ["present perfect", "past simple", "has been", "have been"]],
    ["Understand phrasal verbs in context", ["give up", "look after", "run into"]],
    ["Use natural word partnerships", ["make a decision", "heavy rain", "take responsibility"]],
    ["Recognise word families and affixes", ["word family", "prefix", "suffix"]],
    ["Choose first and second conditionals", ["first conditional", "second conditional", "unless", "even if"]],
    ["Use inversion for emphasis", ["never", "rarely", "not only"]],
    ["Interpret idioms beyond literal meaning", ["break the ice", "cut corners", "on the fence"]],
    ["Qualify claims with precise language", ["may", "might", "appears to", "is likely to", "hedging"]],
    ["Distinguish near-synonyms precisely", ["imply", "infer", "economic", "economical"]],
    ["Understand mixed conditionals", ["mixed conditionals", "past perfect", "would have", "would be"]],

    ["拼音基础与四声", ["四声", "声调", "声母", "韵母"]],
    ["问候、感谢与介绍自己", ["早上好", "谢谢", "请", "不好意思"]],
    ["数字、星期与日期", ["年、月、日", "星期", "零"]],
    ["代词与“是”字句", ["我是", "她是", "是字句"]],
    ["常用动词与日常动作", ["吃", "喝", "起床", "学习"]],
    ["常见地点、方向与问路", ["在哪里", "旁边", "地铁站", "医院"]],
    ["用疑问词提问与表达否定", ["吗", "什么", "不", "没（有）"]],
    ["常用量词与数量表达", ["量词", "一本", "一杯", "一个"]],
    ["的、了、过、着等常见助词", ["的", "了", "过", "着"]],
    ["时间词的位置与频率表达", ["每天", "已经", "之前", "之后"]],
    ["用比、更、最和一样进行比较", ["比", "更", "最", "一样"]],
    ["用关联结构扩展句子", ["因为……所以……", "虽然……但是……"]],
    ["把、被与复合条件句", ["把字句", "被字句", "把", "被"]],
    ["连接词与语气关系", ["因此", "然而", "此外"]],
    ["成语、谚语与传统智慧", ["画蛇添足", "亡羊补牢"]],
    ["近义词的语气与使用差别", ["才", "就"]],
    ["自然表达、名句与古典诗词", ["麻烦你了", "不积跬步", "无以至千里"]]
  ];

  const hanPattern = /[\u3400-\u9fff]/;
  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const allowedSelector = ".lesson-explanation-paragraph,.lesson-example,.lesson-breakdown-sentence,.lesson-breakdown > span > strong";

  function normalise(value) {
    return String(value || "").replace(/\\s+/g, " ").trim().toLowerCase();
  }

  function getTopicTerms(root) {
    const title = normalise(root.querySelector("h2")?.textContent);
    const matches = curatedTopics.filter(([lessonTitle]) => title.includes(normalise(lessonTitle)));
    if (!matches.length) return [];
    return [...new Set(matches.flatMap(([, terms]) => terms))]
      .filter(Boolean)
      .sort((a,b) => b.length - a.length);
  }

  function getExplanationParagraphs(root) {
    const contentBox = root.querySelector(".lesson-content-box");
    if (!contentBox) return [];
    const heading = [...contentBox.querySelectorAll(":scope > h3")]
      .find(node => /^(explanation|讲解)$/i.test(normalise(node.textContent)));
    if (!heading) return [];
    const result = [];
    let node = heading.nextElementSibling;
    while (node && node.tagName !== "H3") {
      if (node.matches("p") && !node.classList.contains("lesson-practice-intro")) { node.classList.add("lesson-explanation-paragraph"); result.push(node); }
      node = node.nextElementSibling;
    }
    return result;
  }

  function neutraliseRoleMarks(root) {
    root.querySelectorAll('mark[class*="lesson-focus-"]').forEach(mark => {
      const span = document.createElement("span");
      span.className = "lesson-role-neutral";
      while (mark.firstChild) span.append(mark.firstChild);
      mark.replaceWith(span);
    });
  }

  function highlightTextNode(node, pattern) {
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let last = 0;
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text))) {
      if (match.index > last) fragment.append(document.createTextNode(text.slice(last, match.index)));
      const mark = document.createElement("mark");
      mark.className = "lesson-topic-highlight";
      mark.textContent = match[0];
      fragment.append(mark);
      last = match.index + match[0].length;
    }
    if (last < text.length) fragment.append(document.createTextNode(text.slice(last)));
    if (fragment.childNodes.length) node.replaceWith(fragment);
  }

  function applyTopicHighlights(root) {
    if (!root) return;
    neutraliseRoleMarks(root);
    const terms = getTopicTerms(root);
    if (!terms.length) return;

    const alternatives = terms.map(term => {
      const escaped = escapeRegExp(term);
      return hanPattern.test(term)
        ? escaped
        : "(?<![A-Za-z0-9_])" + escaped + "(?![A-Za-z0-9_])";
    });
    const pattern = new RegExp(alternatives.join("|"), "giu");
    const targets = [
      ...root.querySelectorAll(allowedSelector),
      ...getExplanationParagraphs(root)
    ];
    const uniqueTargets = [...new Set(targets)];
    for (const target of uniqueTargets) {
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !pattern.test(node.nodeValue)) {
            pattern.lastIndex = 0;
            return NodeFilter.FILTER_REJECT;
          }
          pattern.lastIndex = 0;
          const parent = node.parentElement;
          if (!parent || parent.closest("mark.lesson-topic-highlight,button,script,style,textarea,small")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) highlightTextNode(node, pattern);
    }
  }

  function observe() {
    let root = null;
    let rootObserver = null;
    let scheduled = false;
    const refresh = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        const currentRoot = document.querySelector(rootSelector);
        if (currentRoot !== root) {
          if (rootObserver) rootObserver.disconnect();
          root = currentRoot;
          if (root) {
            rootObserver = new MutationObserver(refresh);
            rootObserver.observe(root, { childList: true, subtree: true, characterData: true });
          }
        }
        if (root) applyTopicHighlights(root);
      });
    };
    const bodyObserver = new MutationObserver(refresh);
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observe, { once: true });
  } else {
    observe();
  }
})();