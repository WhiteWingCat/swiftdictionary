-- The Malay Daily Discovery runtime pool must match the approved catalogue
-- exactly and preserve rotation_order 1..93. This prevents stale content IDs
-- from being rejected by private.is_approved_learning_content().
DO $$
DECLARE
  expected_ids text[] := ARRAY[
    'ms-discovery-dict-ada',
    'ms-discovery-dict-air',
    'ms-discovery-dict-ajar',
    'ms-discovery-dict-anak',
    'ms-discovery-dict-baik',
    'ms-discovery-dict-baca',
    'ms-discovery-dict-bahasa',
    'ms-discovery-dict-bantu',
    'ms-discovery-dict-besar',
    'ms-discovery-dict-boleh',
    'ms-discovery-dict-buku',
    'ms-discovery-dict-datang',
    'ms-discovery-dict-dengan',
    'ms-discovery-dict-kawan',
    'ms-discovery-dict-makan',
    'ms-discovery-dict-minum',
    'ms-discovery-dict-pergi',
    'ms-discovery-dict-rumah',
    'ms-discovery-dict-sekolah',
    'ms-discovery-dict-saya',
    'ms-discovery-dict-tidur',
    'ms-discovery-dict-tolong',
    'ms-discovery-dict-terima-kasih',
    'ms-discovery-dict-untuk',
    'ms-discovery-dict-pejabat',
    'ms-discovery-dict-pekerja',
    'ms-discovery-dict-majikan',
    'ms-discovery-dict-pekerjaan',
    'ms-discovery-dict-wang',
    'ms-discovery-dict-murah',
    'ms-discovery-dict-mahal',
    'ms-discovery-dict-bayaran',
    'ms-discovery-dict-jual',
    'ms-discovery-dict-kedai',
    'ms-discovery-dict-pasar',
    'ms-discovery-dict-pasar-raya',
    'ms-discovery-dict-resit',
    'ms-discovery-dict-bil',
    'ms-discovery-dict-bank',
    'ms-discovery-dict-akaun',
    'ms-discovery-dict-tunai',
    'ms-discovery-dict-pelanggan',
    'ms-discovery-dict-perkhidmatan',
    'ms-discovery-dict-hospital',
    'ms-discovery-dict-klinik',
    'ms-discovery-dict-ubat',
    'ms-discovery-dict-doktor',
    'ms-discovery-dict-jururawat',
    'ms-discovery-dict-polis',
    'ms-discovery-dict-balai-polis',
    'ms-discovery-dict-bomba',
    'ms-discovery-dict-pejabat-pos',
    'ms-discovery-dict-perpustakaan',
    'ms-discovery-dict-universiti',
    'ms-discovery-dict-kolej',
    'ms-discovery-dict-peperiksaan',
    'ms-discovery-dict-soalan',
    'ms-discovery-dict-jawapan',
    'ms-discovery-dict-latihan',
    'ms-discovery-dict-komputer',
    'ms-discovery-dict-telefon',
    'ms-discovery-dict-internet',
    'ms-discovery-dict-surat',
    'ms-discovery-dict-e-mel',
    'ms-discovery-dict-mesyuarat',
    'ms-discovery-dict-cuti',
    'ms-discovery-dict-ribut',
    'ms-discovery-dict-banjir',
    'ms-discovery-dict-kemalangan',
    'ms-discovery-dict-kecemasan',
    'ms-discovery-dict-selamat',
    'ms-discovery-dict-bahaya',
    'ms-discovery-dict-peluang',
    'ms-discovery-dict-tujuan',
    'ms-discovery-dict-sebab',
    'ms-discovery-dict-akibat',
    'ms-discovery-dict-berjaya',
    'ms-discovery-dict-gagal',
    'ms-discovery-dict-kereta',
    'ms-discovery-dict-motosikal',
    'ms-discovery-dict-basikal',
    'ms-discovery-dict-teksi',
    'ms-discovery-dict-tren',
    'ms-discovery-dict-stesen',
    'ms-discovery-dict-lapangan-terbang',
    'ms-discovery-dict-pesawat',
    'ms-discovery-dict-tiket',
    'ms-discovery-dict-perjalanan',
    'ms-discovery-dict-peta',
    'ms-discovery-dict-hotel',
    'ms-discovery-dict-jiran',
    'ms-discovery-dict-kampung',
    'ms-discovery-dict-taman'
  ];
  actual_ids text[];
BEGIN
  SELECT array_agg(content_id ORDER BY rotation_order)
    INTO actual_ids
  FROM private.learning_content_catalog
  WHERE language_code='ms'
    AND activity_type='daily_discovery'
    AND is_active;

  IF actual_ids IS DISTINCT FROM expected_ids THEN
    RAISE EXCEPTION 'Malay Daily Discovery catalogue IDs or rotation order do not match the runtime pool';
  END IF;
END
$$;
