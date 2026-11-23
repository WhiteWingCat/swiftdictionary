-- SwiftDictionary U2.8.0 follow-up: quiz start allowance and Chinese Quiz question quality.
-- Quiz starts now consume allowance like permanent lesson starts. Completion events
-- remain history-only, so a single Quiz cannot be charged twice.
begin;

create or replace function public.enforce_learning_daily_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_timezone text;
  v_plan text;
  v_status text;
  v_valid_from timestamptz;
  v_valid_until timestamptz;
  v_limit integer;
  v_enabled boolean;
  v_start timestamptz;
  v_end timestamptz;
  v_used integer;
  v_error_message text;
begin
  if auth.uid() is null or auth.uid() <> new.user_id then
    raise exception 'Authentication required for own learning activity'
      using errcode = '42501';
  end if;

  new.created_at := pg_catalog.now();

  -- Permanent lessons and Quizzes charge once, when a new session starts.
  -- Their completion events remain history-only. Daily activities and
  -- Flashcard games continue to charge only after successful completion.
  if new.activity_type in ('lesson','quiz') then
    if new.event_type <> 'started' then
      return new;
    end if;
    v_error_message := case new.activity_type
      when 'lesson' then 'Daily lesson start limit reached'
      else 'Daily Quiz start limit reached'
    end;
  else
    if new.event_type <> 'completed' then
      return new;
    end if;
    v_error_message := 'Daily learning completion limit reached';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.user_id::text, 0)
  );

  select coalesce(
           case when p.allowance_timezone is not null
                     and p.allowance_timezone_until > pg_catalog.now()
                then p.allowance_timezone else p.timezone end,
           'UTC'
         )
  into v_timezone
  from public.user_preferences p
  where p.user_id = new.user_id;

  if not exists (
    select 1 from pg_catalog.pg_timezone_names where name = v_timezone
  ) then
    raise exception 'Invalid IANA timezone in user preferences'
      using errcode = '22023';
  end if;

  select e.plan_code, e.status, e.valid_from, e.valid_until
  into v_plan, v_status, v_valid_from, v_valid_until
  from public.user_entitlements e
  where e.user_id = new.user_id;

  if not found or v_status <> 'active'
     or (v_valid_from is not null and pg_catalog.now() < v_valid_from)
     or (v_valid_until is not null and pg_catalog.now() >= v_valid_until) then
    v_plan := 'free';
  end if;

  select l.daily_limit, l.is_enabled into v_limit, v_enabled
  from public.learning_plan_limits l
  where l.plan_code = v_plan and l.activity_type = new.activity_type;

  if not found or not v_enabled then
    raise exception 'This learning activity is currently unavailable'
      using errcode = '42501';
  end if;

  -- The personal testing exemption remains limited to permanent lessons.
  if new.activity_type = 'lesson' and private.is_learning_limit_exempt() then
    return new;
  end if;

  v_start := (((pg_catalog.now() at time zone v_timezone)::date)::timestamp
                at time zone v_timezone);
  v_end := ((((pg_catalog.now() at time zone v_timezone)::date + 1)::timestamp)
                at time zone v_timezone);

  insert into private.learning_allowance_usage
    (user_id, activity_type, window_start, window_end, used_count)
  values
    (new.user_id, new.activity_type, v_start, v_end, 1)
  on conflict (user_id, activity_type)
  do update
  set window_start = excluded.window_start,
      window_end = excluded.window_end,
      used_count = case
        when private.learning_allowance_usage.window_start = excluded.window_start
         and private.learning_allowance_usage.window_end = excluded.window_end
        then private.learning_allowance_usage.used_count + 1
        else 1
      end,
      updated_at = pg_catalog.now()
  where private.learning_allowance_usage.window_start is distinct from excluded.window_start
     or private.learning_allowance_usage.window_end is distinct from excluded.window_end
     or private.learning_allowance_usage.used_count < v_limit
  returning used_count into v_used;

  if not found then
    select u.used_count into v_used
    from private.learning_allowance_usage u
    where u.user_id = new.user_id
      and u.activity_type = new.activity_type;

    raise exception '%', v_error_message
      using errcode = 'P0001',
            detail = pg_catalog.json_build_object(
              'activity_type', new.activity_type,
              'daily_limit', v_limit,
              'used', coalesce(v_used, v_limit),
              'timezone', v_timezone,
              'resets_at', v_end
            )::text;
  end if;

  return new;
end;
$function$;

create or replace function private.charge_quiz_start_allowance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.status = 'in_progress' then
    insert into public.learning_activity_log
      (user_id, activity_type, language_code, event_type)
    values
      (new.user_id, 'quiz', new.learning_language_code, 'started');
  end if;
  return new;
end;
$function$;

revoke all on function private.charge_quiz_start_allowance() from public, anon, authenticated;

drop trigger if exists charge_quiz_start_allowance on private.quiz_sessions;
create trigger charge_quiz_start_allowance
after insert on private.quiz_sessions
for each row execute function private.charge_quiz_start_allowance();

-- Rephrase Chinese knowledge prompts so the correct option is not repeated in
-- the question itself. Pinyin is cleared for these revised prompts because the
-- old transcription no longer matches the new wording.
update private.quiz_question_bank q
set prompt_learning = edits.prompt_learning,
    prompt_pinyin = null,
        updated_at = pg_catalog.now()
from (values
  ('zh-en-b-common-actions-01','日常用餐时，把食物送入口中的动作通常用哪个动词？'),
  ('zh-en-b-common-actions-02','口渴时，把水或其他饮料送入口中的动作通常用哪个动词？'),
  ('zh-en-b-common-actions-03','从当前位置前往另一个地点，通常用哪个动词？'),
  ('zh-en-b-common-actions-04','哪句话表示说话者正在饮用水？'),
  ('zh-en-b-common-actions-06','在学校或自学中获取知识、练习技能，通常用哪个动词？'),
  ('zh-en-b-greetings-introductions-01','早晨第一次见面时，常用哪种问候语？'),
  ('zh-en-b-greetings-introductions-02','接受他人帮助或礼物后，常用哪种表达致谢？'),
  ('zh-en-b-greetings-introductions-05','分别或结束交谈时，常用哪种告别语？'),
  ('zh-en-b-greetings-introductions-06','说话者要向别人介绍自己的姓名是李明，应该怎样表达？'),
  ('zh-en-b-greetings-introductions-07','初次见面时，表达对认识对方感到愉快，通常怎么说？'),
  ('zh-en-b-numbers-dates-time-01','哪一个汉字用来表示比六多一的整数？'),
  ('zh-en-b-numbers-dates-time-02','在日期或日常对话中，表示说话当天的词语是什么？'),
  ('zh-en-b-numbers-dates-time-03','一周中排在星期日之后的第一天通常叫什么？'),
  ('zh-en-b-numbers-dates-time-04','在日期格式中，表示一年十二个时间单位之一的汉字是什么？'),
  ('zh-en-b-numbers-dates-time-06','表示日期的下一天，通常使用哪个词？'),
  ('zh-en-b-places-getting-around-01','学生上课、阅读和完成作业的主要场所通常叫什么？'),
  ('zh-en-b-places-getting-around-02','人们生病或受伤时，通常前往哪个地方接受诊断和治疗？'),
  ('zh-en-b-places-getting-around-03','乘客等候火车或公共交通工具的地方通常叫什么？'),
  ('zh-en-b-places-getting-around-05','在地图上，通常与右侧相反的方向叫什么？'),
  ('zh-en-b-places-getting-around-06','在地图上，通常与左侧相反的方向叫什么？'),
  ('zh-en-b-pronouns-basic-sentences-01','说话者在谈论自己时，通常使用哪个第一人称单数代词？'),
  ('zh-en-b-pronouns-basic-sentences-02','书写第三人称女性时，通常使用哪个汉字？'),
  ('zh-en-b-pronouns-basic-sentences-03','说话者代表自己和至少另一人时，通常使用哪个第一人称复数代词？'),
  ('zh-en-b-pronouns-basic-sentences-04','哪句话说明说话者的身份是一名学生？'),
  ('zh-en-b-pronouns-basic-sentences-05','在中文判断句中，常用哪个动词连接主语和身份或性质？'),
  ('zh-en-b-pronouns-basic-sentences-06','哪句话表示某件书籍属于说话者，并且就在说话者附近？'),
  ('zh-en-b-questions-negation-02','用于询问事物、内容或情况的疑问代词是什么？'),
  ('zh-en-b-questions-negation-03','用于询问人物身份的疑问代词是什么？'),
  ('zh-en-b-questions-negation-04','要否定一般性的陈述时，通常在动词前使用哪个字？'),
  ('zh-en-b-questions-negation-05','表示某人或某处不存在某物时，常用哪个表达？'),
  ('zh-en-extra-01','哪个助词可用于说明说话者具备某项亲身经历？'),
  ('zh-en-i-comparisons-02','哪句话表示说话者的身高超过另一个人？'),
  ('zh-en-i-comparisons-03','在比较多个对象时，哪个字常用来引出程度最高的一项？'),
  ('zh-en-i-comparisons-04','哪种表达表示两个物体的尺寸相同？'),
  ('zh-en-i-comparisons-05','哪句话表示今天的气温低于昨天？'),
  ('zh-en-i-comparisons-07','哪个副词可以表示程度比原来增加？'),
  ('zh-en-i-grammar-particles-01','在中文名词短语中，哪个结构助词通常连接修饰语与中心名词？'),
  ('zh-en-i-grammar-particles-02','哪句话说明说话者在前一天观看了一部电影？'),
  ('zh-en-i-grammar-particles-03','哪个助词可以说明某人曾经经历过一件事？'),
  ('zh-en-i-grammar-particles-05','在口语中，哪个句末助词可以让提议听起来更自然？'),
  ('zh-en-i-measure-words-02','数词二与书籍搭配时，通常使用哪种量词结构？'),
  ('zh-en-i-measure-words-03','给饮品计数时，通常使用哪个量词？'),
  ('zh-en-i-measure-words-04','计数单页纸时，通常使用哪个量词？'),
  ('zh-en-i-measure-words-06','描述人数为一时，常用哪种数量表达？'),
  ('zh-en-i-time-expressions-02','描述每日重复发生的事情时，通常使用哪个时间表达？'),
  ('zh-en-i-time-expressions-03','表示某件事情在当前时点之前发生或完成时，通常使用哪个副词？'),
  ('zh-en-i-time-expressions-04','表示某件事情到目前为止尚未发生时，通常使用哪个表达？'),
  ('zh-en-i-time-expressions-05','哪句话表示说话者每天早晨在七点这个时间起床？'),
  ('zh-en-i-time-expressions-06','一天中午饭之后、傍晚之前的时段叫什么？'),
  ('zh-en-i-time-expressions-07','哪句话表示说话者到现在仍未吃晚餐？'),
  ('zh-en-a-complex-sentences-03','哪种句型表达一个必要条件与其后果之间的关系？'),
  ('zh-en-a-complex-sentences-05','哪句话使用被动句式，说明说话者的手机由弟弟拿走？'),
  ('zh-en-a-connectors-02','哪个连接词用于引出与前文形成对比或转折的内容？'),
  ('zh-en-a-connectors-03','哪个连接词可以在前文之后补充另一项信息？'),
  ('zh-en-a-connectors-04','哪个词常用于简要归纳前文的主要观点？'),
  ('zh-en-a-connectors-07','哪个连接词可以引出某种情况之后顺势发生的后续行动？'),
  ('zh-en-a-idioms-proverbs-01','哪个成语用来批评做了多余的事，反而破坏原本良好的结果？'),
  ('zh-en-a-idioms-proverbs-03','哪个成语形容一次行动同时获得两种好处？'),
  ('zh-en-a-idioms-proverbs-06','哪个成语劝人到了新的地方应尊重并遵循当地习惯？'),
  ('zh-en-a-nuanced-vocabulary-02','哪个副词强调经历一段等待或过程后，结果最终出现？'),
  ('zh-en-a-nuanced-vocabulary-03','哪个动词可以表示对某件事有一定认识，或熟悉相关情况？'),
  ('zh-en-a-nuanced-vocabulary-05','哪种表达可以说明一本书的内容或难度适合刚开始学习该主题的人？'),
  ('zh-en-a-nuanced-vocabulary-07','哪个副词可以引出一个极端或出乎意料的例子？'),
  ('zh-en-extra-09','描述一个人做事认真、留意细节、不容易出错时，常用哪个形容词？'),
  ('zh-en-extra-10','当机构决定让原本不对外提供的资料供公众查阅时，常用哪个动词？')
) as edits(question_id,prompt_learning)
where q.question_id = edits.question_id
  and q.learning_language_code = 'zh'
  and q.question_type = 'knowledge'
  and q.status = 'approved';

-- Remove any remaining prompt Pinyin that contains the correct option's
-- pronunciation, even when the character string itself is not repeated.
update private.quiz_question_bank q
set prompt_pinyin = null,
        updated_at = pg_catalog.now()
where q.learning_language_code = 'zh'
  and q.status = 'approved'
  and nullif(btrim(q.prompt_pinyin),'') is not null
  and exists (
    select 1
    from pg_catalog.jsonb_array_elements(q.options) as option_row(value)
    where option_row.value ->> 'id' = q.correct_option_id
      and nullif(btrim(option_row.value ->> 'pinyin'),'') is not null
      and pg_catalog.position(
        pg_catalog.lower(option_row.value ->> 'pinyin')
        in pg_catalog.lower(q.prompt_pinyin)
      ) > 0
  );

-- Make the advanced 把-construction distractors grammatical and meaningfully
-- close to the target, rather than obviously broken sentences.
update private.quiz_question_bank
set prompt_learning = '哪句话正确使用“把”字句，并明确表示作业已经全部完成？',
    prompt_pinyin = null,
    options = pg_catalog.jsonb_build_array(
      pg_catalog.jsonb_build_object('id','o1','learning_text','我把作业写完了。','translation_text','I finished writing the homework.','pinyin','wǒ bǎ zuòyè xiě wán le.'),
      pg_catalog.jsonb_build_object('id','o2','learning_text','我把作业写得很快。','translation_text','I wrote the homework quickly.','pinyin','wǒ bǎ zuòyè xiě de hěn kuài.'),
      pg_catalog.jsonb_build_object('id','o3','learning_text','我把作业写在本子上。','translation_text','I wrote the homework in a notebook.','pinyin','wǒ bǎ zuòyè xiě zài běnzi shàng.'),
      pg_catalog.jsonb_build_object('id','o4','learning_text','我把作业写到一半。','translation_text','I wrote half of the homework.','pinyin','wǒ bǎ zuòyè xiě dào yíbàn.')
    ),
    revision = revision + 1,
    updated_at = pg_catalog.now()
where question_id = 'zh-en-a-complex-sentences-07'
  and learning_language_code = 'zh'
  and status = 'approved';

commit;
