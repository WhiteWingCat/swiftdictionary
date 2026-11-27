/* SwiftDictionary U3.0 — Malay Dictionary topic and word-class filters. */
(() => {
  "use strict";

  const groups = [
    {id:"daily-life",label:"Kehidupan harian",terms:["kehidupan harian","rutin harian","urusan harian","rumah","kebersihan"]},
    {id:"people",label:"Manusia & keluarga",terms:["manusia","keluarga","masyarakat","hubungan","penduduk","penyewa","pengontrak","pemilik rumah","penjual","usahawan","hos"]},
    {id:"actions",label:"Tindakan & pergerakan",terms:["tindakan","pergerakan","cara"]},
    {id:"places",label:"Tempat & kemudahan",terms:["tempat","perkhidmatan awam","perkhidmatan","infrastruktur","jalan","lorong","persimpangan","lintasan","tanda arah","pasar","bazar","kiosk","warung"]},
    {id:"food",label:"Makanan & minuman",terms:["makanan","minuman","dapur","rasa"]},
    {id:"nature",label:"Alam & persekitaran",terms:["alam","tumbuhan","haiwan","cuaca","bencana","pertanian","geografi"]},
    {id:"education",label:"Pendidikan",terms:["pendidikan","pembelajaran"]},
    {id:"communication",label:"Komunikasi & bahasa",terms:["komunikasi","bahasa","ungkapan"]},
    {id:"work",label:"Pekerjaan & perniagaan",terms:["pekerjaan","kerja","perniagaan"]},
    {id:"health",label:"Kesihatan & keselamatan",terms:["kesihatan","keselamatan","tubuh","anggota badan","deria"]},
    {id:"grammar",label:"Tatabahasa",terms:["tatabahasa","kata fungsi","kata kerja","kata bilangan","kata tugas","kata hubung","kata sendi","kata bantu","kata ganti","kata nafi","kata penentu","kata arah","kata seru","penjodoh bilangan"]},
    {id:"qualities",label:"Sifat & emosi",terms:["sifat","keadaan","emosi","penampilan","warna","bentuk","sentuhan"]},
    {id:"time",label:"Masa, nombor & ukuran",terms:["masa","ukuran","jumlah","nombor","kuantiti"]},
    {id:"objects",label:"Objek & bahan",terms:["objek","bahan","alat","wadah","kotak","pemotong","alat ukur","getah pemadam","sampul surat","kereta sorong","tembok","penghadang","anak kunci","mangga","para","ambalan","bekas tanaman","tirai","alas kepala"]},
    {id:"culture",label:"Budaya & hiburan",terms:["budaya","seni","sukan","muzik","hiburan","pelancongan"]},
    {id:"other",label:"Lain-lain",terms:[]}
  ];
  const wordClasses = [
    {id:"all",label:"Semua golongan kata"},
    {id:"noun",label:"Kata nama"},
    {id:"verb",label:"Kata kerja"},
    {id:"adjective",label:"Kata adjektif"},
    {id:"adverb",label:"Kata adverba"},
    {id:"function",label:"Kata tugas"},
    {id:"other",label:"Lain-lain"}
  ];
  const knownClassTerms = ["kata nama","kata kerja","kata adjektif","kata adverba","kata bantu","kata sendi","kata ganti","kata nafi","kata tugas","kata hubung","kata arah","kata seru","kata penentu","kata bilangan","penjodoh bilangan"];

  function categoryIds(item) {
    const raw = Array.isArray(item?.categories) ? item.categories : [];
    const ids = new Set();
    raw.forEach(value => {
      const category = String(value || "").toLocaleLowerCase("ms-MY");
      const group = groups.find(candidate => candidate.id !== "other" && candidate.terms.some(term => category.includes(term)));
      ids.add(group ? group.id : "other");
    });
    return ids;
  }
  function matchesPart(item, selected) {
    if (!selected || selected === "all") return true;
    const part = String(item?.part || "").toLocaleLowerCase("ms-MY");
    if (selected === "noun") return part.includes("kata nama");
    if (selected === "verb") return part.includes("kata kerja");
    if (selected === "adjective") return part.includes("kata adjektif");
    if (selected === "adverb") return part.includes("kata adverba");
    if (selected === "function") return knownClassTerms.some(term => part.includes(term) && !["kata nama","kata kerja","kata adjektif","kata adverba"].includes(term));
    if (selected === "other") return !knownClassTerms.some(term => part.includes(term));
    return true;
  }
  window.SWIFT_MALAY_DICTIONARY_FILTERS = {groups,wordClasses,categoryIds,matchesPart};

  if (typeof document === "undefined" || typeof filteredWords !== "function" || typeof render !== "function") return;
  const panel = document.getElementById("dictionaryFiltersContent");
  const anchor = document.getElementById("chineseCategoryRow");
  const categoryRow = document.getElementById("categoryRow");
  const chineseRow = document.getElementById("chineseCategoryRow");
  if (!panel || !anchor || !categoryRow || !chineseRow) return;

  let activeTopic = "all";
  let activePart = "all";
  const makeRow = (id,label,attribute,items) => {
    const row = document.createElement("div");
    row.id = id;
    row.className = "category-row";
    row.setAttribute("aria-label",label);
    const heading = document.createElement("div");
    heading.className = "filter-group-label";
    heading.textContent = label;
    row.appendChild(heading);
    const buttons = [];
    items.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.dataset[attribute] = item.id;
      button.textContent = item.label;
      button.setAttribute("aria-pressed","false");
      button.addEventListener("click",() => {
        if (attribute === "malayCategory") activeTopic = item.id;
        else activePart = item.id;
        currentPage = 1;
        updateButtons();
        render();
      });
      buttons.push(button);
      row.appendChild(button);
    });
    return {row,buttons};
  };
  const topicItems = [{id:"all",label:"Semua topik"},...groups];
  const topic = makeRow("malayTopicRow","Topik","malayCategory",topicItems);
  const parts = makeRow("malayPartRow","Golongan kata","malayPart",wordClasses);
  panel.insertBefore(topic.row,anchor.nextSibling);
  panel.insertBefore(parts.row,topic.row.nextSibling);

  function updateButtons() {
    topic.buttons.forEach(button => {
      const active = button.dataset.malayCategory === activeTopic;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
    parts.buttons.forEach(button => {
      const active = button.dataset.malayPart === activePart;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
  }
  function updateVisibility() {
    const isMalay = course === "ms";
    categoryRow.hidden = course === "zh" || isMalay;
    chineseRow.hidden = course !== "zh" || !words.some(item => Array.isArray(item.categories) && item.categories.length);
    topic.row.hidden = !isMalay;
    parts.row.hidden = !isMalay;
  }
  const originalFilteredWords = filteredWords;
  filteredWords = function() {
    const result = originalFilteredWords();
    if (course !== "ms") return result;
    return result.filter(item => {
      const topicMatch = activeTopic === "all" || categoryIds(item).has(activeTopic);
      return topicMatch && matchesPart(item,activePart);
    });
  };
  const originalRender = render;
  render = function() {
    updateVisibility();
    originalRender();
    updateVisibility();
  };
  window.addEventListener("swiftdictionary:course-changed",() => {
    activeTopic = "all";
    activePart = "all";
    updateButtons();
    render();
  });
  updateButtons();
  render();
})();
