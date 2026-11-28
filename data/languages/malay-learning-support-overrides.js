/* SwiftDictionary U3.0 — curated Malay support-language corrections.
 * These are model-assisted Malaysian Standard Malay drafts; owner/editor review remains pending.
 * Keep question IDs, option IDs and answer keys unchanged. */
(() => {
  const pack = window.SWIFT_MALAY_LEARNING_SUPPORT_TRANSLATIONS;
  if (!pack) return;
  const en = pack.quiz?.en;
  if (!en) return;
  const rows = {
    "quiz-advanced-001": {
      promptLearning:"Kata kerja manakah paling sesuai untuk menyatakan dakwaan ini secara berhati-hati? “Dapatan awal ___ bahawa proses baharu itu mungkin dapat mengurangkan kelewatan.”",
      explanationLearning:"“Suggest” menyatakan kemungkinan berdasarkan petunjuk yang ada tanpa mendakwa bahawa perkara itu telah dibuktikan secara muktamad.",
      options:{a:{learning:"membuktikan"},b:{learning:"menunjukkan"},c:{learning:"menjamin"},d:{learning:"mengesahkan"}}
    },
    "quiz-advanced-002": {
      promptLearning:"Lengkapkan pernyataan berhati-hati ini: Perbezaan itu mungkin ___ variasi dalam sampel.",
      explanationLearning:"Frasa “partly attributable to” menunjukkan bahawa sesuatu faktor mungkin menyumbang kepada hasil tersebut, tetapi bukan semestinya satu-satunya punca.",
      options:{a:{learning:"semestinya berpunca daripada"},b:{learning:"disebabkan sepenuhnya oleh"},c:{learning:"sebahagiannya berpunca daripada"},d:{learning:"pasti dapat dijelaskan oleh"}}
    },
    "quiz-advanced-003": {
      promptLearning:"Memandangkan saiz sampel yang terhad, dapatan tersebut harus ditafsirkan secara ___.",
      explanationLearning:"“Cautiously” menunjukkan bahawa bukti yang terhad tidak wajar digunakan untuk membuat kesimpulan yang terlalu yakin.",
      options:{a:{learning:"menyeluruh"},b:{learning:"berhati-hati"},c:{learning:"muktamad"},d:{learning:"harfiah"}}
    },
    "quiz-advanced-004": {
      promptLearning:"Corak yang diperhatikan adalah ___ dengan kajian terdahulu, walaupun kaedah yang digunakan berbeza.",
      explanationLearning:"“Consistent with” bermaksud corak itu selaras dengan dapatan terdahulu, tetapi tidak bermaksud kedua-dua kajian adalah serupa sepenuhnya.",
      options:{a:{learning:"serupa sepenuhnya"},b:{learning:"muktamad"},c:{learning:"selaras"},d:{learning:"terjamin"}}
    },
    "quiz-advanced-005": {
      promptLearning:"Peningkatan kos itu mungkin ___ perubahan harga pembekal.",
      explanationLearning:"“Stem from” bermaksud berpunca daripada atau disebabkan oleh sesuatu.",
      options:{a:{learning:"berpunca"},b:{learning:"membuktikan"},c:{learning:"membuat kesimpulan"},d:{learning:"memastikan"}}
    },
    "quiz-advanced-006": {
      promptLearning:"Tanpa kumpulan perbandingan yang lebih besar, adalah ___ untuk mendakwa bahawa rawatan itu lebih berkesan.",
      explanationLearning:"“Premature” bermaksud terlalu awal kerana bukti yang ada masih belum mencukupi untuk menyokong kesimpulan tersebut.",
      options:{a:{learning:"tidak dapat dielakkan"},b:{learning:"terlalu awal"},c:{learning:"muktamad"},d:{learning:"sejagat"}}
    },
    "quiz-advanced-007": {
      promptLearning:"Oleh sebab anggaran itu berdasarkan sampel yang kecil, anggaran tersebut masih bersifat ___.",
      explanationLearning:"“Tentative” menerangkan kesimpulan sementara yang mungkin berubah apabila bukti tambahan diperoleh.",
      options:{a:{learning:"mutlak"},b:{learning:"sementara"},c:{learning:"akhir"},d:{learning:"pasti"}}
    },
    "quiz-advanced-008": {
      promptLearning:"Jadual yang disemak itu berkemungkinan hanya memberikan kesan ___ terhadap jumlah kos dan bukannya mengubah keseluruhan belanjawan.",
      explanationLearning:"“Modest effect” bermaksud kesannya terhad atau sederhana, bukannya perubahan yang besar atau menyeluruh.",
      options:{a:{learning:"sederhana"},b:{learning:"terjamin"},c:{learning:"sejagat"},d:{learning:"mutlak"}}
    },
    "quiz-advanced-009": {
      promptLearning:"Bukti yang ada ___ menunjukkan hubungan antara tidur dengan tumpuan, tetapi kajian lanjut masih diperlukan.",
      explanationLearning:"“Tentatively” menyampaikan bahawa bukti memberikan petunjuk tentang hubungan tersebut, tetapi belum membuktikannya secara muktamad.",
      options:{a:{learning:"tanpa sebarang pertikaian"},b:{learning:"secara kekal"},c:{learning:"secara sementara"},d:{learning:"secara muktamad"}}
    },
    "quiz-advanced-010": {
      promptLearning:"Hasil tinjauan itu ___ kemungkinan bahawa waktu kerja yang fleksibel dapat meningkatkan pengekalan kakitangan.",
      explanationLearning:"Frasa “raise the possibility” mengemukakan satu kemungkinan yang munasabah untuk dipertimbangkan tanpa mengesahkannya.",
      options:{a:{learning:"menyelesaikan"},b:{learning:"menimbulkan"},c:{learning:"menjamin"},d:{learning:"menolak"}}
    },
    "quiz-advanced-011": {
      promptLearning:"Lengkapkan ayat ini: Hanya selepas laporan akhir diterbitkan, barulah orang ramai ___ skala masalah tersebut.",
      explanationLearning:"Frasa negatif yang diletakkan di hadapan seperti “Not until” memerlukan penyongsangan subjek-kata bantu dalam klausa utama: “did the public understand”.",
      options:{a:{learning:"memahami orang ramai"},b:{learning:"barulah orang ramai memahami"},c:{learning:"orang ramai memang telah memahami"},d:{learning:"memahami orang ramai itu"}}
    },
    "quiz-advanced-012": {
      promptLearning:"Pilih struktur penyongsangan yang betul: Jarang sekali ___ analisis isu yang begitu terperinci.",
      explanationLearning:"Apabila “Rarely” diletakkan pada awal klausa, subjek dan kata bantu perlu diterbalikkan: “have we seen”.",
      options:{a:{learning:"kami pernah melihat"},b:{learning:"pernahkah kami melihat"},c:{learning:"kami telah melihat"},d:{learning:"kami melihat"}}
    },
    "quiz-advanced-013": {
      promptLearning:"Lengkapkan ayat ini: Hanya selepas data diperiksa, barulah pasukan itu ___ laporan tersebut.",
      explanationLearning:"Apabila “Only after” memperkenalkan klausa syarat di hadapan, klausa utama menggunakan penyongsangan: “did the team release”.",
      options:{a:{learning:"pasukan itu memang menerbitkan"},b:{learning:"pasukan itu telah menerbitkan"},c:{learning:"barulah pasukan itu menerbitkan"},d:{learning:"pasukan itu ialah"}}
    },
    "quiz-advanced-014": {
      promptLearning:"Pilih bentuk penyongsangan formal yang betul: Dalam apa jua keadaan, ___ fail sulit dengan pihak luar.",
      explanationLearning:"“Under no circumstances” ialah frasa negatif yang diletakkan di hadapan ayat dan memerlukan penyongsangan: “should staff share”.",
      options:{a:{learning:"kakitangan patut berkongsi"},b:{learning:"patutkah kakitangan berkongsi"},c:{learning:"kakitangan berkongsi"},d:{learning:"kakitangan pernah berkongsi"}}
    },
    "quiz-advanced-015": {
      promptLearning:"Lengkapkan ayat bersyarat songsang jenis ketiga ini: Sekiranya saya tahu tentang kelewatan itu, saya ___ tren yang lebih awal.",
      explanationLearning:"“Had I known” menggantikan “If I had known”. Hasil andaian lampau menggunakan “would have” diikuti past participle.",
      options:{a:{learning:"akan menaiki"},b:{learning:"akan sudah menaiki"},c:{learning:"tentunya telah menaiki"},d:{learning:"telah menaiki"}}
    },
    "quiz-advanced-016": {
      promptLearning:"Pilih pelengkap yang betul: Sebaik sahaja ___, lampu pun terpadam.",
      explanationLearning:"Struktur “No sooner had + subjek + past participle + than” menerangkan satu peristiwa yang berlaku sejurus selepas peristiwa lain.",
      options:{a:{learning:"kami telah duduk"},b:{learning:"kami duduk dengan kata bantu did"},c:{learning:"kami baru sahaja duduk"},d:{learning:"kami duduk"}}
    },
    "quiz-advanced-017": {
      promptLearning:"Lengkapkan ayat ini: Langsung tidak ___ bahawa keputusan itu akan mengubah industri tersebut.",
      explanationLearning:"“Little” yang bermaksud “langsung tidak” pada awal klausa mencetuskan penyongsangan: “did they know”.",
      options:{a:{learning:"mereka tahu"},b:{learning:"tahukah mereka"},c:{learning:"mereka memang tahu"},d:{learning:"pernahkah mereka tahu"}}
    },
    "quiz-advanced-018": {
      promptLearning:"Pilih struktur yang betul: Bukan sahaja ___ belanjawan, malah rancangan itu turut mengurangkan kelewatan.",
      explanationLearning:"Apabila “Not only” memulakan klausa, kata bantu perlu mendahului subjek: “did the plan cut”.",
      options:{a:{learning:"rancangan itu mengurangkan"},b:{learning:"rancangan itu mengurangkan (dengan penyongsangan did)"},c:{learning:"rancangan itu telah mengurangkan (bentuk kata kerja tidak betul)"},d:{learning:"rancangan itu memang mengurangkan (bentuk kata kerja tidak betul)"}}
    },
    "quiz-advanced-019": {
      promptLearning:"Pilih bentuk penyongsangan pasif yang melengkapkan ayat ini dengan betul: “Tidak pernah sekali pun ___ tentang perubahan pada kontrak itu.”",
      explanationLearning:"Frasa negatif “At no point” mencetuskan penyongsangan. Bentuk pasif yang betul ialah “was the client informed”.",
      options:{a:{learning:"pelanggan menerima notis"},b:{learning:"pelanggan memaklumkan"},c:{learning:"pelanggan telah dimaklumkan"},d:{learning:"pelanggan memang memaklumkan"}}
    },
    "quiz-advanced-020": {
      promptLearning:"Lengkapkan struktur penegasan ini: Begitu tidak dijangka ___ sehingga jawatankuasa meminta semakan kedua.",
      explanationLearning:"Struktur “So + kata adjektif” pada awal ayat mencetuskan penyongsangan: “So unexpected was the result that...”.",
      options:{a:{learning:"keputusan itu"},b:{learning:"keputusan itu melakukan"},c:{learning:"keputusan itu benar-benar"},d:{learning:"keputusan itu telah"}}
    },
    "quiz-advanced-021": {
      promptLearning:"Pilih ayat bersyarat campuran yang betul: Jika saya menerima biasiswa itu, saya ___ di universiti sekarang.",
      explanationLearning:"Past perfect menerangkan pilihan lampau yang tidak berlaku, manakala “would be studying” menyatakan kesannya pada masa kini.",
      options:{a:{learning:"tentunya telah belajar"},b:{learning:"akan sedang belajar"},c:{learning:"akan belajar sekarang"},d:{learning:"telah belajar"}}
    },
    "quiz-advanced-022": {
      promptLearning:"Jika dia lebih teratur, dia ___ tarikh akhir semalam.",
      explanationLearning:"Syarat andaian masa kini menggunakan “were”, manakala hasil lampau yang tidak berlaku menggunakan “would not have missed”.",
      options:{a:{learning:"tidak akan terlepas"},b:{learning:"tentunya tidak terlepas"},c:{learning:"tidak akan terlepas pada masa hadapan"},d:{learning:"tidak terlepas sebelum itu"}}
    },
    "quiz-advanced-023": {
      promptLearning:"Jika mereka tidak berpindah ke luar negara, mereka ___ di sini sekarang.",
      explanationLearning:"Syarat past perfect merujuk kepada peristiwa lampau yang tidak berlaku, manakala “would still be living” menyatakan hasil andaian pada masa kini.",
      options:{a:{learning:"masih akan tinggal"},b:{learning:"akan terus tinggal"},c:{learning:"tentunya masih pernah tinggal"},d:{learning:"telah tinggal sebelum itu"}}
    },
    "quiz-advanced-024": {
      promptLearning:"Jika dia mengambil ubat itu, dia ___ lebih sihat sekarang.",
      explanationLearning:"Syarat lampau yang tidak berlaku membawa kepada hasil pada masa kini. Oleh itu, klausa utama menggunakan “would feel”.",
      options:{a:{learning:"akan berasa"},b:{learning:"tentunya telah berasa"},c:{learning:"akan berasa sekarang"},d:{learning:"telah berasa"}}
    },
    "quiz-advanced-025": {
      promptLearning:"Jika saya tidak takut akan tempat tinggi, saya ___ pendakian itu pada hujung minggu lalu.",
      explanationLearning:"Syarat andaian masa kini, “were not afraid”, menerangkan hasil lampau yang berbeza dan tidak berlaku: “would have joined”.",
      options:{a:{learning:"akan menyertai"},b:{learning:"akan sudah menyertai"},c:{learning:"tentunya telah menyertai"},d:{learning:"telah menyertai"}}
    },
    "quiz-advanced-026": {
      promptLearning:"Jika syarikat itu telah melabur lebih awal, syarikat itu ___ bahagian pasaran yang lebih besar pada hari ini.",
      explanationLearning:"Past perfect menerangkan pelaburan terdahulu yang tidak berlaku, manakala “would have” menerangkan keadaan pada masa kini.",
      options:{a:{learning:"akan mempunyai"},b:{learning:"akan mempunyai pada masa kini"},c:{learning:"pasti telah mempunyai"},d:{learning:"telah mempunyai"}}
    },
    "quiz-advanced-027": {
      promptLearning:"Jika kita telah menyemak peta itu, kita ___ sesat sekarang.",
      explanationLearning:"Keadaan lampau yang tidak berlaku memberikan kesan kepada keadaan masa kini. Oleh itu, “would not be lost now” ialah hasil campuran yang betul.",
      options:{a:{learning:"tidak akan berada dalam keadaan"},b:{learning:"tidak akan"},c:{learning:"tidak akan berada sebelum ini"},d:{learning:"tidak pernah"}}
    },
    "quiz-advanced-028": {
      promptLearning:"Jika dia fasih berbahasa Perancis, dia ___ tugasan di Paris itu pada tahun lepas.",
      explanationLearning:"Keadaan kebolehan pada masa kini yang tidak benar membawa kepada hasil lampau yang tidak berlaku, yang dinyatakan dengan “would have accepted”.",
      options:{a:{learning:"akan menerima"},b:{learning:"akan menerima sekarang"},c:{learning:"pasti telah menerima"},d:{learning:"telah menerima"}}
    },
    "quiz-advanced-029": {
      promptLearning:"Jika sistem itu lebih andal, sistem itu ___ semasa gangguan perkhidmatan semalam.",
      explanationLearning:"Keadaan andaian pada masa kini, “were more reliable”, dikaitkan dengan hasil lampau yang tidak berlaku: “would not have failed”.",
      options:{a:{learning:"tidak akan gagal"},b:{learning:"tidak akan mengalami kegagalan"},c:{learning:"tidak akan gagal pada masa hadapan"},d:{learning:"tidak pernah gagal"}}
    },
    "quiz-advanced-030": {
      promptLearning:"Jika saya menyimpan lebih banyak wang, saya ___ sebuah komputer riba baharu sekarang.",
      explanationLearning:"Past perfect menerangkan tabiat menyimpan wang pada masa lampau yang tidak berlaku; “could afford” menyatakan hasilnya pada masa kini.",
      options:{a:{learning:"mampu membeli"},b:{learning:"sebenarnya mampu membeli ketika itu"},c:{learning:"boleh membeli"},d:{learning:"telah mampu membeli"}}
    },
    "quiz-advanced-031": {
      promptLearning:"Selepas berbulan-bulan membuat perancangan, pasukan itu akhirnya memulakan usaha tersebut. Apakah maksud ungkapan “get the ball rolling”?",
      explanationLearning:"“Get the ball rolling” bermaksud memulakan sesuatu aktiviti, proses atau projek.",
      options:{a:{learning:"Mereka memulakan aktiviti atau proses tersebut."},b:{learning:"Mereka menamatkan projek itu buat selama-lamanya."},c:{learning:"Mereka mengelak daripada membuat keputusan."},d:{learning:"Mereka mengulangi peringkat perancangan."}}
    },
    "quiz-advanced-032": {
      promptLearning:"Kegagalan pemeriksaan keselamatan itu hanyalah sebahagian kecil daripada masalah sebenar. Apakah maksud yang tersirat?",
      explanationLearning:"“The tip of the iceberg” merujuk kepada bahagian kecil yang kelihatan daripada masalah lebih besar yang masih tersembunyi.",
      options:{a:{learning:"Masalah itu lebih kecil daripada yang kelihatan."},b:{learning:"Masalah yang kelihatan hanyalah sebahagian daripada masalah yang jauh lebih besar."},c:{learning:"Masalah itu sudah diselesaikan."},d:{learning:"Masalah itu berpunca daripada cuaca sejuk."}}
    },
    "quiz-advanced-033": {
      promptLearning:"Kontraktor itu mengambil jalan pintas untuk menyiapkan bangunan lebih awal. Apakah yang dilakukan oleh kontraktor tersebut?",
      explanationLearning:"“Cut corners” bermaksud mengambil jalan pintas, lazimnya dengan mengorbankan mutu kerja atau prosedur yang sepatutnya.",
      options:{a:{learning:"Mematuhi setiap prosedur kualiti dengan teliti."},b:{learning:"Mengurangkan piawaian kualiti atau keselamatan untuk menjimatkan masa atau wang."},c:{learning:"Menambah pemeriksaan tambahan dalam jadual."},d:{learning:"Mengubah reka bentuk tanpa mengubah kos."}}
    },
    "quiz-advanced-034": {
      promptLearning:"Sebelum membentangkan cadangan itu, kita perlu memastikan semua orang mempunyai pemahaman yang sama. Apakah maksud ungkapan “on the same page”?",
      explanationLearning:"“On the same page” bermaksud mempunyai pemahaman yang sama; ungkapan ini tidak semestinya bermaksud bersetuju tentang setiap perkara.",
      options:{a:{learning:"Semua orang mempunyai pemahaman yang sama."},b:{learning:"Semua orang bekerja di pejabat yang sama."},c:{learning:"Semua orang telah menyiapkan dokumen yang sama."},d:{learning:"Semua orang bersetuju dengan setiap butiran."}}
    },
    "quiz-advanced-035": {
      promptLearning:"Selepas kemas kini perisian menimbulkan lebih banyak masalah, pasukan itu terpaksa kembali ke titik permulaan. Apakah yang berlaku?",
      explanationLearning:"“Back to square one” bermaksud terpaksa kembali ke permulaan dan memulakan semula.",
      options:{a:{learning:"Pasukan itu telah menyiapkan projek tersebut."},b:{learning:"Pasukan itu terpaksa kembali ke permulaan dan bermula semula."},c:{learning:"Pasukan itu telah menemui penyelesaian kekal."},d:{learning:"Pasukan itu telah berpindah ke pejabat lain."}}
    },
    "quiz-advanced-036": {
      promptLearning:"Dia masih belum membuat keputusan sama ada mahu menerima kenaikan pangkat itu. Apakah maksud ungkapan “on the fence”?",
      explanationLearning:"“On the fence” bermaksud belum membuat keputusan antara beberapa pilihan.",
      options:{a:{learning:"Dia sudah menerimanya."},b:{learning:"Dia sangat menentangnya."},c:{learning:"Dia belum memutuskan sama ada mahu menerimanya."},d:{learning:"Dia mahu orang lain menerima kenaikan pangkat itu."}}
    }
  };
  Object.assign(rows, {
    "quiz-beginner-001":{promptLearning:"Pilih kata kerja yang betul: Setiap orang boleh melakukan kesilapan apabila mereka letih.",explanationLearning:"Padanan kata yang lazim ialah “make a mistake”, yang bermaksud melakukan kesilapan.",options:{a:{learning:"melakukan"},b:{learning:"mengambil"},c:{learning:"membuat"},d:{learning:"mempunyai"}}},
    "quiz-beginner-002":{promptLearning:"Frasa manakah bermaksud berhenti bekerja seketika untuk berehat?",explanationLearning:"“Take a break” ialah ungkapan lazim untuk berhenti seketika dan berehat.",options:{a:{learning:"membuat rehat"},b:{learning:"melakukan rehat"},c:{learning:"berehat seketika"},d:{learning:"mengadakan rehat"}}},
    "quiz-beginner-003":{promptLearning:"Frasa manakah yang lazim digunakan untuk menyatakan bahawa seseorang makan pada waktu pagi?",explanationLearning:"“Have breakfast” ialah ungkapan biasa untuk menyatakan bahawa seseorang bersarapan.",options:{a:{learning:"menyediakan sarapan"},b:{learning:"bersarapan"},c:{learning:"melakukan sarapan"},d:{learning:"memasak sarapan"}}},
    "quiz-beginner-004":{promptLearning:"Lengkapkan ayat: Saya ___ kerja sekolah selepas makan malam.",explanationLearning:"Padanan kata kerja yang lazim ialah “do homework”, iaitu menyiapkan kerja sekolah.",options:{a:{learning:"membuat"},b:{learning:"mengambil"},c:{learning:"melakukan / menyiapkan"},d:{learning:"mempunyai"}}},
    "quiz-beginner-005":{promptLearning:"Pilih kata sandang yang betul: Dia membeli ___ payung.",explanationLearning:"“Umbrella” bermula dengan bunyi vokal, maka kata sandang tak tentu “an” digunakan.",options:{a:{learning:"satu (a)"},b:{learning:"satu (an)"},c:{learning:"itu (the)"},d:{learning:"tanpa kata sandang"}}},
    "quiz-beginner-006":{promptLearning:"Pilih kata sandang yang betul: ___ matahari terbit di sebelah timur.",explanationLearning:"“The” digunakan kerana dalam konteks ini kita merujuk kepada matahari yang satu dan unik.",options:{a:{learning:"satu (a)"},b:{learning:"satu (an)"},c:{learning:"kata sandang tentu (the)"},d:{learning:"tanpa kata sandang"}}},
    "quiz-beginner-007":{promptLearning:"Pilih kata sandang yang betul: Dia belajar di ___ universiti di Kuala Lumpur.",explanationLearning:"“University” bermula dengan bunyi konsonan /j/ seperti bunyi “y”, maka “a” digunakan.",options:{a:{learning:"satu (a)"},b:{learning:"satu (an)"},c:{learning:"kata sandang tentu (the)"},d:{learning:"tanpa kata sandang"}}},
    "quiz-beginner-008":{promptLearning:"Pilih kata sandang yang betul: Itu ialah ___ kesilapan yang tidak disengajakan.",explanationLearning:"Huruf “h” dalam “honest” tidak disebut. Oleh itu, perkataan itu bermula dengan bunyi vokal dan menggunakan “an”.",options:{a:{learning:"satu (a)"},b:{learning:"satu (an)"},c:{learning:"kata sandang tentu (the)"},d:{learning:"tanpa kata sandang"}}},
    "quiz-beginner-009":{promptLearning:"Pilih bentuk jamak yang betul: seorang kanak-kanak, dua ___.",explanationLearning:"“Child” mempunyai bentuk jamak tidak sekata, iaitu “children”, bukannya dengan menambah -s.",options:{a:{learning:"childs"},b:{learning:"childes"},c:{learning:"kanak-kanak (children)"},d:{learning:"childrens"}}},
    "quiz-beginner-010":{promptLearning:"Frasa manakah betul dalam bahasa Inggeris standard?",explanationLearning:"“Advice” ialah kata nama tidak boleh bilang. Untuk merujuk kepada satu nasihat, gunakan “a piece of advice”.",options:{a:{learning:"satu nasihat (bentuk tidak standard)"},b:{learning:"sepotong / satu nasihat"},c:{learning:"banyak nasihat (bentuk tidak standard)"},d:{learning:"dua nasihat (bentuk tidak standard)"}}},
    "quiz-beginner-011":{promptLearning:"Pilih perkataan yang betul: Berapa ___ biji epal yang kita perlukan?",explanationLearning:"“Apples” ialah kata nama boleh bilang dalam bentuk jamak. Oleh itu, soalan menggunakan “many”.",options:{a:{learning:"much: untuk kata nama tidak boleh bilang"},b:{learning:"many: untuk kata nama boleh bilang"},c:{learning:"any: sebarang"},d:{learning:"little: sedikit"}}},
    "quiz-beginner-012":{promptLearning:"Pilih perkataan yang betul: Air di dalam botol itu tidak ___ banyak.",explanationLearning:"“Water” ialah kata nama tidak boleh bilang dalam konteks ini. “Much” digunakan dalam ayat negatif tersebut.",options:{a:{learning:"many: untuk kata nama boleh bilang"},b:{learning:"a few: beberapa"},c:{learning:"much: banyak untuk kata nama tidak boleh bilang"},d:{learning:"several: beberapa"}}},
    "quiz-beginner-013":{promptLearning:"Ayat manakah mengikut susunan subjek–kata kerja–objek yang lazim?",explanationLearning:"“Mia” ialah subjek, “reads” ialah kata kerja dan “a book” ialah objek. Susunannya ialah subjek + kata kerja + objek.",options:{a:{learning:"Membaca Mia sebuah buku."},b:{learning:"Mia sebuah buku membaca."},c:{learning:"Sebuah buku Mia membaca."},d:{learning:"Mia membaca sebuah buku."}}},
    "quiz-beginner-014":{promptLearning:"Pilih susunan perkataan yang betul.",explanationLearning:"Susunan ayat penyata yang lazim ialah subjek + kata kerja + frasa tempat.",options:{a:{learning:"Mereka berada di rumah."},b:{learning:"Adakah mereka rumah di?"},c:{learning:"Di rumah berada mereka."},d:{learning:"Mereka di berada rumah."}}},
    "quiz-beginner-015":{promptLearning:"Pilih soalan simple present yang menggunakan “does” dengan “he” dan bertanya sama ada dia bekerja di sini.",explanationLearning:"Selepas kata bantu “does”, kata kerja utama kekal dalam bentuk asas, iaitu “work”.",options:{a:{learning:"Adakah dia bekerja di sana?"},b:{learning:"Adakah mereka bekerja di sini?"},c:{learning:"Adakah dia bekerja di sini?"},d:{learning:"Adakah dia sedang bekerja di sini?"}}},
    "quiz-beginner-016":{promptLearning:"Pilih ayat yang meletakkan kata adjektif pada kedudukan yang lazim.",explanationLearning:"Dalam frasa nama bahasa Inggeris, kata adjektif “red” hadir sebelum kata nama “bag”.",options:{a:{learning:"Dia mempunyai beg merah (kata adjektif selepas kata nama)."},b:{learning:"Dia mempunyai merah sebuah beg."},c:{learning:"Dia mempunyai sebuah beg merah."},d:{learning:"Merah dia mempunyai sebuah beg."}}},
    "quiz-beginner-017":{promptLearning:"Pilih bentuk simple present yang betul: Abang saya ___ ke sekolah dengan bas.",explanationLearning:"Subjek orang ketiga tunggal seperti “my brother” memerlukan kata kerja simple present yang berakhiran -s atau -es.",options:{a:{learning:"go: bentuk asas"},b:{learning:"goes: bentuk orang ketiga tunggal"},c:{learning:"going: bentuk -ing"},d:{learning:"gone: past participle"}}},
    "quiz-beginner-018":{promptLearning:"Pilih ayat negatif yang gramatis tentang kopi.",explanationLearning:"Dengan subjek “they”, gunakan “do not” atau “don't”, diikuti kata kerja asas “like”.",options:{a:{learning:"Mereka tidak suka susu (doesn't tidak sepadan dengan they)."},b:{learning:"Mereka tidak suka teh (kata bantu do digugurkan)."},c:{learning:"Mereka tidak suka jus (likes tidak sepadan)."},d:{learning:"Mereka tidak suka kopi."}}},
    "quiz-beginner-019":{promptLearning:"Pilih ayat simple present yang betul untuk menerangkan tabiat yang dilakukan secara tetap.",explanationLearning:"“Every day” menunjukkan tabiat tetap. Dengan subjek “she”, bentuk kata kerja yang betul ialah “walks”.",options:{a:{learning:"Dia berjalan ke tempat kerja setiap hari."},b:{learning:"Dia berjalan ke tempat kerja semalam."},c:{learning:"Dia sedang berjalan ke tempat kerja sekarang."},d:{learning:"Dia akan berjalan ke tempat kerja esok."}}},
    "quiz-beginner-020":{promptLearning:"Lengkapkan ayat: Kami ___ makan malam di rumah pada setiap hari Jumaat.",explanationLearning:"Subjek “we” menggunakan bentuk asas kata kerja simple present, iaitu “have”.",options:{a:{learning:"has: bentuk orang ketiga tunggal"},b:{learning:"having: bentuk -ing"},c:{learning:"have: bentuk asas"},d:{learning:"had: bentuk lampau"}}},
    "quiz-beginner-021":{promptLearning:"Pilih kata kerja yang betul: Sila ___ perhatian kepada jalan raya.",explanationLearning:"Ungkapan bahasa Inggeris yang standard ialah “pay attention”, yang bermaksud memberikan perhatian.",options:{a:{learning:"make: membuat"},b:{learning:"do: melakukan"},c:{learning:"pay: memberikan"},d:{learning:"take: mengambil"}}},
    "quiz-beginner-022":{promptLearning:"Frasa manakah bermaksud menunaikan apa yang telah dijanjikan?",explanationLearning:"“Keep a promise” bermaksud menepati atau menunaikan janji yang telah dibuat.",options:{a:{learning:"membuat janji"},b:{learning:"menepati janji"},c:{learning:"memungkiri janji"},d:{learning:"mengambil janji"}}},
    "quiz-beginner-023":{promptLearning:"Pilih kata sandang yang betul: Kami mengambil masa ___ jam untuk sampai ke stesen.",explanationLearning:"Huruf “h” dalam “hour” tidak disebut. Perkataan itu bermula dengan bunyi vokal, maka “an” digunakan.",options:{a:{learning:"satu (a)"},b:{learning:"kata sandang tentu (the)"},c:{learning:"tanpa kata sandang"},d:{learning:"satu (an)"}}},
    "quiz-beginner-024":{promptLearning:"Pilih kata sandang yang betul: Dia membeli ___ kamus yang berguna.",explanationLearning:"“Useful” bermula dengan bunyi konsonan /j/ seperti bunyi “y”. Oleh itu, kata sandang yang betul ialah “a”.",options:{a:{learning:"satu (an)"},b:{learning:"satu (a)"},c:{learning:"kata sandang tentu (the)"},d:{learning:"tanpa kata sandang"}}},
    "quiz-beginner-025":{promptLearning:"Lengkapkan ayat: Terdapat dua ___ roti di atas pinggan.",explanationLearning:"Kuantiti “two” memerlukan unit boleh bilang dalam bentuk jamak. “Two slices of bread” ialah ungkapan yang betul.",options:{a:{learning:"slice: bentuk tunggal"},b:{learning:"slices: bentuk jamak"},c:{learning:"breads: bentuk jamak tidak tepat"},d:{learning:"loafs: bentuk jamak tidak tepat"}}},
    "quiz-beginner-026":{promptLearning:"Pilih kata nama tidak boleh bilang: Berapa banyak ___ yang kita perlukan untuk resipi ini?",explanationLearning:"“Sugar” ialah kata nama tidak boleh bilang dalam konteks ini, maka perkataan itu sesuai digunakan dengan “much”.",options:{a:{learning:"telur"},b:{learning:"lobak merah"},c:{learning:"gula"},d:{learning:"epal"}}},
    "quiz-beginner-027":{promptLearning:"Pilih ayat yang betul: ___ tiga buah kerusi di dalam bilik itu.",explanationLearning:"“Three chairs” ialah kata nama jamak. Oleh itu, struktur yang betul ialah “There are”.",options:{a:{learning:"There is: untuk bentuk tunggal"},b:{learning:"It are: tidak gramatis"},c:{learning:"There are: untuk bentuk jamak"},d:{learning:"They has: tidak gramatis"}}},
    "quiz-beginner-028":{promptLearning:"Pilih perkataan yang betul untuk memulakan soalan simple present ini: ___ anda suka muzik?",explanationLearning:"Untuk soalan simple present dengan subjek “you”, gunakan kata bantu “do”.",options:{a:{learning:"kata bantu does"},b:{learning:"kata bantu do"},c:{learning:"kata kerja be: are"},d:{learning:"kata kerja be: is"}}},
    "quiz-beginner-029":{promptLearning:"Pilih bentuk simple present yang betul: Kedai itu ___ pada pukul sembilan setiap pagi.",explanationLearning:"“The shop” ialah subjek orang ketiga tunggal, maka kata kerja simple present perlu berakhiran -s.",options:{a:{learning:"open: bentuk asas"},b:{learning:"opening: bentuk -ing"},c:{learning:"opens: bentuk orang ketiga tunggal"},d:{learning:"opened: bentuk lampau"}}},
    "quiz-beginner-030":{promptLearning:"Ayat manakah menggunakan “usually” sebelum kata kerja utama dan menyatakan bahawa dia minum teh pada waktu petang?",explanationLearning:"Kata keterangan kekerapan seperti “usually” lazimnya diletakkan sebelum kata kerja utama: “She usually drinks tea in the evening.”",options:{a:{learning:"Dia biasanya minum teh pada waktu pagi."},b:{learning:"Dia minum usually teh pada waktu petang."},c:{learning:"Dia biasanya minum teh pada waktu petang."},d:{learning:"Dia minum teh pada waktu petang setiap hari."}}},
    "quiz-intermediate-001":{promptLearning:"Program latihan baharu itu sepatutnya membantu pekerja ___ kemajuan dalam kemahiran komunikasi mereka.",explanationLearning:"Padanan kata kerja yang standard ialah “make progress”, yang bermaksud mencapai kemajuan.",options:{a:{learning:"melakukan"},b:{learning:"mengambil"},c:{learning:"mencapai / membuat"},d:{learning:"mempunyai"}}},
    "quiz-intermediate-002":{promptLearning:"Acara luar itu dibatalkan kerana hujan yang ___.",explanationLearning:"Dalam bahasa Inggeris, “heavy rain” ialah padanan kata yang lazim untuk hujan lebat.",options:{a:{learning:"lebat"},b:{learning:"kuat"},c:{learning:"tebal"},d:{learning:"pepejal"}}},
    "quiz-intermediate-003":{promptLearning:"Kata kerja manakah bermaksud menyiapkan kerja sebelum atau pada tarikh akhir yang ditetapkan: ___ tarikh akhir?",explanationLearning:"“Meet the deadline” bermaksud menyiapkan kerja sebelum atau pada tarikh akhir yang ditetapkan.",options:{a:{learning:"memenuhi / menepati"},b:{learning:"terlepas"},c:{learning:"melanjutkan"},d:{learning:"membatalkan"}}},
    "quiz-intermediate-004":{promptLearning:"Semasa mesyuarat, Maya ___ satu isu penting tentang khidmat pelanggan.",explanationLearning:"“Raise an issue” bermaksud membangkitkan sesuatu masalah atau perkara supaya diberikan perhatian.",options:{a:{learning:"membangkitkan"},b:{learning:"bangkit / terbit"},c:{learning:"membesar"},d:{learning:"mengangkat"}}},
    "quiz-intermediate-005":{promptLearning:"Berdasarkan ramalan cuaca yang baik, kemungkinan konsert luar itu dibatalkan adalah ___.",explanationLearning:"“Highly unlikely” ialah padanan kata semula jadi yang bermaksud sangat tidak mungkin berlaku.",options:{a:{learning:"sangat tidak mungkin (strongly)"},b:{learning:"amat tidak mungkin (deeply; tidak lazim)"},c:{learning:"sangat tidak mungkin berlaku (highly)"},d:{learning:"sangat tidak mungkin (heavily; tidak lazim)"}}},
    "quiz-intermediate-006":{promptLearning:"Setiap ahli pasukan mesti ___ tanggungjawab untuk menyemak hasil kerja masing-masing.",explanationLearning:"Ungkapan standard ialah “take responsibility for”, yang bermaksud memikul tanggungjawab terhadap sesuatu.",options:{a:{learning:"membuat"},b:{learning:"melakukan"},c:{learning:"memikul"},d:{learning:"memegang"}}}
  });
  Object.entries(rows).forEach(([id, row]) => {
    if (en[id]) {
      en[id].promptLearning = row.promptLearning;
      en[id].explanationLearning = row.explanationLearning;
      Object.entries(row.options).forEach(([optionId, value]) => {
        if (en[id].options?.[optionId]) en[id].options[optionId].learning = value.learning;
      });
    }
  });
  const zh = pack.quiz?.zh;
  const zhRows = {
    "zh-en-a-complex-sentences-01":{promptLearning:"Ayat yang manakah menggunakan struktur “把” untuk menerangkan cara sesuatu objek dikenakan tindakan?",explanationLearning:"Struktur “把” meletakkan objek yang menerima kesan tindakan sebelum kata kerja. “关上” menunjukkan bahawa tindakan menutup pintu telah selesai.",options:{o1:{learning:"Sila tutup pintu."},o2:{learning:"Pintu berada di sini."},o3:{learning:"Saya nampak pintu."},o4:{learning:"Pintu itu besar."}}},
    "zh-en-a-complex-sentences-02":{promptLearning:"Apakah fungsi utama “被” dalam ayat pasif?",explanationLearning:"“被” memperkenalkan pelaku atau sumber sesuatu tindakan dan menunjukkan bahawa subjek menerima tindakan tersebut. Oleh itu, unsur ini membentuk ayat pasif.",options:{o1:{learning:"Menandakan ayat pasif."},o2:{learning:"Menandakan pemilikan."},o3:{learning:"Membentuk soalan ya atau tidak."},o4:{learning:"Menandakan perbandingan."}}},
    "zh-en-a-complex-sentences-03":{promptLearning:"Pola ayat yang manakah menunjukkan hubungan antara syarat yang wajib dipenuhi dengan hasil selepasnya?",explanationLearning:"“只有” memperkenalkan syarat yang wajib dipenuhi, manakala “才” memperkenalkan hasil yang hanya akan berlaku apabila syarat itu dipenuhi.",options:{o1:{learning:"只有……才…… (hanya jika... barulah...)"},o2:{learning:"无论……都…… (walau apa pun... tetap...)"},o3:{learning:"既然……就…… (memandangkan... maka...)"},o4:{learning:"虽然……但是…… (walaupun... namun...)"} }},
    "zh-en-a-complex-sentences-04":{promptLearning:"Pola ayat yang manakah bermaksud “hasilnya tetap sama tanpa mengira keadaannya”?",explanationLearning:"“无论” menunjukkan bahawa syarat tidak dihadkan, manakala “都” menegaskan bahawa hasilnya tetap sama dalam semua keadaan.",options:{o1:{learning:"无论……都…… (walau apa pun... tetap...)"},o2:{learning:"只有……才…… (hanya jika... barulah...)"},o3:{learning:"因为……所以…… (kerana... oleh itu...)"},o4:{learning:"不但……而且…… (bukan sahaja... malah...)"} }},
    "zh-en-a-complex-sentences-05":{promptLearning:"Ayat yang manakah menggunakan bentuk pasif untuk menyatakan bahawa telefon bimbit penutur telah diambil oleh adik lelakinya?",explanationLearning:"Ini ialah ayat pasif. Telefon bimbit ialah objek yang menerima tindakan, “被弟弟” menyatakan pelakunya, manakala “拿走了” menunjukkan hasil tindakan itu.",options:{o1:{learning:"Telefon bimbit saya telah diambil oleh adik lelaki saya."},o2:{learning:"Saya membawa adik lelaki saya pergi."},o3:{learning:"Adik lelaki saya ternampak telefon bimbit itu."},o4:{learning:"Telefon bimbit itu berada di sebelah adik lelaki saya."}}},
    "zh-en-a-complex-sentences-06":{promptLearning:"Pola ayat yang manakah menggunakan fakta yang telah diketahui sebagai alasan untuk membuat kesimpulan?",explanationLearning:"“既然” memperkenalkan fakta yang telah dipastikan, manakala “就” menghubungkan fakta itu dengan kesimpulan atau tindakan seterusnya.",options:{o1:{learning:"既然……就…… (memandangkan... maka...)"},o2:{learning:"一边……一边…… (sambil... pada masa yang sama...)"},o3:{learning:"先……然后…… (mula-mula... kemudian...)"},o4:{learning:"越……越…… (semakin... semakin...)"} }},
    "zh-en-a-complex-sentences-07":{promptLearning:"Ayat yang manakah menggunakan struktur “把” dengan betul dan menyatakan bahawa kerja sekolah telah disiapkan sepenuhnya?",explanationLearning:"Dalam “我把作业写完了”, “把” meletakkan objek “作业” sebelum kata kerja, manakala “写完” menunjukkan bahawa tindakan itu telah selesai.",options:{o1:{learning:"Saya telah menyiapkan kerja sekolah."},o2:{learning:"Saya menulis kerja sekolah itu dengan pantas."},o3:{learning:"Saya menulis kerja sekolah itu di dalam buku nota."},o4:{learning:"Saya menyiapkan separuh daripada kerja sekolah itu."}}},
    "zh-en-a-complex-sentences-translation-01":{promptLearning:"Ayat yang manakah bermaksud “Tolong letakkan buku itu di atas meja”?",explanationLearning:"“把” meletakkan objek yang dikenakan tindakan di hadapan kata kerja, manakala “放在桌子上” menyatakan tempat buku itu diletakkan.",options:{o1:{translation:"Tolong letakkan buku itu di atas meja."},o2:{translation:"Tolong letakkan meja itu di atas buku."},o3:{translation:"Tolong letakkan buku itu di bawah meja."},o4:{translation:"Buku itu berada di atas meja, sila."}}},
    "zh-en-a-connectors-01":{promptLearning:"Kata hubung yang manakah digunakan untuk memperkenalkan hasil atau kesimpulan?",explanationLearning:"“因此” menghubungkan sebab atau fakta yang disebut sebelumnya dengan hasil atau kesimpulan yang terbit daripadanya.",options:{o1:{learning:"Oleh itu."},o2:{learning:"Namun begitu."},o3:{learning:"Selain itu."},o4:{learning:"Sebaliknya."}}},
    "zh-en-a-connectors-02":{promptLearning:"Kata hubung yang manakah memperkenalkan maklumat yang berbeza atau berlawanan dengan perkara sebelumnya?",explanationLearning:"“然而” menghubungkan dua klausa yang menunjukkan pertentangan atau perbezaan. Gaya penggunaannya biasanya lebih formal berbanding “但是”.",options:{o1:{learning:"Namun begitu."},o2:{learning:"Oleh itu."},o3:{learning:"Ringkasnya."},o4:{learning:"Lalu."}}},
    "zh-en-a-connectors-03":{promptLearning:"Kata hubung yang manakah boleh digunakan untuk menambahkan maklumat selepas perkara yang telah disebut?",explanationLearning:"“此外” digunakan untuk menambahkan maklumat yang belum disebut sebelumnya. Maksudnya hampir sama dengan “selain itu”.",options:{o1:{learning:"Selain itu."},o2:{learning:"Sebaliknya."},o3:{learning:"Oleh itu."},o4:{learning:"Walaupun."}}},
    "zh-en-a-connectors-04":{promptLearning:"Perkataan yang manakah lazim digunakan untuk merumuskan isi utama yang telah dibincangkan?",explanationLearning:"“总之” digunakan untuk merumuskan perbincangan atau isi penting sebelumnya dan memperkenalkan kesimpulan ringkas.",options:{o1:{learning:"Kesimpulannya."},o2:{learning:"Lalu."},o3:{learning:"Namun begitu."},o4:{learning:"Terutamanya."}}}
  };
  Object.assign(zhRows, {
    "zh-en-b-pinyin-foundations-01":{promptLearning:"Suku kata yang manakah menggunakan nada pertama?",explanationLearning:"Nada pertama kekal tinggi dan rata. “妈” disebut mā dengan nada pertama.",options:{o1:{learning:"ibu"},o2:{learning:"rami; kebas"},o3:{learning:"kuda"},o4:{learning:"memarahi"}}},
    "zh-en-b-pinyin-foundations-02":{promptLearning:"Aksara Cina yang manakah disebut mǎ dengan nada ketiga?",explanationLearning:"“马” disebut mǎ dengan nada ketiga. Tanda nada ketiga diletakkan di atas vokal a.",options:{o1:{learning:"ibu"},o2:{learning:"rami; kebas"},o3:{learning:"kuda"},o4:{learning:"memarahi"}}},
    "zh-en-b-pinyin-foundations-03":{promptLearning:"Pernyataan manakah paling tepat menerangkan nada kedua?",explanationLearning:"Nada kedua menaik dari pic yang lebih rendah ke pic yang lebih tinggi, seakan-akan intonasi yang menanjak.",options:{o1:{learning:"Suara bermula tinggi kemudian menurun."},o2:{learning:"Suara menaik dari rendah ke tinggi."},o3:{learning:"Suara kekal tinggi dan rata."},o4:{learning:"Suara menurun dengan cepat."}}},
    "zh-en-b-pinyin-foundations-04":{promptLearning:"Apakah fungsi utama Pinyin bahasa Mandarin?",explanationLearning:"Pinyin menggunakan huruf dan tanda nada untuk menandakan sebutan Mandarin standard serta membantu pelajar membaca dan mempelajari sebutan.",options:{o1:{learning:"Menandakan sebutan Mandarin standard."},o2:{learning:"Menunjukkan urutan goresan aksara."},o3:{learning:"Menggantikan semua aksara Cina."},o4:{learning:"Menunjukkan struktur tatabahasa ayat."}}},
    "zh-en-b-pinyin-foundations-05":{promptLearning:"Dalam perkataan “妈妈”, suku kata yang manakah biasanya disebut dengan nada neutral?",explanationLearning:"Dalam “妈妈”, aksara “妈” yang kedua biasanya disebut dengan nada neutral ma, lebih ringan dan pendek tanpa tanda nada pertama.",options:{o1:{learning:"“妈” yang pertama"},o2:{learning:"“妈” yang kedua"},o3:{learning:"Kedua-duanya nada pertama"},o4:{learning:"Kedua-duanya nada keempat"}}},
    "zh-en-b-pinyin-foundations-06":{promptLearning:"Apakah ejaan Pinyin standard bagi “你好”?",explanationLearning:"Ejaan Pinyin standard mengekalkan nada asal kedua-dua aksara, iaitu nǐ hǎo. Dalam pertuturan bersambung, nada ketiga pertama mengalami perubahan nada.",options:{o1:{learning:"nǐ hǎo"},o2:{learning:"ní hǎo"},o3:{learning:"nǐ hào"},o4:{learning:"nì hǎo"}}},
    "zh-en-b-pinyin-foundations-07":{promptLearning:"Pernyataan manakah paling tepat tentang nada ketiga?",explanationLearning:"Apabila disebut secara bersendirian atau pada hujung frasa, nada ketiga lazimnya menurun dahulu kemudian menaik. Dalam pertuturan bersambung, ia juga boleh disebut sebagai separuh nada ketiga.",options:{o1:{learning:"Ia sentiasa menurun kemudian menaik sepenuhnya."},o2:{learning:"Apabila disebut bersendirian atau di hujung ayat, ia lazimnya menurun kemudian menaik."},o3:{learning:"Picnya sentiasa kekal sama."},o4:{learning:"Ia sentiasa menurun dengan cepat."}}},
    "zh-en-b-greetings-introductions-01":{promptLearning:"Apakah ucapan yang lazim digunakan ketika bertemu seseorang buat kali pertama pada waktu pagi?",explanationLearning:"“早上好” ialah ucapan yang biasa digunakan ketika bertemu seseorang pada waktu pagi.",options:{o1:{learning:"Selamat pagi"},o2:{learning:"Selamat tinggal"},o3:{learning:"Selamat malam (sebelum tidur)"},o4:{learning:"Terima kasih"}}},
    "zh-en-b-greetings-introductions-02":{promptLearning:"Ungkapan manakah digunakan untuk mengucapkan terima kasih selepas menerima bantuan atau hadiah?",explanationLearning:"“谢谢” digunakan untuk menyatakan penghargaan atas bantuan, hadiah atau kebaikan seseorang.",options:{o1:{learning:"Terima kasih"},o2:{learning:"Sama-sama"},o3:{learning:"Maaf"},o4:{learning:"Tumpang tanya"}}},
    "zh-en-b-greetings-introductions-03":{promptLearning:"Frasa manakah digunakan untuk memulakan soalan dengan sopan?",explanationLearning:"“请问” lazimnya diletakkan sebelum soalan untuk menarik perhatian seseorang dengan sopan.",options:{o1:{learning:"Tumpang tanya"},o2:{learning:"Silakan bercakap"},o3:{learning:"Silakan masuk"},o4:{learning:"Silakan duduk"}}},
    "zh-en-b-greetings-introductions-04":{promptLearning:"Apakah jawapan yang paling semula jadi apabila seseorang mengucapkan “谢谢”?",explanationLearning:"“不客气” lazim digunakan sebagai jawapan kepada “谢谢” untuk menyatakan bahawa orang itu tidak perlu berasa terhutang budi.",options:{o1:{learning:"Sama-sama"},o2:{learning:"Terima kasih"},o3:{learning:"Selamat pagi"},o4:{learning:"Tumpang tanya"}}},
    "zh-en-b-greetings-introductions-05":{promptLearning:"Ungkapan perpisahan manakah lazim digunakan apabila berpisah atau menamatkan perbualan?",explanationLearning:"“再见” digunakan ketika berpisah dan membawa maksud berharap dapat berjumpa lagi.",options:{o1:{learning:"Selamat tinggal; jumpa lagi"},o2:{learning:"Helo"},o3:{learning:"Terima kasih"},o4:{learning:"Tumpang tanya"}}},
    "zh-en-b-greetings-introductions-06":{promptLearning:"Jika penutur ingin memperkenalkan namanya sebagai Li Ming, apakah ungkapan yang patut digunakan?",explanationLearning:"“我叫李明” ialah cara lazim memperkenalkan nama, yang bermaksud “Nama saya Li Ming”.",options:{o1:{learning:"Nama saya Li Ming."},o2:{learning:"Siapa nama kamu?"},o3:{learning:"Dia ialah Li Ming."},o4:{learning:"Saya mengenali Li Ming."}}},
    "zh-en-b-greetings-introductions-07":{promptLearning:"Apakah ungkapan yang lazim digunakan ketika pertama kali bertemu seseorang untuk menyatakan rasa gembira berkenalan dengannya?",explanationLearning:"“很高兴认识你” lazim digunakan ketika pertemuan pertama untuk menyatakan rasa gembira dapat berkenalan.",options:{o1:{learning:"Gembira dapat berkenalan dengan anda."},o2:{learning:"Apa khabar?"},o3:{learning:"Saya sihat."},o4:{learning:"Selamat tinggal."}}},
    "zh-en-b-numbers-dates-time-01":{promptLearning:"Aksara Cina yang manakah mewakili nombor bulat yang satu lebih besar daripada enam?",explanationLearning:"“七” mewakili nombor 7, disebut qī dalam Mandarin dengan nada pertama.",options:{o1:{learning:"tujuh"},o2:{learning:"sepuluh"},o3:{learning:"sembilan"},o4:{learning:"tiga"}}}, 
    "zh-en-b-numbers-dates-time-02":{promptLearning:"Apakah perkataan yang merujuk kepada hari ketika seseorang sedang bercakap?",explanationLearning:"“今天” merujuk kepada hari semasa, iaitu hari ini.",options:{o1:{learning:"hari ini"},o2:{learning:"esok"},o3:{learning:"semalam"},o4:{learning:"setiap hari"}}},
    "zh-en-b-numbers-dates-time-03":{promptLearning:"Apakah nama hari pertama selepas hari Ahad dalam seminggu?",explanationLearning:"“星期一” merujuk kepada hari Isnin, bersamaan dengan Monday dalam bahasa Inggeris.",options:{o1:{learning:"Isnin"},o2:{learning:"Rabu"},o3:{learning:"Jumaat"},o4:{learning:"Ahad"}}},
    "zh-en-b-numbers-dates-time-04":{promptLearning:"Dalam format tarikh, aksara Cina manakah mewakili salah satu daripada dua belas unit masa dalam setahun?",explanationLearning:"“月” bermaksud bulan. Dalam ungkapan tarikh, aksara ini biasanya diletakkan selepas nombor, contohnya “三月” (Mac).",options:{o1:{learning:"bulan"},o2:{learning:"tahun"},o3:{learning:"hari"},o4:{learning:"jam"}}},
    "zh-en-b-numbers-dates-time-05":{promptLearning:"Apakah susunan yang lazim digunakan untuk menulis tarikh dalam bahasa Cina?",explanationLearning:"Tarikh dalam bahasa Cina biasanya disusun daripada unit terbesar kepada terkecil: tahun, bulan, kemudian hari.",options:{o1:{learning:"tahun, bulan, hari"},o2:{learning:"bulan, hari, tahun"},o3:{learning:"hari, bulan, tahun"},o4:{learning:"tahun, hari, bulan"}}},
    "zh-en-b-numbers-dates-time-06":{promptLearning:"Perkataan manakah merujuk kepada hari selepas hari ini?",explanationLearning:"“明天” merujuk kepada hari selepas hari ini, iaitu esok.",options:{o1:{learning:"esok"},o2:{learning:"semalam"},o3:{learning:"hari ini"},o4:{learning:"sekarang"}}},
    "zh-en-b-pronouns-basic-sentences-01":{promptLearning:"Kata ganti nama diri pertama tunggal manakah digunakan apabila penutur merujuk kepada dirinya sendiri?",explanationLearning:"“我” ialah kata ganti nama diri pertama tunggal yang merujuk kepada penutur sendiri.",options:{o1:{learning:"saya"},o2:{learning:"kamu"},o3:{learning:"dia (lelaki)"},o4:{learning:"dia (perempuan)"}}},
    "zh-en-b-pronouns-basic-sentences-02":{promptLearning:"Aksara Cina manakah lazim digunakan dalam tulisan untuk merujuk kepada orang ketiga perempuan?",explanationLearning:"“她” ialah aksara bertulis untuk kata ganti nama diri ketiga perempuan. Sebutannya sama dengan “他”, iaitu tā.",options:{o1:{learning:"dia (perempuan)"},o2:{learning:"dia (lelaki / umum)"},o3:{learning:"saya"},o4:{learning:"penanda jamak"}}},
    "zh-en-b-pronouns-basic-sentences-03":{promptLearning:"Kata ganti nama diri pertama jamak manakah digunakan apabila penutur mewakili dirinya bersama sekurang-kurangnya seorang yang lain?",explanationLearning:"“我们” ialah kata ganti nama diri pertama jamak yang merujuk kepada penutur dan sekurang-kurangnya seorang yang lain.",options:{o1:{learning:"kami / kita"},o2:{learning:"kamu semua"},o3:{learning:"mereka"},o4:{learning:"kamu"}}},
    "zh-en-b-pronouns-basic-sentences-04":{promptLearning:"Ayat manakah menyatakan bahawa penutur ialah seorang pelajar?",explanationLearning:"“我是学生” dibentuk daripada “我” (saya) + “是” (ialah) + “学生” (pelajar), dan bermaksud “Saya seorang pelajar”.",options:{o1:{learning:"Saya seorang pelajar."},o2:{learning:"Saya sangat pelajar."},o3:{learning:"Adakah pelajar itu saya?"},o4:{learning:"Saya mempunyai pelajar."}}},
    "zh-en-b-pronouns-basic-sentences-05":{promptLearning:"Dalam ayat penyata bahasa Cina, kata kerja manakah lazimnya menghubungkan subjek dengan identiti atau sifatnya?",explanationLearning:"Dalam pola ayat ini, “是” menghubungkan subjek dengan identiti atau penerangan berbentuk kata nama, seakan-akan kata kerja “be” dalam bahasa Inggeris.",options:{o1:{learning:"ialah / merupakan"},o2:{learning:"berada di"},o3:{learning:"mempunyai"},o4:{learning:"pergi"}}},
    "zh-en-b-pronouns-basic-sentences-06":{promptLearning:"Ayat manakah menyatakan bahawa sebuah buku ialah milik penutur dan berada berhampiran penutur?",explanationLearning:"Dalam “这是我的书”, “这” bermaksud ini, “是” menghubungkan penerangan, “我的” menunjukkan pemilikan dan “书” bermaksud buku.",options:{o1:{learning:"Ini buku saya."},o2:{learning:"Saya buku ini."},o3:{learning:"Ini ialah buku saya (susunan tidak tepat)."},o4:{learning:"Buku saya ini (susunan tidak tepat)."}}},
    "zh-en-b-common-actions-01":{promptLearning:"Apakah kata kerja yang digunakan untuk perbuatan memasukkan makanan ke dalam mulut ketika makan?",explanationLearning:"“吃” bermaksud makan dan merupakan kata kerja tindakan yang lazim, seperti dalam “吃饭” (makan nasi / makan) dan “吃水果” (makan buah).",options:{o1:{learning:"makan"},o2:{learning:"minum"},o3:{learning:"melihat"},o4:{learning:"mendengar"}}},
    "zh-en-b-common-actions-02":{promptLearning:"Apakah kata kerja yang digunakan untuk perbuatan memasukkan air atau minuman ke dalam mulut apabila dahaga?",explanationLearning:"“喝” bermaksud minum. Kata kerja ini biasanya diikuti nama minuman seperti air, teh atau kopi.",options:{o1:{learning:"minum"},o2:{learning:"makan"},o3:{learning:"pergi"},o4:{learning:"datang"}}},
    "zh-en-b-common-actions-03":{promptLearning:"Apakah kata kerja yang digunakan untuk bergerak dari lokasi semasa ke tempat lain?",explanationLearning:"“去” bermaksud pergi dari lokasi semasa ke sesuatu tempat dan lazimnya diikuti nama tempat, seperti “去学校” (pergi ke sekolah).",options:{o1:{learning:"pergi"},o2:{learning:"datang"},o3:{learning:"melihat"},o4:{learning:"berkata"}}},
    "zh-en-b-common-actions-04":{promptLearning:"Ayat manakah bermaksud penutur sedang minum air?",explanationLearning:"“我喝水” mengikut susunan subjek + kata kerja + objek: “我” ialah subjek, “喝” kata kerja dan “水” objek.",options:{o1:{learning:"Saya minum air."},o2:{learning:"Saya makan air."},o3:{learning:"Saya melihat air."},o4:{learning:"Saya pergi air."}}},
    "zh-en-b-common-actions-05":{promptLearning:"Apabila digunakan bersama perkataan “书” (buku), kata kerja manakah membawa maksud membaca?",explanationLearning:"“看书” ialah padanan kata yang lazim dan bermaksud membaca. “看” secara bersendirian juga boleh bermaksud melihat atau menonton.",options:{o1:{learning:"melihat; membaca"},o2:{learning:"minum"},o3:{learning:"datang"},o4:{learning:"membuat"}}},
    "zh-en-b-common-actions-06":{promptLearning:"Apakah kata kerja yang merujuk kepada kegiatan memperoleh pengetahuan atau melatih kemahiran di sekolah atau melalui pembelajaran kendiri?",explanationLearning:"“学习” bermaksud belajar, iaitu memperoleh pengetahuan atau melatih kemahiran. Contohnya, “学习中文” bermaksud belajar bahasa Cina.",options:{o1:{learning:"belajar"},o2:{learning:"berehat"},o3:{learning:"bekerja"},o4:{learning:"tidur"}}},
    "zh-en-b-places-getting-around-01":{promptLearning:"Apakah nama tempat utama yang dikunjungi pelajar untuk menghadiri kelas, membaca dan menyiapkan tugasan?",explanationLearning:"“学校” ialah tempat untuk belajar dan menghadiri kelas, bersamaan dengan school dalam bahasa Inggeris.",options:{o1:{learning:"sekolah"},o2:{learning:"hospital"},o3:{learning:"kedai"},o4:{learning:"stesen"}}},
    "zh-en-b-places-getting-around-02":{promptLearning:"Ke manakah seseorang biasanya pergi untuk mendapatkan diagnosis dan rawatan apabila sakit atau cedera?",explanationLearning:"“医院” ialah tempat yang menyediakan diagnosis dan perkhidmatan perubatan, bersamaan dengan hospital dalam bahasa Inggeris.",options:{o1:{learning:"hospital"},o2:{learning:"sekolah"},o3:{learning:"taman"},o4:{learning:"restoran"}}},
    "zh-en-b-places-getting-around-03":{promptLearning:"Apakah nama tempat penumpang menunggu kereta api atau pengangkutan awam?",explanationLearning:"“车站” merujuk secara umum kepada tempat kenderaan berhenti dan penumpang naik atau turun. Jenis khusus termasuk stesen kereta api dan stesen bas.",options:{o1:{learning:"stesen"},o2:{learning:"sekolah"},o3:{learning:"hospital"},o4:{learning:"rumah"}}},
    "zh-en-b-places-getting-around-04":{promptLearning:"Ayat manakah digunakan untuk bertanya lokasi stesen MRT?",explanationLearning:"“地铁站在哪里？” menggunakan pola “tempat + 在哪里” untuk bertanya lokasi sesuatu tempat.",options:{o1:{learning:"Di manakah stesen MRT?"},o2:{learning:"Apakah stesen MRT?"},o3:{learning:"Saya pergi ke stesen MRT."},o4:{learning:"Stesen MRT itu besar."}}}
  });
  Object.entries(zhRows).forEach(([id,row])=>{
    if(zh?.[id]){
      zh[id].promptLearning=row.promptLearning;
      zh[id].explanationLearning=row.explanationLearning;
      Object.entries(row.options).forEach(([optionId,value])=>{
        if(zh[id].options?.[optionId]) zh[id].options[optionId][zh[id].options[optionId].translation!==undefined&&zh[id].options[optionId].learning===undefined?"translation":"learning"]=value.learning??value.translation;
        if(value.translation&&zh[id].options?.[optionId]) zh[id].options[optionId].translation=value.translation;
      });
    }
  });
  const lessonCorrections = {
    en: {
      "b-sentence": [
        {q:"Pilih susunan yang lazim bagi ayat penyata mudah.",options:["Kata kerja + subjek + objek","Subjek + kata kerja + objek","Objek + subjek + kata kerja"]},
        {q:"Dalam ayat “The young artist painted a mural”, perkataan manakah membentuk subjek?",options:["Artis muda itu","melukis","sebuah mural"]},
        {q:"Pilih ayat yang mengikut susunan subjek–kata kerja–objek yang lazim.",options:["Kanak-kanak itu menanam bunga.","Menanam kanak-kanak itu bunga.","Bunga kanak-kanak itu menanam."]},
        {q:"Pilih ayat yang betul.",options:["There is three chairs. (tidak gramatis: kata kerja tunggal dengan kata nama jamak)","Terdapat tiga buah kerusi. (there are)","There be three chairs. (bentuk kata kerja tidak tepat)"]},
        {q:"Pilih soalan yang betul.",options:["Does he works here? (kata kerja selepas does tidak boleh ditambah -s)","Adakah dia bekerja di sini? (Does he work here?)","Do he work here? (kata bantu tidak sepadan dengan he)"]}
      ]
    },
    zh: {
      "zh-b-pinyin-foundations": [
        {q:"Suku kata yang manakah menggunakan nada pertama?",options:["ibu (mā)","rami; kebas (má)","kuda (mǎ)","memarahi (mà)"]},
        {q:"Aksara Cina manakah disebut mǎ dengan nada ketiga?",options:["ibu (mā)","rami; kebas (má)","kuda (mǎ)","memarahi (mà)"]},
        {q:"Pernyataan manakah paling tepat menerangkan nada kedua?",options:["Suara bermula tinggi kemudian menurun.","Suara menaik dari rendah ke tinggi.","Suara kekal tinggi dan rata.","Suara menurun dengan cepat."]},
        {q:"Apakah fungsi utama Hanyu Pinyin?",options:["Menandakan sebutan Mandarin.","Menunjukkan urutan goresan aksara Cina.","Menggantikan semua aksara Cina.","Menunjukkan struktur tatabahasa ayat."]},
        {q:"Dalam “妈妈”, suku kata yang manakah biasanya disebut dengan nada neutral?",options:["Suku kata pertama, mā.","Suku kata kedua, ma.","Kedua-dua suku kata menggunakan nada pertama.","Kedua-dua suku kata menggunakan nada keempat."]},
        {q:"Apakah ejaan Pinyin bertulis yang standard bagi “你好”?",options:["nǐ hǎo (ejaan standard)","ní hǎo (sebutan perubahan nada)","nǐ hào (nada kedua salah)","nì hǎo (nada pertama salah)"]},
        {q:"Pernyataan manakah paling tepat tentang nada ketiga?",options:["Ia sentiasa menurun dahulu kemudian menaik sepenuhnya.","Apabila disebut bersendirian atau di hujung frasa, ia lazimnya menurun dahulu kemudian menaik.","Picnya sentiasa kekal tinggi dan rata.","Ia sentiasa menurun dengan cepat."]}
      ]
    }
  };
  for (const [language, lessons] of Object.entries(lessonCorrections)) {
    for (const [lessonId, corrections] of Object.entries(lessons)) {
      const target = pack.lessons?.[language]?.[lessonId];
      if (!Array.isArray(target)) continue;
      corrections.forEach((correction, index) => {
        if (!target[index]) return;
        target[index].q = correction.q;
        target[index].options = correction.options.slice();
      });
    }
  }
  window.SWIFT_MALAY_LEARNING_SUPPORT_CORRECTIONS = {
    quiz: { en: Object.keys(rows), zh: Object.keys(zhRows) },
    lessons: {
      en: Object.values(lessonCorrections.en).reduce((sum, rows) => sum + rows.length, 0),
      zh: Object.values(lessonCorrections.zh).reduce((sum, rows) => sum + rows.length, 0)
    },
    status: "model_assisted_malay_draft_pending_editorial_review"
  };
})();
