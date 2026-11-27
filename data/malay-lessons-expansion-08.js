/* SwiftDictionary U3.0 — Malay Lessons expansion batch 08.
 * Original Malaysian Standard Malay draft content; EN/ZH support is machine-assisted.
 * Owner linguistic and translation review remains reserved for staging review.
 */
(() => {
  const base=window.SWIFT_MALAY_LESSONS;
  if(!base) throw new Error("Load the Malay lesson foundation before batch 08.");
  const t=(ms,en,zh)=>({ms,en,zh});
  const make=(id,topic,title,summary,explanations,points,example,mistake,qs)=>({
    id,topic_id:id.replace(/^ms-[bia]-/,"ms-topic-"),topic:t(...topic),title:t(...title),summary:t(...summary),
    explanation:explanations.map(x=>t(...x)),points:points.map(x=>t(...x)),
    examples:[t(...example)],mistakes:[t(...mistake)],
    practices:qs.map(q=>({q:t(...q[0]),options:q[1].map(o=>t(...o)),answer:q[2]}))
  });
  const batch={
    beginner:[
      make("ms-b-transport-directions",
        ["Pengangkutan dan arah","Transport and directions","交通与方向"],
        ["Menyatakan cara perjalanan dan arah","Describing transport and directions","描述交通方式与方向"],
        ["Gunakan nama pengangkutan dan ungkapan arah untuk menerangkan perjalanan mudah.","Use transport words and direction expressions to describe a simple journey.","使用交通工具词汇和方向表达描述简单行程。"],
        [
          ["Nama pengangkutan termasuk bas, kereta api, teksi, motosikal dan feri. Gunakan kata kerja seperti menaiki, memandu atau berjalan kaki mengikut cara perjalanan.","Transport words include bus, train, taxi, motorcycle and ferry. Use verbs such as menaiki, memandu or berjalan kaki according to the mode of travel.","交通工具词汇包括巴士、火车、德士、摩托车和渡轮。根据出行方式使用menaiki、memandu或berjalan kaki等动词。"],
          ["Ungkapan arah seperti belok kiri, belok kanan, terus dan di sebelah membantu pendengar mengikuti laluan. Nyatakan mercu tanda jika perlu.","Direction expressions such as turn left, turn right, go straight and beside help listeners follow a route. Mention a landmark when useful.","belok kiri（左转）、belok kanan（右转）、terus（直走）和di sebelah（旁边）等方向表达有助于听者辨认路线。必要时说明地标。"]
        ],
        [["Pilih kata kerja yang sesuai dengan jenis pengangkutan.","Choose a verb that suits the mode of transport.","根据交通方式选择合适动词。"],["Susun arahan arah mengikut urutan perjalanan.","Put direction instructions in travel order.","按行程顺序排列方向指示。"]],
        ["Saya menaiki bas ke pusat bandar, kemudian berjalan kaki ke perpustakaan.","I take a bus to the city centre, then walk to the library.","我乘巴士到市中心，然后步行去图书馆。"],
        ["Jangan gunakan “memandu bas” apabila maksud anda ialah menjadi penumpang; gunakan “menaiki bas”.","Do not use “memandu bas” when you mean travelling as a passenger; use “menaiki bas”.","如果你指的是乘客而不是驾驶者，不要使用“memandu bas”，应使用“menaiki bas”。"],
        [
          [["Apakah maksud “belok kiri”?","What does “belok kiri” mean?","“belok kiri”是什么意思？"],[["Turn left","Turn left","左转"],["Turn right","Turn right","右转"],["Go straight","Go straight","直走"],["Stop here","Stop here","在这里停下"]],0],
          [["Kata kerja manakah sesuai untuk perjalanan sebagai penumpang bas?","Which verb suits travelling as a bus passenger?","作为巴士乘客出行应使用哪个动词？"],[["Menaiki","To board or ride","乘坐"],["Memandu","To drive","驾驶"],["Membaiki","To repair","修理"],["Membina","To build","建造"]],0],
          [["Pilih arahan yang paling jelas selepas tiba di simpang.","Choose the clearest instruction after reaching a junction.","到达路口后，选择最清楚的指示。"],[["Belok kanan di simpang itu.","Turn right at that junction.","在那个路口右转。"],["Simpang itu sangat menarik.","That junction is very interesting.","那个路口很有趣。"],["Saya suka menaiki bas.","I like taking the bus.","我喜欢乘巴士。"],["Jalan itu semalam.","That road yesterday.","那条路昨天。"]],0]
        ]),
      make("ms-b-shopping-quantities-prices",
        ["Membeli-belah dan harga","Shopping and prices","购物与价格"],
        ["Bertanya tentang harga dan kuantiti","Asking about prices and quantities","询问价格与数量"],
        ["Gunakan ungkapan sopan untuk bertanya harga, menyatakan bilangan dan membuat pilihan mudah.","Use polite expressions to ask prices, state quantities and make simple choices.","使用礼貌表达询问价格、说明数量并作出简单选择。"],
        [
          ["Gunakan “Berapakah harga …?” untuk bertanya harga dan “Saya mahu …” atau “Saya ingin …” untuk menyatakan pilihan.","Use “Berapakah harga …?” to ask the price and “Saya mahu …” or “Saya ingin …” to state a choice.","使用“Berapakah harga …?”询问价格，并用“Saya mahu …”或“Saya ingin …”表达选择。"],
          ["Penjodoh bilangan membantu menyatakan kuantiti, seperti sekilo beras, dua botol air dan tiga helai baju. Sebut mata wang dengan jelas apabila perlu.","Classifiers help express quantities, such as a kilogram of rice, two bottles of water and three pieces of clothing. State the currency clearly when needed.","量词有助于表达数量，例如sekilo beras（一公斤米）、dua botol air（两瓶水）和tiga helai baju（三件衣服）。必要时清楚说明货币单位。"]
        ],
        [["Gunakan soalan yang sesuai untuk mendapatkan maklumat harga.","Use a suitable question to obtain price information.","使用恰当问句询问价格。"],["Padankan penjodoh bilangan dengan benda yang dihitung.","Match a classifier to the item being counted.","根据所数物品选择量词。"]],
        ["Berapakah harga dua botol air mineral ini?","How much are these two bottles of mineral water?","这两瓶矿泉水多少钱？"],
        ["Jangan gunakan penjodoh bilangan secara rawak; pilih bentuk yang sesuai dengan jenis atau bentuk benda.","Do not choose classifiers randomly; select one that suits the type or shape of the item.","不要随意选择量词，应根据物品的类别或形状使用恰当量词。"],
        [
          [["Pilih soalan untuk bertanya harga.","Choose a question for asking the price.","选择询问价格的问句。"],[["Berapakah harga barang ini?","How much is this item?","这个商品多少钱？"],["Di manakah kamu tidur?","Where do you sleep?","你在哪里睡觉？"],["Bilakah kamu pulang?","When are you returning?","你什么时候回家？"],["Mengapakah pintu terbuka?","Why is the door open?","门为什么开着？"]],0],
          [["Penjodoh bilangan manakah sesuai untuk air mineral dalam botol?","Which classifier suits bottled mineral water?","瓶装矿泉水适合使用哪个量词？"],[["Botol","Bottle","瓶"],["Ekor","Animal","只"],["Orang","Person","位"],["Batang","Long object","支"],],0],
          [["Pilih ayat permintaan yang sopan.","Choose a polite request.","选择礼貌的请求句。"],[["Saya ingin membeli sekilo beras.","I would like to buy a kilogram of rice.","我想买一公斤米。"],["Beri saya itu sekarang!","Give me that now!","现在把那个给我！"],["Kamu mesti beri murah.","You must make it cheap.","你必须卖便宜点。"],["Saya tidak mahu bercakap.","I do not want to speak.","我不想说话。"]],0]
        ]),
      make("ms-b-time-and-routines",
        ["Masa dan rutin harian","Time and daily routines","时间与日常作息"],
        ["Menceritakan rutin mengikut waktu","Describing routines by time","按时间描述日常作息"],
        ["Gunakan ungkapan waktu dan kata kerja rutin untuk menceritakan kegiatan mengikut urutan.","Use time expressions and routine verbs to describe activities in sequence.","使用时间表达和日常动词按顺序描述活动。"],
        [
          ["Ungkapan seperti pada waktu pagi, pada tengah hari, pada waktu petang dan pada waktu malam membantu menetapkan masa sesuatu kegiatan.","Expressions such as in the morning, at noon, in the afternoon and at night establish when an activity takes place.","pada waktu pagi（早上）、pada tengah hari（中午）、pada waktu petang（傍晚）和pada waktu malam（晚上）等表达用于说明活动时间。"],
          ["Gunakan penanda urutan seperti mula-mula, kemudian, selepas itu dan akhirnya untuk menyusun rutin dengan jelas.","Use sequence markers such as first, then, after that and finally to organise a routine clearly.","使用mula-mula（首先）、kemudian（然后）、selepas itu（之后）和akhirnya（最后）等顺序标记，使作息描述清楚。"]
        ],
        [["Nyatakan waktu dengan ungkapan yang tepat.","State time with an accurate expression.","使用准确表达说明时间。"],["Susun kegiatan mengikut urutan yang munasabah.","Arrange activities in a logical order.","按合理顺序排列活动。"]],
        ["Mula-mula, saya bersarapan. Selepas itu, saya pergi ke sekolah pada pukul tujuh pagi.","First, I have breakfast. After that, I go to school at seven in the morning.","首先，我吃早餐。之后，我在早上七点去学校。"],
        ["Jangan gunakan penanda urutan yang bercanggah sehingga pembaca tidak dapat mengikuti kronologi.","Do not use conflicting sequence markers that make the chronology difficult to follow.","不要使用互相矛盾的顺序标记，以免读者无法理解时间先后。"],
        [
          [["Apakah maksud “akhirnya”?","What does “akhirnya” mean?","“akhirnya”是什么意思？"],[["Finally","Finally","最后"],["Yesterday","Yesterday","昨天"],["Usually","Usually","通常"],["Nearby","Nearby","附近"]],0],
          [["Ungkapan manakah merujuk waktu selepas tengah hari tetapi sebelum malam?","Which expression refers to the time after noon but before night?","哪个表达指中午之后、夜晚之前的时段？"],[["Pada waktu petang","In the afternoon/evening","傍晚"],["Pada waktu pagi","In the morning","早上"],["Pada tengah malam","At midnight","午夜"],["Pada awal pagi sahaja","Only at dawn","仅清晨"]],0],
          [["Pilih penanda yang sesuai untuk menunjukkan kegiatan kedua.","Choose a marker suitable for the second activity.","选择适合表示第二项活动的衔接词。"],[["Kemudian","Then","然后"],["Semalam","Yesterday","昨天"],["Mungkin","Perhaps","也许"],["Walaupun","Although","尽管"]],0]
        ])
    ],
    intermediate:[
      make("ms-i-active-passive-voice",
        ["Ayat aktif dan ayat pasif","Active and passive sentences","主动句与被动句"],
        ["Membezakan dan membina ayat aktif serta pasif","Distinguishing and forming active and passive sentences","区分并构建主动句与被动句"],
        ["Kenal pasti pelaku dan sasaran tindakan untuk memilih struktur aktif atau pasif yang sesuai.","Identify the actor and recipient of an action to choose a suitable active or passive structure.","辨认动作施事者与承受者，以选择恰当的主动或被动句式。"],
        [
          ["Ayat aktif menonjolkan pelaku sebagai subjek, contohnya “Pekerja itu membaiki mesin”. Ayat pasif menonjolkan sasaran tindakan, contohnya “Mesin itu dibaiki oleh pekerja”.","An active sentence foregrounds the actor as subject, for example, “The worker repairs the machine”. A passive sentence foregrounds the recipient, for example, “The machine is repaired by the worker”.","主动句以施事者为主语，例如“Pekerja itu membaiki mesin”。被动句突出动作承受者，例如“Mesin itu dibaiki oleh pekerja”。"],
          ["Dalam bahasa Melayu, bentuk pasif bergantung pada jenis kata ganti nama dan struktur ayat. Pastikan pelaku serta hubungan tindakan dinyatakan dengan tepat.","In Malay, passive forms depend on pronoun type and sentence structure. Ensure the actor and action relationship are expressed accurately.","马来语被动形式取决于代词类型和句子结构。应准确表达施事者与动作之间的关系。"]
        ],
        [["Kenal pasti pelaku, kata kerja dan objek sebelum menukar ayat.","Identify the actor, verb and object before transforming a sentence.","转换句子前先辨认施事者、动词和宾语。"],["Pilih bentuk pasif yang sesuai dengan struktur dan kata ganti nama.","Choose a passive form that suits the structure and pronoun.","根据句式和代词选择恰当的被动形式。"]],
        ["Laporan itu disediakan oleh pasukan penyelidik sebelum mesyuarat bermula.","The report was prepared by the research team before the meeting began.","会议开始前，研究团队准备了该报告。"],
        ["Jangan menukar ayat aktif kepada pasif dengan mengekalkan susunan kata secara mekanis; semak semula struktur dan fokus ayat.","Do not convert an active sentence into a passive one mechanically while keeping the same word order; review the sentence structure and focus.","不要机械地保留原语序来转换主动句与被动句；应重新检查句子结构和重点。"],
        [
          [["Dalam ayat aktif, unsur manakah lazimnya menjadi subjek?","In an active sentence, which element commonly serves as the subject?","主动句中通常哪个成分作主语？"],[["Pelaku tindakan","The actor","动作施事者"],["Tanda baca","Punctuation","标点"],["Kata hubung sahaja","Conjunction only","只有连词"],["Keterangan masa sahaja","Time expression only","只有时间状语"]],0],
          [["Apakah fokus utama ayat pasif?","What is the main focus of a passive sentence?","被动句的主要重点是什么？"],[["Sasaran atau penerima tindakan","The recipient of the action","动作承受者"],["Warna objek","The object's colour","物体颜色"],["Tempat penutur","The speaker's location","说话者地点"],["Bilangan perenggan","The number of paragraphs","段落数量"]],0],
          [["Pilih ayat pasif yang gramatis.","Choose the grammatical passive sentence.","选择语法正确的被动句。"],[["Dokumen itu disemak oleh pegawai tersebut.","The document was checked by that officer.","该文件由那名官员审核。"],["Pegawai itu oleh menyemak dokumen.","The officer by checks document.","官员由审核文件。"],["Dokumen itu menyemak pegawai.","The document checks the officer.","文件审核官员。"],["Disemak dokumen pegawai itu oleh.","Checked document officer by.","审核文件官员由。"]],0]
        ]),
      make("ms-i-compound-complex-sentences",
        ["Ayat majmuk dan hubungan klausa","Compound sentences and clause relationships","复合句与分句关系"],
        ["Menghubungkan klausa dengan tepat","Connecting clauses accurately","准确连接分句"],
        ["Gunakan kata hubung untuk membina ayat majmuk yang menunjukkan hubungan setara, sebab, syarat atau waktu.","Use conjunctions to form compound sentences expressing coordination, cause, condition or time.","使用连词构建复合句，表达并列、原因、条件或时间关系。"],
        [
          ["Ayat majmuk menggabungkan dua klausa atau lebih. Kata hubung seperti dan, tetapi, kerana, jika dan apabila menunjukkan hubungan yang berlainan.","A compound sentence combines two or more clauses. Conjunctions such as and, but, because, if and when express different relationships.","复合句由两个或更多分句组成。dan、tetapi、kerana、jika和apabila等连词表达不同关系。"],
          ["Pastikan setiap klausa mempunyai hubungan makna yang logik. Elakkan menggabungkan terlalu banyak idea tanpa tanda baca atau susunan yang membantu pembaca.","Ensure each clause has a logical semantic relationship. Avoid joining too many ideas without punctuation or an order that helps readers.","确保各分句之间具有合理的语义关系。避免在缺少标点或清晰结构的情况下堆叠过多观点。"]
        ],
        [["Pilih kata hubung berdasarkan hubungan antara klausa.","Choose a conjunction based on the relationship between clauses.","根据分句之间的关系选择连词。"],["Semak kelengkapan klausa dan tanda baca.","Check clause completeness and punctuation.","检查分句完整性和标点。"]],
        ["Jika keputusan diterima, pihak sekolah akan mengumumkan jadual baharu pada minggu hadapan.","If the decision is accepted, the school will announce the new schedule next week.","如果决定获批，校方将在下周公布新日程。"],
        ["Jangan gunakan kata hubung yang menunjukkan sebab apabila hubungan sebenar antara klausa ialah syarat.","Do not use a cause conjunction when the actual relationship between clauses is conditional.","如果分句之间实际是条件关系，就不要使用表示原因的连词。"],
        [
          [["Kata hubung manakah lazimnya memperkenalkan syarat?","Which conjunction commonly introduces a condition?","哪个连词通常引出条件？"],[["Jika","If","如果"],["Kerana","Because","因为"],["Tetapi","But","但是"],["Dan","And","和"]],0],
          [["Apakah fungsi “tetapi” dalam ayat majmuk?","What is the function of “tetapi” in a compound sentence?","“tetapi”在复合句中的作用是什么？"],[["Menunjukkan pertentangan","Showing contrast","表示转折"],["Menunjukkan sebab","Showing cause","表示原因"],["Menunjukkan tujuan sahaja","Showing purpose only","只表示目的"],["Menunjukkan bilangan","Showing quantity","表示数量"]],0],
          [["Pilih ayat yang menggunakan kata hubung dengan tepat.","Choose the sentence that uses a conjunction accurately.","选择连词使用准确的句子。"],[["Saya akan hadir jika urusan selesai.","I will attend if the matter is settled.","如果事情处理完毕，我就会出席。"],["Saya hadir kerana jika hujan.","I attend because if rain.","我出席因为如果下雨。"],["Dia membaca tetapi kerana buku.","He reads but because book.","他阅读但是因为书。"],["Mereka dan apabila ke sekolah.","They and when to school.","他们和当去学校。"]],0]
        ]),
      make("ms-i-formal-correspondence",
        ["Surat dan e-mel rasmi","Formal letters and emails","正式信函与电子邮件"],
        ["Menyusun surat dan e-mel rasmi","Structuring formal letters and emails","组织正式信函与电子邮件"],
        ["Susun tujuan, maklumat sokongan dan penutup dalam komunikasi rasmi dengan bahasa yang sopan.","Organise the purpose, supporting information and closing in formal communication using polite language.","在正式沟通中以礼貌语言组织目的、支持信息和结尾。"],
        [
          ["Komunikasi rasmi lazimnya mempunyai tajuk atau perkara, sapaan, tujuan, butiran yang berkaitan dan penutup. Susunan ini membantu penerima memahami permintaan.","Formal communication commonly includes a subject, greeting, purpose, relevant details and closing. This structure helps the recipient understand the request.","正式沟通常包含主题、称呼、目的、相关细节和结尾。这样的结构有助于收件人理解请求。"],
          ["Gunakan kata ganti nama dan bentuk sapaan yang sesuai dengan penerima. Elakkan singkatan tidak rasmi, bahasa percakapan dan arahan yang terlalu keras.","Use pronouns and forms of address suited to the recipient. Avoid informal abbreviations, colloquial language and overly harsh commands.","根据收件人选择合适的代词和称呼。避免使用非正式缩写、口语和过于强硬的指令。"]
        ],
        [["Nyatakan tujuan pada bahagian awal dengan jelas.","State the purpose clearly near the beginning.","在开头清楚说明目的。"],["Gunakan penutup yang sopan dan sesuai dengan urusan.","Use a polite closing suited to the matter.","使用符合事务性质的礼貌结尾。"]],
        ["Saya ingin memohon pengesahan bahawa dokumen yang dihantar telah diterima oleh pihak tuan/puan.","I would like to request confirmation that the submitted document has been received.","我想请贵方确认已收到所提交的文件。"],
        ["Jangan gunakan singkatan sembang atau panggilan terlalu santai dalam e-mel yang ditujukan kepada pihak rasmi.","Do not use chat abbreviations or overly casual forms of address in an email to an official recipient.","写给正式机构的电子邮件中，不要使用聊天缩写或过于随意的称呼。"],
        [
          [["Apakah unsur yang membantu penerima mengenal pasti tujuan e-mel?","Which element helps the recipient identify an email's purpose?","哪个部分有助于收件人了解邮件目的？"],[["Perkara atau tajuk yang jelas","A clear subject line","清楚的主题"],["Hiasan warna","Colour decoration","颜色装饰"],["Nama fail rawak","A random file name","随机文件名"],["Emoji sahaja","Emoji only","只有表情符号"]],0],
          [["Pilih ungkapan yang sesuai untuk komunikasi rasmi.","Choose an expression suitable for formal communication.","选择适合正式沟通的表达。"],[["Saya ingin memohon maklumat lanjut.","I would like to request further information.","我想进一步索取相关资料。"],["Weh, cepat balas.","Hey, reply quickly.","喂，快点回复。"],["Kau kena buat sekarang.","You have to do it now.","你现在必须做。"],["Apa hal dengan kamu?","What's your problem?","你怎么回事？"]],0],
          [["Apakah tujuan penutup yang sopan?","What is the purpose of a polite closing?","礼貌结尾的作用是什么？"],[["Mengakhiri komunikasi dengan tertib","To end communication courteously","有礼貌地结束沟通"],["Mengubah tujuan asal","To change the original purpose","改变原本目的"],["Menghapuskan maklumat penting","To remove important information","删除重要信息"],["Memanjangkan e-mel tanpa sebab","To lengthen the email without reason","无故延长邮件"]],0]
        ])
    ],
    advanced:[
      make("ms-a-source-credibility",
        ["Penilaian kewibawaan sumber","Evaluating source credibility","评估资料来源的可信度"],
        ["Menilai sumber dan bukti secara kritis","Critically evaluating sources and evidence","批判性评估资料来源与证据"],
        ["Nilai kewibawaan sumber berdasarkan pengarang, bukti, tarikh, tujuan dan pengesahan silang.","Evaluate source credibility through authorship, evidence, date, purpose and cross-checking.","从作者、证据、日期、目的和交叉核实等方面评估资料来源的可信度。"],
        [
          ["Sumber yang boleh dipercayai lazimnya menyatakan pengarang atau organisasi, tarikh penerbitan, kaedah mendapatkan maklumat dan rujukan yang boleh disemak.","A credible source commonly identifies its author or organisation, publication date, information-gathering method and verifiable references.","可信来源通常会注明作者或机构、发布日期、信息获取方法及可核查的参考资料。"],
          ["Bezakan dakwaan, pendapat dan bukti. Bandingkan maklumat dengan sumber bebas yang berwibawa, khususnya apabila dakwaan itu penting atau luar biasa.","Distinguish claims, opinions and evidence. Compare information with independent authoritative sources, especially when a claim is important or unusual.","区分主张、观点和证据。尤其当主张重要或不寻常时，应与独立且权威的来源进行比较。"]
        ],
        [["Semak identiti dan kepakaran pengarang atau organisasi.","Check the identity and expertise of the author or organisation.","核查作者或机构的身份与专业背景。"],["Sahkan dakwaan melalui bukti dan sumber bebas.","Verify claims through evidence and independent sources.","通过证据和独立来源核实主张。"]],
        ["Sebelum memetik statistik itu, penyelidik menyemak metodologi laporan dan membandingkan angkanya dengan data daripada agensi lain.","Before citing the statistic, the researcher checked the report's methodology and compared its figures with data from another agency.","引用该统计数据前，研究人员先检查报告的方法，并将数字与另一机构的数据进行比较。"],
        ["Jangan menganggap sesuatu dakwaan benar hanya kerana banyak laman mengulanginya; semak sama ada semuanya bergantung pada sumber asal yang sama.","Do not assume a claim is true merely because many websites repeat it; check whether they all rely on the same original source.","不要因为许多网站重复某项主张就认定它属实；应检查这些网站是否都依赖同一个原始来源。"],
        [
          [["Faktor manakah membantu menilai kewibawaan sumber?","Which factor helps evaluate source credibility?","哪个因素有助于评估来源可信度？"],[["Kaedah dan bukti yang boleh disemak","Verifiable methods and evidence","可核查的方法与证据"],["Jumlah warna pada halaman","The number of colours on the page","页面颜色数量"],["Panjang tajuk sahaja","Title length only","只有标题长度"],["Bilangan perkongsian tanpa konteks","Share count without context","没有语境的分享次数"]],0],
          [["Mengapakah pengesahan silang penting?","Why is cross-checking important?","为什么交叉核实很重要？"],[["Untuk membandingkan dakwaan dengan sumber bebas","To compare claims with independent sources","将主张与独立来源比较"],["Untuk memastikan semua sumber menyalin ayat sama","To ensure all sources copy the same wording","确保所有来源复制相同措辞"],["Untuk mengelakkan pembacaan bukti","To avoid reading evidence","避免阅读证据"],["Untuk menggantikan metodologi","To replace methodology","取代研究方法"]],0],
          [["Apakah tindakan wajar apabila beberapa laman mengulang dakwaan yang sama?","What should be done when several websites repeat the same claim?","多个网站重复同一主张时，恰当的做法是什么？"],[["Mengesan sumber asal dan menilai buktinya","Trace the original source and assess its evidence","追查原始来源并评估其证据"],["Menganggap dakwaan itu pasti benar","Assume the claim is certainly true","认定该主张必然属实"],["Mengabaikan tarikh penerbitan","Ignore publication dates","忽略发布日期"],["Memilih laman paling berwarna","Choose the most colourful website","选择颜色最鲜艳的网站"]],0]
        ]),
      make("ms-a-register-and-genre",
        ["Penyesuaian laras dan genre","Adapting register and genre","调整语域与文体"],
        ["Menyesuaikan laras bahasa dengan tujuan dan khalayak","Adapting register to purpose and audience","根据目的与受众调整语域"],
        ["Pilih laras, struktur dan tahap formaliti berdasarkan tujuan komunikasi, khalayak dan genre penulisan.","Choose register, structure and formality according to communication purpose, audience and writing genre.","根据沟通目的、受众和写作体裁选择语域、结构及正式程度。"],
        [
          ["Laporan, surat rasmi, rencana dan mesej peribadi mempunyai tujuan serta konvensi yang berbeza. Penulis perlu menyesuaikan pilihan kata, susunan maklumat dan nada.","Reports, formal letters, articles and personal messages have different purposes and conventions. Writers should adapt vocabulary, information order and tone.","报告、正式信函、文章和私人信息具有不同目的与规范。作者应调整词汇、信息顺序和语气。"],
          ["Laras formal menuntut ketepatan dan kesantunan, manakala komunikasi tidak formal boleh lebih santai jika hubungan dan keadaan mengizinkannya. Formaliti tidak bermaksud ayat mesti kabur atau berbelit.","Formal register requires precision and courtesy, while informal communication can be more relaxed when the relationship and situation allow. Formality does not mean sentences must be vague or convoluted.","正式语域要求准确与礼貌；若关系和情境允许，非正式沟通可以更轻松。正式并不意味着句子必须含糊或冗长。"]
        ],
        [["Kenal pasti khalayak dan tujuan sebelum menulis.","Identify the audience and purpose before writing.","写作前先确定受众和目的。"],["Kekalkan laras yang konsisten dalam satu dokumen.","Maintain a consistent register within a document.","在同一文件中保持语域一致。"]],
        ["Dalam laporan kepada pihak pengurusan, penulis menyatakan dapatan, bukti dan cadangan menggunakan bahasa yang neutral serta teratur.","In a report to management, the writer presents findings, evidence and recommendations in neutral, organised language.","向管理层提交报告时，作者以中立且有条理的语言陈述发现、证据和建议。"],
        ["Jangan mencampurkan sapaan santai dan singkatan perbualan ke dalam laporan rasmi tanpa sebab yang sesuai.","Do not mix casual greetings and chat abbreviations into a formal report without a suitable reason.","没有恰当理由时，不要在正式报告中混用随意称呼和聊天缩写。"],
        [
          [["Apakah faktor utama dalam pemilihan laras bahasa?","What is a key factor in choosing a register?","选择语域时的关键因素是什么？"],[["Tujuan dan khalayak","Purpose and audience","目的与受众"],["Warna kertas","Paper colour","纸张颜色"],["Bilangan huruf dalam nama","Number of letters in a name","姓名字母数量"],["Jenis papan kekunci","Keyboard type","键盘类型"]],0],
          [["Apakah ciri bahasa laporan rasmi?","What is a feature of formal report language?","正式报告语言有什么特点？"],[["Neutral, tepat dan teratur","Neutral, precise and organised","中立、准确且有条理"],["Penuh singkatan sembang","Full of chat abbreviations","充满聊天缩写"],["Tidak mempunyai tujuan","Having no purpose","没有目的"],["Menggunakan sapaan rawak","Using random greetings","使用随意称呼"]],0],
          [["Mengapakah laras perlu konsisten dalam dokumen?","Why should register be consistent within a document?","为什么文件中的语域应保持一致？"],[["Supaya nada dan jangkaan pembaca terpelihara","To maintain tone and reader expectations","保持语气并符合读者预期"],["Supaya semua ayat sama panjang","To make every sentence the same length","让每个句子长度相同"],["Supaya bukti boleh dibuang","So evidence can be removed","以便删除证据"],["Supaya tajuk berubah","So the title changes","让标题改变"]],0]
        ]),
      make("ms-a-argument-structure",
        ["Struktur hujah yang koheren","Coherent argument structure","连贯的论证结构"],
        ["Menyusun tesis, alasan dan bukti secara koheren","Organising a thesis, reasons and evidence coherently","连贯组织论点、理由与证据"],
        ["Bina hujah dengan pendirian yang jelas, alasan tersusun, bukti relevan dan kesimpulan yang sepadan.","Build an argument with a clear position, ordered reasons, relevant evidence and a fitting conclusion.","通过明确立场、有序理由、相关证据和恰当结论构建论证。"],
        [
          ["Pernyataan tesis menerangkan pendirian utama. Setiap perenggan isi sebaik-baiknya mempunyai satu fokus, alasan yang menyokongnya dan bukti atau contoh yang relevan.","A thesis statement explains the main position. Each body paragraph should ideally have one focus, supporting reasoning and relevant evidence or examples.","论点陈述说明主要立场。每个正文段落最好围绕一个重点，并提供支持理由及相关证据或例子。"],
          ["Susun alasan daripada yang paling sesuai atau kukuh mengikut tujuan penulisan. Kesimpulan perlu merumuskan hujah tanpa memperkenalkan dakwaan baharu yang tidak dibincangkan.","Order reasons according to their suitability or strength for the writing purpose. The conclusion should synthesise the argument without introducing new claims that were not discussed.","根据写作目的，按适切性或说服力排列理由。结论应综合论证，不应引入未讨论的新主张。"]
        ],
        [["Pastikan setiap perenggan menyumbang kepada tesis.","Ensure every paragraph contributes to the thesis.","确保每个段落都服务于中心论点。"],["Sokong dakwaan dengan bukti yang berkaitan dan boleh dinilai.","Support claims with relevant and assessable evidence.","使用相关且可评估的证据支持主张。"]],
        ["Cadangan itu wajar dipertimbangkan kerana dapat mengurangkan pembaziran; dapatan audit dan anggaran kos menunjukkan manfaatnya boleh diukur.","The proposal deserves consideration because it can reduce waste; audit findings and cost estimates show that its benefits can be measured.","该提案值得考虑，因为它能够减少浪费；审计结果和成本估算显示其效益可以量化。"],
        ["Jangan memasukkan contoh yang menarik tetapi tidak menyokong tesis kerana hal itu melemahkan kesatuan hujah.","Do not include an interesting example that does not support the thesis, as it weakens the unity of the argument.","不要加入有趣却无法支持中心论点的例子，因为这会削弱论证的统一性。"],
        [
          [["Apakah fungsi pernyataan tesis?","What is the function of a thesis statement?","论点陈述的作用是什么？"],[["Menyatakan pendirian utama","State the main position","说明主要立场"],["Menggantikan semua bukti","Replace all evidence","取代所有证据"],["Menyenaraikan tanda baca","List punctuation","列出标点"],["Mengulang tajuk sahaja","Only repeat the title","只重复标题"]],0],
          [["Apakah yang patut menyokong dakwaan dalam perenggan isi?","What should support a claim in a body paragraph?","正文段落中的主张应由什么支持？"],[["Alasan dan bukti yang relevan","Relevant reasons and evidence","相关理由与证据"],["Contoh yang tiada kaitan","Unrelated examples","无关例子"],["Pendapat tanpa penjelasan","Opinion without explanation","没有解释的观点"],["Pengulangan tajuk","Repeating the title","重复标题"]],0],
          [["Apakah ciri kesimpulan yang berkesan?","What is a feature of an effective conclusion?","有效结论具有什么特点？"],[["Merumuskan hujah yang telah dibincangkan","Synthesise the argument already discussed","总结已经讨论的论证"],["Memperkenalkan banyak dakwaan baharu","Introduce many new claims","引入许多新主张"],["Mengabaikan tesis","Ignore the thesis","忽略中心论点"],["Menyalin perenggan pertama sepenuhnya","Copy the first paragraph entirely","完整复制第一段"]],0]
        ])
    ]
  };
  for(const level of ["beginner","intermediate","advanced"]) base[level].push(...batch[level]);
  base.contentVersion="u3-ms-lessons-0.8.0";
  base.expansionBatches=[...(base.expansionBatches||[]),{version:"0.8.0",added:9,byLevel:{beginner:3,intermediate:3,advanced:3}}];
})();
