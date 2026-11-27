/* SwiftDictionary U3.0 — Malay Lessons expansion batch 05.
 * Original Malaysian Standard Malay draft content; EN/ZH support is machine-assisted.
 * Owner linguistic and translation review is reserved for staging review.
 */
(() => {
  const base=window.SWIFT_MALAY_LESSONS;
  if(!base) throw new Error("Load the Malay lesson foundation before batch 05.");
  const t=(ms,en,zh)=>({ms,en,zh});
  const make=(id,topic,title,summary,explanations,points,example,mistake,qs)=>({
    id,topic_id:id.replace(/^ms-[bia]-/,"ms-topic-"),
    topic:t(...topic),title:t(...title),summary:t(...summary),
    explanation:explanations.map(x=>({ms:x[0],en:x[1],zh:x[2]})),
    points:points.map(x=>({ms:x[0],en:x[1],zh:x[2]})),
    examples:[{ms:example[0],en:example[1],zh:example[2]}],
    mistakes:[{ms:mistake[0],en:mistake[1],zh:mistake[2]}],
    practices:qs.map(q=>({q:t(...q[0]),options:q[1].map(o=>t(...o)),answer:q[2]}))
  });
  const batch={
    beginner:[
      make("ms-b-home-and-household",
        ["Rumah dan barang keperluan","Home and household items","家居与日用品"],
        ["Menerangkan rumah dan barang di dalamnya","Describing a home and its contents","描述住所与家居物品"],
        ["Gunakan kata nama, kata adjektif dan kata sendi untuk menerangkan ruang serta barang keperluan harian.","Use nouns, adjectives and prepositions to describe rooms and everyday household items.","使用名词、形容词和介词描述房间及日常家居用品。"],
        [
          ["Kata nama seperti ruang tamu, dapur, bilik tidur dan bilik mandi menamakan ruang di rumah. Barang seperti meja, kerusi, almari dan peti sejuk boleh diterangkan melalui fungsi atau lokasinya.","Nouns such as living room, kitchen, bedroom and bathroom name spaces in a home. Items such as tables, chairs, cupboards and refrigerators can be described by their function or location.","ruang tamu（客厅）、dapur（厨房）、bilik tidur（卧室）和bilik mandi（浴室）等名词表示家中空间。meja（桌子）、kerusi（椅子）、almari（柜子）和peti sejuk（冰箱）等物品可按功能或位置描述。"],
          ["Gunakan “di” untuk lokasi, misalnya “Buku itu di atas meja”. Kata “ada” boleh menyatakan kewujudan sesuatu barang: “Ada sebuah lampu di bilik tidur”.","Use “di” for location, for example, “The book is on the table”. “Ada” can express the existence of an item: “There is a lamp in the bedroom”.","使用“di”表示位置，例如“Buku itu di atas meja”（书在桌子上）。“Ada”可表示某物存在，例如“Ada sebuah lampu di bilik tidur”（卧室里有一盏灯）。"]
        ],
        [["Namakan ruang dan barang dengan kata nama yang tepat.","Name rooms and objects with accurate nouns.","使用准确名词说出房间和物品。"],["Gunakan “di” untuk menerangkan lokasi barang.","Use “di” to describe an object's location.","使用“di”描述物品的位置。"]],
        ["Peti sejuk berada di dapur, manakala sofa diletakkan di ruang tamu.","The refrigerator is in the kitchen, while the sofa is placed in the living room.","冰箱在厨房，而沙发放在客厅。"],
        ["Jangan kelirukan “di” sebagai kata sendi nama dengan imbuhan “di-” pada kata kerja pasif; ejaannya bergantung pada fungsinya.","Do not confuse “di” as a preposition with the “di-” prefix on passive verbs; spelling depends on its function.","不要混淆作为介词的“di”和被动动词前缀“di-”；两者的拼写取决于其语法功能。"],
        [
          [["Di manakah makanan biasanya disediakan di rumah?","Where is food usually prepared at home?","家里通常在哪里准备食物？"],[["dapur","kitchen","厨房"],["bilik tidur","bedroom","卧室"],["ruang tamu","living room","客厅"],["garaj","garage","车库"]],0],
          [["Pilih ayat yang menerangkan lokasi dengan betul.","Choose the sentence that correctly describes a location.","选择正确描述位置的句子。"],[["Buku itu di atas meja.","The book is on the table.","书在桌子上。"],["Buku itu atas kepada meja.","The book above to table.","书上方到桌子。"],["Buku itu meja di atas kepada.","The book table on to.","书桌子上到。"],["Buku itu di meja atas kepada.","The book at table above to.","书在桌子上方到。"]],0],
          [["Apakah fungsi “ada” dalam ayat “Ada sebuah lampu di bilik”?","What is the function of “ada” in “There is a lamp in the room”?","“Ada sebuah lampu di bilik”中的“ada”有什么作用？"],[["Menyatakan kewujudan","Expressing existence","表示存在"],["Menyatakan larangan","Expressing prohibition","表示禁止"],["Menyatakan perbandingan","Expressing comparison","表示比较"],["Menyatakan masa lampau","Expressing past time","表示过去时间"]],0]
        ]),
      make("ms-b-school-and-learning",
        ["Sekolah dan pembelajaran","School and learning","学校与学习"],
        ["Bercerita tentang kegiatan pembelajaran","Talking about learning activities","谈论学习活动"],
        ["Pelajari kosa kata asas tentang mata pelajaran, bahan pembelajaran dan kegiatan di sekolah.","Learn basic vocabulary for school subjects, learning materials and school activities.","学习有关学校科目、学习材料和校园活动的基础词汇。"],
        [
          ["Mata pelajaran termasuk bahasa, matematik, sains dan sejarah. Bahan pembelajaran pula termasuk buku teks, buku latihan, nota dan kamus.","School subjects include languages, mathematics, science and history. Learning materials include textbooks, exercise books, notes and dictionaries.","学校科目包括语言、数学、科学和历史。学习材料包括课本、练习簿、笔记和词典。"],
          ["Gunakan kata kerja seperti “membaca”, “menulis”, “mengulang kaji”, “berbincang” dan “menyiapkan” untuk menerangkan kegiatan. Frasa “di dalam kelas” menyatakan tempat kegiatan berlaku.","Use verbs such as “read”, “write”, “revise”, “discuss” and “complete” to describe activities. The phrase “in the classroom” states where an activity takes place.","使用“membaca”（阅读）、“menulis”（写作）、“mengulang kaji”（复习）、“berbincang”（讨论）和“menyiapkan”（完成）等动词描述活动。“di dalam kelas”表示活动地点。"]
        ],
        [["Bezakan nama mata pelajaran daripada bahan pembelajaran.","Distinguish subject names from learning materials.","区分科目名称与学习材料。"],["Pilih kata kerja yang menggambarkan kegiatan dengan tepat.","Choose verbs that accurately describe activities.","选择准确描述活动的动词。"]],
        ["Murid-murid membaca buku teks dan berbincang tentang eksperimen sains di dalam kelas.","The pupils read the textbook and discuss a science experiment in the classroom.","学生在教室里阅读课本，并讨论科学实验。"],
        ["Jangan gunakan nama bahan seperti “buku latihan” seolah-olah nama mata pelajaran; kedua-duanya mempunyai fungsi yang berbeza.","Do not use the name of a material such as “exercise book” as if it were a school subject; they serve different purposes.","不要把“练习簿”等学习材料当作科目名称；两者的用途不同。"],
        [
          [["Yang manakah nama mata pelajaran?","Which is the name of a school subject?","哪一个是学校科目名称？"],[["sejarah","history","历史"],["kamus","dictionary","词典"],["buku teks","textbook","课本"],["papan putih","whiteboard","白板"]],0],
          [["Pilih kata kerja yang bermaksud mengulang pelajaran.","Choose the verb that means to revise a lesson.","选择表示复习功课的动词。"],[["mengulang kaji","revise","复习"],["memotong","cut","切割"],["menyiram","water","浇水"],["menjahit","sew","缝纫"]],0],
          [["Pilih ayat yang sesuai tentang pembelajaran.","Choose a suitable sentence about learning.","选择合适的学习相关句子。"],[["Kami berbincang tentang eksperimen sains.","We discuss the science experiment.","我们讨论科学实验。"],["Kami meminum eksperimen sains.","We drink the science experiment.","我们喝科学实验。"],["Kami menjahit buku teks.","We sew the textbook.","我们缝课本。"],["Kami menyiram mata pelajaran.","We water the subject.","我们给科目浇水。"]],0]
        ]),
      make("ms-b-feelings-and-opinions",
        ["Perasaan dan pendapat mudah","Feelings and simple opinions","情绪与简单观点"],
        ["Menyatakan perasaan dan pendapat","Expressing feelings and opinions","表达情绪与观点"],
        ["Gunakan ungkapan asas untuk menyatakan perasaan, kesukaan dan pendapat secara sopan.","Use basic expressions to state feelings, preferences and opinions politely.","使用基本表达礼貌地说明情绪、喜好和观点。"],
        [
          ["Kata adjektif seperti gembira, sedih, risau, teruja dan kecewa menerangkan perasaan. Frasa “Saya berasa…” memperkenalkan keadaan emosi seseorang.","Adjectives such as happy, sad, worried, excited and disappointed describe feelings. The phrase “Saya berasa…” introduces someone's emotional state.","gembira（开心）、sedih（难过）、risau（担心）、teruja（兴奋）和kecewa（失望）等形容词描述情绪。“Saya berasa…”用于说明某人的情绪状态。"],
          ["Untuk menyatakan pendapat, gunakan “Pada pendapat saya…” atau “Saya fikir…”. Nyatakan alasan ringkas dengan “kerana” supaya pandangan lebih jelas.","To express an opinion, use “In my opinion…” or “I think…”. Give a brief reason with “kerana” to make the view clearer.","表达观点时可使用“Pada pendapat saya…”或“Saya fikir…”。用“kerana”补充简短理由，使观点更清楚。"]
        ],
        [["Bezakan perasaan daripada pendapat; kedua-duanya boleh dinyatakan dalam ayat berasingan.","Distinguish feelings from opinions; they can be expressed in separate sentences.","区分情绪与观点；两者可以分别用句子表达。"],["Gunakan alasan yang berkaitan selepas “kerana”.","Give a relevant reason after “kerana”.","在“kerana”之后提供相关理由。"]],
        ["Saya berasa teruja kerana dapat menyertai pertandingan itu. Pada pendapat saya, pengalaman ini sangat berguna.","I feel excited because I can take part in the competition. In my opinion, this experience is very useful.","我很兴奋，因为我可以参加那场比赛。在我看来，这次经历很有意义。"],
        ["Jangan anggap pendapat sebagai fakta yang telah dibuktikan; gunakan penanda seperti “pada pendapat saya” apabila menyatakan pandangan peribadi.","Do not treat an opinion as an established fact; use markers such as “in my opinion” when stating a personal view.","不要把个人观点当作已证实的事实；表达个人看法时可使用“pada pendapat saya”等标记。"],
        [
          [["Perkataan manakah menerangkan perasaan gembira?","Which word describes feeling happy?","哪个词表示开心？"],[["gembira","happy","开心"],["sempit","narrow","狭窄"],["licin","slippery","光滑"],["pahit","bitter","苦"]],0],
          [["Ungkapan manakah sesuai untuk memperkenalkan pendapat?","Which expression is suitable for introducing an opinion?","哪个表达适合引出观点？"],[["Pada pendapat saya","In my opinion","在我看来"],["Di bawah meja","Under the table","在桌子下面"],["Pada pukul tujuh","At seven o'clock","七点钟"],["Dengan segera","Immediately","立即"]],0],
          [["Apakah fungsi “kerana” dalam ayat?","What is the function of “kerana” in a sentence?","“kerana”在句子中有什么作用？"],[["Memperkenalkan sebab","Introducing a reason","引出原因"],["Menunjukkan tempat","Showing a place","表示地点"],["Menamakan orang","Naming a person","命名人物"],["Menyatakan bilangan","Stating quantity","表示数量"]],0]
        ])
    ],
    intermediate:[
      make("ms-i-conditionals",
        ["Ayat bersyarat","Conditional sentences","条件句"],
        ["Menyatakan syarat dan kemungkinan","Expressing conditions and possibilities","表达条件与可能性"],
        ["Bina ayat yang menghubungkan sesuatu syarat dengan hasil atau tindakan yang berkaitan.","Build sentences connecting a condition with a related result or action.","构建将条件与相关结果或行动联系起来的句子。"],
        [
          ["Kata “jika” dan “sekiranya” memperkenalkan syarat. Klausa selepasnya menerangkan hasil yang mungkin berlaku apabila syarat dipenuhi.","“Jika” and “sekiranya” introduce a condition. The following clause describes a result that may occur when the condition is met.","“Jika”和“sekiranya”引出条件。后面的分句说明条件满足时可能发生的结果。"],
          ["Susunan klausa boleh berubah tanpa mengubah hubungan makna: “Jika hujan turun, perlawanan ditangguhkan” atau “Perlawanan ditangguhkan jika hujan turun”. Gunakan tanda koma apabila klausa syarat mendahului klausa utama.","Clause order can change without changing the meaning relationship: “If it rains, the match is postponed” or “The match is postponed if it rains”. Use a comma when the conditional clause comes first.","分句顺序可以改变而不改变逻辑关系：“Jika hujan turun, perlawanan ditangguhkan”或“Perlawanan ditangguhkan jika hujan turun”。条件分句置于主句之前时使用逗号。"]
        ],
        [["Kenal pasti syarat dan hasil dalam ayat.","Identify the condition and result in a sentence.","识别句子中的条件与结果。"],["Pastikan hasil mempunyai hubungan logik dengan syarat.","Ensure the result is logically related to the condition.","确保结果与条件之间存在逻辑关系。"]],
        ["Sekiranya semua dokumen lengkap, permohonan itu akan diproses dengan lebih cepat.","If all documents are complete, the application will be processed more quickly.","如果所有文件齐全，该申请将能更快处理。"],
        ["Jangan gunakan penanda syarat tanpa hubungan yang munasabah antara klausa; hasil perlu berkaitan dengan syarat yang dinyatakan.","Do not use a conditional marker without a reasonable relationship between clauses; the result must relate to the stated condition.","不要在分句之间缺乏合理关系时使用条件标记；结果必须与所述条件相关。"],
        [
          [["Kata manakah memperkenalkan syarat?","Which word introduces a condition?","哪个词引出条件？"],[["sekiranya","if","如果"],["walaupun","although","虽然"],["sementara","while","与此同时"],["malah","moreover","而且"]],0],
          [["Dalam ayat bersyarat, apakah fungsi klausa selepas syarat?","In a conditional sentence, what does the clause after the condition do?","在条件句中，条件之后的分句起什么作用？"],[["Menyatakan hasil atau tindakan berkaitan","Stating a related result or action","说明相关结果或行动"],["Menamakan warna","Naming a colour","命名颜色"],["Mengulang tajuk","Repeating a title","重复标题"],["Menyenaraikan huruf","Listing letters","列出字母"]],0],
          [["Pilih ayat bersyarat yang gramatis.","Choose the grammatical conditional sentence.","选择语法正确的条件句。"],[["Jika bas tiba awal, kami tidak akan terlewat.","If the bus arrives early, we will not be late.","如果巴士早到，我们就不会迟到。"],["Jika bas awal kepada kami tidak.","If bus early to us not.","如果巴士早对我们不。"],["Kami jika tidak bas tiba awal akan.","We if not bus arrive early will.","我们如果不巴士早到会。"],["Bas tiba awal kerana jika.","Bus arrives early because if.","巴士早到因为如果。"]],0]
        ]),
      make("ms-i-quantifiers-and-classifiers",
        ["Penjodoh bilangan dan pengukur","Classifiers and quantifiers","量词与数量表达"],
        ["Menggunakan penjodoh bilangan dengan tepat","Using classifiers accurately","准确使用量词"],
        ["Pilih penjodoh bilangan dan kata kuantiti yang sesuai dengan bentuk atau jenis benda yang dihitung.","Choose classifiers and quantity words suited to the form or type of item being counted.","根据物品的形状或类别选择合适的量词和数量词。"],
        [
          ["Penjodoh bilangan hadir antara angka dengan kata nama, contohnya “dua orang murid”, “tiga ekor kucing” dan “sehelai kertas”. Pemilihannya bergantung pada golongan benda yang dihitung.","A classifier appears between a number and a noun, for example, “two pupils”, “three cats” and “a sheet of paper”. The choice depends on the category of item counted.","量词位于数字与名词之间，例如“dua orang murid”（两名学生）、“tiga ekor kucing”（三只猫）和“sehelai kertas”（一张纸）。量词的选择取决于所计数物品的类别。"],
          ["Kata kuantiti seperti beberapa, banyak, sedikit dan sejumlah memberikan gambaran jumlah. Sesuaikan kata kuantiti dengan konteks dan kata nama yang mengikutinya.","Quantity words such as several, many, a little and a total of indicate amount. Match them to the context and the noun that follows.","beberapa（几个）、banyak（许多）、sedikit（少量）和sejumlah（一定数量）等数量词表示数量。应根据语境及后续名词选择合适的表达。"]
        ],
        [["Letakkan penjodoh bilangan selepas angka dan sebelum kata nama.","Place the classifier after the number and before the noun.","把量词放在数字之后、名词之前。"],["Jangan pilih penjodoh bilangan berdasarkan bunyi semata-mata; pertimbangkan golongan benda.","Do not choose a classifier based only on sound; consider the category of item.","不要只凭语感选择量词；应考虑物品类别。"]],
        ["Pihak sekolah menyediakan dua buah komputer, lima orang guru dan beberapa helai kertas untuk aktiviti itu.","The school provided two computers, five teachers and several sheets of paper for the activity.","校方为该活动准备了两台电脑、五位教师和几张纸。"],
        ["Jangan gunakan satu penjodoh bilangan untuk semua kata nama; “orang”, “ekor”, “buah” dan “helai” mempunyai penggunaan yang berbeza.","Do not use one classifier for every noun; “orang”, “ekor”, “buah” and “helai” have different uses.","不要对所有名词使用同一个量词；“orang”“ekor”“buah”和“helai”的用法各不相同。"],
        [
          [["Penjodoh bilangan manakah lazim digunakan untuk manusia?","Which classifier is commonly used for people?","哪个量词通常用于人？"],[["orang","people classifier","位／人"],["ekor","animal classifier","只"],["helai","flat thin items","张"],["utas","long flexible items","条"]],0],
          [["Pilih frasa yang betul.","Choose the correct phrase.","选择正确的短语。"],[["tiga ekor kucing","three cats","三只猫"],["tiga helai kucing","three sheets of cats","三张猫"],["tiga orang kucing","three people of cats","三位猫"],["tiga batang kucing","three sticks of cats","三根猫"]],0],
          [["Apakah fungsi kata “beberapa”?","What is the function of “beberapa”?","“beberapa”有什么作用？"],[["Menyatakan kuantiti yang tidak khusus","Expressing an unspecified quantity","表示不具体的数量"],["Menunjukkan masa lampau","Showing past time","表示过去时间"],["Menamakan tempat","Naming a place","命名地点"],["Menunjukkan larangan","Showing prohibition","表示禁止"]],0]
        ]),
      make("ms-i-cause-and-effect",
        ["Sebab dan akibat","Cause and effect","因果关系"],
        ["Menghubungkan sebab dengan akibat","Connecting causes and effects","连接原因与结果"],
        ["Gunakan penanda hubungan yang tepat untuk menjelaskan punca, kesan dan tindakan susulan.","Use appropriate linking expressions to explain causes, effects and follow-up actions.","使用恰当的连接表达说明原因、影响和后续行动。"],
        [
          ["“Oleh sebab” dan “kerana” memperkenalkan sebab. “Oleh itu”, “akibatnya” dan “kesannya” boleh memperkenalkan hasil atau kesan sesuatu keadaan.","“Oleh sebab” and “kerana” introduce causes. “Oleh itu”, “akibatnya” and “kesannya” can introduce a result or effect.","“Oleh sebab”和“kerana”引出原因。“Oleh itu”“akibatnya”和“kesannya”可引出结果或影响。"],
          ["Pastikan hubungan sebab-akibat disokong oleh maklumat yang munasabah. Jangan menganggap dua peristiwa yang berlaku serentak semestinya mempunyai hubungan sebab-akibat.","Ensure cause-and-effect relationships are supported by reasonable information. Do not assume that two events occurring at the same time necessarily have a causal relationship.","确保因果关系有合理信息支持。不要认为同时发生的两个事件必然存在因果关系。"]
        ],
        [["Gunakan penanda sebab untuk punca dan penanda akibat untuk hasil.","Use cause markers for reasons and effect markers for results.","用原因标记说明起因，用结果标记说明影响。"],["Bezakan hubungan sebab-akibat daripada kebetulan atau perkaitan semata-mata.","Distinguish causation from coincidence or mere association.","区分因果关系、巧合与单纯相关性。"]],
        ["Oleh sebab bekalan air terganggu, pihak pengurusan menangguhkan kerja pembersihan. Oleh itu, jadual baharu akan dimaklumkan kemudian.","Because the water supply was disrupted, management postponed the cleaning work. Therefore, the revised schedule will be announced later.","由于供水中断，管理方推迟了清洁工作。因此，新的时间表将稍后公布。"],
        ["Jangan gunakan “akibatnya” untuk memperkenalkan sebab; penanda itu lazimnya memperkenalkan kesan atau hasil.","Do not use “akibatnya” to introduce a cause; it generally introduces an effect or result.","不要用“akibatnya”引出原因；它通常用于引出影响或结果。"],
        [
          [["Ungkapan manakah memperkenalkan sebab?","Which expression introduces a cause?","哪个表达引出原因？"],[["oleh sebab","because of","由于"],["oleh itu","therefore","因此"],["akibatnya","as a result","结果"],["kesannya","its effect","其影响"]],0],
          [["Ungkapan manakah sesuai untuk memperkenalkan hasil?","Which expression is suitable for introducing a result?","哪个表达适合引出结果？"],[["oleh itu","therefore","因此"],["kerana","because","因为"],["disebabkan oleh","caused by","由于"],["atas alasan","for the reason","基于原因"]],0],
          [["Apakah yang perlu dipastikan sebelum membuat dakwaan sebab-akibat?","What should be ensured before making a causal claim?","提出因果论断前应确保什么？"],[["Hubungan itu disokong maklumat yang munasabah.","The relationship is supported by reasonable information.","该关系有合理信息支持。"],["Kedua-dua peristiwa berlaku pada hari sama sahaja.","The events merely occur on the same day.","两件事只是在同一天发生。"],["Tiada bukti diperlukan.","No evidence is needed.","不需要证据。"],["Punca dan kesan mesti mempunyai ejaan sama.","Cause and effect must have identical spelling.","原因和结果必须拼写相同。"]],0]
        ])
    ],
    advanced:[
      make("ms-a-data-and-statistical-language",
        ["Bahasa data dan statistik","Data and statistical language","数据与统计语言"],
        ["Mentafsir dan melaporkan data","Interpreting and reporting data","解读与报告数据"],
        ["Gunakan istilah kuantitatif dengan tepat dan elakkan kesimpulan yang melampaui data yang tersedia.","Use quantitative terms accurately and avoid conclusions that go beyond the available data.","准确使用定量术语，避免得出超出已有数据范围的结论。"],
        [
          ["Istilah seperti meningkat, menurun, kekal, majoriti, minoriti, purata dan peratusan menerangkan corak data. Nyatakan tempoh, kumpulan dan ukuran supaya laporan boleh ditafsir dengan betul.","Terms such as increased, decreased, remained stable, majority, minority, average and percentage describe data patterns. State the period, group and measure so the report can be interpreted correctly.","meningkat（上升）、menurun（下降）、kekal（保持）、majoriti（多数）、minoriti（少数）、purata（平均值）和peratusan（百分比）等术语描述数据趋势。应说明时间范围、群体和衡量指标，以便正确解读报告。"],
          ["Bezakan bilangan mutlak dengan peratusan dan perkaitan dengan sebab-akibat. Jika sampel kecil atau kaedah pengumpulan terhad, nyatakan batasan tersebut dan elakkan generalisasi berlebihan.","Distinguish absolute counts from percentages and association from causation. If the sample is small or collection methods are limited, state those limitations and avoid overgeneralisation.","区分绝对数量与百分比，也要区分相关性与因果关系。如果样本较小或收集方法有限，应说明这些限制，避免过度概括。"]
        ],
        [["Sertakan unit, tempoh dan kumpulan yang dibandingkan.","Include the unit, period and groups being compared.","注明单位、时间范围和比较群体。"],["Gunakan bahasa berhati-hati apabila data tidak membuktikan sebab-akibat.","Use cautious wording when data does not establish causation.","数据无法证明因果关系时，应谨慎措辞。"]],
        ["Dalam tinjauan terhadap 200 responden, 58 peratus memilih pengangkutan awam. Dapatan ini menggambarkan sampel kajian dan tidak semestinya mewakili seluruh penduduk.","In a survey of 200 respondents, 58 per cent chose public transport. This finding describes the study sample and does not necessarily represent the entire population.","在一项针对200名受访者的调查中，58%选择公共交通。这一结果反映的是研究样本，不一定代表全体居民。"],
        ["Jangan menyatakan bahawa sesuatu faktor menyebabkan perubahan hanya kerana kedua-duanya berubah pada tempoh yang sama.","Do not claim that one factor caused a change merely because both changed during the same period.","不要仅因两个因素在同一时期发生变化，就断言其中一个导致了另一个变化。"],
        [
          [["Apakah maklumat yang membantu pembaca mentafsir angka dengan tepat?","What information helps readers interpret figures accurately?","哪些信息有助于读者准确解读数据？"],[["Unit, tempoh dan kumpulan","Unit, period and group","单位、时间范围和群体"],["Warna tajuk sahaja","Title colour only","仅标题颜色"],["Nama penulis sahaja","Writer's name only","仅作者姓名"],["Bilangan halaman sahaja","Page count only","仅页数"]],0],
          [["Apakah perbezaan penting antara perkaitan dengan sebab-akibat?","What is an important difference between association and causation?","相关性与因果关系的重要区别是什么？"],[["Perkaitan tidak semestinya membuktikan sebab-akibat.","Association does not necessarily prove causation.","相关性不一定能证明因果关系。"],["Kedua-duanya sentiasa sama.","They are always the same.","两者总是相同。"],["Sebab-akibat tidak memerlukan bukti.","Causation requires no evidence.","因果关系不需要证据。"],["Perkaitan hanya melibatkan angka bulat.","Association only involves whole numbers.","相关性只涉及整数。"]],0],
          [["Bilakah penulis patut menyatakan batasan kajian?","When should a writer state study limitations?","作者何时应说明研究限制？"],[["Apabila sampel atau kaedah mempunyai kekangan.","When the sample or method has limitations.","当样本或方法存在限制时。"],["Hanya apabila tajuk panjang.","Only when the title is long.","只有标题很长时。"],["Tidak perlu dinyatakan.","They never need to be stated.","无需说明。"],["Apabila keputusan tidak disukai sahaja.","Only when the results are disliked.","只有不喜欢结果时。"]],0]
        ]),
      make("ms-a-policy-and-formal-correspondence",
        ["Bahasa dasar dan surat-menyurat rasmi","Policy language and formal correspondence","政策语言与正式函件"],
        ["Menulis komunikasi rasmi yang jelas","Writing clear formal communication","撰写清晰的正式沟通文本"],
        ["Gunakan struktur dan ungkapan rasmi untuk menyampaikan keputusan, prosedur, permohonan dan tanggungjawab secara tepat.","Use formal structures and expressions to communicate decisions, procedures, requests and responsibilities accurately.","使用正式结构和表达准确传达决定、程序、申请和责任。"],
        [
          ["Komunikasi rasmi lazimnya menyatakan tujuan pada bahagian awal, diikuti latar belakang ringkas, butiran tindakan dan tarikh yang berkaitan. Gunakan tajuk dan perenggan yang membantu pembaca mencari maklumat.","Formal communication usually states its purpose at the beginning, followed by brief background, action details and relevant dates. Use headings and paragraphs that help readers locate information.","正式沟通通常在开头说明目的，随后提供简要背景、行动细节和相关日期。使用有助读者查找信息的标题和段落。"],
          ["Pilih kata kerja yang menyatakan tanggungjawab dengan tepat seperti memohon, mengesahkan, meluluskan, mengemukakan dan memaklumkan. Bezakan arahan wajib daripada saranan atau pilihan.","Choose verbs that accurately express responsibilities, such as request, confirm, approve, submit and notify. Distinguish mandatory instructions from recommendations or options.","选择准确表达责任的动词，例如memohon（申请）、mengesahkan（确认）、meluluskan（批准）、mengemukakan（提交）和memaklumkan（通知）。区分强制指示、建议和可选事项。"]
        ],
        [["Nyatakan pihak yang bertanggungjawab dan tindakan yang diperlukan.","State the responsible party and required action.","说明责任方和所需行动。"],["Gunakan tarikh, rujukan dan istilah secara konsisten.","Use dates, references and terminology consistently.","统一使用日期、编号和术语。"]],
        ["Pemohon diminta mengemukakan dokumen sokongan sebelum atau pada 30 Jun 2027. Sebarang pertanyaan boleh dikemukakan kepada urus setia melalui saluran rasmi.","Applicants are requested to submit supporting documents on or before 30 June 2027. Any enquiries may be directed to the secretariat through the official channel.","申请人须于2027年6月30日或之前提交支持文件。如有疑问，可通过正式渠道向秘书处提出。"],
        ["Jangan gunakan ungkapan kabur seperti “dengan kadar segera” apabila tarikh akhir khusus boleh dinyatakan.","Avoid vague expressions such as “as soon as possible” when a specific deadline can be stated.","若能明确说明截止日期，就不要使用“尽快”等含糊表达。"],
        [
          [["Apakah susunan yang membantu surat rasmi menjadi jelas?","Which structure helps make a formal letter clear?","哪种结构有助于正式信函清晰明了？"],[["Tujuan, latar belakang, tindakan dan tarikh","Purpose, background, action and date","目的、背景、行动和日期"],["Maklumat rawak tanpa tajuk","Random information without headings","没有标题的零散信息"],["Penutup sebelum tujuan","Closing before purpose","先结束后说明目的"],["Ulangan tanpa butiran","Repetition without details","没有细节的重复"]],0],
          [["Kata kerja manakah bermaksud menyerahkan dokumen secara rasmi?","Which verb means to submit documents formally?","哪个动词表示正式提交文件？"],[["mengemukakan","submit","提交"],["mengelakkan","avoid","避免"],["menghiburkan","entertain","娱乐"],["menghias","decorate","装饰"]],0],
          [["Mengapakah tarikh akhir khusus lebih baik daripada ungkapan kabur?","Why is a specific deadline better than a vague expression?","为什么明确截止日期优于含糊表达？"],[["Pembaca dapat mengetahui masa tindakan dengan tepat.","Readers can know the required timing precisely.","读者能准确了解行动期限。"],["Surat menjadi lebih panjang.","The letter becomes longer.","信函会变长。"],["Tanggungjawab tidak perlu dinyatakan.","Responsibilities need not be stated.","无需说明责任。"],["Maklumat menjadi rahsia.","Information becomes secret.","信息会变成秘密。"]],0]
        ]),
      make("ms-a-ethical-and-inclusive-language",
        ["Bahasa beretika dan inklusif","Ethical and inclusive language","合乎伦理与包容性语言"],
        ["Memilih bahasa yang adil dan menghormati","Choosing fair and respectful language","选择公平且尊重他人的语言"],
        ["Nilai kesan pilihan kata terhadap individu dan kumpulan, serta sampaikan maklumat tanpa stereotaip atau penghinaan.","Evaluate how word choices affect individuals and groups, and communicate without stereotypes or insults.","评估用词对个人和群体的影响，并避免刻板印象或侮辱性表达。"],
        [
          ["Bahasa yang inklusif mengelakkan generalisasi tentang latar belakang, keupayaan, umur atau identiti seseorang. Sebut ciri yang benar-benar relevan dengan tujuan komunikasi sahaja.","Inclusive language avoids generalisations about a person's background, ability, age or identity. Mention only characteristics genuinely relevant to the communication purpose.","包容性语言避免对个人背景、能力、年龄或身份作笼统概括。只提及与沟通目的真正相关的特征。"],
          ["Dalam penulisan, bezakan kritikan terhadap tindakan atau idea daripada serangan terhadap individu. Gunakan istilah yang tepat, konteks yang mencukupi dan bukti yang boleh disemak.","In writing, distinguish criticism of an action or idea from an attack on a person. Use precise terms, sufficient context and verifiable evidence.","写作时应区分对行为或观点的批评与对个人的攻击。使用准确术语、充分语境和可核查证据。"]
        ],
        [["Fokuskan kritikan pada tindakan, keputusan atau bukti, bukan maruah individu.","Focus criticism on actions, decisions or evidence, not personal dignity.","批评应针对行为、决定或证据，而非个人尊严。"],["Semak sama ada sesuatu label benar-benar perlu dan tepat.","Check whether a label is genuinely necessary and accurate.","检查某个标签是否确有必要且准确。"]],
        ["Laporan itu menilai keputusan pengurusan berdasarkan rekod dan kesannya terhadap pengguna, tanpa membuat andaian tentang latar belakang mana-mana individu.","The report evaluates the management decision based on records and its effects on users, without making assumptions about any individual's background.","该报告根据记录及其对用户的影响评估管理决定，没有对任何人的背景作出假设。"],
        ["Jangan gunakan label yang merendahkan atau membuat kesimpulan tentang seluruh kumpulan berdasarkan tindakan seorang individu.","Do not use demeaning labels or draw conclusions about an entire group based on one individual's actions.","不要使用贬低性标签，也不要根据一个人的行为对整个群体下结论。"],
        [
          [["Apakah ciri bahasa yang inklusif?","What is a feature of inclusive language?","包容性语言有什么特点？"],[["Mengelakkan stereotaip dan generalisasi","Avoiding stereotypes and generalisations","避免刻板印象和笼统概括"],["Melabel semua orang dengan cara sama","Labelling everyone in the same way","以同一种方式给所有人贴标签"],["Menghina pihak yang berbeza pandangan","Insulting those with different views","侮辱持不同观点的人"],["Menyebarkan andaian tanpa bukti","Spreading assumptions without evidence","传播没有证据的假设"]],0],
          [["Kritikan yang beretika patut ditujukan kepada apa?","What should ethical criticism be directed at?","合乎伦理的批评应针对什么？"],[["Tindakan, keputusan atau idea","Actions, decisions or ideas","行为、决定或观点"],["Maruah peribadi seseorang","A person's dignity","个人尊严"],["Latar belakang yang tidak berkaitan","Irrelevant background","无关的背景"],["Identiti seluruh kumpulan","The identity of an entire group","整个群体的身份"]],0],
          [["Apakah yang perlu dilakukan sebelum menggunakan sesuatu label terhadap kumpulan?","What should be done before using a label for a group?","对群体使用某个标签前应做什么？"],[["Semak keperluan, ketepatan dan konteksnya.","Check its necessity, accuracy and context.","检查其必要性、准确性和语境。"],["Gunakan label yang paling keras.","Use the harshest label.","使用最严厉的标签。"],["Anggap label itu benar tanpa semakan.","Assume the label is true without checking.","不经核实就认为标签属实。"],["Ulang label itu sebanyak mungkin.","Repeat the label as often as possible.","尽可能多次重复该标签。"]],0]
        ])
    ]
  };
  for(const level of ["beginner","intermediate","advanced"]){
    const ids=new Set(base[level].map(item=>item.id));
    for(const lesson of batch[level]){
      if(ids.has(lesson.id)) throw new Error("Duplicate Malay lesson ID: "+lesson.id);
      base[level].push(lesson);
    }
  }
  base.contentVersion="u3-ms-lessons-0.5.0";
  base.expansionBatches=(base.expansionBatches||[]).concat([{id:"batch-05",added:9,reviewStatus:"draft"}]);
})();
