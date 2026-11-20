# SwiftDictionary Privacy Notice — Working Draft (20 November 2026)

<mark>NOT APPROVED FOR PUBLICATION — legal, operator, provider and retention review required.</mark>

**Version:** Working draft 0.3  
**Effective date:** [Set after approval]  
**Data controller / operator:** [Legal identity and capacity to be confirmed]  
**Privacy contact:** [Create and verify a monitored contact route]  
**Postal/contact address:** [Confirm lawful and safe public contact details; do not publish a private home address without legal advice]

This draft describes the current Update 2.5.0 product baseline and the Update 2.6.0 security work in progress. It is not a legal opinion. Before publication, verify every statement against the deployed production build, current provider settings and contracts, and advice from a qualified Malaysian privacy lawyer.

## 1. About SwiftDictionary

SwiftDictionary is an individually operated vocabulary dictionary and language-learning service. It currently provides English and Simplified Chinese learning experiences. Dictionary word-grid search is intended to remain free and unlimited. Learning features may have daily usage limits shown in the application.

The service is intended for people aged 16 or older. The current application has not yet implemented the proposed age-confirmation gate. The legal and consent approach for users aged 16–17 remains under review.

## 2. Personal data we process

Depending on whether you sign in and which features you use, SwiftDictionary may process:

| Category | Examples | Why it is used |
|---|---|---|
| Account and sign-in | Supabase account identifier, email address and identity/provider metadata returned through Google sign-in | Sign-in, account security, account switching and synchronisation |
| Profile | Display name, selected avatar and timestamps | Displaying and maintaining your profile |
| Preferences | Learning language, translation language, IANA timezone and Daily Learning settings | Personalising the interface and calculating local-day learning limits |
| Saved dictionary items | Words or Chinese characters you save, course and timestamps | Saving and synchronising your vocabulary |
| Lessons and practice | Lesson identifiers, difficulty, progress/completion state, correct-answer totals, question totals, topic and timestamps | Showing progress and identifying topics for revision |
| Daily Learning | Activity type, language, topic/content identifier, difficulty, status, local date/timezone, answer totals and timestamps | Delivering activities, showing history and supporting adaptive revision |
| Quiz | Session settings and results; question and option snapshots; correct-option snapshots; selected option IDs and answer timestamps | Running Quiz, showing results and preserving session history |
| Flashcards | Private collection names, user-created card text, examples/translations, dictionary references and card order | Storing and displaying your own flashcard collections |
| Flashcard review | Per-card mastery/review counts, streaks, last result and review timestamps; game mode and session summaries | Review scheduling, weak-card prioritisation and progress display |
| Plan and allowance state | Learning-plan/entitlement state and usage counts or window timestamps | Enforcing the learning limits displayed in the app |
| Browser storage | Course/translation preferences, avatar, signed-out saved words and a persisted Supabase sign-in session | Remembering preferences, local saved items and keeping you signed in |
| Provider/network metadata | Standard connection, request, security and diagnostic information that providers may process, such as IP address, browser/device details, request URL and timestamps | Website delivery, authentication, security and provider operations |

**Quiz accuracy note:** The service stores selected option identifiers and question/session snapshots. This is more detailed than an aggregate score alone. The previous privacy-policy draft incorrectly said individual selected answers were not stored; that statement is withdrawn.

The application uses browser local storage for certain preferences, signed-out saved words and its authentication session. This is not the same as using GPS or collecting a precise physical location. The reviewed source did not show a GPS/geolocation API, advertising tracker or analytics package; this must be rechecked against the production build before publication.

### Sources of data and whether it is required

Data may come directly from you (for example, saved words, preferences and custom Flashcard text), from Google when you choose Google sign-in (for example, account identity and email information returned through the sign-in flow), from your use of SwiftDictionary (for example, progress, selected Quiz options and Flashcard review results), or from service providers' ordinary network/security operations.

Signing in is needed for features that save account-linked information and synchronise it across devices. The public dictionary word-grid is intended to remain available without an account. Display names, avatars, saved words, preferences and custom Flashcard content are supplied at your choice, subject to the feature you choose to use. If you do not sign in, account synchronisation and other account-dependent features may not be available; if you do not provide optional content, that content will not be stored. The exact obligatory/voluntary status of each field must be confirmed against the final deployed interface before publication.

## 3. How we use personal data

The current purposes are to:

- authenticate users and maintain accounts;
- synchronise saved words, preferences and learning progress across devices;
- provide dictionary, lesson, Daily Learning, Quiz and Flashcard features;
- calculate and display progress and learning results;
- identify weak topics/cards to support revision;
- enforce the learning allowances shown in the application;
- maintain security, troubleshoot failures and prevent misuse; and
- respond to privacy requests and comply with applicable law.

We do not intend to use learning records for behavioural advertising, sell personal data, or introduce advertising/analytics tracking. Any change to these purposes requires a fresh privacy review and an updated notice where appropriate.

## 4. Service providers and international processing

The current provider map is:

| Provider | Role | Known information and limitations |
|---|---|---|
| Cloudflare | Hosts and delivers the SwiftDictionary website through Cloudflare Pages; may process delivery, security, build and diagnostic metadata | Cloudflare uses a global network. Exact account settings, log categories/retention, support access and applicable contractual terms still require owner verification. |
| Supabase | Authentication and application database | The production project's primary database is in Tokyo, Japan. This does not mean every support, operational-log, account-administration or subprocessor activity occurs in Japan. The staging project is in Singapore and is for synthetic testing only. |
| Google | OAuth identity provider when a user chooses Google sign-in | The actual OAuth scopes, consent-screen settings and provider-side retention must be verified in the Google project. |
| jsDelivr | Delivers browser libraries and Chinese stroke-order data used by the site | CDN requests can expose ordinary request metadata and the requested asset path. A stroke-data path can reveal which character asset was requested, but does not itself include the SwiftDictionary account ID. |
| GitHub | Source-code hosting and development workflow; may receive feedback if a user chooses to submit a GitHub issue | GitHub issue content may be public when submitted to a public repository. SwiftDictionary should not ask users to submit passwords, authentication tokens or private learning records in a public issue. |

Information may be processed outside Malaysia, including in Japan, Singapore, the United States, the European Union and other locations used by providers or their subprocessors. These are possible provider-processing locations, not a claim that every user's data is stored in every listed country. The exact recipients, processing locations, transfer basis, safeguards and current subprocessors must be verified before publication.

The Tokyo production database and Singapore staging database are separate. Production learner records must not be copied into staging.

The provider review also found that selecting a Supabase database region does not mean every Supabase activity stays in that region. Supabase's published materials describe global support/operations and certain account-administration, telemetry and operational-log processing outside the selected database region. Cloudflare and jsDelivr use distributed CDN networks. The exact Google processing locations and account-specific provider settings have not been verified. This notice must be updated if the provider's current documentation, contract or the operator's settings show different or more specific arrangements.

## 5. Disclosure and sharing

SwiftDictionary does not intend to sell personal data or share it for third-party advertising. Data is made available to providers only to the extent needed for hosting, authentication, database operation, content delivery, security and support, or where disclosure is required or permitted by law.

If you choose to submit feedback through GitHub, review the repository destination and visibility before submitting. A public GitHub issue is visible to the public and is not a private privacy-request channel.

[Before publication: confirm this section against the live Cloudflare, Supabase, Google, GitHub and CDN configuration, provider contracts, all scripts and any support channels.]

## 6. Retention

SwiftDictionary should retain personal data only for as long as necessary for the purpose for which it was collected, subject to applicable legal requirements.

**Operator-controlled application-data retention periods have not yet been approved.** Current provider plan-level evidence is narrower: the production and staging Supabase projects are on Free; Supabase currently lists 24 hours for Auth Audit Logs and 1 day for API & Database log retention on that plan. Cloudflare Observability Usage displays 7 days for the logs/traces represented on that Usage page, but it has not been established that this period applies to the separate Pages HTTP request-log view or to build/security/platform records. These are provider-controlled log-history specifications, not a promise that every underlying provider copy is physically erased at expiry. Supabase Free projects have no configurable daily backup/PITR window confirmed in this review. A separate retention schedule must still define account/authentication data, saved words, profile/preferences, learning history, Quiz snapshots and selected answers, Flashcard content/mastery, allowance records, security logs, CDN requests, support/feedback records and provider backups. Verify this paragraph against current provider terms and settings before publication.

Deleting learning history through the Profile control removes the categories described in the application confirmation. It does not delete the account, saved words, profile/preferences or current allowance usage. It also does not promise immediate removal from provider-controlled logs or backups.

A self-service account-deletion control is not currently confirmed as implemented. The separate account-deletion workflow remains a development item. Do not rely on this draft as a promise that account deletion is already available.

[Before publication: insert verified active-system periods, backup expiry, log retention, provider-controlled retention and legal-retention exceptions. Do not promise immediate deletion from backups unless verified.]

## 7. Your privacy choices and requests

Subject to applicable law, you may have rights to request access to personal data, correction of inaccurate data, information about processing, and data portability where the statutory conditions and technical feasibility requirements are met. Where consent is the applicable basis, you may also be able to withdraw consent, subject to legal requirements and the effect this may have on features that depend on the relevant processing. You may raise a concern about processing or ask about deletion.

**Privacy request contact:** [Insert monitored privacy contact route after owner approval.]

The process must explain how to submit a request, how identity/account control will be checked, how requests from a parent/guardian or authorised representative are handled where legally required, and the applicable response period.

The application currently provides a Delete Learning History control. It is separate from account deletion. Do not promise additional self-service controls until implemented and tested.

## 8. Children and age

SwiftDictionary is intended for users aged 16 and older. The current application does not yet have the proposed age-confirmation gate.

Malaysian Personal Data Protection Regulations 2013, Regulation 3(3), requires consent under Regulation 3 to be obtained from a parent, guardian or person with parental responsibility where the data subject is under 18. Whether consent under Regulation 3 is the relevant basis for each SwiftDictionary processing purpose, and what practical safeguards are required for 16- and 17-year-old users, must be determined with qualified Malaysian legal advice. A self-declared age of 16 or older is not proof of age and is not a substitute for parental consent where that is legally required.

The service must not knowingly invite under-16 users to create accounts while the 16+ eligibility rule remains in place. A process for accidental underage accounts and related data must be approved before publication.

## 9. Security

SwiftDictionary uses authentication, database access controls and row-level security intended to restrict account data to the appropriate user and service operations. Security work is ongoing. No online service can guarantee absolute security.

The operator will maintain a process for assessing suspected personal-data breaches and making any notifications required by applicable law. The applicable Malaysian breach-notification thresholds and timelines must be followed; do not treat every incident as automatically reportable or assume that every incident is exempt.

## 10. Changes to this notice

This notice must be updated when the service, data categories, providers, processing purposes, retention practices or applicable requirements materially change. The effective date and version should be displayed. Where consent or additional notice is legally required, an updated document alone is not a substitute for obtaining it.

## 11. Bahasa Malaysia / English

This working draft is intended to be completed in Bahasa Malaysia and English before publication if Act 709 applies. The two versions must be substantively consistent and provide accessible privacy choices and request routes in both languages. Simplified Chinese may be added as a helpful translation but does not replace Bahasa Malaysia or English.

## 12. Contact

**Data controller/operator:** [Legal identity and capacity to be confirmed]  
**Privacy contact:** [Monitored email or other approved contact route]  
**Address/contact details:** [To be confirmed with legal advice]  
**Country:** Malaysia

---

# Notis Privasi SwiftDictionary — Draf Kerja (20 November 2026)

<mark>BELUM DILULUSKAN UNTUK PENERBITAN — memerlukan semakan undang-undang, identiti pengendali, penyedia perkhidmatan dan tempoh penyimpanan.</mark>

**Versi:** Draf kerja 0.2  
**Tarikh kuat kuasa:** [Tetapkan selepas kelulusan]  
**Pengawal data / pengendali:** [Identiti undang-undang dan kapasiti perlu disahkan]  
**Hubungan privasi:** [Sediakan saluran hubungan yang dipantau]  
**Alamat untuk dihubungi:** [Sahkan butiran hubungan yang sesuai; jangan terbitkan alamat rumah persendirian tanpa nasihat undang-undang]

Draf ini menerangkan garis besar pemprosesan data bagi asas produk Update 2.5.0 dan kerja keselamatan Update 2.6.0 yang masih berjalan. Ia bukan nasihat undang-undang. Sebelum diterbitkan, setiap kenyataan mesti disahkan berdasarkan versi produksi sebenar, tetapan dan kontrak penyedia semasa, serta nasihat peguam privasi Malaysia yang berkelayakan.

## 1. Mengenai SwiftDictionary

SwiftDictionary ialah perkhidmatan kamus kosa kata dan pembelajaran bahasa yang dikendalikan secara individu. Perkhidmatan ini menyediakan pengalaman pembelajaran Bahasa Inggeris dan Bahasa Cina Ringkas. Carian grid perkataan kamus bertujuan kekal percuma dan tanpa had. Ciri pembelajaran mungkin mempunyai had penggunaan harian seperti yang dipaparkan dalam aplikasi.

Perkhidmatan ini disasarkan kepada individu berumur 16 tahun ke atas. Aplikasi semasa belum melaksanakan langkah pengesahan umur yang dicadangkan. Pendekatan undang-undang dan persetujuan bagi pengguna berumur 16–17 tahun masih dalam semakan.

## 2. Data peribadi yang diproses

Bergantung pada sama ada anda log masuk dan ciri yang digunakan, SwiftDictionary mungkin memproses:

| Kategori | Contoh | Tujuan |
|---|---|---|
| Akaun dan log masuk | ID akaun Supabase, alamat e-mel dan metadata identiti/penyedia daripada log masuk Google | Log masuk, keselamatan akaun, pertukaran akaun dan penyegerakan |
| Profil | Nama paparan, avatar pilihan dan cap masa | Memaparkan dan mengurus profil |
| Tetapan pilihan | Bahasa pembelajaran, bahasa terjemahan, zon waktu IANA dan tetapan Daily Learning | Memperibadikan antara muka dan mengira had pembelajaran mengikut hari tempatan |
| Item kamus tersimpan | Perkataan atau aksara Cina yang disimpan, kursus dan cap masa | Menyimpan dan menyegerakkan kosa kata |
| Pelajaran dan latihan | ID pelajaran, tahap kesukaran, status kemajuan/penyelesaian, jumlah jawapan betul, jumlah soalan, topik dan cap masa | Memaparkan kemajuan dan mengenal pasti topik untuk ulang kaji |
| Daily Learning | Jenis aktiviti, bahasa, ID topik/kandungan, kesukaran, status, tarikh/zon waktu tempatan, jumlah jawapan dan cap masa | Menyediakan aktiviti, memaparkan sejarah dan menyokong ulang kaji adaptif |
| Quiz | Tetapan dan keputusan sesi; salinan soalan dan pilihan jawapan; salinan jawapan betul; ID pilihan yang dipilih dan cap masa jawapan | Menjalankan Quiz, memaparkan keputusan dan menyimpan sejarah sesi |
| Flashcards | Nama koleksi peribadi, teks kad ciptaan pengguna, contoh/terjemahan, rujukan kamus, susunan kad | Menyimpan dan memaparkan koleksi kad imbas anda |
| Ulang kaji Flashcard | Bilangan penguasaan/ulangkaji setiap kad, rentetan, keputusan terakhir dan cap masa; mod permainan dan ringkasan sesi | Menjadualkan ulang kaji, mengutamakan kad yang lemah dan memaparkan kemajuan |
| Pelan dan had penggunaan | Status pelan/kelayakan pembelajaran serta bilangan penggunaan atau cap masa tempoh | Menguatkuasakan had pembelajaran yang dipaparkan dalam aplikasi |
| Storan pelayar | Tetapan bahasa, avatar, perkataan tersimpan semasa tidak log masuk dan sesi log masuk Supabase yang disimpan | Mengingati tetapan, item tempatan dan mengekalkan sesi log masuk |
| Metadata rangkaian/penyedia | Maklumat sambungan, permintaan, keselamatan dan diagnostik biasa yang mungkin diproses penyedia, seperti alamat IP, butiran pelayar/peranti, URL permintaan dan cap masa | Penghantaran laman web, pengesahan, keselamatan dan operasi penyedia |

**Maklumat ketepatan Quiz:** Perkhidmatan menyimpan pengecam pilihan jawapan yang dipilih serta salinan soalan dan sesi. Ini lebih terperinci daripada jumlah markah sahaja. Draf dasar privasi terdahulu yang menyatakan bahawa pilihan jawapan individu tidak disimpan adalah tidak tepat dan ditarik balik.

Aplikasi menggunakan storan tempatan pelayar untuk tetapan tertentu, perkataan tersimpan semasa tidak log masuk dan sesi pengesahan. Ini bukan penggunaan GPS atau pengumpulan lokasi fizikal tepat. Kod sumber yang disemak tidak menunjukkan API GPS/geolokasi, penjejak pengiklanan atau pakej analitik; perkara ini mesti disemak semula terhadap binaan produksi sebelum penerbitan.

### Sumber data dan sama ada data diperlukan

Data mungkin diperoleh terus daripada anda (contohnya perkataan tersimpan, tetapan dan teks Flashcard ciptaan sendiri), daripada Google apabila anda memilih log masuk Google (contohnya identiti akaun dan maklumat e-mel yang dikembalikan melalui proses log masuk), daripada penggunaan SwiftDictionary (contohnya kemajuan, pilihan Quiz yang dipilih dan keputusan ulang kaji Flashcard), atau daripada operasi rangkaian/keselamatan biasa penyedia perkhidmatan.

Log masuk diperlukan bagi ciri yang menyimpan maklumat berkaitan akaun dan menyegerakkannya antara peranti. Grid carian kamus awam bertujuan kekal tersedia tanpa akaun. Nama paparan, avatar, perkataan tersimpan, tetapan dan kandungan Flashcard tersuai diberikan atas pilihan anda, tertakluk pada ciri yang digunakan. Jika anda tidak log masuk, penyegerakan akaun dan ciri lain yang bergantung pada akaun mungkin tidak tersedia; jika anda tidak memberikan kandungan pilihan, kandungan tersebut tidak akan disimpan. Status wajib/sukarela bagi setiap medan mesti disahkan berdasarkan antara muka produksi akhir sebelum penerbitan.

## 3. Cara data peribadi digunakan

Tujuan semasa termasuk:

- mengesahkan pengguna dan mengurus akaun;
- menyegerakkan perkataan tersimpan, tetapan dan kemajuan pembelajaran antara peranti;
- menyediakan ciri kamus, Lessons, Daily Learning, Quiz dan Flashcards;
- mengira dan memaparkan kemajuan serta keputusan pembelajaran;
- mengenal pasti topik/kad yang lemah untuk menyokong ulang kaji;
- menguatkuasakan had pembelajaran yang dipaparkan dalam aplikasi;
- mengekalkan keselamatan, menyelesaikan masalah dan mencegah penyalahgunaan; dan
- menjawab permintaan privasi serta mematuhi undang-undang yang terpakai.

SwiftDictionary tidak bertujuan menggunakan rekod pembelajaran untuk pengiklanan berdasarkan tingkah laku, menjual data peribadi atau memperkenalkan penjejakan analitik/pengiklanan. Sebarang perubahan kepada tujuan ini memerlukan semakan privasi baharu dan notis yang dikemas kini jika sesuai.

## 4. Penyedia perkhidmatan dan pemprosesan antarabangsa

Peta penyedia semasa:

| Penyedia | Peranan | Maklumat dan batasan yang diketahui |
|---|---|---|
| Cloudflare | Mengehos dan menghantar laman web SwiftDictionary melalui Cloudflare Pages; mungkin memproses metadata penghantaran, keselamatan, binaan dan diagnostik | Cloudflare menggunakan rangkaian global. Tetapan akaun, kategori/tempoh log, akses sokongan dan terma kontrak yang terpakai masih perlu disahkan oleh pengendali. |
| Supabase | Pengesahan dan pangkalan data aplikasi | Pangkalan data utama projek produksi berada di Tokyo, Jepun. Ini tidak bermaksud semua aktiviti sokongan, log operasi, pentadbiran akaun atau subpemproses berlaku di Jepun. Projek staging berada di Singapura dan hanya untuk ujian data sintetik. |
| Google | Penyedia identiti OAuth apabila pengguna memilih log masuk Google | Skop OAuth sebenar, tetapan skrin persetujuan dan penyimpanan di pihak penyedia perlu disahkan dalam projek Google. |
| jsDelivr | Menghantar pustaka pelayar dan data tertib strok aksara Cina yang digunakan oleh laman | Permintaan CDN boleh mendedahkan metadata permintaan biasa dan laluan aset yang diminta. Laluan data strok boleh menunjukkan aset aksara yang diminta, tetapi tidak mengandungi ID akaun SwiftDictionary. |
| GitHub | Mengehos kod sumber dan aliran kerja pembangunan; mungkin menerima maklum balas jika pengguna memilih untuk menghantar isu GitHub | Kandungan isu GitHub mungkin boleh dilihat umum apabila dihantar ke repositori awam. SwiftDictionary tidak sepatutnya meminta pengguna menghantar kata laluan, token pengesahan atau rekod pembelajaran peribadi dalam isu awam. |

Maklumat mungkin diproses di luar Malaysia, termasuk di Jepun, Singapura, Amerika Syarikat, Kesatuan Eropah dan lokasi lain yang digunakan oleh penyedia atau subpemproses mereka. Ini ialah lokasi pemprosesan penyedia yang mungkin, bukan dakwaan bahawa data setiap pengguna disimpan di semua negara tersebut. Penerima sebenar, lokasi pemprosesan, asas pemindahan, perlindungan dan senarai subpemproses semasa mesti disahkan sebelum penerbitan.

Pangkalan data produksi di Tokyo dan pangkalan data staging di Singapura adalah berasingan. Rekod pengguna produksi tidak boleh disalin ke staging.

Semakan penyedia juga mendapati bahawa pemilihan rantau pangkalan data Supabase tidak bermaksud semua aktiviti Supabase kekal di rantau tersebut. Bahan terbitan Supabase menerangkan sokongan/operasi global serta pemprosesan pentadbiran akaun, telemetri dan log operasi tertentu di luar rantau pangkalan data yang dipilih. Cloudflare dan jsDelivr menggunakan rangkaian CDN teragih. Lokasi pemprosesan Google yang tepat dan tetapan khusus akaun belum disahkan. Notis ini mesti dikemas kini jika dokumentasi, kontrak atau tetapan penyedia semasa menunjukkan aturan yang berbeza atau lebih khusus.

## 5. Pendedahan dan perkongsian

SwiftDictionary tidak bertujuan menjual data peribadi atau berkongsi data untuk pengiklanan pihak ketiga. Data hanya disediakan kepada penyedia setakat yang diperlukan untuk pengehosan, pengesahan, operasi pangkalan data, penghantaran kandungan, keselamatan dan sokongan, atau apabila pendedahan diwajibkan atau dibenarkan oleh undang-undang.

Jika anda memilih untuk menghantar maklum balas melalui GitHub, semak destinasi repositori dan tahap keterlihatannya sebelum menghantar. Isu GitHub awam boleh dilihat oleh orang ramai dan bukan saluran permintaan privasi peribadi.

[Sebelum penerbitan: sahkan bahagian ini berdasarkan konfigurasi Cloudflare, Supabase, Google, GitHub dan CDN yang sebenar, kontrak penyedia, semua skrip dan saluran sokongan.]

## 6. Tempoh penyimpanan

SwiftDictionary sepatutnya menyimpan data peribadi hanya selama yang diperlukan bagi tujuan pengumpulannya, tertakluk kepada keperluan undang-undang yang terpakai.

**Tempoh penyimpanan tepat belum diluluskan atau disahkan.** Jadual penyimpanan berasingan mesti dilengkapkan bagi data akaun/pengesahan, perkataan tersimpan, profil/tetapan, sejarah pembelajaran, salinan soalan dan jawapan Quiz yang dipilih, kandungan/penguasaan Flashcard, rekod had penggunaan, log keselamatan, permintaan CDN, rekod sokongan/maklum balas dan sandaran penyedia.

Pemadaman sejarah pembelajaran melalui kawalan Profile membuang kategori yang diterangkan dalam pengesahan aplikasi. Ia tidak memadam akaun, perkataan tersimpan, profil/tetapan atau penggunaan had semasa. Ia juga tidak menjanjikan pemadaman serta-merta daripada log atau sandaran yang dikawal penyedia.

Kawalan pemadaman akaun kendiri belum disahkan sebagai ciri yang telah dilaksanakan. Aliran kerja pemadaman akaun yang berasingan masih merupakan item pembangunan. Jangan anggap draf ini sebagai janji bahawa pemadaman akaun sudah tersedia.

[Sebelum penerbitan: masukkan tempoh sistem aktif, tamat tempoh sandaran, penyimpanan log, tempoh penyedia dan pengecualian penyimpanan undang-undang yang telah disahkan. Jangan menjanjikan pemadaman serta-merta daripada sandaran tanpa pengesahan.]

## 7. Pilihan dan permintaan privasi anda

Tertakluk kepada undang-undang yang terpakai, anda mungkin mempunyai hak untuk meminta akses kepada data peribadi, pembetulan data yang tidak tepat, maklumat tentang pemprosesan dan kemudahalihan data jika syarat statutori serta keperluan kebolehlaksanaan teknikal dipenuhi. Jika persetujuan ialah asas pemprosesan yang terpakai, anda juga mungkin boleh menarik balik persetujuan, tertakluk kepada keperluan undang-undang dan kesannya terhadap ciri yang bergantung pada pemprosesan tersebut. Anda boleh membangkitkan kebimbangan tentang pemprosesan atau bertanya tentang pemadaman.

**Hubungan permintaan privasi:** [Masukkan saluran hubungan privasi yang dipantau selepas kelulusan pengendali.]

Proses ini mesti menerangkan cara menghantar permintaan, cara identiti/kawalan akaun disahkan, cara permintaan daripada ibu bapa/penjaga atau wakil yang diberi kuasa dikendalikan jika diwajibkan undang-undang, dan tempoh maklum balas yang terpakai.

Aplikasi kini menyediakan kawalan Padam Sejarah Pembelajaran. Ia berasingan daripada pemadaman akaun. Jangan menjanjikan kawalan kendiri tambahan sebelum ia dilaksanakan dan diuji.

## 8. Kanak-kanak dan umur

SwiftDictionary disasarkan kepada pengguna berumur 16 tahun ke atas. Aplikasi semasa belum mempunyai langkah pengesahan umur yang dicadangkan.

Peraturan-Peraturan Perlindungan Data Peribadi 2013, Peraturan 3(3), menghendaki persetujuan di bawah Peraturan 3 diperoleh daripada ibu bapa, penjaga atau seseorang yang mempunyai tanggungjawab ibu bapa jika subjek data berumur bawah 18 tahun. Sama ada persetujuan di bawah Peraturan 3 ialah asas yang berkaitan bagi setiap tujuan pemprosesan SwiftDictionary, dan perlindungan praktikal yang diperlukan bagi pengguna berumur 16–17 tahun, mesti ditentukan dengan nasihat undang-undang Malaysia yang berkelayakan. Pengisytiharan umur kendiri 16 tahun ke atas bukan bukti umur dan bukan pengganti persetujuan ibu bapa apabila persetujuan itu diwajibkan oleh undang-undang.

Perkhidmatan tidak boleh dengan sengaja menggalakkan pengguna bawah 16 tahun membuka akaun selagi peraturan kelayakan 16+ dikekalkan. Proses untuk akaun bawah umur yang tercipta secara tidak sengaja dan data berkaitannya mesti diluluskan sebelum penerbitan.

## 9. Keselamatan

SwiftDictionary menggunakan pengesahan, kawalan akses pangkalan data dan keselamatan peringkat baris yang bertujuan mengehadkan akses kepada data akaun kepada pengguna dan operasi perkhidmatan yang sesuai. Kerja keselamatan masih berjalan. Tiada perkhidmatan dalam talian boleh menjamin keselamatan mutlak.

Pengendali akan mengekalkan proses untuk menilai kemungkinan pelanggaran data peribadi dan membuat pemberitahuan yang diwajibkan oleh undang-undang yang terpakai. Ambang dan tempoh pemberitahuan pelanggaran Malaysia yang berkaitan mesti dipatuhi; jangan anggap setiap insiden mesti dilaporkan secara automatik atau setiap insiden dikecualikan.

## 10. Perubahan kepada notis ini

Notis ini mesti dikemas kini apabila perkhidmatan, kategori data, penyedia, tujuan pemprosesan, amalan penyimpanan atau keperluan undang-undang berubah secara material. Tarikh kuat kuasa dan versi hendaklah dipaparkan. Jika persetujuan atau notis tambahan diwajibkan oleh undang-undang, dokumen yang dikemas kini sahaja bukan pengganti untuk mendapatkannya.

## 11. Bahasa

Draf kerja ini perlu dilengkapkan dalam Bahasa Malaysia dan Bahasa Inggeris sebelum diterbitkan jika Akta 709 terpakai. Kedua-dua versi mesti konsisten dari segi kandungan dan menyediakan pilihan privasi serta saluran permintaan yang mudah diakses dalam kedua-dua bahasa. Bahasa Cina Ringkas boleh ditambah sebagai terjemahan tambahan tetapi tidak menggantikan Bahasa Malaysia atau Bahasa Inggeris.

## 12. Hubungan

**Pengawal data/pengendali:** [Identiti undang-undang dan kapasiti perlu disahkan]  
**Hubungan privasi:** [E-mel dipantau atau saluran lain yang diluluskan]  
**Alamat/butiran hubungan:** [Perlu disahkan dengan nasihat undang-undang]  
**Negara:** Malaysia

## Review checklist before publication

- [ ] Confirm Act 709 applicability and the operator/controller identity with Malaysian counsel.
- [ ] Decide and document the processing basis for each purpose, including the Regulation 3(3) issue for 16–17-year-olds.
- [ ] Verify all current providers, subprocessors, OAuth scopes, transfer locations and contractual arrangements.
- [ ] Complete and approve the retention schedule, including logs and backups.
- [ ] Implement and test access/correction, deletion and data-portability request procedures as applicable.
- [ ] Decide and implement the public privacy contact route.
- [ ] Verify the production data map and current feature behaviour.
- [ ] Complete a Bahasa Malaysia legal-language review and ensure it matches the English notice.
- [ ] Obtain legal review before publication.
