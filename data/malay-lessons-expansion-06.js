/* SwiftDictionary U3.0 — Malay Lessons expansion batch 06.
 * Original Malaysian Standard Malay draft content; EN/ZH support is machine-assisted.
 * Owner linguistic and translation review is reserved for staging review.
 */
(() => {
  const base=window.SWIFT_MALAY_LESSONS;
  if(!base) throw new Error("Load the Malay lesson foundation before batch 06.");
  const t=(ms,en,zh)=>({ms,en,zh});
  const make=(id,topic,title,summary,explanations,points,example,mistake,qs)=>({
    id,topic_id:id.replace(/^ms-[bia]-/,"ms-topic-"),
    topic:t(...topic),title:t(...title),summary:t(...summary),
    explanation:explanations.map(x=>t(...x)),points:points.map(x=>t(...x)),
    examples:[t(...example)],mistakes:[t(...mistake)],
    practices:qs.map(q=>({q:t(...q[0]),options:q[1].map(o=>t(...o)),answer:q[2]}))
  });
  const batch={
    beginner:[
      make("ms-b-food-and-drink",
        ["Makanan dan minuman","Food and drinks","食物与饮料"],
        ["Menyatakan pilihan makanan dan minuman","Expressing food and drink choices","表达食物与饮料选择"],
        ["Gunakan kata nama makanan, kata adjektif rasa dan ungkapan mudah untuk menyatakan pilihan serta keperluan.","Use food nouns, taste adjectives and simple expressions to state preferences and needs.","使用食物名词、味觉形容词和简单表达说明喜好与需求。"],
        [
          ["Kata nama seperti nasi, mi, sayur, buah dan air merujuk makanan atau minuman. Kata adjektif seperti manis, masam, pedas dan tawar menerangkan rasa.","Nouns such as rice, noodles, vegetables, fruit and water refer to food or drinks. Adjectives such as sweet, sour, spicy and bland describe taste.","nasi（米饭）、mi（面条）、sayur（蔬菜）、buah（水果）和air（水）等名词表示食物或饮料；manis（甜）、masam（酸）、pedas（辣）和tawar（淡）等形容词描述味道。"],
          ["Gunakan “Saya suka …” untuk menyatakan kesukaan dan “Saya tidak makan …” untuk menyatakan pantang atau pilihan. Nyatakan permintaan dengan sopan, misalnya “Boleh saya minta air kosong?”","Use “Saya suka …” to express a preference and “Saya tidak makan …” to state a restriction or choice. Make requests politely, for example, “May I have plain water?”","用“Saya suka …”表达喜好，用“Saya tidak makan …”说明饮食限制或选择。提出请求时应有礼貌，例如“Boleh saya minta air kosong?”（可以给我白开水吗？）。"]
        ],
        [["Namakan makanan dan minuman dengan tepat.","Name foods and drinks accurately.","准确说出食物与饮料名称。"],["Gunakan ungkapan sopan untuk menyatakan pilihan atau permintaan.","Use polite expressions to state a choice or request.","使用礼貌表达说明选择或提出请求。"]],
        ["Saya suka buah yang manis, tetapi saya kurang gemar makanan yang terlalu pedas.","I like sweet fruit, but I do not particularly enjoy very spicy food.","我喜欢甜的水果，但不太喜欢过辣的食物。"],
        ["Jangan gunakan kata adjektif rasa seolah-olah semuanya mempunyai maksud yang sama; pedas menerangkan rasa cili, manakala masam menerangkan rasa seperti limau.","Do not treat taste adjectives as interchangeable; pedas describes chilli heat, while masam describes sourness such as lime.","不要把味觉形容词混为一谈；pedas表示辣味，masam表示酸味，例如酸橙的味道。"],
        [
          [["Apakah maksud “masam”?","What does “masam” mean?","“masam”是什么意思？"],[["Manis","Sweet","甜"],["Masam","Sour","酸"],["Pedas","Spicy","辣"],["Tawar","Bland","淡"]],1],
          [["Pilih ayat yang menyatakan kesukaan.","Choose the sentence that expresses a preference.","选择表达喜好的句子。"],[["Saya suka minum susu.","I like drinking milk.","我喜欢喝牛奶。"],["Saya di bawah meja.","I am under the table.","我在桌子下面。"],["Dia semalam ke sekolah.","He yesterday to school.","他昨天去学校。"],["Buku itu sangat jauh.","That book is very far.","那本书很远。"]],0],
          [["Pilih permintaan yang paling sopan.","Choose the most polite request.","选择最有礼貌的请求。"],[["Boleh saya minta air kosong?","May I have plain water?","可以给我白开水吗？"],["Bagi air sekarang!","Give water now!","现在给我水！"],["Air itu saya mahu cepat.","That water I want quickly.","那水我要快点。"],["Kamu mesti beri air.","You must give water.","你必须给水。"]],0]
        ]),
      make("ms-b-daily-activities",
        ["Kegiatan harian","Daily activities","日常活动"],
        ["Menceritakan kegiatan harian mengikut urutan","Describing daily activities in sequence","按顺序描述日常活动"],
        ["Bina ayat mudah tentang rutin dengan kata kerja dan penanda urutan masa.","Build simple sentences about routines using verbs and time-sequence markers.","使用动词和时间顺序词构成描述日常作息的简单句子。"],
        [
          ["Kata kerja seperti bangun, mandi, bersarapan, belajar dan berehat menerangkan kegiatan. Tambahkan maklumat masa seperti pada waktu pagi atau selepas sekolah.","Verbs such as wake up, bathe, have breakfast, study and rest describe activities. Add time information such as in the morning or after school.","bangun（起床）、mandi（洗澡）、bersarapan（吃早餐）、belajar（学习）和berehat（休息）等动词描述活动。可加入pada waktu pagi（早上）或selepas sekolah（放学后）等时间信息。"],
          ["Penanda seperti mula-mula, kemudian, selepas itu dan akhirnya membantu menyusun peristiwa. Gunakan bentuk ayat yang konsisten apabila menceritakan rutin biasa.","Markers such as first, then, after that and finally help sequence events. Keep sentence forms consistent when describing a usual routine.","mula-mula（首先）、kemudian（然后）、selepas itu（之后）和akhirnya（最后）等词语有助于排列事件。描述日常作息时应保持句式一致。"]
        ],
        [["Gunakan kata kerja yang sesuai untuk setiap kegiatan.","Use an appropriate verb for each activity.","为每项活动使用恰当动词。"],["Susun kegiatan dengan penanda urutan yang jelas.","Sequence activities with clear markers.","使用清晰的顺序词排列活动。"]],
        ["Mula-mula, saya bersarapan. Kemudian, saya pergi ke sekolah dan belajar bersama rakan.","First, I have breakfast. Then, I go to school and study with my friends.","首先，我吃早餐。然后，我去学校和朋友一起学习。"],
        ["Jangan susun peristiwa tanpa penanda masa apabila urutan penting kepada maksud cerita.","Do not list events without time markers when their order is important to the account.","当事件顺序影响叙述意思时，不要省略时间顺序词。"],
        [
          [["Apakah maksud “bersarapan”?","What does “bersarapan” mean?","“bersarapan”是什么意思？"],[["Makan tengah hari","Have lunch","吃午餐"],["Makan sarapan","Have breakfast","吃早餐"],["Makan malam","Have dinner","吃晚餐"],["Tidur","Sleep","睡觉"]],1],
          [["Pilih penanda yang biasanya menunjukkan langkah pertama.","Choose the marker that usually indicates the first step.","选择通常表示第一步的词语。"],[["Akhirnya","Finally","最后"],["Mula-mula","First","首先"],["Walaupun","Although","虽然"],["Namun","However","然而"]],1],
          [["Pilih ayat yang menerangkan rutin dengan jelas.","Choose the sentence that clearly describes a routine.","选择清楚描述日常作息的句子。"],[["Setiap pagi, saya bangun pada pukul enam.","Every morning, I wake up at six.","我每天早上六点起床。"],["Pagi meja kerana buku.","Morning table because book.","早晨桌子因为书。"],["Saya sekolah semalam esok.","I school yesterday tomorrow.","我学校昨天明天。"],["Selepas itu kerana biru.","After that because blue.","之后因为蓝色。"]],0]
        ]),
      make("ms-b-weather-and-seasons",
        ["Cuaca dan keadaan alam","Weather and natural conditions","天气与自然状况"],
        ["Menerangkan keadaan cuaca","Describing the weather","描述天气状况"],
        ["Pelajari kosa kata cuaca dan bina ayat ringkas tentang keadaan di luar.","Learn weather vocabulary and build short sentences about outdoor conditions.","学习天气词汇，并构成描述户外状况的简短句子。"],
        [
          ["Kata seperti panas, sejuk, mendung, hujan dan berangin menerangkan keadaan cuaca. Gunakan “hari ini” atau “sekarang” untuk menetapkan masa.","Words such as hot, cold, cloudy, rainy and windy describe weather. Use “today” or “now” to establish the time.","panas（热）、sejuk（冷）、mendung（多云）、hujan（下雨）和berangin（有风）等词语描述天气。使用“hari ini”（今天）或“sekarang”（现在）说明时间。"],
          ["Ayat “Cuaca hari ini mendung” menyatakan keadaan. Ayat “Bawa payung kerana hujan” pula menghubungkan keadaan cuaca dengan tindakan yang sesuai.","The sentence “The weather is cloudy today” states a condition. “Bring an umbrella because it is raining” connects the weather to an appropriate action.","“Cuaca hari ini mendung”（今天天气多云）说明天气状况；“Bawa payung kerana hujan”（因为下雨，请带伞）则把天气与适当行动联系起来。"]
        ],
        [["Pilih kata adjektif yang tepat untuk keadaan cuaca.","Choose the correct adjective for a weather condition.","为天气状况选择准确的形容词。"],["Hubungkan keadaan cuaca dengan tindakan yang munasabah.","Connect weather conditions with sensible actions.","把天气状况与合理行动联系起来。"]],
        ["Cuaca petang ini hujan, jadi kami membawa payung.","It is raining this afternoon, so we are bringing umbrellas.","今天下午下雨，所以我们带上雨伞。"],
        ["Bezakan “hujan” sebagai kata nama atau kata kerja mengikut ayat; jangan menggantikannya dengan “mendung” yang hanya menerangkan keadaan berawan.","Distinguish “hujan” as a noun or verb according to the sentence; do not replace it with “mendung”, which describes cloudy conditions.","应根据句子区分“hujan”作名词或动词的用法；不要用只表示多云状况的“mendung”替代。"],
        [
          [["Apakah maksud “berangin”?","What does “berangin” mean?","“berangin”是什么意思？"],[["Windy","Windy","有风"],["Snowy","Snowy","下雪"],["Dusty","Dusty","多尘"],["Silent","Silent","安静"]],0],
          [["Apakah barang yang sesuai dibawa ketika hujan?","What is suitable to bring when it rains?","下雨时适合带什么？"],[["Payung","Umbrella","雨伞"],["Cermin","Mirror","镜子"],["Bantal","Pillow","枕头"],["Pinggan","Plate","盘子"]],0],
          [["Pilih ayat yang menerangkan cuaca dengan betul.","Choose the sentence that correctly describes the weather.","选择正确描述天气的句子。"],[["Langit mendung sebelum hujan.","The sky is cloudy before the rain.","下雨前天空阴沉。"],["Langit memasak nasi.","The sky cooks rice.","天空煮饭。"],["Hujan memakai kasut.","The rain wears shoes.","雨穿鞋子。"],["Angin membaca buku.","The wind reads a book.","风读书。"]],0]
        ])
    ],
    intermediate:[
      make("ms-i-pronouns-and-reference",
        ["Kata ganti nama dan rujukan","Pronouns and reference","代词与指代"],
        ["Menggunakan kata ganti nama dengan jelas","Using pronouns clearly","清晰使用代词"],
        ["Gunakan kata ganti nama untuk mengelakkan pengulangan, sambil memastikan rujukannya mudah dikenal pasti.","Use pronouns to avoid repetition while keeping their references clear.","使用代词避免重复，同时确保指代对象清楚明确。"],
        [
          ["Kata ganti nama diri seperti saya, kami, kita, dia dan mereka menggantikan nama orang. Pilihan kata bergantung pada siapa yang bercakap dan siapa yang disertakan.","Personal pronouns such as I, we, you and I, he or she, and they replace people's names. The choice depends on who is speaking and who is included.","saya、kami、kita、dia和mereka等人称代词代替人物姓名。选择哪一个取决于说话者身份及是否包括 pendengar。"],
          ["“Kami” biasanya tidak merangkumi orang yang diajak bercakap, manakala “kita” merangkuminya. Pastikan kata ganti nama merujuk kepada orang atau kumpulan yang telah dinyatakan.","“Kami” usually excludes the person being addressed, while “kita” includes them. Ensure that a pronoun refers to a person or group already identified.","“kami”通常不包括听话者，而“kita”包括听话者。应确保代词指向前文已明确的人或群体。"]
        ],
        [["Bezakan “kami” daripada “kita” berdasarkan pihak yang disertakan.","Distinguish “kami” from “kita” according to who is included.","根据包含对象区分“kami”和“kita”。"],["Pastikan rujukan kata ganti nama tidak mengelirukan pembaca.","Ensure pronoun references do not confuse readers.","确保代词指代不会令读者困惑。"]],
        ["Kita akan membincangkan tugasan ini bersama-sama selepas kelas.","We will discuss this task together after class.","下课后，我们（包括你）会一起讨论这项任务。"],
        ["Jangan gunakan kata ganti nama yang boleh merujuk kepada dua orang atau kumpulan berbeza tanpa penjelasan.","Do not use a pronoun that could refer to two different people or groups without clarification.","如果代词可能指向两个不同的人或群体，应先作出说明。"],
        [
          [["Kata ganti nama manakah yang lazimnya merangkumi pendengar?","Which pronoun usually includes the listener?","哪个代词通常包括听话者？"],[["Kami","Kami","我们（不包括听话者）"],["Kita","Kita","我们（包括听话者）"],["Mereka","They","他们"],["Dia","He or she","他/她"]],1],
          [["Pilih ayat dengan rujukan yang jelas.","Choose the sentence with a clear reference.","选择指代清楚的句子。"],[["Aina meminjam buku itu dan dia memulangkannya esok.","Aina borrowed the book and she will return it tomorrow.","Aina借了那本书，她明天会归还。"],["Dia memberitahunya bahawa dia melihatnya.","He told him that he saw him.","他告诉他，他看见了他。"],["Mereka berkata mereka kepada mereka.","They said they to them.","他们说他们给他们。"],["Ia itu mereka punya dia.","It that their his.","它那他们的他的。"]],0],
          [["Apakah tujuan utama penggunaan kata ganti nama?","What is the main purpose of using pronouns?","使用代词的主要目的是什么？"],[["Mengelakkan pengulangan nama secara berlebihan","Avoiding excessive repetition of names","避免过度重复姓名"],["Menukar semua kata kerja","Changing all verbs","替换所有动词"],["Menghapuskan tanda baca","Removing punctuation","删除标点"],["Menambah bilangan perenggan","Increasing paragraph count","增加段落数量"]],0]
        ]),
      make("ms-i-noun-and-verb-derivation",
        ["Kata terbitan nama dan kerja","Derived nouns and verbs","派生名词与动词"],
        ["Memahami pembentukan kata terbitan","Understanding derived word formation","理解派生词的构成"],
        ["Kenal pasti hubungan antara kata dasar dengan kata terbitan melalui imbuhan yang mengubah fungsi atau makna.","Identify relationships between roots and derived words through affixes that change function or meaning.","通过改变词性或意义的词缀，辨认词根与派生词之间的关系。"],
        [
          ["Imbuhan boleh membentuk kata nama dan kata kerja. Contohnya, “ajar” berkaitan dengan “mengajar” dan “pengajaran”; bentuk terbitan membawa fungsi tatabahasa yang berbeza.","Affixes can form nouns and verbs. For example, “ajar” is related to “mengajar” and “pengajaran”; the derived forms have different grammatical functions.","词缀可以构成名词和动词。例如，“ajar”与“mengajar”和“pengajaran”相关；这些派生形式具有不同的语法功能。"],
          ["Jangan menentukan makna hanya berdasarkan satu imbuhan. Perhatikan kata dasar, bentuk penuh dan konteks ayat untuk memahami maksud sesuatu kata terbitan.","Do not determine meaning from an affix alone. Consider the root, complete form and sentence context to understand a derived word.","不要只凭一个词缀判断词义。应结合词根、完整词形和句子语境理解派生词。"]
        ],
        [["Kenal pasti kata dasar dalam kata terbitan.","Identify the root in a derived word.","辨认派生词中的词根。"],["Gunakan fungsi tatabahasa dan konteks untuk mentafsir makna.","Use grammatical function and context to interpret meaning.","利用语法功能和语境理解词义。"]],
        ["Pengajaran guru itu membantu murid memahami cara mengajar yang berkesan.","The teacher's instruction helps pupils understand effective teaching methods.","老师的教学帮助学生理解有效的授课方法。"],
        ["Jangan anggap semua kata yang berkongsi akar mempunyai makna atau kelas kata yang sama.","Do not assume that all words sharing a root have the same meaning or word class.","不要假设所有共享词根的词语都具有相同意义或词类。"],
        [
          [["Apakah kata dasar bagi “pengajaran”?","What is the root of “pengajaran”?","“pengajaran”的词根是什么？"],[["ajar","ajar","教"],["ajarannya","ajarannya","他的教学"],["ajaranan","ajaranan","无此词"],["mengajarkan","mengajarkan","教授"]],0],
          [["“Pengajaran” dalam ayat biasanya berfungsi sebagai kata apa?","What word class does “pengajaran” usually belong to?","“pengajaran”通常属于哪种词类？"],[["Kata nama","Noun","名词"],["Kata sendi","Preposition","介词"],["Kata seru","Interjection","感叹词"],["Kata bilangan","Numeral","数词"]],0],
          [["Apakah cara terbaik menentukan makna kata terbitan?","What is the best way to determine the meaning of a derived word?","理解派生词词义的最佳方法是什么？"],[["Melihat kata dasar, bentuk dan konteks","Considering the root, form and context","结合词根、词形和语境"],["Melihat huruf pertama sahaja","Looking only at the first letter","只看首字母"],["Meneka tanpa membaca ayat","Guessing without reading the sentence","不读句子就猜测"],["Mengabaikan imbuhan","Ignoring affixes","忽略词缀"]],0]
        ]),
      make("ms-i-paragraph-development",
        ["Pengembangan perenggan","Paragraph development","段落展开"],
        ["Membina perenggan yang tersusun","Building a well-organised paragraph","构建结构清晰的段落"],
        ["Kembangkan satu idea utama dengan huraian, contoh dan ayat penutup yang berkaitan.","Develop one main idea with explanation, an example and a relevant concluding sentence.","围绕一个中心思想，加入解释、例子和相关总结句。"],
        [
          ["Ayat topik memperkenalkan idea utama. Ayat huraian menjelaskan idea itu, manakala contoh memberikan bukti atau gambaran yang khusus.","A topic sentence introduces the main idea. Supporting sentences explain it, while examples provide specific evidence or illustration.","主题句引入中心思想；说明句解释该思想；例子则提供具体证据或说明。"],
          ["Pastikan setiap ayat menyumbang kepada idea utama. Gunakan penanda seperti selain itu, contohnya dan oleh itu apabila hubungan makna memerlukannya.","Ensure every sentence contributes to the main idea. Use markers such as furthermore, for example and therefore when the meaning requires them.","确保每个句子都围绕中心思想展开。根据语义关系使用selain itu（此外）、contohnya（例如）和oleh itu（因此）等衔接词。"]
        ],
        [["Mulakan perenggan dengan idea utama yang jelas.","Begin a paragraph with a clear main idea.","以清晰的中心思想开启段落。"],["Sertakan huraian dan contoh yang benar-benar menyokong idea tersebut.","Include explanations and examples that genuinely support the idea.","加入真正支持中心思想的解释和例子。"]],
        ["Amalan membaca memperluas pengetahuan. Contohnya, pembaca dapat mempelajari budaya dan pengalaman masyarakat lain melalui bahan bacaan.","Reading broadens knowledge. For example, readers can learn about other communities' cultures and experiences through reading materials.","阅读能拓展知识。例如，读者可以通过阅读材料了解其他群体的文化和经历。"],
        ["Jangan masukkan contoh yang menarik tetapi tidak berkaitan dengan idea utama perenggan.","Do not include an interesting example that is unrelated to the paragraph's main idea.","不要加入有趣但与段落中心思想无关的例子。"],
        [
          [["Apakah fungsi ayat topik?","What is the function of a topic sentence?","主题句的作用是什么？"],[["Memperkenalkan idea utama","Introducing the main idea","引入中心思想"],["Menyenaraikan semua sumber","Listing all sources","列出所有来源"],["Menggantikan tajuk dokumen","Replacing the document title","取代文件标题"],["Menutup keseluruhan esei","Ending the entire essay","结束整篇文章"]],0],
          [["Pilih contoh yang menyokong idea tentang faedah membaca.","Choose an example that supports the idea of reading benefits.","选择支持阅读益处这一观点的例子。"],[["Membaca membantu seseorang memperoleh maklumat baharu.","Reading helps a person gain new information.","阅读帮助人们获取新信息。"],["Bas itu berwarna merah.","The bus is red.","那辆巴士是红色的。"],["Saya membeli dua biji limau.","I bought two oranges.","我买了两个橙子。"],["Pintu itu diperbuat daripada kayu.","The door is made of wood.","那扇门由木头制成。"]],0],
          [["Apakah yang perlu dielakkan dalam satu perenggan?","What should be avoided in a paragraph?","段落中应避免什么？"],[["Ayat yang tidak berkaitan dengan idea utama","Sentences unrelated to the main idea","与中心思想无关的句子"],["Contoh yang menyokong huraian","Examples supporting the explanation","支持说明的例子"],["Ayat topik yang jelas","A clear topic sentence","清晰的主题句"],["Penanda wacana yang sesuai","Appropriate discourse markers","恰当的衔接词"]],0]
        ])
    ],
    advanced:[
      make("ms-a-nuance-and-stance",
        ["Nuansa makna dan pendirian penulis","Meaning nuance and authorial stance","语义细微差别与作者立场"],
        ["Menilai nuansa dan pendirian dalam teks","Evaluating nuance and stance in texts","评估文本中的语义细微差别与立场"],
        ["Kenal pasti pilihan kata yang menunjukkan tahap kepastian, penilaian dan pendirian penulis.","Identify word choices that signal degrees of certainty, evaluation and the author's stance.","辨认体现确定程度、评价和作者立场的用词。"],
        [
          ["Kata seperti mungkin, barangkali dan pasti menunjukkan tahap kepastian yang berbeza. Kata seperti wajar, membimbangkan dan menguntungkan pula membawa penilaian.","Words such as perhaps, possibly and certainly indicate different levels of certainty. Words such as justified, concerning and beneficial carry evaluations.","mungkin、barangkali和pasti表示不同程度的确定性；wajar、membimbangkan和menguntungkan则带有评价意味。"],
          ["Bezakan fakta yang disokong bukti daripada pendapat atau penilaian. Perhatikan sama ada penulis menggunakan bahasa neutral, berhati-hati atau meyakinkan.","Distinguish evidence-supported facts from opinions or evaluations. Notice whether the writer uses neutral, cautious or persuasive language.","区分有证据支持的事实与意见或评价。留意作者使用的是中立、谨慎还是具有说服力的语言。"]
        ],
        [["Kenal pasti perkataan yang menandakan kepastian atau kemungkinan.","Identify words that signal certainty or possibility.","辨认表示确定性或可能性的词语。"],["Bezakan kenyataan fakta daripada penilaian penulis.","Distinguish factual statements from the author's evaluation.","区分事实陈述与作者评价。"]],
        ["Penulis menyatakan bahawa langkah itu mungkin berkesan, tetapi bukti tambahan masih diperlukan sebelum kesimpulan dibuat.","The writer states that the measure may be effective, but further evidence is still needed before a conclusion is reached.","作者指出该措施可能有效，但在作出结论前仍需要更多证据。"],
        ["Jangan tafsir perkataan “mungkin” sebagai kepastian; perkataan itu menunjukkan kemungkinan, bukan pengesahan.","Do not interpret “mungkin” as certainty; it indicates possibility, not confirmation.","不要把“mungkin”理解为确定；它表示可能性，而非已获证实。"],
        [
          [["Perkataan manakah yang paling jelas menunjukkan kepastian?","Which word most clearly signals certainty?","哪个词最明确表示确定性？"],[["Mungkin","Possibly","可能"],["Barangkali","Perhaps","也许"],["Pasti","Certainly","肯定"],["Sekiranya","If","如果"]],2],
          [["Pernyataan manakah yang merupakan penilaian?","Which statement is an evaluation?","哪一项属于评价？"],[["Program itu wajar diteruskan.","The programme deserves to continue.","该计划值得继续。"],["Mesyuarat bermula pukul sembilan.","The meeting begins at nine.","会议九点开始。"],["Laporan itu mempunyai sepuluh halaman.","The report has ten pages.","报告有十页。"],["Bangunan itu terletak di sebelah sekolah.","The building is beside the school.","那栋建筑位于学校旁边。"]],0],
          [["Apakah maksud “mungkin berkesan” dalam konteks hujah?","What does “may be effective” mean in an argument?","在论证中，“mungkin berkesan”是什么意思？"],[["Keberkesanan masih berupa kemungkinan","Effectiveness remains a possibility","有效性仍只是一种可能"],["Keberkesanan telah dibuktikan sepenuhnya","Effectiveness has been fully proven","有效性已被完全证明"],["Langkah itu pasti gagal","The measure will certainly fail","该措施肯定失败"],["Tiada bukti diperlukan","No evidence is needed","不需要证据"]],0]
        ]),
      make("ms-a-compare-and-synthesise-sources",
        ["Perbandingan dan sintesis sumber","Comparing and synthesising sources","比较与综合资料来源"],
        ["Menggabungkan maklumat daripada beberapa sumber","Synthesising information from multiple sources","综合多个来源的信息"],
        ["Bandingkan persamaan, perbezaan dan kekuatan sumber sebelum membina rumusan sendiri.","Compare similarities, differences and source strengths before developing your own synthesis.","在形成自己的综合结论前，比较不同来源的相同点、差异和可靠程度。"],
        [
          ["Mulakan dengan mengenal pasti persoalan yang sama dalam semua sumber. Catat perkara yang disepakati, perkara yang berbeza dan bukti yang digunakan oleh setiap penulis.","Begin by identifying the question shared by all sources. Note areas of agreement, differences and the evidence used by each author.","先找出所有来源共同讨论的问题，再记录各来源的共识、分歧及作者使用的证据。"],
          ["Sintesis bukan sekadar menyusun petikan satu demi satu. Hubungkan dapatan, jelaskan percanggahan dan nyatakan batas bukti sebelum membuat rumusan yang seimbang.","Synthesis is not simply arranging quotations one after another. Connect findings, explain contradictions and state evidence limitations before reaching a balanced conclusion.","综合分析并非把引文逐一排列。应联系研究发现、解释矛盾，并说明证据局限，再形成平衡结论。"]
        ],
        [["Bandingkan sumber berdasarkan persoalan dan bukti yang relevan.","Compare sources using relevant questions and evidence.","根据相关问题和证据比较来源。"],["Bina rumusan yang mengiktiraf persamaan serta percanggahan.","Develop a synthesis that recognises both agreement and contradiction.","形成兼顾共识与矛盾的综合结论。"]],
        ["Dua kajian menunjukkan peningkatan penyertaan, tetapi hanya satu kajian mengukur kesan jangka panjang; oleh itu, kesimpulan tentang keberkesanan berterusan perlu dibuat dengan berhati-hati.","Two studies show increased participation, but only one measures long-term effects; therefore, conclusions about sustained effectiveness should be made cautiously.","两项研究都显示参与度提高，但只有一项研究衡量长期影响；因此，对持续成效的结论应谨慎作出。"],
        ["Jangan menganggap dua sumber yang bersetuju semestinya bebas antara satu sama lain; semak sama ada kedua-duanya bergantung pada data asal yang sama.","Do not assume two agreeing sources are necessarily independent; check whether both rely on the same original data.","不要假设两个意见一致的来源必然彼此独立；应检查它们是否依赖相同的原始数据。"],
        [
          [["Apakah langkah awal yang sesuai sebelum mensintesis sumber?","What is a suitable first step before synthesising sources?","综合资料来源前，适合先做什么？"],[["Kenal pasti persoalan yang dikongsi","Identify the shared question","找出共同讨论的问题"],["Salin semua petikan","Copy all quotations","复制所有引文"],["Pilih sumber paling panjang","Choose the longest source","选择最长的来源"],["Abaikan perbezaan","Ignore differences","忽略差异"]],0],
          [["Mengapakah percanggahan antara sumber perlu dijelaskan?","Why should contradictions between sources be explained?","为什么需要解释来源之间的矛盾？"],[["Supaya rumusan menggambarkan bukti dengan tepat","So the synthesis represents the evidence accurately","使综合结论准确反映证据"],["Supaya satu sumber boleh dibuang tanpa sebab","So one source can be discarded without reason","可以毫无理由地丢弃一个来源"],["Supaya semua dapatan kelihatan sama","So all findings appear identical","让所有发现看起来相同"],["Supaya rumusan menjadi lebih panjang","So the synthesis becomes longer","让综合结论更长"]],0],
          [["Apakah yang perlu diperiksa apabila dua sumber bersetuju?","What should be checked when two sources agree?","两个来源意见一致时，应检查什么？"],[["Sama ada kedua-duanya bergantung pada data asal yang sama","Whether both rely on the same original data","它们是否依赖相同的原始数据"],["Warna kulit buku","The colour of the book cover","书封面的颜色"],["Bilangan huruf dalam tajuk","The number of letters in the title","标题的字母数量"],["Nama fon yang digunakan","The font name used","使用的字体名称"]],0]
        ]),
      make("ms-a-revision-and-proofreading",
        ["Penyuntingan dan pruf akhir","Editing and final proofreading","编辑与最终校对"],
        ["Menyunting teks secara sistematik","Editing a text systematically","系统地编辑文本"],
        ["Gunakan beberapa pusingan semakan untuk memperbaik ketepatan bahasa, susunan idea dan konsistensi dokumen.","Use several review passes to improve language accuracy, idea organisation and document consistency.","通过多轮检查改善语言准确性、观点组织和文件一致性。"],
        [
          ["Semakan kandungan menilai ketepatan fakta dan kelengkapan hujah. Semakan struktur menilai urutan idea dan hubungan perenggan.","A content review checks factual accuracy and argument completeness. A structural review checks idea sequence and paragraph relationships.","内容检查评估事实准确性和论证完整性；结构检查评估观点顺序及段落关系。"],
          ["Pruf akhir menumpukan ejaan, tanda baca, format, nombor dan keseragaman istilah. Baca teks selepas perubahan dibuat untuk memastikan pembetulan tidak menghasilkan kesalahan baharu.","Final proofreading focuses on spelling, punctuation, formatting, numbers and terminology consistency. Read the text again after changes to ensure corrections have not introduced new errors.","最终校对重点检查拼写、标点、格式、数字和术语一致性。修改后应重新通读，确保修正没有引入新错误。"]
        ],
        [["Asingkan semakan kandungan, struktur dan bahasa.","Separate content, structure and language reviews.","分别进行内容、结构和语言检查。"],["Semak semula teks selepas setiap perubahan penting.","Recheck the text after every significant change.","每次重要修改后重新检查文本。"]],
        ["Selepas menyemak fakta dan susunan hujah, penyunting memeriksa ejaan, tanda baca serta penggunaan istilah yang konsisten.","After checking facts and argument structure, the editor checks spelling, punctuation and consistent terminology.","检查事实和论证结构后，编辑再检查拼写、标点及术语使用是否一致。"],
        ["Jangan bergantung pada pemeriksa ejaan automatik sahaja kerana alat itu mungkin tidak mengesan kesalahan makna atau istilah yang betul tetapi tidak sesuai dalam konteks.","Do not rely only on automatic spellcheck because it may miss meaning errors or terms that are correct but unsuitable in context.","不要只依赖自动拼写检查，因为它可能无法发现语义错误，或在特定语境中不恰当但拼写正确的术语。"],
        [
          [["Apakah yang dinilai dalam semakan kandungan?","What is evaluated in a content review?","内容检查评估什么？"],[["Ketepatan fakta dan kelengkapan hujah","Factual accuracy and argument completeness","事实准确性和论证完整性"],["Warna latar halaman","Page background colour","页面背景颜色"],["Jenis papan kekunci","Keyboard type","键盘类型"],["Kelajuan menaip sahaja","Typing speed only","仅打字速度"]],0],
          [["Apakah fokus utama pruf akhir?","What is the main focus of final proofreading?","最终校对的主要重点是什么？"],[["Ejaan, tanda baca dan konsistensi","Spelling, punctuation and consistency","拼写、标点和一致性"],["Menukar semua idea","Changing every idea","更改所有观点"],["Menambah sumber tanpa semakan","Adding sources without checking","未经检查就添加来源"],["Memadam semua contoh","Deleting all examples","删除所有例子"]],0],
          [["Mengapakah teks perlu dibaca semula selepas pembetulan?","Why should a text be reread after corrections?","为什么修改后需要重新通读文本？"],[["Untuk memastikan pembetulan tidak menimbulkan kesalahan baharu","To ensure corrections have not introduced new errors","确保修改没有产生新错误"],["Untuk memanjangkan setiap ayat","To lengthen every sentence","拉长每个句子"],["Untuk mengubah tajuk secara rawak","To change the title randomly","随意更改标题"],["Untuk menghapuskan semua tanda baca","To remove all punctuation","删除所有标点"]],0]
        ])
    ]
  };
  for(const level of ["beginner","intermediate","advanced"]) base[level].push(...batch[level]);
  base.contentVersion="u3-ms-lessons-0.6.0";
  base.expansionBatches=[...(base.expansionBatches||[]),{version:"0.6.0",added:9,byLevel:{beginner:3,intermediate:3,advanced:3}}];
})();
