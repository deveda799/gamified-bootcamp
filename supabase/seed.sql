insert into organizations (name, slug, timezone)
values ('Jenny 知识成长', 'jenny-growth', 'Asia/Shanghai')
on conflict (slug) do update
set name = excluded.name,
    timezone = excluded.timezone,
    updated_at = now();

insert into courses (
  organization_id,
  slug,
  title,
  subtitle,
  description,
  status,
  position
)
select
  o.id,
  'ai-life-os',
  'AI人生操作系统创造营',
  '用 AI 构建个人成长与副业成长系统',
  '从人生说明书、第二大脑到 AI 数字分身的训练营。',
  'published',
  1
from organizations o
where o.slug = 'jenny-growth'
on conflict (organization_id, slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    status = excluded.status,
    position = excluded.position,
    updated_at = now();

insert into modules (course_id, title, description, position)
select
  c.id,
  '模块 01 · 人生说明书',
  '从人生说明书开始建立个人成长操作系统。',
  1
from courses c
join organizations o on o.id = c.organization_id
where o.slug = 'jenny-growth'
  and c.slug = 'ai-life-os'
on conflict (course_id, position) do update
set title = excluded.title,
    description = excluded.description,
    updated_at = now();

insert into lessons (
  module_id,
  title,
  summary,
  content_md,
  estimated_minutes,
  position,
  status
)
select
  m.id,
  '认识人生操作系统',
  '理解训练营主线与今天的行动。',
  E'# 认识人生操作系统\n\n这一节将帮助你理解人生说明书、第二大脑与 AI 知识库之间的关系。',
  8,
  1,
  'published'
from modules m
join courses c on c.id = m.course_id
join organizations o on o.id = c.organization_id
where o.slug = 'jenny-growth'
  and c.slug = 'ai-life-os'
  and m.position = 1
on conflict (module_id, position) do update
set title = excluded.title,
    summary = excluded.summary,
    content_md = excluded.content_md,
    estimated_minutes = excluded.estimated_minutes,
    status = excluded.status,
    updated_at = now();

insert into assignments (
  lesson_id,
  title,
  description_md,
  requirement_md,
  points,
  allow_text,
  allow_link,
  allow_file,
  max_files,
  position
)
select
  l.id,
  '我的价值观地图',
  '写下 5 个核心价值观，并说明它们如何影响选择。',
  E'1. 写出 5 个核心价值观\n2. 说明它们如何影响选择\n3. 可以上传图片或文件',
  10,
  true,
  true,
  true,
  5,
  1
from lessons l
join modules m on m.id = l.module_id
join courses c on c.id = m.course_id
join organizations o on o.id = c.organization_id
where o.slug = 'jenny-growth'
  and c.slug = 'ai-life-os'
  and m.position = 1
  and l.position = 1
on conflict (lesson_id, position) do update
set title = excluded.title,
    description_md = excluded.description_md,
    requirement_md = excluded.requirement_md,
    points = excluded.points,
    allow_text = excluded.allow_text,
    allow_link = excluded.allow_link,
    allow_file = excluded.allow_file,
    max_files = excluded.max_files,
    updated_at = now();

insert into camps (
  organization_id,
  course_id,
  slug,
  title,
  description,
  starts_at,
  timezone,
  status
)
select
  o.id,
  c.id,
  'ai-life-os-camp',
  'AI人生操作系统创造营',
  'MVP V1 测试训练营',
  date_trunc('day', now()),
  'Asia/Shanghai',
  'published'
from organizations o
join courses c on c.organization_id = o.id
where o.slug = 'jenny-growth'
  and c.slug = 'ai-life-os'
on conflict (organization_id, slug) do update
set course_id = excluded.course_id,
    title = excluded.title,
    description = excluded.description,
    timezone = excluded.timezone,
    status = excluded.status,
    updated_at = now();

insert into level_rules (organization_id, level_no, name, min_points)
select o.id, rules.level_no, rules.name, rules.min_points
from organizations o
cross join (
  values
    (1, '觉醒者', 0),
    (2, '探索者', 100),
    (3, '架构师', 250),
    (4, '训练师', 450),
    (5, '炼金师', 700),
    (6, '创造者', 1000),
    (7, '超级个体', 1500)
) as rules(level_no, name, min_points)
where o.slug = 'jenny-growth'
on conflict (organization_id, level_no) do update
set name = excluded.name,
    min_points = excluded.min_points;

insert into point_rules (
  organization_id,
  event_type,
  points,
  description,
  is_active
)
select
  o.id,
  rules.event_type::point_event_type,
  rules.points,
  rules.description,
  true
from organizations o
cross join (
  values
    ('profile_completed', 10, '首次完善个人资料'),
    ('daily_check_in', 2, '每日签到'),
    ('lesson_completed', 5, '完成课程学习'),
    ('assignment_submitted', 10, '提交作业')
) as rules(event_type, points, description)
where o.slug = 'jenny-growth'
on conflict (organization_id, event_type) do update
set points = excluded.points,
    description = excluded.description,
    is_active = excluded.is_active;

insert into badges (
  organization_id,
  name,
  description,
  criteria_type,
  criteria_value,
  position,
  status
)
select
  o.id,
  rules.name,
  rules.description,
  rules.criteria_type::badge_criteria_type,
  rules.criteria_value,
  rules.position,
  'published'
from organizations o
cross join (
  values
    ('觉醒者徽章', '完成首次课程学习', 'lesson_completed_count', 1, 1),
    ('人生架构师', '累计完成 5 节课程', 'lesson_completed_count', 5, 2),
    ('项目猎人', '累计提交 3 次作业', 'assignment_submitted_count', 3, 3),
    ('知识炼金师', '累计提交 5 次作业', 'assignment_submitted_count', 5, 4),
    ('数字分身创造者', '累计获得 700 积分', 'total_points', 700, 5),
    ('内容创造者', '累计获得 1000 积分', 'total_points', 1000, 6),
    ('坚持王', '累计签到 7 天', 'check_in_days', 7, 7),
    ('超级个体', '累计获得 1500 积分', 'total_points', 1500, 8)
) as rules(name, description, criteria_type, criteria_value, position)
where o.slug = 'jenny-growth'
on conflict (organization_id, name) do update
set description = excluded.description,
    criteria_type = excluded.criteria_type,
    criteria_value = excluded.criteria_value,
    position = excluded.position,
    status = excluded.status,
    updated_at = now();
