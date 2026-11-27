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
  Object.entries(rows).forEach(([id, row]) => {
    if (en[id]) {
      en[id].promptLearning = row.promptLearning;
      en[id].explanationLearning = row.explanationLearning;
      Object.entries(row.options).forEach(([optionId, value]) => {
        if (en[id].options?.[optionId]) en[id].options[optionId].learning = value.learning;
      });
    }
  });
  window.SWIFT_MALAY_LEARNING_SUPPORT_CORRECTIONS = {
    quiz: { en: Object.keys(rows) },
    status: "model_assisted_malay_draft_pending_editorial_review"
  };
})();
