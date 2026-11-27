/* SwiftDictionary U3.0 — Malay Lessons expansion batch 04.
 * Original Malaysian Standard Malay draft content; EN/ZH support is machine-assisted.
 * Owner linguistic and translation review is reserved for staging review.
 */
(() => {
  const base=window.SWIFT_MALAY_LESSONS;
  if(!base) throw new Error("Load the Malay lesson foundation before batch 04.");
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
      make("ms-b-weather-and-clothing",
        ["Cuaca dan pakaian","Weather and clothing","天气与衣着"],
        ["Membincangkan cuaca dan pakaian","Talking about weather and clothing","谈论天气与衣着"],
        ["Gunakan kata adjektif dan ungkapan mudah untuk menerangkan keadaan cuaca serta pakaian yang sesuai.","Use simple adjectives and expressions to describe weather and suitable clothing.","使用简单形容词和表达描述天气及合适的衣着。"],
        [
          ["Kata seperti panas, sejuk, hujan, berangin dan mendung menerangkan keadaan cuaca. Gunakan pola “Hari ini cuaca panas” atau “Di luar sedang hujan”.","Words such as hot, cold, rainy, windy and cloudy describe the weather. Use patterns such as “The weather is hot today” or “It is raining outside”.","panas（热）、sejuk（冷）、hujan（下雨）、berangin（有风）和mendung（阴天）等词描述天气。可使用“今天天气很热”或“外面正在下雨”等句型。"],
          ["Untuk menyatakan kesesuaian, gunakan “sesuai untuk” atau “lebih baik memakai”. Contohnya, payung sesuai digunakan ketika hujan.","To express suitability, use “suitable for” or “it is better to wear”. For example, an umbrella is suitable in rainy weather.","表达适合程度时，可使用“sesuai untuk”（适合）或“lebih baik memakai”（最好穿戴）。例如，下雨时适合使用雨伞。"]
        ],
        [["Pilih kata adjektif yang tepat untuk keadaan yang diterangkan.","Choose an adjective that matches the described condition.","选择符合所描述情况的形容词。"],["Gunakan “ketika” atau “apabila” untuk menghubungkan cuaca dengan tindakan.","Use “ketika” or “apabila” to connect weather with an action.","使用“ketika”或“apabila”连接天气与行动。"]],
        ["Cuaca mendung dan mungkin hujan. Bawa payung sebelum keluar.","It is cloudy and may rain. Take an umbrella before going out.","天气阴沉，可能会下雨。出门前带上雨伞。"],
        ["Jangan gunakan “cuaca hujan” untuk semua keadaan; “hujan sedang turun” atau “hari ini hujan” lebih semula jadi.","Do not use “cuaca hujan” for every situation; “hujan sedang turun” or “hari ini hujan” is more natural.","不要在所有情况下都使用“cuaca hujan”；“hujan sedang turun”或“hari ini hujan”更自然。"],
        [
          [["Apakah perkataan yang sesuai untuk keadaan langit yang dilitupi awan?","Which word describes a sky covered with clouds?","哪个词形容天空布满云？"],[["mendung","cloudy","阴天"],["kering","dry","干燥"],["sempit","narrow","狭窄"],["tajam","sharp","锋利"]],0],
          [["Lengkapkan ayat: “Ketika hujan, eloklah kita membawa ___.”","Complete the sentence: “When it rains, it is good to bring an ___.”","完成句子：“下雨时，我们最好带上___。”"],[["payung","umbrella","雨伞"],["bantal","pillow","枕头"],["sudu","spoon","勺子"],["dompet","wallet","钱包"]],0],
          [["Pilih ayat yang paling semula jadi.","Choose the most natural sentence.","选择最自然的句子。"],[["Hari ini cuaca sangat panas.","The weather is very hot today.","今天天气很热。"],["Hari ini cuaca memakai panas.","Today weather wears hot.","今天天气穿着热。"],["Panas hari ini cuaca kepada.","Hot today weather to.","热今天天气给。"],["Cuaca sangat membawa panas.","Weather very carries hot.","天气非常带着热。"]],0]
        ]),
      make("ms-b-transport-and-travel",
        ["Pengangkutan dan perjalanan","Transport and travel","交通与出行"],
        ["Menyatakan cara perjalanan","Describing how to travel","描述出行方式"],
        ["Bina ayat mudah tentang pengangkutan, destinasi dan tempoh perjalanan.","Build simple sentences about transport, destinations and journey duration.","用简单句子说明交通方式、目的地和行程时间。"],
        [
          ["Kata nama seperti bas, kereta api, teksi dan basikal menamakan jenis pengangkutan. Gunakan kata kerja “menaiki”, “mengambil” atau “memandu” mengikut konteks.","Nouns such as bus, train, taxi and bicycle name forms of transport. Use verbs such as “take”, “board” or “drive” according to context.","bas（巴士）、kereta api（火车）、teksi（出租车）和basikal（自行车）等名词表示交通工具。根据语境使用“menaiki”“mengambil”或“memandu”等动词。"],
          ["Gunakan “ke” untuk destinasi dan “dari” untuk tempat asal. Tempoh boleh dinyatakan dengan “selama”, seperti “Perjalanan mengambil masa selama dua jam”.","Use “ke” for a destination and “dari” for an origin. Duration can be expressed with “selama”, as in “The journey takes two hours”.","目的地前使用“ke”，出发地点前使用“dari”。可用“selama”表达持续时间，例如“行程需要两个小时”。"]
        ],
        [["Nyatakan alat pengangkutan dengan kata kerja yang sesuai.","Name the transport and use an appropriate verb.","使用恰当动词说明交通工具。"],["Bezakan destinasi dengan tempat asal: ke sekolah, dari rumah.","Distinguish destination from origin: to school, from home.","区分目的地与出发地点：ke sekolah（去学校）、dari rumah（从家里）。"]],
        ["Saya menaiki bas dari rumah ke pusat bandar. Perjalanan mengambil masa kira-kira tiga puluh minit.","I take the bus from home to the city centre. The journey takes about thirty minutes.","我从家里乘巴士前往市中心。行程大约需要三十分钟。"],
        ["Jangan tukar “ke” dan “dari”; kedua-duanya menunjukkan arah hubungan yang berbeza.","Do not interchange “ke” and “dari”; they express different directions of movement.","不要混淆“ke”和“dari”；两者表示不同的移动方向。"],
        [
          [["Kata sendi manakah yang menandakan destinasi?","Which preposition marks a destination?","哪个介词表示目的地？"],[["ke","to","去／到"],["dari","from","从"],["dengan","with","和／用"],["tanpa","without","没有"]],0],
          [["Pilih kata kerja yang sesuai: “Saya ___ kereta ke tempat kerja.”","Choose the suitable verb: “I ___ a car to work.”","选择合适动词：“我___汽车去上班。”"],[["memandu","drive","驾驶"],["meminum","drink","喝"],["menjahit","sew","缝"],["menyapu","sweep","扫"]],0],
          [["Ayat manakah menyatakan tempoh perjalanan?","Which sentence states journey duration?","哪句话说明行程时间？"],[["Perjalanan mengambil masa dua jam.","The journey takes two hours.","行程需要两个小时。"],["Perjalanan di sebelah kiri.","The journey is on the left.","行程在左边。"],["Perjalanan warna biru.","The journey is blue.","行程是蓝色的。"],["Perjalanan tanpa destinasi.","The journey without a destination.","没有目的地的行程。"]],0]
        ]),
      make("ms-b-health-and-appointments",
        ["Kesihatan dan janji temu","Health and appointments","健康与预约"],
        ["Berkomunikasi tentang janji temu","Communicating about appointments","沟通预约事项"],
        ["Pelajari ungkapan asas untuk membuat janji temu dan menerangkan keperluan umum.","Learn basic expressions for making appointments and describing general needs.","学习预约及说明一般需求的基本表达。"],
        [
          ["Gunakan “Saya ingin membuat janji temu” untuk meminta masa lawatan. Nyatakan tarikh atau masa dengan jelas, contohnya “pada hari Isnin” atau “pukul sepuluh pagi”.","Use “I would like to make an appointment” to request a visit time. State the date or time clearly, such as “on Monday” or “at ten in the morning”.","可用“Saya ingin membuat janji temu”表达预约请求。清楚说明日期或时间，例如“pada hari Isnin”或“pukul sepuluh pagi”。"],
          ["Untuk urusan umum, frasa “Saya kurang sihat” atau “Saya ingin berjumpa doktor” menyampaikan keperluan tanpa membuat diagnosis. Ikut arahan petugas kesihatan tentang urusan seterusnya.","For general situations, “I am not feeling well” or “I would like to see a doctor” communicates a need without making a diagnosis. Follow healthcare staff instructions for next steps.","一般情况下，“Saya kurang sihat”或“Saya ingin berjumpa doktor”可以表达需求，而不自行作出诊断。后续应遵循医护人员的指示。"]
        ],
        [["Gunakan ungkapan sopan seperti “bolehkah” dan “saya ingin”.","Use polite expressions such as “bolehkah” and “saya ingin”.","使用“bolehkah”和“saya ingin”等礼貌表达。"],["Sebut tarikh dan masa untuk mengelakkan kekeliruan.","State the date and time to avoid confusion.","说明日期和时间以避免混淆。"]],
        ["Selamat pagi. Saya ingin membuat janji temu dengan doktor pada hari Khamis, jika ada kekosongan.","Good morning. I would like to make an appointment with the doctor on Thursday, if there is an available slot.","早上好。如果有空档，我想预约星期四看医生。"],
        ["Jangan anggap ungkapan umum tentang kesihatan sebagai diagnosis; gunakan bahasa neutral dan dapatkan nasihat profesional.","Do not treat general health expressions as a diagnosis; use neutral language and seek professional advice.","不要把一般健康表达当作诊断；使用中性措辞并寻求专业意见。"],
        [
          [["Pilih ungkapan yang sesuai untuk meminta janji temu.","Choose an appropriate expression to request an appointment.","选择适合预约的表达。"],[["Saya ingin membuat janji temu.","I would like to make an appointment.","我想预约。"],["Saya menutup tingkap temu.","I close the appointment window.","我关闭预约窗口。"],["Saya memasak janji temu.","I cook an appointment.","我烹饪预约。"],["Saya melukis pukul doktor.","I draw the doctor's time.","我画医生的时间。"]],0],
          [["Apakah maklumat yang membantu mengelakkan kekeliruan semasa membuat janji temu?","What information helps avoid confusion when making an appointment?","预约时哪些信息有助于避免混淆？"],[["Tarikh dan masa","Date and time","日期和时间"],["Warna pakaian","Clothing colour","衣服颜色"],["Jenis muzik","Type of music","音乐类型"],["Nama makanan","Food name","食物名称"]],0],
          [["Pilih ayat yang sopan.","Choose the polite sentence.","选择礼貌的句子。"],[["Bolehkah saya bertanya tentang waktu yang tersedia?","May I ask about the available times?","我可以询问可预约的时间吗？"],["Berikan masa sekarang juga!","Give me a time right now!","现在马上给我时间！"],["Saya tidak mahu mendengar.","I do not want to listen.","我不想听。"],["Semua masa mesti milik saya.","All times must belong to me.","所有时间都必须属于我。"]],0]
        ])
    ],
    intermediate:[
      make("ms-i-reported-speech",
        ["Cakap ajuk dan cakap pindah","Direct and reported speech","直接引语与间接引语"],
        ["Melaporkan kata-kata orang lain","Reporting what others said","转述他人的话"],
        ["Kenali perbezaan petikan langsung dengan laporan tidak langsung serta perubahan kata ganti dan penunjuk masa.","Distinguish direct quotation from indirect reporting and notice changes to pronouns and time references.","区分直接引语与间接转述，并留意代词和时间指示语的变化。"],
        [
          ["Cakap ajuk memetik kata-kata seseorang secara langsung dan lazimnya menggunakan tanda petik. Cakap pindah menyampaikan maksud ujaran tanpa mengekalkan bentuk asal sepenuhnya.","Direct speech quotes a person's exact words, usually with quotation marks. Reported speech conveys the meaning without fully retaining the original form.","直接引语引用某人的原话，通常使用引号。间接引语传达话语意思，但不完全保留原句形式。"],
          ["Apabila menukar bentuk, sesuaikan kata ganti nama, kata penunjuk masa dan tempat mengikut sudut pandang pelapor. Kata hubung “bahawa” boleh memperkenalkan kandungan yang dilaporkan.","When changing forms, adjust pronouns and time/place references to the reporter's viewpoint. The conjunction “bahawa” can introduce the reported content.","转换形式时，应根据转述者的视角调整代词、时间和地点指示语。连词“bahawa”可引出转述内容。"]
        ],
        [["Kekalkan maksud asal walaupun struktur ayat berubah.","Preserve the original meaning even when sentence structure changes.","即使句子结构改变，也要保留原意。"],["Semak rujukan masa dan kata ganti berdasarkan konteks pelaporan.","Check time references and pronouns against the reporting context.","根据转述语境检查时间指示语和代词。"]],
        ["Aina berkata, “Saya akan datang esok.” → Aina berkata bahawa dia akan datang pada keesokan harinya.","Aina said, “I will come tomorrow.” → Aina said that she would come the following day.","Aina说：“我明天会来。”→ Aina表示她会在第二天到来。"],
        ["Jangan menukar “esok” secara mekanik tanpa memeriksa masa ujaran asal dan masa laporan dibuat.","Do not mechanically change “tomorrow” without checking when the original statement was made and when it is reported.","不要机械地替换“明天”；应先确认原话和转述发生的时间。"],
        [
          [["Apakah ciri utama cakap ajuk?","What is a key feature of direct speech?","直接引语的主要特点是什么？"],[["Memetik kata-kata secara langsung.","Quoting the exact words directly.","直接引用原话。"],["Menghapuskan semua kata kerja.","Removing all verbs.","删除所有动词。"],["Menyenaraikan kata secara rawak.","Listing words randomly.","随机列出词语。"],["Mengubah maksud asal.","Changing the original meaning.","改变原意。"]],0],
          [["Kata hubung manakah boleh memperkenalkan kandungan yang dilaporkan?","Which conjunction can introduce reported content?","哪个连词可以引出转述内容？"],[["bahawa","that","即／说"],["tetapi","but","但是"],["kerana","because","因为"],["walaupun","although","虽然"]],0],
          [["Apakah yang perlu diperiksa ketika menukar cakap ajuk kepada cakap pindah?","What should be checked when converting direct to reported speech?","把直接引语转换为间接引语时应检查什么？"],[["Kata ganti nama dan rujukan masa.","Pronouns and time references.","代词和时间指示语。"],["Warna tanda petik sahaja.","Only the colour of quotation marks.","仅引号的颜色。"],["Panjang setiap huruf.","The length of every letter.","每个字母的长度。"],["Bilangan perenggan sahaja.","Only the number of paragraphs.","仅段落数量。"]],0]
        ]),
      make("ms-i-modality-and-obligation",
        ["Kehendak, keupayaan dan kewajipan","Intention, ability and obligation","意愿、能力与义务"],
        ["Menggunakan kata bantu ragam","Using modal auxiliaries","使用情态助动词"],
        ["Bezakan kata bantu yang menyatakan keupayaan, kemungkinan, keizinan, kehendak dan kewajipan.","Distinguish modal words expressing ability, possibility, permission, intention and obligation.","区分表示能力、可能性、许可、意愿和义务的情态词。"],
        [
          ["Kata “boleh” boleh menyatakan keupayaan atau keizinan bergantung pada konteks. “Mungkin” menandakan kemungkinan, manakala “mesti” dan “perlu” menyatakan kewajipan atau keperluan.","“Boleh” can express ability or permission depending on context. “Mungkin” signals possibility, while “mesti” and “perlu” express obligation or necessity.","“Boleh”可根据语境表示能力或许可。“Mungkin”表示可能性，“mesti”和“perlu”表示义务或必要性。"],
          ["“Ingin” dan “hendak” menyatakan kehendak atau niat. Pilih bentuk yang sesuai dengan tahap ketegasan dan kesopanan; permintaan boleh dilembutkan dengan “bolehkah” atau “sila”.","“Ingin” and “hendak” express desire or intention. Choose a form suited to the level of firmness and politeness; requests can be softened with “bolehkah” or “sila”.","“Ingin”和“hendak”表示意愿或打算。根据语气强度和礼貌程度选择形式；可用“bolehkah”或“sila”使请求更委婉。"]
        ],
        [["Tentukan maksud kata bantu berdasarkan konteks ayat.","Determine a modal word's meaning from the sentence context.","根据句子语境判断情态词的含义。"],["Gunakan bentuk yang lebih sopan apabila meminta bantuan atau keizinan.","Use a more polite form when asking for help or permission.","请求帮助或许可时使用更礼貌的形式。"]],
        ["Anda boleh menggunakan bilik ini, tetapi anda mesti memastikan pintunya dikunci selepas digunakan.","You may use this room, but you must ensure its door is locked after use.","你可以使用这个房间，但使用后必须确保门已锁好。"],
        ["Jangan anggap “boleh” sentiasa bermaksud keupayaan; dalam konteks tertentu, maksudnya ialah keizinan.","Do not assume “boleh” always means ability; in some contexts it means permission.","不要认为“boleh”总是表示能力；在某些语境中，它表示许可。"],
        [
          [["Kata manakah paling jelas menyatakan kewajipan?","Which word most clearly expresses obligation?","哪个词最明确表示义务？"],[["mesti","must","必须"],["mungkin","maybe","可能"],["ingin","want","想要"],["pernah","ever","曾经"]],0],
          [["Dalam ayat “Kamu boleh masuk sekarang”, apakah maksud “boleh”?","In “You may enter now”, what does “boleh” mean?","在“Kamu boleh masuk sekarang”中，“boleh”是什么意思？"],[["Keizinan","Permission","许可"],["Kewajipan","Obligation","义务"],["Masa lampau","Past time","过去时间"],["Penafian","Negation","否定"]],0],
          [["Pilih permintaan yang lebih sopan.","Choose the more polite request.","选择更礼貌的请求。"],[["Bolehkah anda membantu saya?","Could you help me?","您可以帮我吗？"],["Kamu mesti membantu saya sekarang!","You must help me now!","你现在必须帮我！"],["Buat kerja ini tanpa bertanya!","Do this without asking!","不准问，做这件事！"],["Saya mahu semuanya serta-merta!","I want everything immediately!","我立刻就要全部！"]],0]
        ]),
      make("ms-i-relative-clauses",
        ["Ayat relatif","Relative clauses","关系从句"],
        ["Mengembangkan ayat dengan kata relatif","Expanding sentences with relative words","使用关系词扩展句子"],
        ["Gunakan kata relatif “yang” untuk memberikan maklumat tambahan tentang orang, benda atau perkara.","Use the relative word “yang” to add information about a person, object or matter.","使用关系词“yang”为人物、事物或事项补充信息。"],
        [
          ["Kata “yang” menghubungkan kata nama dengan penerangan yang mengikutinya. Penerangan itu boleh menyatakan ciri, tindakan atau identiti.","“Yang” links a noun to a following description. The description may state a quality, action or identity.","“Yang”连接名词与后续说明。说明内容可以描述特征、动作或身份。"],
          ["Ayat relatif membantu menggabungkan maklumat yang berkaitan tanpa mengulang kata nama secara tidak perlu. Pastikan penerangan selepas “yang” merujuk kata nama yang betul.","Relative clauses combine related information without unnecessary repetition of a noun. Ensure the description after “yang” refers to the correct noun.","关系从句有助于整合相关信息，避免不必要地重复名词。应确保“yang”之后的说明指向正确的名词。"]
        ],
        [["Letakkan penerangan selepas kata nama yang diterangkan.","Place the description after the noun it modifies.","把说明放在被修饰名词之后。"],["Pastikan rujukan “yang” jelas dan tidak mengelirukan.","Make sure the reference of “yang” is clear and unambiguous.","确保“yang”的指向清楚，不产生歧义。"]],
        ["Pelajar yang memenangi pertandingan itu menerima sijil daripada pihak sekolah.","The student who won the competition received a certificate from the school.","赢得比赛的学生获得了校方颁发的证书。"],
        ["Elakkan meletakkan penerangan terlalu jauh daripada kata nama sehingga rujukannya menjadi kabur.","Avoid placing a description so far from its noun that the reference becomes unclear.","避免把说明放得离名词太远，以致指向变得模糊。"],
        [
          [["Apakah fungsi utama “yang” dalam ayat relatif?","What is the main function of “yang” in a relative clause?","“yang”在关系从句中的主要作用是什么？"],[["Menghubungkan kata nama dengan penerangan.","Linking a noun to a description.","连接名词与说明。"],["Menunjukkan bilangan.","Showing quantity.","表示数量。"],["Menandakan masa lampau sahaja.","Marking only past time.","仅标记过去时间。"],["Menggantikan semua kata kerja.","Replacing all verbs.","替代所有动词。"]],0],
          [["Pilih ayat relatif yang betul.","Choose the correct relative-clause sentence.","选择正确的关系从句句子。"],[["Buku yang saya pinjam itu menarik.","The book that I borrowed is interesting.","我借的那本书很有趣。"],["Yang buku saya pinjam itu menarik.","That book I borrow interesting.","那本书我借有趣。"],["Buku menarik yang itu saya.","Book interesting that I.","书有趣那我。"],["Saya yang buku itu pinjam menarik.","I that book borrow interesting.","我那本书借有趣。"]],0],
          [["Mengapakah rujukan “yang” perlu jelas?","Why must the reference of “yang” be clear?","为什么“yang”的指向必须清楚？"],[["Supaya pembaca tahu kata nama yang diterangkan.","So readers know which noun is described.","让读者知道说明的是哪个名词。"],["Supaya ayat sentiasa lebih panjang.","So sentences are always longer.","让句子总是更长。"],["Supaya semua kata nama digugurkan.","So all nouns are omitted.","让所有名词都省略。"],["Supaya tanda baca tidak digunakan.","So punctuation is not used.","让句子不使用标点。"]],0]
        ])
    ],
    advanced:[
      make("ms-a-register-and-audience",
        ["Laras dan khalayak","Register and audience","语体与受众"],
        ["Memilih laras bahasa mengikut khalayak","Choosing register for an audience","根据受众选择语体"],
        ["Sesuaikan pilihan kata, struktur dan nada dengan tujuan komunikasi serta hubungan penulis dengan pembaca.","Adapt vocabulary, structure and tone to the communication purpose and the writer's relationship with the reader.","根据沟通目的及作者与读者的关系调整词汇、结构和语气。"],
        [
          ["Laras rasmi lazimnya menggunakan bentuk lengkap, istilah tepat dan nada terkawal. Laras tidak rasmi boleh menggunakan ungkapan lebih santai apabila hubungan dan situasi mengizinkannya.","Formal register generally uses complete forms, precise terminology and a controlled tone. Informal register may use more relaxed expressions when the relationship and situation allow.","正式语体通常使用完整形式、准确术语和克制语气。若关系和场合允许，非正式语体可以使用较轻松的表达。"],
          ["Pemilihan laras bukan sekadar menggantikan perkataan. Susunan maklumat, tahap kesantunan, kata ganti nama dan bentuk sapaan juga perlu sepadan dengan khalayak.","Register choice is not merely word substitution. Information order, politeness, pronouns and forms of address should also suit the audience.","语体选择不只是替换词语。信息顺序、礼貌程度、代词和称呼方式也应符合受众。"]
        ],
        [["Kenal pasti tujuan, pembaca dan saluran sebelum menulis.","Identify the purpose, audience and medium before writing.","写作前确认目的、读者和传播渠道。"],["Kekalkan ketepatan fakta dalam kedua-dua laras.","Maintain factual accuracy in both registers.","无论何种语体都要保持事实准确。"]],
        ["Rasmi: “Pihak kami memohon kerjasama tuan/puan untuk mengemukakan borang sebelum 15 Mei.” Tidak rasmi: “Boleh hantar borang itu sebelum 15 Mei?”","Formal: “We request your cooperation in submitting the form before 15 May.” Informal: “Could you send the form before 15 May?”","正式：“本方恳请阁下于5月15日前提交表格。”非正式：“可以在5月15日前把表格交来吗？”"],
        ["Jangan menyamakan laras tidak rasmi dengan bahasa yang cuai; mesej santai masih perlu jelas dan menghormati pembaca.","Do not equate informal register with careless language; a casual message should still be clear and respectful.","不要把非正式语体等同于粗心表达；轻松的信息仍应清楚并尊重读者。"],
        [
          [["Apakah faktor utama dalam pemilihan laras bahasa?","What is a key factor in choosing a register?","选择语体时的关键因素是什么？"],[["Tujuan dan khalayak","Purpose and audience","目的与受众"],["Panjang nama penulis","Length of the writer's name","作者姓名长度"],["Warna kertas","Paper colour","纸张颜色"],["Bilangan gambar sahaja","Only the number of images","仅图片数量"]],0],
          [["Ciri manakah lebih sesuai untuk surat rasmi?","Which feature is more suitable for a formal letter?","哪项特征更适合正式信函？"],[["Bahasa tepat dan nada terkawal","Precise language and a controlled tone","准确用语与克制语气"],["Slanga tanpa penjelasan","Unexplained slang","未经解释的俚语"],["Singkatan rawak","Random abbreviations","随意缩写"],["Sapaan yang tidak sesuai","Inappropriate forms of address","不恰当的称呼"]],0],
          [["Apakah prinsip yang kekal penting dalam semua laras?","What principle remains important in every register?","所有语体都必须遵守什么原则？"],[["Kejelasan dan ketepatan","Clarity and accuracy","清晰与准确"],["Ayat mesti panjang","Sentences must be long","句子必须很长"],["Semua istilah mesti teknikal","All terms must be technical","所有术语都必须专业"],["Tiada tanda baca","No punctuation","不使用标点"]],0]
        ]),
      make("ms-a-editing-and-error-correction",
        ["Penyuntingan dan pembetulan bahasa","Editing and language correction","编辑与语言修订"],
        ["Menyunting teks secara sistematik","Editing text systematically","系统地编辑文本"],
        ["Gunakan beberapa peringkat semakan untuk meningkatkan ketepatan, kejelasan, keselarasan dan kebolehbacaan teks.","Use several review stages to improve a text's accuracy, clarity, consistency and readability.","通过多个检查阶段提升文本的准确性、清晰度、一致性和可读性。"],
        [
          ["Semakan awal menilai tujuan, susunan idea dan kelengkapan hujah. Semakan ayat pula meneliti tatabahasa, pilihan kata, hubungan rujukan dan tanda baca.","An initial review assesses purpose, idea order and argument completeness. Sentence-level editing examines grammar, word choice, references and punctuation.","初步检查评估目的、观点顺序和论证完整性。句子层面的编辑则检查语法、选词、指代关系和标点。"],
          ["Baca teks sekali lagi selepas pembetulan untuk mengesan kesilapan baharu. Pastikan istilah, ejaan nama khas, angka, tarikh dan format digunakan secara konsisten.","Read the text again after corrections to catch new errors. Ensure terminology, proper-name spelling, numbers, dates and formatting are consistent.","修改后再次通读文本，以发现新错误。确保术语、专有名称拼写、数字、日期和格式保持一致。"]
        ],
        [["Semak kandungan dan struktur sebelum membetulkan perkara kecil.","Review content and structure before correcting minor details.","先检查内容和结构，再处理细节。"],["Jangan ubah fakta atau maksud ketika menyunting gaya.","Do not change facts or meaning while editing style.","编辑文风时不要改变事实或原意。"]],
        ["Selepas semakan struktur, penyunting membetulkan ayat yang kabur dan menyeragamkan istilah dalam seluruh laporan.","After the structural review, the editor corrects unclear sentences and standardises terminology throughout the report.","完成结构检查后，编辑者修正含糊句子，并统一整份报告中的术语。"],
        ["Jangan bergantung pada semakan ejaan automatik sahaja; alat tersebut mungkin tidak mengesan kesalahan makna atau rujukan.","Do not rely only on automatic spell-checking; such tools may miss errors of meaning or reference.","不要只依赖自动拼写检查；这类工具可能无法发现语义或指代错误。"],
        [
          [["Apakah yang wajar disemak terlebih dahulu dalam penyuntingan menyeluruh?","What should be reviewed first in comprehensive editing?","全面编辑时应先检查什么？"],[["Tujuan dan struktur kandungan","Purpose and content structure","目的与内容结构"],["Warna fon","Font colour","字体颜色"],["Jarak selepas setiap huruf","Spacing after every letter","每个字母后的间距"],["Bilangan halaman sahaja","Only the page count","仅页数"]],0],
          [["Mengapakah teks perlu dibaca semula selepas pembetulan?","Why should a text be reread after corrections?","为什么修改后要重新通读文本？"],[["Untuk mengesan kesilapan baharu atau kesan sampingan pembetulan.","To detect new errors or side effects of edits.","发现新错误或修改带来的问题。"],["Untuk menambah ayat tanpa tujuan.","To add sentences without purpose.","无目的地增加句子。"],["Untuk menukar semua istilah.","To change every term.","更换所有术语。"],["Untuk menghapuskan semua tanda baca.","To remove all punctuation.","删除所有标点。"]],0],
          [["Apakah batas penting ketika menyunting gaya?","What is an important constraint when editing style?","编辑文风时的重要原则是什么？"],[["Kekalkan fakta dan maksud asal.","Preserve facts and original meaning.","保留事实与原意。"],["Ubah angka supaya lebih menarik.","Change numbers to make them more interesting.","为了吸引人而修改数字。"],["Gugurkan bukti yang tidak sehaluan.","Remove evidence that disagrees.","删除不一致的证据。"],["Tukar nama orang tanpa sebab.","Change people's names without reason.","无故更改人名。"]],0]
        ]),
      make("ms-a-proposal-and-persuasive-writing",
        ["Penulisan cadangan dan pujukan","Proposal and persuasive writing","提案与说服性写作"],
        ["Membina cadangan yang meyakinkan","Building a persuasive proposal","撰写有说服力的提案"],
        ["Susun masalah, bukti, pilihan tindakan dan manfaat supaya cadangan dapat dinilai secara rasional.","Organise the problem, evidence, action options and benefits so a proposal can be assessed rationally.","组织问题、证据、行动方案和益处，使提案能够得到理性评估。"],
        [
          ["Cadangan yang baik menerangkan masalah secara khusus, mengenal pasti pihak yang terlibat dan menyatakan objektif yang boleh dinilai. Elakkan dakwaan umum tanpa skop yang jelas.","A good proposal explains the problem specifically, identifies stakeholders and states assessable objectives. Avoid broad claims without a clear scope.","良好的提案会具体说明问题、识别相关方，并提出可评估的目标。避免范围不清的笼统论断。"],
          ["Sokong pilihan tindakan dengan bukti yang relevan, kos atau sumber yang diperlukan, risiko dan manfaat. Akhiri dengan langkah pelaksanaan serta ukuran kejayaan.","Support the proposed action with relevant evidence, required costs or resources, risks and benefits. End with implementation steps and measures of success.","用相关证据、所需成本或资源、风险和益处支持行动方案。最后说明实施步骤和成功衡量指标。"]
        ],
        [["Bezakan fakta, andaian dan cadangan.","Distinguish facts, assumptions and recommendations.","区分事实、假设和建议。"],["Nyatakan manfaat bersama kekangan dan risiko secara seimbang.","State benefits alongside limitations and risks in a balanced way.","平衡说明益处、限制和风险。"]],
        ["Cadangan ini mencadangkan percubaan selama tiga bulan. Kejayaannya akan dinilai melalui kadar penyertaan, maklum balas pengguna dan kos operasi.","This proposal recommends a three-month pilot. Its success will be assessed through participation rates, user feedback and operating costs.","本提案建议开展为期三个月的试行计划，并通过参与率、用户反馈和运营成本评估成效。"],
        ["Jangan menggunakan bahasa pujukan untuk menyembunyikan kos, risiko atau bukti yang bercanggah.","Do not use persuasive language to conceal costs, risks or conflicting evidence.","不要利用说服性语言隐瞒成本、风险或相互矛盾的证据。"],
        [
          [["Bahagian manakah patut menerangkan masalah yang ingin diselesaikan?","Which section should explain the problem to be solved?","哪一部分应说明需要解决的问题？"],[["Pernyataan masalah","Problem statement","问题陈述"],["Hiasan muka depan","Cover decoration","封面装饰"],["Senarai lampiran sahaja","Appendix list only","仅附件清单"],["Ucapan penutup tanpa konteks","Closing remarks without context","没有背景的结束语"]],0],
          [["Apakah yang menjadikan cadangan lebih boleh dinilai?","What makes a proposal more assessable?","什么能让提案更容易评估？"],[["Objektif dan ukuran kejayaan yang jelas","Clear objectives and success measures","明确目标与成功指标"],["Janji umum tanpa ukuran","General promises without measures","没有衡量标准的笼统承诺"],["Pengulangan slogan","Repeated slogans","重复口号"],["Mengabaikan kos","Ignoring costs","忽略成本"]],0],
          [["Apakah amalan yang paling beretika dalam penulisan pujukan?","What is the most ethical persuasive-writing practice?","说服性写作中最符合伦理的做法是什么？"],[["Menyatakan bukti, risiko dan batasan secara seimbang.","Presenting evidence, risks and limitations in a balanced way.","平衡呈现证据、风险和限制。"],["Menyembunyikan bukti yang tidak menyokong.","Hiding evidence that does not support the proposal.","隐瞒不支持提案的证据。"],["Membesar-besarkan hasil yang belum diuji.","Exaggerating untested outcomes.","夸大尚未验证的结果。"],["Menggunakan angka tanpa sumber.","Using numbers without sources.","使用没有来源的数字。"]],0]
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
  base.contentVersion="u3-ms-lessons-0.4.0";
  base.expansionBatches=(base.expansionBatches||[]).concat([{id:"batch-04",added:9,reviewStatus:"draft"}]);
})();
