/* SwiftDictionary U3.0 — Malay Lessons expansion batch 03.
 * Original Malaysian Standard Malay draft content; translation support is machine-assisted.
 * Human linguistic and independent translation review is scheduled for staging review.
 */
(() => {
  const base=window.SWIFT_MALAY_LESSONS;
  if(!base) throw new Error("Load the Malay lesson foundation before batch 03.");
  const batch={
    beginner:[
      {
        id:"ms-b-family-and-people",topic_id:"ms-family-and-people",
        topic:{ms:"Keluarga dan hubungan",en:"Family and relationships",zh:"家庭与关系"},
        title:{ms:"Menerangkan hubungan kekeluargaan",en:"Describing family relationships",zh:"描述家庭关系"},
        summary:{ms:"Gunakan kata nama dan frasa pemilikan untuk memperkenalkan ahli keluarga.",en:"Use nouns and possessive phrases to introduce family members.",zh:"使用名词和所属短语介绍家庭成员。"},
        explanation:[
          {ms:"Kata nama seperti ibu, bapa, abang, kakak dan adik merujuk ahli keluarga. Gunakan kata ganti nama atau nama orang untuk menjelaskan hubungan dalam perbualan.",en:"Nouns such as mother, father, older brother, older sister and younger sibling refer to family members. Use pronouns or names to make relationships clear in conversation.",zh:"ibu、bapa、abang、kakak和adik等名词指家庭成员。交谈时可使用代词或姓名说明关系。"},
          {ms:"Frasa “ini ibu saya” memperkenalkan seseorang, manakala “beliau bekerja sebagai guru” menambah maklumat tentang orang tersebut. Kata “saya” hadir selepas kata nama dalam frasa pemilikan seperti “ibu saya”.",en:"The phrase “ini ibu saya” introduces someone, while “beliau bekerja sebagai guru” adds information about that person. “Saya” follows the noun in a possessive phrase such as “ibu saya”.",zh:"“ini ibu saya”用于介绍某人，“beliau bekerja sebagai guru”则补充该人的信息。在“ibu saya”等所属短语中，“saya”置于名词之后。"}
        ],
        points:[{ms:"Letakkan kata ganti nama pemilik selepas kata nama: rumah saya, adik mereka.",en:"Place the possessive pronoun after the noun: rumah saya, adik mereka.",zh:"所属代词放在名词后面：rumah saya、adik mereka。"},{ms:"Gunakan panggilan kekeluargaan yang sesuai dengan hubungan.",en:"Use a family term that matches the relationship.",zh:"根据亲属关系使用恰当的称谓。"}],
        examples:[{ms:"Ini kakak saya. Beliau belajar di universiti.",en:"This is my older sister. She studies at a university.",zh:"这是我的姐姐。她在大学读书。"}],
        mistakes:[{ms:"Jangan susun frasa pemilikan seperti dalam bahasa Inggeris; bentuk biasa ialah “buku saya”, bukan “saya punya buku” dalam ayat neutral.",en:"Do not automatically copy English possessive order; the neutral form is “buku saya”, not “saya punya buku”.",zh:"不要直接套用英语的所属语序；中性表达通常是“buku saya”，而不是“saya punya buku”。"}],
        practices:[
          {q:{ms:"Pilih frasa pemilikan yang betul.",en:"Choose the correct possessive phrase.",zh:"选择正确的所属短语。"},options:[{ms:"rumah saya",en:"my house",zh:"我的房子"},{ms:"saya rumah",en:"I house",zh:"我房子"},{ms:"rumah kepada saya",en:"house to me",zh:"房子给我"},{ms:"saya punya kepada rumah",en:"I own to house",zh:"我拥有给房子"}],answer:0},
          {q:{ms:"Apakah panggilan bagi anak lelaki kepada ibu bapa yang lebih muda daripada abang?",en:"What is a common term for a younger son in relation to an older brother?",zh:"相对于哥哥，年幼的男孩通常称为什么？"},options:[{ms:"adik",en:"younger sibling",zh:"弟弟／妹妹"},{ms:"datuk",en:"grandfather",zh:"祖父"},{ms:"bapa saudara",en:"uncle",zh:"叔叔／舅舅"},{ms:"cucu",en:"grandchild",zh:"孙辈"}],answer:0},
          {q:{ms:"Pilih ayat yang memperkenalkan ahli keluarga dengan jelas.",en:"Choose the sentence that clearly introduces a family member.",zh:"选择清楚介绍家庭成员的句子。"},options:[{ms:"Ini abang saya, Amir.",en:"This is my older brother, Amir.",zh:"这是我的哥哥Amir。"},{ms:"Abang kepada ini saya Amir.",en:"Brother to this I Amir.",zh:"哥哥给这个我Amir。"},{ms:"Saya ini abang kepada Amir.",en:"I this brother to Amir.",zh:"我这个哥哥给Amir。"},{ms:"Amir saya abang ini kepada.",en:"Amir I brother this to.",zh:"Amir我哥哥这个给。"}],answer:0}
        ]
      },
      {
        id:"ms-b-places-and-directions",topic_id:"ms-places-and-directions",
        topic:{ms:"Tempat dan arah",en:"Places and directions",zh:"地点与方向"},
        title:{ms:"Bertanya dan memberikan arah",en:"Asking for and giving directions",zh:"询问与指引方向"},
        summary:{ms:"Gunakan kata arah dan kata sendi untuk menerangkan lokasi serta laluan.",en:"Use direction words and prepositions to describe locations and routes.",zh:"使用方位词和介词描述位置与路线。"},
        explanation:[
          {ms:"Kata arah seperti kiri, kanan, hadapan dan belakang membantu menerangkan kedudukan. Gabungkan kata tersebut dengan kata sendi yang sesuai, contohnya “di sebelah kiri” dan “di hadapan bank”.",en:"Direction words such as left, right, front and behind describe position. Combine them with suitable prepositions, for example “di sebelah kiri” and “di hadapan bank”.",zh:"kiri、kanan、hadapan和belakang等方位词用于描述位置。与适当介词组合，例如“di sebelah kiri”和“di hadapan bank”。"},
          {ms:"Gunakan ungkapan sopan seperti “Maaf, boleh tunjukkan jalan ke …?” ketika meminta bantuan. Berikan arahan mengikut urutan supaya mudah diikuti.",en:"Use polite expressions such as “Maaf, boleh tunjukkan jalan ke …?” when asking for help. Give directions in sequence so they are easy to follow.",zh:"求助时使用“Maaf, boleh tunjukkan jalan ke …?”等礼貌表达。按顺序提供指引，方便对方跟随。"}
        ],
        points:[{ms:"Bezakan kedudukan dengan pergerakan: “di hadapan” berbanding “ke hadapan”.",en:"Distinguish position from movement: “di hadapan” versus “ke hadapan”.",zh:"区分位置与移动：“di hadapan”与“ke hadapan”。"},{ms:"Susun arahan mengikut turutan perjalanan.",en:"Order directions according to the route.",zh:"按路线顺序排列指引。"}],
        examples:[{ms:"Terus berjalan, kemudian belok ke kanan. Perpustakaan terletak di sebelah kiri.",en:"Continue straight, then turn right. The library is on the left.",zh:"继续直走，然后右转。图书馆在左边。"}],
        mistakes:[{ms:"Jangan kelirukan “di sebelah kanan” yang menunjukkan lokasi dengan “ke kanan” yang menunjukkan arah pergerakan.",en:"Do not confuse “di sebelah kanan” for a location with “ke kanan” for a direction of movement.",zh:"不要混淆表示位置的“di sebelah kanan”和表示移动方向的“ke kanan”。"}],
        practices:[
          {q:{ms:"Frasa manakah menunjukkan lokasi?",en:"Which phrase indicates a location?",zh:"哪个短语表示位置？"},options:[{ms:"di hadapan kedai",en:"in front of the shop",zh:"在商店前面"},{ms:"ke hadapan",en:"forward",zh:"向前"},{ms:"belok ke kiri",en:"turn left",zh:"左转"},{ms:"terus berjalan",en:"continue walking",zh:"继续走"}],answer:0},
          {q:{ms:"Pilih ungkapan yang sopan untuk meminta arah.",en:"Choose a polite expression for asking directions.",zh:"选择礼貌询问方向的表达。"},options:[{ms:"Maaf, boleh tunjukkan jalan ke stesen?",en:"Excuse me, could you show me the way to the station?",zh:"请问，您可以指引我去车站的路吗？"},{ms:"Tunjuk sekarang!",en:"Show me now!",zh:"现在指给我！"},{ms:"Awak pergi mana?",en:"Where are you going?",zh:"你去哪里？"},{ms:"Jalan itu saya.",en:"Road that I.",zh:"路那我。"}],answer:0},
          {q:{ms:"Apakah arahan yang menunjukkan perubahan arah ke kanan?",en:"Which instruction indicates a right turn?",zh:"哪项指示表示右转？"},options:[{ms:"Belok ke kanan.",en:"Turn right.",zh:"右转。"},{ms:"Berhenti di hadapan.",en:"Stop in front.",zh:"在前面停下。"},{ms:"Terus ke belakang.",en:"Continue backwards.",zh:"继续向后。"},{ms:"Belok ke kiri.",en:"Turn left.",zh:"左转。"}],answer:0}
        ]
      },
      {
        id:"ms-b-shopping-and-prices",topic_id:"ms-shopping-and-prices",
        topic:{ms:"Membeli-belah dan harga",en:"Shopping and prices",zh:"购物与价格"},
        title:{ms:"Bertanya tentang harga dan kuantiti",en:"Asking about prices and quantities",zh:"询问价格与数量"},
        summary:{ms:"Gunakan soalan harga, penjodoh bilangan dan ungkapan kuantiti ketika membeli-belah.",en:"Use price questions, classifiers and quantity expressions when shopping.",zh:"购物时使用价格问句、量词和数量表达。"},
        explanation:[
          {ms:"Gunakan “Berapakah harga …?” atau “Berapa harga …?” untuk bertanya harga. Jawapan boleh menyatakan jumlah wang, contohnya “Harganya dua puluh ringgit”.",en:"Use “Berapakah harga …?” or “Berapa harga …?” to ask the price. A reply can state an amount, for example “Harganya dua puluh ringgit”.",zh:"使用“Berapakah harga …?”或“Berapa harga …?”询问价格。回答可以说明金额，例如“Harganya dua puluh ringgit”。"},
          {ms:"Penjodoh bilangan membantu menyatakan kuantiti, seperti dua helai baju, tiga biji epal dan sekilogram beras. Pilih penjodoh berdasarkan benda yang dihitung.",en:"Classifiers express quantities, such as dua helai baju, tiga biji epal and sekilogram beras. Choose a classifier based on the item being counted.",zh:"量词用于表达数量，例如dua helai baju、tiga biji epal和sekilogram beras。根据所计数物品选择量词。"}
        ],
        points:[{ms:"Nyatakan harga dengan unit yang betul, seperti ringgit dan sen.",en:"State prices with the correct units, such as ringgit and sen.",zh:"使用正确单位表达价格，例如令吉和仙。"},{ms:"Gunakan penjodoh bilangan yang sesuai untuk kuantiti.",en:"Use a suitable classifier for quantities.",zh:"为数量选择合适的量词。"}],
        examples:[{ms:"Berapakah harga sekilogram mangga ini? Harganya lapan ringgit.",en:"How much is one kilogram of these mangoes? They cost eight ringgit.",zh:"这些芒果一公斤多少钱？价格是八令吉。"}],
        mistakes:[{ms:"Jangan gunakan penjodoh bilangan yang tidak sepadan, seperti “seekor baju”.",en:"Do not use a mismatched classifier, such as “seekor baju”.",zh:"不要使用不匹配的量词，例如“seekor baju”。"}],
        practices:[
          {q:{ms:"Pilih soalan yang betul untuk bertanya harga.",en:"Choose the correct question for asking a price.",zh:"选择正确的价格问句。"},options:[{ms:"Berapakah harga beg ini?",en:"How much is this bag?",zh:"这个包多少钱？"},{ms:"Di manakah harga beg ini?",en:"Where is the price of this bag?",zh:"这个包的价格在哪里？"},{ms:"Siapakah harga beg ini?",en:"Who is the price of this bag?",zh:"这个包的价格是谁？"},{ms:"Bilakah beg ini harga?",en:"When is this bag price?",zh:"这个包何时价格？"}],answer:0},
          {q:{ms:"Penjodoh bilangan yang sesuai untuk sehelai kemeja ialah …",en:"A suitable classifier phrase for one shirt is …",zh:"一件衬衫适合使用的量词短语是……"},options:[{ms:"sehelai kemeja",en:"one shirt",zh:"一件衬衫"},{ms:"seekor kemeja",en:"one animal shirt",zh:"一只衬衫"},{ms:"sebatang kemeja",en:"one rod shirt",zh:"一根衬衫"},{ms:"seorang kemeja",en:"one person shirt",zh:"一个人衬衫"}],answer:0},
          {q:{ms:"Jika dua barang berharga RM5 setiap satu, berapakah jumlahnya?",en:"If two items cost RM5 each, what is the total?",zh:"如果两件商品每件5令吉，总价是多少？"},options:[{ms:"Sepuluh ringgit",en:"Ten ringgit",zh:"十令吉"},{ms:"Lima ringgit",en:"Five ringgit",zh:"五令吉"},{ms:"Dua ringgit",en:"Two ringgit",zh:"两令吉"},{ms:"Lima belas ringgit",en:"Fifteen ringgit",zh:"十五令吉"}],answer:0}
        ]
      }
    ],
    intermediate:[
      {
        id:"ms-i-perbandingan",topic_id:"ms-comparison",
        topic:{ms:"Kata adjektif dan perbandingan",en:"Adjectives and comparison",zh:"形容词与比较"},
        title:{ms:"Membuat perbandingan dengan tepat",en:"Making accurate comparisons",zh:"准确进行比较"},
        summary:{ms:"Gunakan lebih, paling, kurang dan sama … dengan untuk membandingkan sifat.",en:"Use lebih, paling, kurang and sama … dengan to compare qualities.",zh:"使用lebih、paling、kurang和sama … dengan比较性质。"},
        explanation:[
          {ms:"Kata adjektif menerangkan sifat seperti tinggi, cepat, mahal dan menarik. “Lebih … daripada” membandingkan dua perkara, manakala “paling” menunjukkan darjah tertinggi dalam kumpulan.",en:"Adjectives describe qualities such as tall, fast, expensive and interesting. “Lebih … daripada” compares two things, while “paling” indicates the highest degree in a group.",zh:"形容词描述tinggi、cepat、mahal和menarik等性质。“Lebih … daripada”比较两者，“paling”表示群体中的最高程度。"},
          {ms:"Gunakan “sama … dengan” untuk menunjukkan tahap yang setara. Pastikan unsur yang dibandingkan berada dalam kategori yang munasabah.",en:"Use “sama … dengan” to show an equal degree. Make sure the items being compared are reasonably comparable.",zh:"使用“sama … dengan”表示程度相同。确保比较对象具有合理的可比性。"}
        ],
        points:[{ms:"Gunakan “daripada” selepas bentuk perbandingan “lebih”.",en:"Use “daripada” after the comparative form “lebih”.",zh:"比较结构“lebih”后使用“daripada”。"},{ms:"Gunakan “paling” untuk darjah tertinggi dalam kumpulan.",en:"Use “paling” for the highest degree in a group.",zh:"使用“paling”表示群体中的最高程度。"}],
        examples:[{ms:"Jalan ini lebih lebar daripada jalan lama, tetapi jalan utama ialah yang paling lebar.",en:"This road is wider than the old road, but the main road is the widest.",zh:"这条路比旧路宽，但主干道是最宽的。"}],
        mistakes:[{ms:"Elakkan bentuk berlebihan seperti “paling tertinggi” dalam penggunaan standard; pilih “paling tinggi” atau “tertinggi”.",en:"Avoid redundant forms such as “paling tertinggi” in standard usage; choose “paling tinggi” or “tertinggi”.",zh:"标准用法中避免“paling tertinggi”等重复形式；应选择“paling tinggi”或“tertinggi”。"}],
        practices:[
          {q:{ms:"Lengkapkan ayat: Bas ini lebih besar ___ van itu.",en:"Complete the sentence: This bus is bigger ___ that van.",zh:"完成句子：Bas ini lebih besar ___ van itu。"},options:[{ms:"daripada",en:"than",zh:"比"},{ms:"kepada",en:"to (recipient)",zh:"给"},{ms:"kerana",en:"because",zh:"因为"},{ms:"supaya",en:"so that",zh:"以便"}],answer:0},
          {q:{ms:"Bentuk manakah menunjukkan darjah tertinggi?",en:"Which form indicates the highest degree?",zh:"哪种形式表示最高程度？"},options:[{ms:"paling tinggi",en:"the tallest/highest",zh:"最高"},{ms:"agak tinggi",en:"rather tall",zh:"相当高"},{ms:"kurang tinggi",en:"less tall",zh:"较不高"},{ms:"sama tinggi",en:"equally tall",zh:"一样高"}],answer:0},
          {q:{ms:"Pilih ayat perbandingan yang gramatis.",en:"Choose the grammatical comparison sentence.",zh:"选择语法正确的比较句。"},options:[{ms:"Harga buku ini sama dengan harga buku itu.",en:"The price of this book is the same as that book's price.",zh:"这本书的价格与那本书相同。"},{ms:"Harga buku ini sama daripada harga itu.",en:"This book's price same than that price.",zh:"这本书价格相同比那个价格。"},{ms:"Harga buku ini paling daripada buku itu.",en:"This book's price most than that book.",zh:"这本书价格最比那本书。"},{ms:"Harga buku ini lebih sama buku itu.",en:"This book price more same that book.",zh:"这本书价格更相同那本书。"}],answer:0}
        ]
      },
      {
        id:"ms-i-kata-penguat",topic_id:"ms-intensifiers",
        topic:{ms:"Kata penguat",en:"Intensifiers",zh:"程度副词"},
        title:{ms:"Menggunakan kata penguat",en:"Using intensifiers",zh:"使用程度副词"},
        summary:{ms:"Kenali kata penguat hadapan, belakang dan bebas dalam frasa adjektif.",en:"Recognise front, end and free intensifiers in adjective phrases.",zh:"认识形容词短语中的前置、后置和自由程度副词。"},
        explanation:[
          {ms:"Kata penguat menguatkan maksud kata adjektif. Contohnya, “amat menarik”, “cantik sekali” dan “sangat besar”.",en:"Intensifiers strengthen the meaning of an adjective. Examples include “amat menarik”, “cantik sekali” and “sangat besar”.",zh:"程度副词加强形容词的意义。例如“amat menarik”、“cantik sekali”和“sangat besar”。"},
          {ms:"Kedudukan kata penguat bergantung pada jenis dan pola penggunaannya. Pelajari bentuk yang lazim dan elakkan penggabungan berlebihan yang tidak gramatis.",en:"The position of an intensifier depends on its type and usage pattern. Learn common forms and avoid ungrammatical over-combination.",zh:"程度副词的位置取决于其类型和用法。学习常见形式，避免不合语法的过度叠加。"}
        ],
        points:[{ms:"Kata penguat hadapan hadir sebelum kata adjektif, seperti “terlalu panas”.",en:"A front intensifier appears before the adjective, as in “terlalu panas”.",zh:"前置程度副词位于形容词前，例如“terlalu panas”。"},{ms:"Kata penguat belakang hadir selepas kata adjektif, seperti “indah sekali”.",en:"An end intensifier appears after the adjective, as in “indah sekali”.",zh:"后置程度副词位于形容词后，例如“indah sekali”。"}],
        examples:[{ms:"Pemandangan di kawasan tanah tinggi itu amat indah.",en:"The scenery in the highland area is very beautiful.",zh:"高原地区的景色非常美丽。"}],
        mistakes:[{ms:"Jangan gabungkan beberapa kata penguat secara berturut-turut tanpa pola yang diterima, seperti “sangat amat indah sekali”.",en:"Do not stack several intensifiers without an accepted pattern, such as “sangat amat indah sekali”.",zh:"不要连续堆叠多个不符合规范的程度副词，例如“sangat amat indah sekali”。"}],
        practices:[
          {q:{ms:"Pilih frasa yang menggunakan kata penguat hadapan.",en:"Choose the phrase with a front intensifier.",zh:"选择使用前置程度副词的短语。"},options:[{ms:"terlalu panas",en:"too hot",zh:"太热"},{ms:"panas sekali",en:"very hot",zh:"非常热"},{ms:"indah nian",en:"exceedingly beautiful",zh:"极其美丽"},{ms:"besar benar",en:"really large",zh:"确实很大"}],answer:0},
          {q:{ms:"Dalam frasa “cantik sekali”, di manakah kata penguat hadir?",en:"Where does the intensifier appear in “cantik sekali”?",zh:"在“cantik sekali”中，程度副词位于哪里？"},options:[{ms:"Selepas kata adjektif",en:"After the adjective",zh:"形容词之后"},{ms:"Sebelum kata adjektif",en:"Before the adjective",zh:"形容词之前"},{ms:"Sebelum subjek",en:"Before the subject",zh:"主语之前"},{ms:"Selepas objek",en:"After the object",zh:"宾语之后"}],answer:0},
          {q:{ms:"Pilih frasa yang tidak mengulang kata penguat secara berlebihan.",en:"Choose the phrase that does not overuse intensifiers.",zh:"选择没有过度重复程度副词的短语。"},options:[{ms:"sangat menarik",en:"very interesting",zh:"非常有趣"},{ms:"sangat amat menarik sekali",en:"very extremely interesting indeed",zh:"非常极其有趣得很"},{ms:"terlalu paling menarik",en:"too most interesting",zh:"太最有趣"},{ms:"amat sekali sangat besar",en:"extremely very very large",zh:"极其非常很大"}],answer:0}
        ]
      },
      {
        id:"ms-i-ayat-majmuk",topic_id:"ms-compound-sentences",
        topic:{ms:"Ayat majmuk",en:"Compound and complex sentences",zh:"复合句"},
        title:{ms:"Menggabungkan ayat dengan tepat",en:"Combining sentences accurately",zh:"准确合并句子"},
        summary:{ms:"Gabungkan klausa menggunakan kata hubung yang menunjukkan hubungan setara atau bertingkat.",en:"Combine clauses using conjunctions that show coordinate or subordinate relationships.",zh:"使用表示并列或从属关系的连词合并分句。"},
        explanation:[
          {ms:"Ayat majmuk gabungan menghubungkan klausa yang setara, misalnya dengan “dan” atau “tetapi”. Ayat majmuk pancangan mempunyai klausa utama dan klausa kecil yang bergantung padanya.",en:"A compound sentence joins equal clauses, for example with “dan” or “tetapi”. A complex sentence has a main clause and a subordinate clause that depends on it.",zh:"并列复合句连接地位相同的分句，例如使用“dan”或“tetapi”。主从复合句则包含主句和依附于主句的从句。"},
          {ms:"Pilih kata hubung berdasarkan fungsi klausa. “Apabila” menunjukkan masa, “kerana” menunjukkan sebab dan “supaya” menunjukkan tujuan.",en:"Choose a conjunction according to the clause's function. “Apabila” indicates time, “kerana” indicates reason and “supaya” indicates purpose.",zh:"根据分句功能选择连词。“Apabila”表示时间，“kerana”表示原因，“supaya”表示目的。"}
        ],
        points:[{ms:"Pastikan setiap klausa mempunyai hubungan makna yang jelas.",en:"Make sure each clause has a clear semantic relationship.",zh:"确保每个分句之间有清晰的语义关系。"},{ms:"Jangan gabungkan klausa yang tidak berkaitan hanya untuk memanjangkan ayat.",en:"Do not combine unrelated clauses merely to lengthen a sentence.",zh:"不要仅为了延长句子而合并无关分句。"}],
        examples:[{ms:"Kami menangguhkan perjalanan kerana hujan turun dengan lebat.",en:"We postponed the journey because it was raining heavily.",zh:"由于下着大雨，我们推迟了行程。"},{ms:"Dia menyimpan resit itu supaya urusan tuntutan lebih mudah.",en:"She kept the receipt so that the claim process would be easier.",zh:"她保存了收据，以便更轻松地办理报销。"}],
        mistakes:[{ms:"Jangan gunakan “supaya” untuk memperkenalkan sebab; gunakan “kerana” apabila menyatakan punca.",en:"Do not use “supaya” to introduce a cause; use “kerana” to state a reason.",zh:"不要用“supaya”引出原因；说明原因时使用“kerana”。"}],
        practices:[
          {q:{ms:"Kata hubung manakah menunjukkan tujuan?",en:"Which conjunction indicates purpose?",zh:"哪个连词表示目的？"},options:[{ms:"supaya",en:"so that",zh:"以便"},{ms:"kerana",en:"because",zh:"因为"},{ms:"tetapi",en:"but",zh:"但是"},{ms:"atau",en:"or",zh:"或者"}],answer:0},
          {q:{ms:"Pilih ayat yang menunjukkan hubungan sebab.",en:"Choose the sentence showing a cause relationship.",zh:"选择表示因果关系的句子。"},options:[{ms:"Perlawanan dibatalkan kerana padang banjir.",en:"The match was cancelled because the field was flooded.",zh:"由于球场淹水，比赛被取消。"},{ms:"Perlawanan dibatalkan supaya padang banjir.",en:"The match was cancelled so that the field flooded.",zh:"比赛被取消以便球场淹水。"},{ms:"Perlawanan dibatalkan tetapi padang kerana.",en:"The match cancelled but field because.",zh:"比赛取消但是球场因为。"},{ms:"Perlawanan apabila padang atau.",en:"Match when field or.",zh:"比赛当球场或者。"}],answer:0},
          {q:{ms:"Apakah ciri ayat majmuk pancangan?",en:"What is a feature of a complex sentence?",zh:"主从复合句有什么特点？"},options:[{ms:"Mempunyai klausa utama dan klausa kecil yang bergantung padanya.",en:"It has a main clause and a subordinate clause.",zh:"包含主句和依附其上的从句。"},{ms:"Tidak mempunyai kata kerja.",en:"It has no verb.",zh:"没有动词。"},{ms:"Semua klausa mesti berdiri sendiri.",en:"Every clause must stand alone.",zh:"每个分句都必须独立。"},{ms:"Hanya mengandungi satu perkataan.",en:"It contains only one word.",zh:"只包含一个词。"}],answer:0}
        ]
      }
    ],
    advanced:[
      {
        id:"ms-a-variasi-struktur",topic_id:"ms-sentence-variation",
        topic:{ms:"Variasi struktur ayat",en:"Sentence-structure variation",zh:"句式变化"},
        title:{ms:"Menggunakan variasi ayat secara berkesan",en:"Using sentence variation effectively",zh:"有效运用多样句式"},
        summary:{ms:"Gunakan ayat aktif, pasif, songsang dan ayat pendek atau panjang mengikut tujuan penulisan.",en:"Use active, passive, inverted, short and long sentences according to the purpose of writing.",zh:"根据写作目的运用主动、被动、倒装以及长短句。"},
        explanation:[
          {ms:"Variasi struktur ayat membantu mengawal fokus dan rentak penulisan. Ayat aktif menonjolkan pelaku, manakala ayat pasif boleh menonjolkan perkara yang menerima tindakan.",en:"Sentence variation helps control focus and writing rhythm. Active sentences foreground the agent, while passive sentences can foreground the recipient of an action.",zh:"句式变化有助于控制写作焦点和节奏。主动句突出施事者，被动句则可突出动作承受者。"},
          {ms:"Ayat songsang mendahulukan unsur tertentu untuk penegasan. Gunakannya secara terkawal dan pastikan hubungan subjek-predikat masih jelas.",en:"An inverted sentence places a particular element first for emphasis. Use it carefully and keep the subject-predicate relationship clear.",zh:"倒装句将特定成分前置以加强强调。应谨慎使用，并确保主谓关系清晰。"}
        ],
        points:[{ms:"Pilih struktur ayat berdasarkan maklumat yang hendak diberi penekanan.",en:"Choose a sentence structure based on the information to emphasise.",zh:"根据需要强调的信息选择句式。"},{ms:"Pelbagaikan struktur tanpa mengorbankan kejelasan.",en:"Vary structures without sacrificing clarity.",zh:"在不牺牲清晰度的前提下变化句式。"}],
        examples:[{ms:"Biasa: Para penyelidik menjalankan kajian itu selama dua tahun. Fokus pada tempoh: Selama dua tahun, kajian itu dijalankan oleh para penyelidik.",en:"Neutral: The researchers conducted the study for two years. Emphasis on duration: For two years, the study was conducted by the researchers.",zh:"普通语序：研究人员进行了为期两年的研究。强调时长：这项研究由研究人员进行了两年。"}],
        mistakes:[{ms:"Jangan mengubah susunan ayat sehingga pelaku, tindakan atau penerima tindakan menjadi kabur.",en:"Do not rearrange a sentence so that the agent, action or recipient becomes unclear.",zh:"不要因改变语序而使施事者、动作或动作承受者变得含糊。"}],
        practices:[
          {q:{ms:"Apakah tujuan utama menggunakan ayat pasif dalam konteks tertentu?",en:"What is a main purpose of using a passive sentence in a particular context?",zh:"在特定语境中使用被动句的主要目的是什么？"},options:[{ms:"Memberikan fokus kepada perkara yang menerima tindakan.",en:"To focus on the thing receiving the action.",zh:"将焦点放在动作承受者上。"},{ms:"Menghapuskan semua maklumat.",en:"To remove all information.",zh:"删除所有信息。"},{ms:"Menjadikan ayat tidak gramatis.",en:"To make the sentence ungrammatical.",zh:"使句子不合语法。"},{ms:"Mengubah masa kejadian tanpa sebab.",en:"To change the event's time without reason.",zh:"无故改变事件时间。"}],answer:0},
          {q:{ms:"Apakah perkara yang perlu dikekalkan dalam ayat songsang?",en:"What should remain clear in an inverted sentence?",zh:"倒装句中必须保持清楚的是什么？"},options:[{ms:"Hubungan subjek dan predikat.",en:"The subject-predicate relationship.",zh:"主语与谓语的关系。"},{ms:"Semua perkataan mesti diulang.",en:"Every word must be repeated.",zh:"每个词都必须重复。"},{ms:"Kata kerja mesti digugurkan.",en:"The verb must be omitted.",zh:"必须省略动词。"},{ms:"Ayat mesti tiada tanda baca.",en:"The sentence must have no punctuation.",zh:"句子不能有标点。"}],answer:0},
          {q:{ms:"Bilakah variasi ayat paling berkesan?",en:"When is sentence variation most effective?",zh:"句式变化在什么时候最有效？"},options:[{ms:"Apabila membantu fokus, aliran dan kejelasan teks.",en:"When it supports focus, flow and clarity.",zh:"当它有助于文本焦点、流畅度和清晰度时。"},{ms:"Apabila menjadikan setiap ayat sepanjang mungkin.",en:"When it makes every sentence as long as possible.",zh:"当它让每个句子尽可能长时。"},{ms:"Apabila mengelirukan hubungan idea.",en:"When it confuses relationships between ideas.",zh:"当它混淆观点关系时。"},{ms:"Apabila semua ayat menggunakan pola sama.",en:"When every sentence uses the same pattern.",zh:"当所有句子都使用相同结构时。"}],answer:0}
        ]
      },
      {
        id:"ms-a-parafrasa",topic_id:"ms-paraphrasing",
        topic:{ms:"Parafrasa dan rumusan",en:"Paraphrasing and summarising",zh:"改写与总结"},
        title:{ms:"Memparafrasa maklumat tanpa mengubah maksud",en:"Paraphrasing without changing meaning",zh:"在不改变原意的情况下改写信息"},
        summary:{ms:"Nyatakan semula idea dengan struktur sendiri sambil mengekalkan ketepatan dan mengiktiraf sumber.",en:"Restate ideas in your own structure while preserving accuracy and acknowledging sources.",zh:"用自己的结构重新表达观点，同时保持准确并注明来源。"},
        explanation:[
          {ms:"Parafrasa menyampaikan semula maklumat menggunakan pilihan kata dan struktur ayat yang berbeza tanpa mengubah maksud asal. Menukar beberapa perkataan sahaja tidak semestinya menghasilkan parafrasa yang baik.",en:"Paraphrasing restates information using different wording and sentence structure without changing the original meaning. Merely replacing a few words does not necessarily produce a good paraphrase.",zh:"改写是使用不同措辞和句子结构重新表达信息，同时不改变原意。仅替换几个词并不一定构成良好改写。"},
          {ms:"Rumusan pula memilih isi utama dan menggugurkan butiran sampingan. Apabila idea atau maklumat diambil daripada sumber, sumber tersebut tetap perlu diiktiraf.",en:"A summary selects the main points and omits secondary details. When ideas or information come from a source, that source must still be acknowledged.",zh:"总结则提取主要内容并省略次要细节。使用来源中的观点或信息时，仍须注明来源。"}
        ],
        points:[{ms:"Fahami maksud sumber sebelum menulis semula.",en:"Understand the source before rewriting it.",zh:"改写前先理解来源内容。"},{ms:"Semak supaya parafrasa tidak menambah dakwaan yang tiada dalam sumber.",en:"Check that the paraphrase does not add claims absent from the source.",zh:"检查改写是否加入了来源中没有的论断。"}],
        examples:[{ms:"Sumber: “Pokok di bandar membantu mengurangkan suhu persekitaran.” Parafrasa: “Suhu kawasan bandar dapat dikurangkan dengan kehadiran pokok.”",en:"Source: “Trees in cities help reduce surrounding temperatures.” Paraphrase: “The presence of trees can lower temperatures in urban areas.”",zh:"来源：“城市树木有助于降低周围温度。”改写：“树木的存在能够降低城市地区的温度。”"}],
        mistakes:[{ms:"Jangan menyalin struktur sumber sepenuhnya sambil hanya menukar beberapa sinonim.",en:"Do not copy the source structure entirely while changing only a few synonyms.",zh:"不要完全照搬来源结构，只替换少数同义词。"}],
        practices:[
          {q:{ms:"Apakah ciri parafrasa yang baik?",en:"What is a feature of a good paraphrase?",zh:"良好改写有什么特点？"},options:[{ms:"Mengekalkan maksud dengan struktur dan ungkapan sendiri.",en:"Preserves meaning using one's own structure and wording.",zh:"使用自己的结构和措辞，同时保留原意。"},{ms:"Menyalin ayat sumber sepenuhnya.",en:"Copies the source sentence entirely.",zh:"完整复制来源句子。"},{ms:"Menambah fakta yang tidak disahkan.",en:"Adds unverified facts.",zh:"添加未经证实的事实。"},{ms:"Mengubah maksud asal.",en:"Changes the original meaning.",zh:"改变原意。"}],answer:0},
          {q:{ms:"Apakah perbezaan utama antara parafrasa dengan rumusan?",en:"What is the main difference between paraphrasing and summarising?",zh:"改写与总结的主要区别是什么？"},options:[{ms:"Rumusan memilih isi utama, manakala parafrasa menyatakan semula maklumat.",en:"A summary selects main points, while a paraphrase restates information.",zh:"总结提取主要内容，而改写重新表达信息。"},{ms:"Parafrasa mesti lebih panjang daripada sumber.",en:"A paraphrase must be longer than the source.",zh:"改写必须比来源更长。"},{ms:"Rumusan menyalin semua ayat.",en:"A summary copies every sentence.",zh:"总结复制每个句子。"},{ms:"Kedua-duanya tidak memerlukan pemahaman.",en:"Neither requires understanding.",zh:"两者都不需要理解。"}],answer:0},
          {q:{ms:"Apakah tindakan yang wajar apabila menggunakan idea daripada sumber?",en:"What should you do when using an idea from a source?",zh:"使用来源中的观点时应该怎么做？"},options:[{ms:"Mengiktiraf sumber mengikut kaedah rujukan yang digunakan.",en:"Acknowledge the source using the required citation method.",zh:"按照所用引用规范注明来源。"},{ms:"Menyembunyikan sumber.",en:"Hide the source.",zh:"隐藏来源。"},{ms:"Mendakwa idea itu milik sendiri.",en:"Claim the idea as your own.",zh:"声称观点属于自己。"},{ms:"Mengubah nama penulis.",en:"Change the author's name.",zh:"更改作者姓名。"}],answer:0}
        ]
      },
      {
        id:"ms-a-bacaan-kritis",topic_id:"ms-critical-reading",
        topic:{ms:"Pembacaan kritis",en:"Critical reading",zh:"批判性阅读"},
        title:{ms:"Menilai dakwaan dan kebolehpercayaan sumber",en:"Evaluating claims and source reliability",zh:"评估论断与来源可信度"},
        summary:{ms:"Nilai bukti, tujuan penulis, tarikh dan kewibawaan sumber sebelum menerima sesuatu dakwaan.",en:"Assess evidence, author purpose, date and source authority before accepting a claim.",zh:"接受论断前评估证据、作者目的、日期和来源权威性。"},
        explanation:[
          {ms:"Pembaca kritis membezakan dakwaan daripada bukti. Semak sama ada data mempunyai sumber, kaedah dan konteks yang jelas serta sama ada bukti benar-benar menyokong kesimpulan.",en:"A critical reader distinguishes claims from evidence. Check whether data has a clear source, method and context, and whether the evidence truly supports the conclusion.",zh:"批判性读者会区分论断与证据。检查数据是否有明确来源、方法和背景，以及证据是否真正支持结论。"},
          {ms:"Kewibawaan sumber bergantung pada bidang kepakaran, ketelusan, kebolehsemakan dan kemutakhiran maklumat. Satu petikan atau angka tanpa konteks tidak semestinya membuktikan dakwaan.",en:"Source credibility depends on expertise, transparency, verifiability and how current the information is. A quotation or number without context does not necessarily prove a claim.",zh:"来源可信度取决于专业性、透明度、可核查性和信息时效性。缺乏背景的引文或数字不一定能证明论断。"}
        ],
        points:[{ms:"Semak tarikh penerbitan dan kesesuaian sumber dengan topik.",en:"Check the publication date and the source's relevance to the topic.",zh:"检查发布日期以及来源与主题的相关性。"},{ms:"Bandingkan dakwaan penting dengan lebih daripada satu sumber yang boleh dipercayai.",en:"Compare important claims against more than one reliable source.",zh:"将重要论断与多个可靠来源进行比较。"}],
        examples:[{ms:"Sebelum menerima dakwaan tentang kadar penggunaan pengangkutan awam, semak laporan asal, tahun data dikumpulkan dan kaedah pengiraan.",en:"Before accepting a claim about public transport usage rates, check the original report, the year the data was collected and the calculation method.",zh:"接受有关公共交通使用率的论断前，应检查原始报告、数据收集年份和计算方法。"}],
        mistakes:[{ms:"Jangan menganggap maklumat yang banyak dikongsi di media sosial semestinya tepat atau disahkan.",en:"Do not assume that information widely shared on social media is necessarily accurate or verified.",zh:"不要认为在社交媒体上广泛传播的信息必然准确或经过核实。"}],
        practices:[
          {q:{ms:"Apakah perkara yang patut disemak apabila menilai statistik?",en:"What should be checked when evaluating a statistic?",zh:"评估统计数据时应检查什么？"},options:[{ms:"Sumber, tarikh, kaedah dan konteks data.",en:"The data source, date, method and context.",zh:"数据来源、日期、方法和背景。"},{ms:"Warna carta sahaja.",en:"Only the chart colour.",zh:"仅图表颜色。"},{ms:"Bilangan tanda seru.",en:"The number of exclamation marks.",zh:"感叹号的数量。"},{ms:"Sama ada tajuknya menarik.",en:"Whether the title is interesting.",zh:"标题是否有趣。"}],answer:0},
          {q:{ms:"Mengapakah dakwaan penting wajar dibandingkan dengan sumber lain?",en:"Why should an important claim be compared with other sources?",zh:"为什么重要论断应与其他来源比较？"},options:[{ms:"Untuk menguji ketekalan dan mengesan percanggahan.",en:"To test consistency and detect contradictions.",zh:"检验一致性并发现矛盾。"},{ms:"Untuk memastikan semua sumber menggunakan ayat sama.",en:"To ensure all sources use identical sentences.",zh:"确保所有来源使用相同句子。"},{ms:"Untuk mengelakkan pembacaan lanjut.",en:"To avoid further reading.",zh:"避免进一步阅读。"},{ms:"Untuk memilih sumber paling panjang sahaja.",en:"To choose only the longest source.",zh:"只选择最长的来源。"}],answer:0},
          {q:{ms:"Apakah kelemahan petikan angka tanpa konteks?",en:"What is a weakness of a numerical quotation without context?",zh:"缺乏背景的数字引文有什么缺陷？"},options:[{ms:"Pembaca tidak dapat menilai maksud dan kesesuaiannya.",en:"Readers cannot assess its meaning and relevance.",zh:"读者无法判断其含义和相关性。"},{ms:"Angka itu semestinya palsu.",en:"The number must be false.",zh:"该数字必然是假的。"},{ms:"Angka itu tidak memerlukan sumber.",en:"The number does not need a source.",zh:"该数字不需要来源。"},{ms:"Semua statistik tidak boleh digunakan.",en:"No statistics can be used.",zh:"所有统计数据都不能使用。"}],answer:0}
        ]
      }
    ]
  };
  for(const level of ["beginner","intermediate","advanced"]){
    const ids=new Set(base[level].map(item=>item.id));
    for(const lesson of batch[level]){
      if(ids.has(lesson.id)) throw new Error("Duplicate Malay lesson ID: "+lesson.id);
      base[level].push(lesson);
    }
  }
  base.contentVersion="u3-ms-lessons-0.3.0";
  base.expansionBatches=(base.expansionBatches||[]).concat([{id:"batch-03",added:9,reviewStatus:"draft"}]);
})();
