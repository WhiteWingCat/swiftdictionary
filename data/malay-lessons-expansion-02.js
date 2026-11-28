/* SwiftDictionary U3.0 — Malay Lessons expansion batch 02.
 * Original draft content in Malaysian Standard Malay. Translation support is machine-assisted.
 * Owner linguistic and independent translation review is scheduled for staging review.
 */
(() => {
  const base=window.SWIFT_MALAY_LESSONS;
  if(!base) throw new Error("Malay lesson foundation must load before its expansion.");
  const batch={
    beginner:[
      {
        id:"ms-b-daily-routine",topic_id:"ms-daily-routine",
        topic:{ms:"Rutin harian",en:"Daily routines",zh:"日常作息"},
        title:{ms:"Menceritakan rutin harian",en:"Talking about daily routines",zh:"描述日常作息"},
        summary:{ms:"Gunakan kata kerja dan penanda waktu untuk menceritakan kegiatan harian.",en:"Use verbs and time expressions to describe everyday activities.",zh:"使用动词和时间表达描述日常活动。"},
        explanation:[
          {ms:"Kata kerja seperti bangun, bersarapan, bekerja dan berehat menyatakan kegiatan. Gunakan penanda waktu seperti pada waktu pagi, kemudian dan pada waktu malam untuk menyusun cerita.",en:"Verbs such as wake up, have breakfast, work and rest describe activities. Use time expressions such as in the morning, then and at night to organise a description.",zh:"bangun、bersarapan、bekerja和berehat等动词表示活动。使用pada waktu pagi、kemudian和pada waktu malam等时间表达组织叙述。"},
          {ms:"Kata kerja bahasa Melayu tidak berubah mengikut orang atau bilangan. Kata ganti nama dan konteks membantu menjelaskan pelaku.",en:"Malay verbs do not change according to person or number. Pronouns and context help identify the doer.",zh:"马来语动词不随人称或数量变化。代词和语境帮助说明动作执行者。"}
        ],
        points:[{ms:"Susun kegiatan mengikut urutan masa.",en:"Arrange activities in time order.",zh:"按时间顺序排列活动。"},{ms:"Gunakan kata kerja yang tepat untuk setiap kegiatan.",en:"Choose an accurate verb for each activity.",zh:"为每项活动选择准确的动词。"}],
        examples:[{ms:"Saya bangun pada pukul enam, bersarapan, kemudian pergi ke tempat kerja.",en:"I wake up at six, have breakfast, and then go to work.",zh:"我六点起床、吃早餐，然后去上班。"}],
        mistakes:[{ms:"Jangan menambah akhiran kata kerja semata-mata untuk membezakan “saya” dengan “mereka”.",en:"Do not add verb endings merely to distinguish “I” from “they”.",zh:"不要仅为了区分“我”和“他们”而给动词添加词尾。"}],
        practices:[
          {q:{ms:"Pilih kata kerja yang sesuai: Saya ___ pada pukul enam pagi.",en:"Choose the suitable verb: I ___ at six in the morning.",zh:"选择合适的动词：Saya ___ pada pukul enam pagi。"},options:[{ms:"bangun",en:"wake up",zh:"起床"},{ms:"semalam",en:"last night",zh:"昨晚"},{ms:"kerana",en:"because",zh:"因为"},{ms:"cantik",en:"beautiful",zh:"漂亮"}],answer:0},
          {q:{ms:"Perkataan manakah menunjukkan urutan selepas sesuatu kegiatan?",en:"Which word indicates what happens after an activity?",zh:"哪个词表示某项活动之后发生的事情？"},options:[{ms:"kemudian",en:"then",zh:"然后"},{ms:"tetapi",en:"but",zh:"但是"},{ms:"walaupun",en:"although",zh:"虽然"},{ms:"sangat",en:"very",zh:"非常"}],answer:0},
          {q:{ms:"Pilih ayat yang tersusun mengikut urutan masa.",en:"Choose the sentence arranged in time order.",zh:"选择按时间顺序组织的句子。"},options:[{ms:"Saya mandi, kemudian bersarapan.",en:"I shower, then have breakfast.",zh:"我洗澡，然后吃早餐。"},{ms:"Kemudian saya kerana mandi.",en:"Then I because shower.",zh:"然后我因为洗澡。"},{ms:"Bersarapan mandi saya kemudian.",en:"Breakfast shower I then.",zh:"吃早餐洗澡我然后。"},{ms:"Saya kemudian sangat bersarapan mandi.",en:"I then very breakfast shower.",zh:"我然后非常早餐洗澡。"}],answer:0}
        ]
      },
      {
        id:"ms-b-time-and-days",topic_id:"ms-time-and-days",
        topic:{ms:"Masa dan hari",en:"Time and days",zh:"时间与星期"},
        title:{ms:"Menyatakan masa dan hari",en:"Telling the time and days",zh:"表达时间和星期"},
        summary:{ms:"Pelajari penggunaan pukul, hari dan kata sendi masa dalam ayat mudah.",en:"Learn to use clock times, days and time prepositions in simple sentences.",zh:"学习在简单句中使用钟点、星期和时间介词。"},
        explanation:[
          {ms:"Gunakan “pukul” sebelum waktu pada jam, contohnya pukul lapan. Nama hari seperti Isnin dan Jumaat ditulis dengan huruf besar pada awal nama.",en:"Use “pukul” before a clock time, for example pukul lapan. Day names such as Isnin and Jumaat begin with a capital letter.",zh:"钟点前使用“pukul”，例如pukul lapan。Isnin和Jumaat等星期名称首字母大写。"},
          {ms:"“Pada hari Isnin” menyatakan hari, manakala “pada pukul lapan” menyatakan waktu tertentu.",en:"“Pada hari Isnin” gives a day, while “pada pukul lapan” gives a specific time.",zh:"“Pada hari Isnin”表示星期，“pada pukul lapan”表示具体时间。"}
        ],
        points:[{ms:"Gunakan “pukul” untuk menyebut waktu jam.",en:"Use “pukul” to state a clock time.",zh:"使用“pukul”表达钟点。"},{ms:"Bezakan hari, tarikh dan waktu.",en:"Distinguish a day, date and time.",zh:"区分星期、日期和时间。"}],
        examples:[{ms:"Kelas bermula pada pukul sembilan pagi, hari Selasa.",en:"The class starts at nine in the morning on Tuesday.",zh:"课程于星期二上午九点开始。"}],
        mistakes:[{ms:"Jangan gunakan “pukul” sebelum nama hari; gunakan “pada hari”.",en:"Do not put “pukul” before a day name; use “pada hari”.",zh:"星期名称前不要使用“pukul”；应使用“pada hari”。"}],
        practices:[
          {q:{ms:"Pilih frasa yang betul untuk menyatakan jam 7:00.",en:"Choose the correct phrase for 7:00.",zh:"选择表达七点整的正确短语。"},options:[{ms:"pukul tujuh",en:"seven o'clock",zh:"七点"},{ms:"hari tujuh",en:"day seven",zh:"第七天"},{ms:"tujuh hari",en:"seven days",zh:"七天"},{ms:"pada Isnin",en:"on Monday",zh:"星期一"}],answer:0},
          {q:{ms:"Apakah nama hari selepas Rabu?",en:"Which day comes after Wednesday?",zh:"星期三之后是哪一天？"},options:[{ms:"Khamis",en:"Thursday",zh:"星期四"},{ms:"Selasa",en:"Tuesday",zh:"星期二"},{ms:"Ahad",en:"Sunday",zh:"星期日"},{ms:"Isnin",en:"Monday",zh:"星期一"}],answer:0},
          {q:{ms:"Pilih ayat yang menggunakan kata sendi masa dengan betul.",en:"Choose the sentence with the time preposition used correctly.",zh:"选择正确使用时间介词的句子。"},options:[{ms:"Mesyuarat bermula pada pukul sepuluh.",en:"The meeting starts at ten o'clock.",zh:"会议十点开始。"},{ms:"Mesyuarat bermula pukul hari Selasa.",en:"The meeting starts o'clock day Tuesday.",zh:"会议开始钟点星期二。"},{ms:"Mesyuarat bermula di pukul sepuluh.",en:"The meeting starts at-at ten.",zh:"会议在于十点。"},{ms:"Mesyuarat bermula kepada hari Selasa.",en:"The meeting starts to Tuesday.",zh:"会议向星期二开始。"}],answer:0}
        ]
      },
      {
        id:"ms-b-food-and-ordering",topic_id:"ms-food-and-ordering",
        topic:{ms:"Makanan dan pesanan",en:"Food and ordering",zh:"食物与点餐"},
        title:{ms:"Memesan makanan dengan sopan",en:"Ordering food politely",zh:"礼貌地点餐"},
        summary:{ms:"Gunakan ayat permintaan yang mudah ketika memesan makanan dan minuman.",en:"Use simple request sentences when ordering food and drinks.",zh:"点餐和饮料时使用简单的请求句。"},
        explanation:[
          {ms:"Gunakan “Saya mahu …” untuk menyatakan pilihan. Dalam situasi layanan, “Saya ingin …” atau “Boleh saya pesan …?” kedengaran lebih sopan.",en:"Use “Saya mahu …” to state a choice. In service situations, “Saya ingin …” or “Boleh saya pesan …?” sounds more polite.",zh:"使用“Saya mahu …”表达选择。在服务场合，“Saya ingin …”或“Boleh saya pesan …?”听起来更礼貌。"},
          {ms:"Gunakan “tanpa” untuk menyatakan sesuatu yang tidak mahu dimasukkan, contohnya “tanpa gula”.",en:"Use “tanpa” to say that you do not want an ingredient included, for example “tanpa gula”.",zh:"使用“tanpa”表示不需要加入某种材料，例如“tanpa gula”。"}
        ],
        points:[{ms:"Mulakan permintaan dengan ungkapan yang sopan.",en:"Begin a request with a polite expression.",zh:"以礼貌表达开始请求。"},{ms:"Nyatakan pilihan atau pengubahsuaian dengan jelas.",en:"State choices or changes clearly.",zh:"清楚说明选择或调整要求。"}],
        examples:[{ms:"Boleh saya pesan teh ais tanpa gula, tolong?",en:"Could I order iced tea without sugar, please?",zh:"请问我可以点一杯无糖冰茶吗？"}],
        mistakes:[{ms:"Pastikan perkataan “tanpa” diikuti perkara yang tidak mahu dimasukkan.",en:"Make sure “tanpa” is followed by the item to be left out.",zh:"确保“tanpa”后面接不需要加入的东西。"}],
        practices:[
          {q:{ms:"Ungkapan manakah paling sesuai untuk membuat pesanan dengan sopan?",en:"Which expression is most suitable for ordering politely?",zh:"哪种表达最适合礼貌地点餐？"},options:[{ms:"Boleh saya pesan …?",en:"May I order …?",zh:"我可以点……吗？"},{ms:"Beri sekarang!",en:"Give it now!",zh:"现在给我！"},{ms:"Pergi sana!",en:"Go there!",zh:"去那边！"},{ms:"Saya tidak tahu.",en:"I do not know.",zh:"我不知道。"}],answer:0},
          {q:{ms:"Apakah maksud “tanpa gula”?",en:"What does “tanpa gula” mean?",zh:"“tanpa gula”是什么意思？"},options:[{ms:"without sugar",en:"without sugar",zh:"不加糖"},{ms:"extra sugar",en:"extra sugar",zh:"加糖"},{ms:"brown sugar",en:"brown sugar",zh:"红糖"},{ms:"sugar water",en:"sugar water",zh:"糖水"}],answer:0},
          {q:{ms:"Pilih ayat pesanan yang jelas.",en:"Choose the clear ordering sentence.",zh:"选择表达清楚的点餐句子。"},options:[{ms:"Saya ingin nasi goreng tanpa cili.",en:"I would like fried rice without chilli.",zh:"我想要不加辣椒的炒饭。"},{ms:"Saya tanpa ingin nasi.",en:"I without want rice.",zh:"我不加想饭。"},{ms:"Nasi kepada saya kerana.",en:"Rice to me because.",zh:"饭给我因为。"},{ms:"Cili pukul minum.",en:"Chilli clock drink.",zh:"辣椒钟点喝。"}],answer:0}
        ]
      }
    ],
    intermediate:[
      {
        id:"ms-i-aspek-perbuatan",topic_id:"ms-aspect",
        topic:{ms:"Aspek perbuatan",en:"Aspect of actions",zh:"动作体"},
        title:{ms:"Menyatakan perbuatan yang sedang dan telah berlaku",en:"Describing ongoing and completed actions",zh:"表达正在进行和已经完成的动作"},
        summary:{ms:"Bezakan penggunaan sedang, telah dan akan berdasarkan masa serta konteks.",en:"Distinguish sedang, telah and akan according to time and context.",zh:"根据时间和语境区分sedang、telah和akan。"},
        explanation:[
          {ms:"“Sedang” menandakan perbuatan yang berlangsung pada waktu yang dirujuk, contohnya “Mereka sedang berbincang”.",en:"“Sedang” marks an action in progress at the time being discussed, as in “Mereka sedang berbincang”.",zh:"“Sedang”表示所指时间正在进行的动作，例如“Mereka sedang berbincang”。"},
          {ms:"“Telah” menandakan perbuatan yang sudah berlaku, manakala “akan” merujuk perbuatan yang belum berlaku pada masa hadapan.",en:"“Telah” marks an action that has happened, while “akan” refers to an action in the future.",zh:"“Telah”表示动作已经发生，“akan”表示未来将发生的动作。"}
        ],
        points:[{ms:"Pilih penanda aspek berdasarkan masa yang dimaksudkan.",en:"Choose an aspect marker based on the intended time.",zh:"根据所表达的时间选择体标记。"},{ms:"Kata kerja kekal dalam bentuk yang sesuai selepas penanda aspek.",en:"Keep the verb in the appropriate form after the aspect marker.",zh:"体标记后面的动词保持适当形式。"}],
        examples:[{ms:"Pasukan itu sedang berlatih, telah menyiapkan jadual dan akan bertanding esok.",en:"The team is training, has prepared the schedule and will compete tomorrow.",zh:"队伍正在训练，已经完成日程安排，并将在明天参赛。"}],
        mistakes:[{ms:"Jangan gunakan “telah” bersama penanda masa hadapan seperti “esok” jika maksud ayat bercanggah.",en:"Do not combine “telah” with a future time such as “tomorrow” when the meanings conflict.",zh:"如果语义冲突，不要把“telah”与“esok”等未来时间表达搭配。"}],
        practices:[
          {q:{ms:"Pilih penanda yang sesuai: Mereka ___ menunggu bas sekarang.",en:"Choose the suitable marker: They ___ waiting for the bus now.",zh:"选择合适的标记：Mereka ___ menunggu bas sekarang。"},options:[{ms:"sedang",en:"currently",zh:"正在"},{ms:"telah",en:"already",zh:"已经"},{ms:"akan",en:"will",zh:"将要"},{ms:"pernah",en:"once/ever",zh:"曾经"}],answer:0},
          {q:{ms:"Penanda manakah sesuai untuk perbuatan yang sudah selesai?",en:"Which marker suits an action that has already been completed?",zh:"哪个标记适用于已经完成的动作？"},options:[{ms:"telah",en:"already",zh:"已经"},{ms:"sedang",en:"currently",zh:"正在"},{ms:"akan",en:"will",zh:"将要"},{ms:"masih",en:"still",zh:"仍然"}],answer:0},
          {q:{ms:"Pilih ayat yang merujuk masa hadapan.",en:"Choose the sentence referring to the future.",zh:"选择指向未来的句子。"},options:[{ms:"Kami akan berangkat esok.",en:"We will depart tomorrow.",zh:"我们明天出发。"},{ms:"Kami telah berangkat semalam.",en:"We departed yesterday.",zh:"我们昨天已经出发。"},{ms:"Kami sedang berangkat sekarang.",en:"We are departing now.",zh:"我们现在正在出发。"},{ms:"Kami sudah tiba tadi.",en:"We arrived earlier.",zh:"我们刚才已经抵达。"}],answer:0}
        ]
      },
      {
        id:"ms-i-kata-sendi",topic_id:"ms-prepositions",
        topic:{ms:"Kata sendi nama",en:"Prepositions",zh:"介词"},
        title:{ms:"Memilih kata sendi nama yang tepat",en:"Choosing the right preposition",zh:"选择恰当的介词"},
        summary:{ms:"Gunakan di, ke, dari dan kepada mengikut hubungan tempat, arah dan penerima.",en:"Use di, ke, dari and kepada for location, direction and recipients.",zh:"根据地点、方向和接受者的关系使用di、ke、dari和kepada。"},
        explanation:[
          {ms:"“Di” menunjukkan tempat, “ke” menunjukkan arah atau destinasi, manakala “dari” menunjukkan tempat atau arah asal.",en:"“Di” indicates a location, “ke” indicates a direction or destination, and “dari” indicates a place or direction of origin.",zh:"“Di”表示地点，“ke”表示方向或目的地，“dari”表示地点或方向的来源。"},
          {ms:"“Kepada” digunakan untuk penerima, khususnya manusia atau pihak yang menerima sesuatu, seperti “surat kepada pengurus”.",en:"“Kepada” is used for a recipient, especially a person or party receiving something, as in “surat kepada pengurus”.",zh:"“Kepada”用于接受者，尤其是接收事物的人或单位，例如“surat kepada pengurus”。"}
        ],
        points:[{ms:"Bezakan tempat berada dengan arah pergerakan.",en:"Distinguish a location from a direction of movement.",zh:"区分所在地点和移动方向。"},{ms:"Gunakan “kepada” apabila menandakan penerima.",en:"Use “kepada” to identify a recipient.",zh:"标示接受者时使用“kepada”。"}],
        examples:[{ms:"Mereka bergerak dari pejabat ke dewan dan menyerahkan dokumen kepada penyelia.",en:"They move from the office to the hall and hand the document to the supervisor.",zh:"他们从办公室前往礼堂，并把文件交给主管。"}],
        mistakes:[{ms:"Dalam penggunaan standard, kata sendi nama “di” untuk tempat ditulis terpisah daripada kata nama; imbuhan “di-” pada kata kerja pasif pula dirapatkan.",en:"In standard usage, the preposition “di” for a place is written separately; the passive prefix “di-” is attached to the verb.",zh:"标准用法中，表示地点的介词“di”与名词分开书写；被动前缀“di-”则与动词连写。"}],
        practices:[
          {q:{ms:"Pilih kata sendi yang betul: Buku itu terletak ___ atas meja.",en:"Choose the correct preposition: The book is ___ the table.",zh:"选择正确介词：Buku itu terletak ___ atas meja。"},options:[{ms:"di",en:"on/at",zh:"在"},{ms:"ke",en:"to",zh:"去"},{ms:"dari",en:"from",zh:"从"},{ms:"kepada",en:"to (recipient)",zh:"给"}],answer:0},
          {q:{ms:"Kata sendi manakah menandakan destinasi?",en:"Which preposition indicates a destination?",zh:"哪个介词表示目的地？"},options:[{ms:"ke",en:"to",zh:"到"},{ms:"di",en:"at/in",zh:"在"},{ms:"dari",en:"from",zh:"从"},{ms:"oleh",en:"by",zh:"由"}],answer:0},
          {q:{ms:"Pilih ayat yang menggunakan “kepada” dengan tepat.",en:"Choose the sentence that uses “kepada” correctly.",zh:"选择正确使用“kepada”的句子。"},options:[{ms:"Saya menghantar e-mel kepada pensyarah.",en:"I send an email to the lecturer.",zh:"我给讲师发送电子邮件。"},{ms:"Saya tinggal kepada rumah.",en:"I live to house.",zh:"我住给房子。"},{ms:"Kami berjalan kepada taman.",en:"We walk to park.",zh:"我们走给公园。"},{ms:"Buku itu berada kepada meja.",en:"The book is to table.",zh:"书在给桌子。"}],answer:0}
        ]
      },
      {
        id:"ms-i-kata-hubung",topic_id:"ms-conjunctions",
        topic:{ms:"Kata hubung",en:"Conjunctions",zh:"连词"},
        title:{ms:"Menghubungkan idea dengan kata hubung",en:"Connecting ideas with conjunctions",zh:"使用连词连接观点"},
        summary:{ms:"Gunakan dan, tetapi, kerana dan walaupun untuk menunjukkan hubungan antara idea.",en:"Use dan, tetapi, kerana and walaupun to show relationships between ideas.",zh:"使用dan、tetapi、kerana和walaupun表达观点之间的关系。"},
        explanation:[
          {ms:"“Dan” menggabungkan unsur yang setara, “tetapi” menunjukkan pertentangan, manakala “kerana” memperkenalkan sebab.",en:"“Dan” joins equivalent items, “tetapi” shows contrast, and “kerana” introduces a reason.",zh:"“Dan”连接并列成分，“tetapi”表示转折，“kerana”引出原因。"},
          {ms:"“Walaupun” memperkenalkan keadaan yang berlawanan dengan hasil yang dinyatakan. Pastikan hubungan makna antara kedua-dua bahagian jelas.",en:"“Walaupun” introduces a circumstance that contrasts with the stated result. Keep the relationship between both clauses clear.",zh:"“Walaupun”引出与所述结果相反的情况。要确保两个分句之间的逻辑关系清楚。"}
        ],
        points:[{ms:"Pilih kata hubung berdasarkan hubungan makna, bukan bunyi ayat sahaja.",en:"Choose a conjunction based on meaning, not merely how the sentence sounds.",zh:"根据语义关系而非句子听起来是否顺口来选择连词。"}],
        examples:[{ms:"Aina tetap hadir walaupun hujan lebat kerana mesyuarat itu penting.",en:"Aina still attended although it was raining heavily because the meeting was important.",zh:"尽管下着大雨，Aina仍然出席，因为会议很重要。"}],
        mistakes:[{ms:"Jangan gunakan “tetapi” untuk menyatakan sebab; gunakan “kerana” bagi hubungan sebab-akibat.",en:"Do not use “tetapi” to express a reason; use “kerana” for cause and effect.",zh:"不要用“tetapi”表达原因；因果关系应使用“kerana”。"}],
        practices:[
          {q:{ms:"Pilih kata hubung yang menunjukkan pertentangan: Dia rajin, ___ adiknya kurang tekun.",en:"Choose the conjunction showing contrast: He is diligent, ___ his younger sibling is less diligent.",zh:"选择表示转折的连词：Dia rajin, ___ adiknya kurang tekun。"},options:[{ms:"tetapi",en:"but",zh:"但是"},{ms:"kerana",en:"because",zh:"因为"},{ms:"dan",en:"and",zh:"和"},{ms:"supaya",en:"so that",zh:"以便"}],answer:0},
          {q:{ms:"Kata hubung manakah memperkenalkan sebab?",en:"Which conjunction introduces a reason?",zh:"哪个连词引出原因？"},options:[{ms:"kerana",en:"because",zh:"因为"},{ms:"tetapi",en:"but",zh:"但是"},{ms:"atau",en:"or",zh:"或者"},{ms:"lalu",en:"then",zh:"接着"}],answer:0},
          {q:{ms:"Pilih ayat yang menggunakan “walaupun” dengan betul.",en:"Choose the sentence that uses “walaupun” correctly.",zh:"选择正确使用“walaupun”的句子。"},options:[{ms:"Walaupun penat, dia meneruskan tugas.",en:"Although tired, they continued the task.",zh:"尽管疲倦，他仍继续工作。"},{ms:"Walaupun kerana dia tidur.",en:"Although because they sleep.",zh:"尽管因为他睡觉。"},{ms:"Dia walaupun buku dan meja.",en:"They although book and table.",zh:"他尽管书和桌子。"},{ms:"Walaupun ke sekolah kepada.",en:"Although to school to.",zh:"尽管去学校给。"}],answer:0}
        ]
      }
    ],
    advanced:[
      {
        id:"ms-a-ayat-pasif",topic_id:"ms-passive-voice",
        topic:{ms:"Ayat aktif dan pasif",en:"Active and passive voice",zh:"主动句与被动句"},
        title:{ms:"Menukar ayat aktif kepada ayat pasif",en:"Changing active sentences into passive sentences",zh:"将主动句改为被动句"},
        summary:{ms:"Kenali fokus ayat dan bina ayat pasif yang gramatis tanpa mengubah maksud.",en:"Identify sentence focus and form grammatical passive sentences without changing the meaning.",zh:"识别句子焦点，并在不改变原意的情况下构成合乎语法的被动句。"},
        explanation:[
          {ms:"Ayat aktif transitif lazimnya menampilkan pelaku sebelum kata kerja dan objek selepasnya. Dalam ayat pasif diri ketiga, objek boleh dijadikan subjek, diikuti kata kerja berawalan di- dan frasa pelaku yang sesuai.",en:"An active transitive sentence commonly places the agent before the verb and the object after it. In a third-person passive sentence, the object can become the subject, followed by a di- verb and a suitable agent phrase.",zh:"主动及物句通常把施事者放在动词前、宾语放在动词后。第三人称被动句可将宾语转为主语，后接di-动词和适当的施事短语。"},
          {ms:"Bagi kata ganti nama diri pertama dan kedua dalam binaan pasif tertentu, kata kerja tidak menerima awalan di- dan kata ganti nama hadir rapat di hadapan kata kerja, contohnya “Buku itu saya baca”.",en:"In certain passive constructions with first- and second-person pronouns, the verb does not take the di- prefix and the pronoun appears directly before the verb, as in “Buku itu saya baca”.",zh:"在某些第一、第二人称代词被动结构中，动词不加di-前缀，代词直接置于动词前，例如“Buku itu saya baca”。"}
        ],
        points:[{ms:"Kenal pasti objek dan pelaku sebelum menukar bentuk ayat.",en:"Identify the object and agent before changing the sentence.",zh:"转换句式前先识别宾语和施事者。"},{ms:"Jangan gunakan satu pola pasif untuk semua kata ganti nama.",en:"Do not apply one passive pattern to every pronoun.",zh:"不要把同一种被动句式套用于所有人称代词。"}],
        examples:[{ms:"Aktif: Juruteknik membaiki komputer itu. Pasif: Komputer itu dibaiki oleh juruteknik.",en:"Active: The technician repairs the computer. Passive: The computer is repaired by the technician.",zh:"主动：技术员修理电脑。被动：电脑由技术员修理。"},{ms:"Pasif: Laporan itu saya siapkan semalam.",en:"Passive: I completed the report yesterday.",zh:"被动：那份报告是我昨天完成的。"}],
        mistakes:[{ms:"Jangan menulis “Komputer itu oleh juruteknik membaiki” kerana susunan tersebut tidak membentuk ayat pasif standard yang dimaksudkan.",en:"Do not write “Komputer itu oleh juruteknik membaiki”; that order does not form the intended standard passive sentence.",zh:"不要写成“Komputer itu oleh juruteknik membaiki”；这种语序无法构成所需的标准被动句。"}],
        practices:[
          {q:{ms:"Pilih ayat pasif diri ketiga yang betul bagi “Mira menutup pintu itu”.",en:"Choose the correct third-person passive form of “Mira menutup pintu itu”.",zh:"选择“Mira menutup pintu itu”的正确第三人称被动句。"},options:[{ms:"Pintu itu ditutup oleh Mira.",en:"The door is closed by Mira.",zh:"门由Mira关上。"},{ms:"Pintu itu Mira menutup oleh.",en:"The door Mira closes by.",zh:"门Mira关由。"},{ms:"Ditutup Mira pintu oleh itu.",en:"Closed Mira door by that.",zh:"关上Mira门由那。"},{ms:"Mira oleh pintu itu ditutup.",en:"Mira by the door is closed.",zh:"Mira由门被关上。"}],answer:0},
          {q:{ms:"Pilih binaan pasif yang sesuai dengan kata ganti nama pertama.",en:"Choose a suitable passive construction with a first-person pronoun.",zh:"选择适合第一人称代词的被动结构。"},options:[{ms:"Kerja itu saya siapkan.",en:"I completed that work.",zh:"那项工作由我完成。"},{ms:"Kerja itu disiapkan saya oleh.",en:"That work completed me by.",zh:"工作被完成我由。"},{ms:"Saya oleh kerja itu siapkan.",en:"I by that work complete.",zh:"我由工作完成。"},{ms:"Kerja itu menyiapkan saya.",en:"That work prepares me.",zh:"那项工作准备我。"}],answer:0},
          {q:{ms:"Apakah unsur yang menjadi fokus dalam ayat pasif “Surat itu ditulis oleh Hana”?",en:"What is the focus in “Surat itu ditulis oleh Hana”?",zh:"在“Surat itu ditulis oleh Hana”中，焦点是什么？"},options:[{ms:"Surat itu",en:"The letter",zh:"那封信"},{ms:"Hana sahaja",en:"Hana only",zh:"只有Hana"},{ms:"oleh",en:"by",zh:"由"},{ms:"ditulis sahaja",en:"written only",zh:"仅仅写"}],answer:0}
        ]
      },
      {
        id:"ms-a-kohesi-wacana",topic_id:"ms-discourse-cohesion",
        topic:{ms:"Kohesi wacana",en:"Discourse cohesion",zh:"语篇衔接"},
        title:{ms:"Membina perenggan yang padu",en:"Building cohesive paragraphs",zh:"构建连贯段落"},
        summary:{ms:"Gunakan penanda wacana, rujukan dan pengulangan terkawal untuk menghubungkan ayat.",en:"Use discourse markers, reference and controlled repetition to connect sentences.",zh:"使用语篇标记、指代和适度重复来连接句子。"},
        explanation:[
          {ms:"Perenggan yang padu mempunyai idea utama yang jelas dan ayat sokongan yang berkaitan. Penanda seperti selain itu, namun dan oleh itu menunjukkan hubungan antara idea.",en:"A cohesive paragraph has a clear main idea and relevant supporting sentences. Markers such as selain itu, namun and oleh itu show relationships between ideas.",zh:"连贯的段落具有清晰的中心思想和相关支持句。selain itu、namun和oleh itu等标记词显示观点之间的关系。"},
          {ms:"Rujukan seperti ini, tersebut dan beliau perlu mempunyai anteseden yang jelas supaya pembaca mengetahui perkara atau orang yang dimaksudkan.",en:"References such as ini, tersebut and beliau need clear antecedents so readers know which thing or person is meant.",zh:"ini、tersebut和beliau等指代词需要有明确的先行词，让读者知道所指的人或事物。"}
        ],
        points:[{ms:"Pastikan setiap ayat menyumbang kepada idea utama.",en:"Ensure each sentence contributes to the main idea.",zh:"确保每个句子都服务于中心思想。"},{ms:"Gunakan penanda wacana mengikut hubungan logik.",en:"Use discourse markers according to the logical relationship.",zh:"根据逻辑关系使用语篇标记词。"}],
        examples:[{ms:"Pengangkutan awam mengurangkan bilangan kenderaan persendirian. Selain itu, perkhidmatan yang cekap dapat menjimatkan masa pengguna. Oleh itu, penambahbaikan rangkaian wajar diberi perhatian.",en:"Public transport reduces the number of private vehicles. In addition, efficient services can save commuters time. Therefore, improving the network deserves attention.",zh:"公共交通减少私家车数量。此外，高效服务可以节省乘客时间。因此，改善交通网络值得重视。"}],
        mistakes:[{ms:"Jangan mulakan setiap ayat dengan penanda wacana tanpa memahami hubungan antara ayat.",en:"Do not begin every sentence with a discourse marker without understanding the relationship between sentences.",zh:"不要在不了解句间关系的情况下，每个句子都以语篇标记词开头。"}],
        practices:[
          {q:{ms:"Penanda wacana manakah paling sesuai untuk menambah idea?",en:"Which discourse marker is suitable for adding an idea?",zh:"哪个语篇标记词适合补充观点？"},options:[{ms:"Selain itu",en:"In addition",zh:"此外"},{ms:"Walaupun",en:"Although",zh:"虽然"},{ms:"Sebaliknya",en:"On the contrary",zh:"相反"},{ms:"Akhirnya",en:"Finally",zh:"最后"}],answer:0},
          {q:{ms:"Mengapakah anteseden bagi kata rujukan perlu jelas?",en:"Why must the antecedent of a reference be clear?",zh:"为什么指代词的先行词必须明确？"},options:[{ms:"Supaya pembaca mengenal pasti perkara yang dirujuk.",en:"So readers can identify what is being referred to.",zh:"让读者识别所指的对象。"},{ms:"Supaya semua ayat sama panjang.",en:"So every sentence is the same length.",zh:"让所有句子长度相同。"},{ms:"Supaya tanda baca boleh dibuang.",en:"So punctuation can be removed.",zh:"让标点可以删除。"},{ms:"Supaya perenggan tiada idea utama.",en:"So the paragraph has no main idea.",zh:"让段落没有中心思想。"}],answer:0},
          {q:{ms:"Pilih penanda yang sesuai untuk menunjukkan kesimpulan berdasarkan alasan sebelumnya.",en:"Choose a marker that introduces a conclusion based on earlier reasons.",zh:"选择用于根据前述理由引出结论的标记词。"},options:[{ms:"Oleh itu",en:"Therefore",zh:"因此"},{ms:"Misalnya",en:"For example",zh:"例如"},{ms:"Namun",en:"However",zh:"然而"},{ms:"Sementara itu",en:"Meanwhile",zh:"与此同时"}],answer:0}
        ]
      },
      {
        id:"ms-a-hujah-berasas",topic_id:"ms-reasoned-argument",
        topic:{ms:"Hujah berasas",en:"Reasoned arguments",zh:"有理有据的论证"},
        title:{ms:"Menyusun hujah dan bukti",en:"Structuring arguments and evidence",zh:"组织论点与证据"},
        summary:{ms:"Bina pendirian yang jelas, sokong dengan alasan dan bezakan fakta daripada pendapat.",en:"Present a clear position, support it with reasons, and distinguish facts from opinions.",zh:"提出明确立场，以理由支持，并区分事实与观点。"},
        explanation:[
          {ms:"Hujah yang meyakinkan menyatakan pendirian, memberikan alasan yang relevan dan menyertakan bukti yang boleh diperiksa. Contoh atau data perlu berkaitan secara langsung dengan dakwaan.",en:"A convincing argument states a position, gives relevant reasons and includes verifiable evidence. Examples or data should directly support the claim.",zh:"有说服力的论证会说明立场、提供相关理由，并附上可核查的证据。例子或数据应直接支持论点。"},
          {ms:"Fakta boleh disemak melalui sumber yang boleh dipercayai, manakala pendapat menyatakan penilaian atau kepercayaan seseorang. Kedua-duanya perlu dibezakan dengan jelas.",en:"Facts can be checked against reliable sources, while opinions express a person's judgement or belief. They should be clearly distinguished.",zh:"事实可以通过可靠来源核查，而观点表达个人判断或信念。两者应清楚区分。"}
        ],
        points:[{ms:"Pastikan bukti menyokong dakwaan yang dibuat.",en:"Make sure evidence supports the claim being made.",zh:"确保证据支持所提出的论点。"},{ms:"Nyatakan sumber maklumat apabila memetik data atau pandangan pihak lain.",en:"Identify information sources when citing data or another party's views.",zh:"引用数据或他人观点时注明信息来源。"}],
        examples:[{ms:"Pendirian: Ruang hijau bandar perlu dipelihara. Alasan: Ruang ini menyediakan kawasan rekreasi. Bukti: Laporan pihak berkuasa tempatan menunjukkan taman kejiranan digunakan secara konsisten oleh penduduk.",en:"Position: Urban green spaces should be preserved. Reason: They provide recreational areas. Evidence: Local authority reports show neighbourhood parks are regularly used by residents.",zh:"立场：应保护城市绿地。理由：绿地提供休闲空间。证据：地方政府报告显示，居民经常使用社区公园。"}],
        mistakes:[{ms:"Jangan menganggap satu contoh terpencil sudah membuktikan dakwaan umum.",en:"Do not assume that one isolated example proves a general claim.",zh:"不要认为一个孤立例子就能证明普遍性论点。"}],
        practices:[
          {q:{ms:"Unsur manakah paling sesuai untuk menyokong sesuatu dakwaan?",en:"Which element best supports a claim?",zh:"哪种内容最适合支持论点？"},options:[{ms:"Bukti yang relevan dan boleh disemak",en:"Relevant and verifiable evidence",zh:"相关且可核查的证据"},{ms:"Ulangan dakwaan tanpa alasan",en:"Repeating the claim without reasons",zh:"没有理由地重复论点"},{ms:"Serangan terhadap pembaca",en:"Attacking the reader",zh:"攻击读者"},{ms:"Maklumat yang tidak berkaitan",en:"Unrelated information",zh:"无关信息"}],answer:0},
          {q:{ms:"Pernyataan manakah merupakan fakta yang boleh disemak?",en:"Which statement is a verifiable fact?",zh:"哪项陈述属于可核查的事实？"},options:[{ms:"Laporan itu diterbitkan pada tahun 2024.",en:"The report was published in 2024.",zh:"该报告于2024年发布。"},{ms:"Laporan itu paling menarik.",en:"The report is the most interesting.",zh:"该报告最有趣。"},{ms:"Semua orang pasti menyukainya.",en:"Everyone must like it.",zh:"所有人肯定都喜欢它。"},{ms:"Pendapat itu jelas paling hebat.",en:"That opinion is clearly the best.",zh:"那个观点显然最好。"}],answer:0},
          {q:{ms:"Apakah kelemahan hujah yang hanya menggunakan satu contoh terpencil?",en:"What is a weakness of an argument based on only one isolated example?",zh:"只依靠一个孤立例子的论证有什么弱点？"},options:[{ms:"Bukti itu mungkin tidak cukup mewakili keadaan umum.",en:"The evidence may not represent the general situation.",zh:"该证据可能不足以代表普遍情况。"},{ms:"Hujah itu semestinya benar.",en:"The argument must be true.",zh:"该论证必然正确。"},{ms:"Contoh tidak pernah berguna.",en:"Examples are never useful.",zh:"例子从来没有用。"},{ms:"Dakwaan tidak memerlukan bukti.",en:"Claims do not need evidence.",zh:"论点不需要证据。"}],answer:0}
        ]
      }
    ]
  };
  for(const level of ["beginner","intermediate","advanced"]){
    const existing=new Set(base[level].map(item=>item.id));
    for(const lesson of batch[level]){
      if(existing.has(lesson.id)) throw new Error("Duplicate Malay lesson id: "+lesson.id);
      base[level].push(lesson);
    }
  }
  base.contentVersion="u3-ms-lessons-0.2.0";
  base.expansionBatches=(base.expansionBatches||[]).concat([{id:"batch-02",added:9,reviewStatus:"draft"}]);
})();
