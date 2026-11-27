-- U3.0 staging repair: align Malay Daily Discovery catalogue IDs with the live 93-word derived pool.
-- Stale rows are deactivated, not deleted; the current pool is upserted with stable rotation order.
begin;

update private.learning_content_catalog
set is_active=false,updated_at=pg_catalog.now()
where language_code='ms' and activity_type='daily_discovery'
  and content_id not in ('ms-discovery-dict-ada','ms-discovery-dict-air','ms-discovery-dict-ajar','ms-discovery-dict-anak','ms-discovery-dict-baik','ms-discovery-dict-baca','ms-discovery-dict-bahasa','ms-discovery-dict-bantu','ms-discovery-dict-besar','ms-discovery-dict-boleh','ms-discovery-dict-buku','ms-discovery-dict-datang','ms-discovery-dict-dengan','ms-discovery-dict-kawan','ms-discovery-dict-makan','ms-discovery-dict-minum','ms-discovery-dict-pergi','ms-discovery-dict-rumah','ms-discovery-dict-sekolah','ms-discovery-dict-saya','ms-discovery-dict-tidur','ms-discovery-dict-tolong','ms-discovery-dict-terima-kasih','ms-discovery-dict-untuk','ms-discovery-dict-pejabat','ms-discovery-dict-pekerja','ms-discovery-dict-majikan','ms-discovery-dict-pekerjaan','ms-discovery-dict-wang','ms-discovery-dict-murah','ms-discovery-dict-mahal','ms-discovery-dict-bayaran','ms-discovery-dict-jual','ms-discovery-dict-kedai','ms-discovery-dict-pasar','ms-discovery-dict-pasar-raya','ms-discovery-dict-resit','ms-discovery-dict-bil','ms-discovery-dict-bank','ms-discovery-dict-akaun','ms-discovery-dict-tunai','ms-discovery-dict-pelanggan','ms-discovery-dict-perkhidmatan','ms-discovery-dict-hospital','ms-discovery-dict-klinik','ms-discovery-dict-ubat','ms-discovery-dict-doktor','ms-discovery-dict-jururawat','ms-discovery-dict-polis','ms-discovery-dict-balai-polis','ms-discovery-dict-bomba','ms-discovery-dict-pejabat-pos','ms-discovery-dict-perpustakaan','ms-discovery-dict-universiti','ms-discovery-dict-kolej','ms-discovery-dict-peperiksaan','ms-discovery-dict-soalan','ms-discovery-dict-jawapan','ms-discovery-dict-latihan','ms-discovery-dict-komputer','ms-discovery-dict-telefon','ms-discovery-dict-internet','ms-discovery-dict-surat','ms-discovery-dict-e-mel','ms-discovery-dict-mesyuarat','ms-discovery-dict-cuti','ms-discovery-dict-ribut','ms-discovery-dict-banjir','ms-discovery-dict-kemalangan','ms-discovery-dict-kecemasan','ms-discovery-dict-selamat','ms-discovery-dict-bahaya','ms-discovery-dict-peluang','ms-discovery-dict-tujuan','ms-discovery-dict-sebab','ms-discovery-dict-akibat','ms-discovery-dict-berjaya','ms-discovery-dict-gagal','ms-discovery-dict-kereta','ms-discovery-dict-motosikal','ms-discovery-dict-basikal','ms-discovery-dict-teksi','ms-discovery-dict-tren','ms-discovery-dict-stesen','ms-discovery-dict-lapangan-terbang','ms-discovery-dict-pesawat','ms-discovery-dict-tiket','ms-discovery-dict-perjalanan','ms-discovery-dict-peta','ms-discovery-dict-hotel','ms-discovery-dict-jiran','ms-discovery-dict-kampung','ms-discovery-dict-taman');

with current_pool(activity_type,rotation_order,content_id) as (
  values
('daily_discovery',1,'ms-discovery-dict-ada'),
('daily_discovery',2,'ms-discovery-dict-air'),
('daily_discovery',3,'ms-discovery-dict-ajar'),
('daily_discovery',4,'ms-discovery-dict-anak'),
('daily_discovery',5,'ms-discovery-dict-baik'),
('daily_discovery',6,'ms-discovery-dict-baca'),
('daily_discovery',7,'ms-discovery-dict-bahasa'),
('daily_discovery',8,'ms-discovery-dict-bantu'),
('daily_discovery',9,'ms-discovery-dict-besar'),
('daily_discovery',10,'ms-discovery-dict-boleh'),
('daily_discovery',11,'ms-discovery-dict-buku'),
('daily_discovery',12,'ms-discovery-dict-datang'),
('daily_discovery',13,'ms-discovery-dict-dengan'),
('daily_discovery',14,'ms-discovery-dict-kawan'),
('daily_discovery',15,'ms-discovery-dict-makan'),
('daily_discovery',16,'ms-discovery-dict-minum'),
('daily_discovery',17,'ms-discovery-dict-pergi'),
('daily_discovery',18,'ms-discovery-dict-rumah'),
('daily_discovery',19,'ms-discovery-dict-sekolah'),
('daily_discovery',20,'ms-discovery-dict-saya'),
('daily_discovery',21,'ms-discovery-dict-tidur'),
('daily_discovery',22,'ms-discovery-dict-tolong'),
('daily_discovery',23,'ms-discovery-dict-terima-kasih'),
('daily_discovery',24,'ms-discovery-dict-untuk'),
('daily_discovery',25,'ms-discovery-dict-pejabat'),
('daily_discovery',26,'ms-discovery-dict-pekerja'),
('daily_discovery',27,'ms-discovery-dict-majikan'),
('daily_discovery',28,'ms-discovery-dict-pekerjaan'),
('daily_discovery',29,'ms-discovery-dict-wang'),
('daily_discovery',30,'ms-discovery-dict-murah'),
('daily_discovery',31,'ms-discovery-dict-mahal'),
('daily_discovery',32,'ms-discovery-dict-bayaran'),
('daily_discovery',33,'ms-discovery-dict-jual'),
('daily_discovery',34,'ms-discovery-dict-kedai'),
('daily_discovery',35,'ms-discovery-dict-pasar'),
('daily_discovery',36,'ms-discovery-dict-pasar-raya'),
('daily_discovery',37,'ms-discovery-dict-resit'),
('daily_discovery',38,'ms-discovery-dict-bil'),
('daily_discovery',39,'ms-discovery-dict-bank'),
('daily_discovery',40,'ms-discovery-dict-akaun'),
('daily_discovery',41,'ms-discovery-dict-tunai'),
('daily_discovery',42,'ms-discovery-dict-pelanggan'),
('daily_discovery',43,'ms-discovery-dict-perkhidmatan'),
('daily_discovery',44,'ms-discovery-dict-hospital'),
('daily_discovery',45,'ms-discovery-dict-klinik'),
('daily_discovery',46,'ms-discovery-dict-ubat'),
('daily_discovery',47,'ms-discovery-dict-doktor'),
('daily_discovery',48,'ms-discovery-dict-jururawat'),
('daily_discovery',49,'ms-discovery-dict-polis'),
('daily_discovery',50,'ms-discovery-dict-balai-polis'),
('daily_discovery',51,'ms-discovery-dict-bomba'),
('daily_discovery',52,'ms-discovery-dict-pejabat-pos'),
('daily_discovery',53,'ms-discovery-dict-perpustakaan'),
('daily_discovery',54,'ms-discovery-dict-universiti'),
('daily_discovery',55,'ms-discovery-dict-kolej'),
('daily_discovery',56,'ms-discovery-dict-peperiksaan'),
('daily_discovery',57,'ms-discovery-dict-soalan'),
('daily_discovery',58,'ms-discovery-dict-jawapan'),
('daily_discovery',59,'ms-discovery-dict-latihan'),
('daily_discovery',60,'ms-discovery-dict-komputer'),
('daily_discovery',61,'ms-discovery-dict-telefon'),
('daily_discovery',62,'ms-discovery-dict-internet'),
('daily_discovery',63,'ms-discovery-dict-surat'),
('daily_discovery',64,'ms-discovery-dict-e-mel'),
('daily_discovery',65,'ms-discovery-dict-mesyuarat'),
('daily_discovery',66,'ms-discovery-dict-cuti'),
('daily_discovery',67,'ms-discovery-dict-ribut'),
('daily_discovery',68,'ms-discovery-dict-banjir'),
('daily_discovery',69,'ms-discovery-dict-kemalangan'),
('daily_discovery',70,'ms-discovery-dict-kecemasan'),
('daily_discovery',71,'ms-discovery-dict-selamat'),
('daily_discovery',72,'ms-discovery-dict-bahaya'),
('daily_discovery',73,'ms-discovery-dict-peluang'),
('daily_discovery',74,'ms-discovery-dict-tujuan'),
('daily_discovery',75,'ms-discovery-dict-sebab'),
('daily_discovery',76,'ms-discovery-dict-akibat'),
('daily_discovery',77,'ms-discovery-dict-berjaya'),
('daily_discovery',78,'ms-discovery-dict-gagal'),
('daily_discovery',79,'ms-discovery-dict-kereta'),
('daily_discovery',80,'ms-discovery-dict-motosikal'),
('daily_discovery',81,'ms-discovery-dict-basikal'),
('daily_discovery',82,'ms-discovery-dict-teksi'),
('daily_discovery',83,'ms-discovery-dict-tren'),
('daily_discovery',84,'ms-discovery-dict-stesen'),
('daily_discovery',85,'ms-discovery-dict-lapangan-terbang'),
('daily_discovery',86,'ms-discovery-dict-pesawat'),
('daily_discovery',87,'ms-discovery-dict-tiket'),
('daily_discovery',88,'ms-discovery-dict-perjalanan'),
('daily_discovery',89,'ms-discovery-dict-peta'),
('daily_discovery',90,'ms-discovery-dict-hotel'),
('daily_discovery',91,'ms-discovery-dict-jiran'),
('daily_discovery',92,'ms-discovery-dict-kampung'),
('daily_discovery',93,'ms-discovery-dict-taman')
)
insert into private.learning_content_catalog
  (activity_type,content_id,rotation_order,topic_id,difficulty,language_code,is_active)
select activity_type,content_id,rotation_order,null,null,'ms',true
from current_pool
on conflict(activity_type,content_id,language_code) do update
set rotation_order=excluded.rotation_order,
    topic_id=null,
    difficulty=null,
    is_active=true,
    updated_at=pg_catalog.now();

do $assert$
begin
  if (select count(*) from private.learning_content_catalog
      where language_code='ms' and activity_type='daily_discovery' and is_active)<>93 then
    raise exception 'Malay Daily Discovery catalogue must contain exactly 93 active IDs';
  end if;
  if exists(
    select 1 from private.learning_content_catalog
    where language_code='ms' and activity_type='daily_discovery' and is_active
      and (topic_id is not null or difficulty is not null)
  ) then
    raise exception 'Malay Daily Discovery catalogue rows must not carry topic/difficulty metadata';
  end if;
end;
$assert$;

commit;