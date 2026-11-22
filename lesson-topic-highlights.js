(() => {
  "use strict";
  const rootSelector = "#lessonReaderContent";
  const lessonTerms = new Map([
    ["choose a, an or the", ["a","an","the"]]
  ]);

  function normalise(text) { return String(text || "").trim().toLowerCase().replace(/\s+/g," "); }
  function applyTopicHighlights(root) {
    if (!root) return;
    root.querySelectorAll('mark[class*="lesson-focus-"]').forEach(mark => {
      const span=document.createElement("span");
      span.className="lesson-role-neutral";
      span.textContent=mark.textContent;
      mark.replaceWith(span);
    });
    const title=normalise(root.querySelector("h2")?.textContent);
    const terms=[...lessonTerms.entries()].find(([lessonTitle])=>title.includes(lessonTitle))?.[1];
    if (!terms?.length) return;
    const escaped=terms.map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|");
    const pattern=new RegExp("(^|[^\\p{L}\\p{N}_])("+escaped+")(?=$|[^\\p{L}\\p{N}_])","giu");
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(node) {
        if (!node.nodeValue || !pattern.test(node.nodeValue)) { pattern.lastIndex=0; return NodeFilter.FILTER_REJECT; }
        pattern.lastIndex=0;
        const parent=node.parentElement;
        if (!parent || parent.closest("mark.lesson-topic-highlight,.lesson-role-neutral,button,script,style,textarea")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    for(const node of nodes) {
      const text=node.nodeValue,fragment=document.createDocumentFragment();
      let last=0,match;
      pattern.lastIndex=0;
      while((match=pattern.exec(text))) {
        const start=match.index+match[1].length;
        if(start>last) fragment.append(document.createTextNode(text.slice(last,start)));
        const mark=document.createElement("mark");
        mark.className="lesson-topic-highlight";
        mark.textContent=match[2];
        fragment.append(mark);
        last=start+match[2].length;
      }
      if(last<text.length) fragment.append(document.createTextNode(text.slice(last)));
      if(fragment.childNodes.length) node.replaceWith(fragment);
    }
  }

  function observe() {
    const root=document.querySelector(rootSelector);
    if(!root) return;
    let scheduled=false;
    const refresh=()=>{
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;applyTopicHighlights(root);});
    };
    new MutationObserver(refresh).observe(root,{childList:true,subtree:true,characterData:true});
    refresh();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",observe,{once:true});
  else observe();
})();