create extension if not exists "pgcrypto";

create type member_role as enum ('owner', 'admin', 'assistant', 'student');
create type publish_status as enum ('draft', 'published', 'archived');
create type enrollment_status as enum ('active', 'paused', 'completed', 'removed');
create type lesson_progress_status as enum ('not_started', 'in_progress', 'completed');
create type submission_status as enum ('draft', 'submitted', 'withdrawn');
create type asset_type as enum ('image', 'video', 'audio', 'pdf', 'file', 'prompt');
create type point_event_type as enum (
  'profile_completed',
  'daily_check_in',
  'lesson_completed',
  'assignment_submitted'
);
create type badge_criteria_type as enum (
  'total_points',
  'check_in_days',
  'lesson_completed_count',
  'assignment_submitted_count'
);

create table app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index app_users_email_key on app_users (lower(email));

create table auth_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  provider text not null,
  provider_subject text not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_subject)
);

create table profiles (
  user_id uuid primary key references app_users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  leaderboard_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Shanghai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  role member_role not null default 'student',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  slug text not null,
  title text not null,
  subtitle text,
  description text,
  cover_url text,
  status publish_status not null default 'draft',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, position)
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  title text not null,
  summary text,
  content_md text not null default '',
  estimated_minutes int not null default 10,
  position int not null default 0,
  status publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, position)
);

create table lesson_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  type asset_type not null,
  title text not null,
  storage_path text,
  external_url text,
  content text,
  metadata jsonb not null default '{}'::jsonb,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table camps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  course_id uuid not null references courses(id) on delete restrict,
  slug text not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Asia/Shanghai',
  status publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  camp_id uuid not null references camps(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  status enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (camp_id, user_id)
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  status lesson_progress_status not null default 'not_started',
  first_opened_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, lesson_id)
);

create table check_ins (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  local_date date not null,
  note text,
  created_at timestamptz not null default now(),
  unique (enrollment_id, local_date)
);

create table assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  title text not null,
  description_md text not null,
  requirement_md text,
  points int not null default 10,
  is_required boolean not null default true,
  allow_text boolean not null default true,
  allow_link boolean not null default true,
  allow_file boolean not null default true,
  max_files int not null default 5,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, position)
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  assignment_id uuid not null references assignments(id) on delete cascade,
  status submission_status not null default 'draft',
  text_content text,
  link_url text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, assignment_id)
);

create table submission_assets (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  type asset_type not null,
  original_name text not null,
  object_key text not null unique,
  size_bytes bigint not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

create table point_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  event_type point_event_type not null,
  points int not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, event_type)
);

create table point_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  camp_id uuid not null references camps(id) on delete cascade,
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  event_type point_event_type not null,
  event_key text not null unique,
  delta int not null,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table level_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  level_no int not null,
  name text not null,
  min_points int not null,
  icon text,
  created_at timestamptz not null default now(),
  unique (organization_id, level_no),
  unique (organization_id, min_points)
);

create table badges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text not null,
  icon_url text,
  criteria_type badge_criteria_type not null,
  criteria_value int not null,
  status publish_status not null default 'published',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table badge_awards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  camp_id uuid not null references camps(id) on delete cascade,
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  source_event_key text,
  awarded_at timestamptz not null default now(),
  unique (user_id, camp_id, badge_id)
);

create index idx_auth_identities_user on auth_identities(user_id);
create index idx_org_members_user on organization_members(user_id);
create index idx_org_members_org_role on organization_members(organization_id, role);
create index idx_courses_org_status on courses(organization_id, status);
create index idx_modules_course_position on modules(course_id, position);
create index idx_lessons_module_position on lessons(module_id, position);
create index idx_lesson_assets_lesson_position on lesson_assets(lesson_id, position);
create index idx_camps_org_status on camps(organization_id, status);
create index idx_enrollments_user_status on enrollments(user_id, status);
create index idx_enrollments_camp_status on enrollments(camp_id, status);
create index idx_lesson_progress_enrollment_status on lesson_progress(enrollment_id, status);
create index idx_check_ins_enrollment_date on check_ins(enrollment_id, local_date desc);
create index idx_assignments_lesson_position on assignments(lesson_id, position);
create index idx_submissions_enrollment_status on submissions(enrollment_id, status);
create index idx_submissions_assignment_status on submissions(assignment_id, status);
create index idx_point_ledger_user_camp_time on point_ledger(user_id, camp_id, created_at desc);
create index idx_point_ledger_camp_time on point_ledger(camp_id, created_at desc);
create index idx_badge_awards_user_camp on badge_awards(user_id, camp_id);

create view v_enrollment_scores as
select
  e.id as enrollment_id,
  e.camp_id,
  e.user_id,
  (
    select coalesce(sum(pl.delta), 0)::int
    from point_ledger pl
    where pl.enrollment_id = e.id
  ) as total_points,
  (
    select count(distinct ci.local_date)::int
    from check_ins ci
    where ci.enrollment_id = e.id
  ) as check_in_days,
  (
    select count(*)::int
    from lesson_progress lp
    where lp.enrollment_id = e.id
      and lp.status = 'completed'
  ) as completed_lessons,
  (
    select count(*)::int
    from submissions s
    where s.enrollment_id = e.id
      and s.status = 'submitted'
  ) as submitted_assignments,
  (
    select count(*)::int
    from badge_awards ba
    where ba.enrollment_id = e.id
  ) as badges_count
from enrollments e;

create view v_current_levels as
select
  scores.*,
  current_rule.level_no,
  current_rule.name as level_name,
  next_rule.name as next_level_name,
  greatest(coalesce(next_rule.min_points, scores.total_points) - scores.total_points, 0)::int as points_to_next_level
from v_enrollment_scores scores
join camps c on c.id = scores.camp_id
join lateral (
  select lr.level_no, lr.name, lr.min_points
  from level_rules lr
  where lr.organization_id = c.organization_id
    and lr.min_points <= scores.total_points
  order by lr.min_points desc
  limit 1
) current_rule on true
left join lateral (
  select lr.name, lr.min_points
  from level_rules lr
  where lr.organization_id = c.organization_id
    and lr.min_points > scores.total_points
  order by lr.min_points
  limit 1
) next_rule on true;

create view v_leaderboard_total as
select
  scores.camp_id,
  scores.user_id,
  p.nickname,
  p.leaderboard_anonymous,
  scores.total_points,
  scores.submitted_assignments,
  scores.check_in_days,
  row_number() over (
    partition by scores.camp_id
    order by scores.total_points desc, scores.submitted_assignments desc, scores.check_in_days desc, scores.user_id
  )::int as rank_no
from v_enrollment_scores scores
join profiles p on p.user_id = scores.user_id;

create or replace function award_eligible_badges(
  p_user_id uuid,
  p_enrollment_id uuid,
  p_camp_id uuid,
  p_organization_id uuid,
  p_event_key text
)
returns text[]
language plpgsql
as $$
declare
  v_new_badges text[];
begin
  with stats as (
    select *
    from v_enrollment_scores
    where enrollment_id = p_enrollment_id
  ),
  inserted as (
    insert into badge_awards (
      organization_id,
      camp_id,
      enrollment_id,
      user_id,
      badge_id,
      source_event_key
    )
    select
      p_organization_id,
      p_camp_id,
      p_enrollment_id,
      p_user_id,
      b.id,
      p_event_key
    from badges b
    cross join stats s
    where b.organization_id = p_organization_id
      and b.status = 'published'
      and case b.criteria_type
        when 'total_points' then s.total_points >= b.criteria_value
        when 'check_in_days' then s.check_in_days >= b.criteria_value
        when 'lesson_completed_count' then s.completed_lessons >= b.criteria_value
        when 'assignment_submitted_count' then s.submitted_assignments >= b.criteria_value
      end
    on conflict (user_id, camp_id, badge_id) do nothing
    returning badge_id
  )
  select coalesce(array_agg(b.name order by b.position), array[]::text[])
  into v_new_badges
  from inserted i
  join badges b on b.id = i.badge_id;

  return coalesce(v_new_badges, array[]::text[]);
end;
$$;

create or replace function provision_app_user(
  p_provider text,
  p_provider_subject text,
  p_email text,
  p_nickname text,
  p_default_camp_slug text
)
returns table (id uuid, email text, status text)
language plpgsql
as $$
declare
  v_user_id uuid;
  v_camp camps%rowtype;
begin
  select ai.user_id
  into v_user_id
  from auth_identities ai
  where ai.provider = p_provider
    and ai.provider_subject = p_provider_subject;

  if v_user_id is null then
    insert into app_users (email)
    values (lower(trim(p_email)))
    on conflict (lower(email)) do update
    set email = excluded.email,
        updated_at = now()
    returning app_users.id into v_user_id;

    insert into auth_identities (user_id, provider, provider_subject)
    values (v_user_id, p_provider, p_provider_subject)
    on conflict (provider, provider_subject) do nothing;
  end if;

  insert into profiles (user_id, nickname)
  values (v_user_id, coalesce(nullif(trim(p_nickname), ''), split_part(p_email, '@', 1)))
  on conflict (user_id) do nothing;

  select c.*
  into v_camp
  from camps c
  where c.slug = p_default_camp_slug
    and c.status = 'published'
  order by c.created_at
  limit 1;

  if v_camp.id is not null then
    insert into organization_members (organization_id, user_id, role)
    values (v_camp.organization_id, v_user_id, 'student')
    on conflict (organization_id, user_id) do nothing;

    insert into enrollments (camp_id, user_id, status)
    values (v_camp.id, v_user_id, 'active')
    on conflict (camp_id, user_id) do nothing;
  end if;

  return query
  select au.id, au.email, au.status
  from app_users au
  where au.id = v_user_id;
end;
$$;

create or replace function check_in_today(
  p_user_id uuid,
  p_now timestamptz,
  p_note text default null
)
returns table (
  local_date date,
  already_checked_in boolean,
  points_added int,
  check_in_days int,
  new_badges text[]
)
language plpgsql
as $$
declare
  v_enrollment enrollments%rowtype;
  v_organization_id uuid;
  v_timezone text;
  v_local_date date;
  v_event_key text;
  v_points int;
  v_inserted_id uuid;
begin
  select e, c.organization_id, c.timezone
  into v_enrollment, v_organization_id, v_timezone
  from enrollments e
  join camps c on c.id = e.camp_id
  where e.user_id = p_user_id
    and e.status = 'active'
  order by e.enrolled_at desc
  limit 1
  for update of e;

  if v_enrollment.id is null then
    raise exception 'NO_ACTIVE_ENROLLMENT';
  end if;

  v_local_date := (p_now at time zone v_timezone)::date;
  v_event_key := 'daily_check_in:' || v_enrollment.id || ':' || v_local_date;

  insert into check_ins (enrollment_id, local_date, note)
  values (v_enrollment.id, v_local_date, nullif(trim(p_note), ''))
  on conflict (enrollment_id, local_date) do nothing
  returning check_ins.id into v_inserted_id;

  if v_inserted_id is null then
    return query
    select
      v_local_date,
      true,
      0,
      (select count(distinct ci.local_date)::int from check_ins ci where ci.enrollment_id = v_enrollment.id),
      array[]::text[];
    return;
  end if;

  select pr.points
  into v_points
  from point_rules pr
  where pr.organization_id = v_organization_id
    and pr.event_type = 'daily_check_in'
    and pr.is_active;

  v_points := coalesce(v_points, 2);

  insert into point_ledger (
    organization_id, camp_id, enrollment_id, user_id,
    event_type, event_key, delta, reason
  )
  values (
    v_organization_id, v_enrollment.camp_id, v_enrollment.id, p_user_id,
    'daily_check_in', v_event_key, v_points, '每日签到'
  )
  on conflict (event_key) do nothing;

  return query
  select
    v_local_date,
    false,
    v_points,
    (select count(distinct ci.local_date)::int from check_ins ci where ci.enrollment_id = v_enrollment.id),
    award_eligible_badges(
      p_user_id,
      v_enrollment.id,
      v_enrollment.camp_id,
      v_organization_id,
      v_event_key
    );
end;
$$;

create or replace function complete_lesson(
  p_user_id uuid,
  p_lesson_id uuid,
  p_now timestamptz
)
returns table (
  lesson_id uuid,
  already_completed boolean,
  points_added int,
  completed_lessons int,
  new_badges text[]
)
language plpgsql
as $$
declare
  v_enrollment enrollments%rowtype;
  v_organization_id uuid;
  v_existing_status lesson_progress_status;
  v_event_key text;
  v_points int;
begin
  select e, c.organization_id
  into v_enrollment, v_organization_id
  from enrollments e
  join camps c on c.id = e.camp_id
  join modules m on m.course_id = c.course_id
  join lessons l on l.module_id = m.id
  where e.user_id = p_user_id
    and e.status = 'active'
    and l.id = p_lesson_id
  limit 1
  for update of e;

  if v_enrollment.id is null then
    raise exception 'LESSON_NOT_AVAILABLE';
  end if;

  select lp.status
  into v_existing_status
  from lesson_progress lp
  where lp.enrollment_id = v_enrollment.id
    and lp.lesson_id = p_lesson_id;

  if v_existing_status = 'completed' then
    return query
    select
      p_lesson_id,
      true,
      0,
      (select count(*)::int from lesson_progress lp where lp.enrollment_id = v_enrollment.id and lp.status = 'completed'),
      array[]::text[];
    return;
  end if;

  insert into lesson_progress (
    enrollment_id, lesson_id, status, first_opened_at, completed_at, updated_at
  )
  values (
    v_enrollment.id, p_lesson_id, 'completed', p_now, p_now, p_now
  )
  on conflict (enrollment_id, lesson_id) do update
  set status = 'completed',
      first_opened_at = coalesce(lesson_progress.first_opened_at, excluded.first_opened_at),
      completed_at = excluded.completed_at,
      updated_at = excluded.updated_at;

  v_event_key := 'lesson_completed:' || v_enrollment.id || ':' || p_lesson_id;

  select pr.points
  into v_points
  from point_rules pr
  where pr.organization_id = v_organization_id
    and pr.event_type = 'lesson_completed'
    and pr.is_active;

  v_points := coalesce(v_points, 5);

  insert into point_ledger (
    organization_id, camp_id, enrollment_id, user_id,
    event_type, event_key, delta, reason
  )
  values (
    v_organization_id, v_enrollment.camp_id, v_enrollment.id, p_user_id,
    'lesson_completed', v_event_key, v_points, '完成课程学习'
  )
  on conflict (event_key) do nothing;

  return query
  select
    p_lesson_id,
    false,
    v_points,
    (select count(*)::int from lesson_progress lp where lp.enrollment_id = v_enrollment.id and lp.status = 'completed'),
    award_eligible_badges(
      p_user_id,
      v_enrollment.id,
      v_enrollment.camp_id,
      v_organization_id,
      v_event_key
    );
end;
$$;

create or replace function submit_assignment(
  p_user_id uuid,
  p_assignment_id uuid,
  p_text_content text,
  p_link_url text,
  p_now timestamptz
)
returns table (
  submission_id uuid,
  status submission_status,
  already_submitted boolean,
  points_added int,
  submitted_assignments int,
  new_badges text[]
)
language plpgsql
as $$
declare
  v_enrollment enrollments%rowtype;
  v_organization_id uuid;
  v_assignment_points int;
  v_submission submissions%rowtype;
  v_event_key text;
  v_points int;
begin
  select e, c.organization_id, a.points
  into v_enrollment, v_organization_id, v_assignment_points
  from enrollments e
  join camps c on c.id = e.camp_id
  join modules m on m.course_id = c.course_id
  join lessons l on l.module_id = m.id
  join assignments a on a.lesson_id = l.id
  where e.user_id = p_user_id
    and e.status = 'active'
    and a.id = p_assignment_id
  limit 1
  for update of e;

  if v_enrollment.id is null then
    raise exception 'ASSIGNMENT_NOT_AVAILABLE';
  end if;

  select s.*
  into v_submission
  from submissions s
  where s.enrollment_id = v_enrollment.id
    and s.assignment_id = p_assignment_id
  for update;

  if v_submission.status = 'submitted' then
    return query
    select
      v_submission.id,
      v_submission.status,
      true,
      0,
      (select count(*)::int from submissions s where s.enrollment_id = v_enrollment.id and s.status = 'submitted'),
      array[]::text[];
    return;
  end if;

  insert into submissions (
    enrollment_id, assignment_id, status, text_content, link_url, submitted_at, updated_at
  )
  values (
    v_enrollment.id,
    p_assignment_id,
    'submitted',
    nullif(trim(p_text_content), ''),
    nullif(trim(p_link_url), ''),
    p_now,
    p_now
  )
  on conflict (enrollment_id, assignment_id) do update
  set status = 'submitted',
      text_content = excluded.text_content,
      link_url = excluded.link_url,
      submitted_at = excluded.submitted_at,
      updated_at = excluded.updated_at
  returning submissions.* into v_submission;

  v_event_key := 'assignment_submitted:' || v_enrollment.id || ':' || p_assignment_id;

  select pr.points
  into v_points
  from point_rules pr
  where pr.organization_id = v_organization_id
    and pr.event_type = 'assignment_submitted'
    and pr.is_active;

  v_points := coalesce(v_points, v_assignment_points, 10);

  insert into point_ledger (
    organization_id, camp_id, enrollment_id, user_id,
    event_type, event_key, delta, reason
  )
  values (
    v_organization_id, v_enrollment.camp_id, v_enrollment.id, p_user_id,
    'assignment_submitted', v_event_key, v_points, '提交作业'
  )
  on conflict (event_key) do nothing;

  return query
  select
    v_submission.id,
    v_submission.status,
    false,
    v_points,
    (select count(*)::int from submissions s where s.enrollment_id = v_enrollment.id and s.status = 'submitted'),
    award_eligible_badges(
      p_user_id,
      v_enrollment.id,
      v_enrollment.camp_id,
      v_organization_id,
      v_event_key
    );
end;
$$;

alter table app_users enable row level security;
alter table auth_identities enable row level security;
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table lesson_assets enable row level security;
alter table camps enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table check_ins enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table submission_assets enable row level security;
alter table point_rules enable row level security;
alter table point_ledger enable row level security;
alter table level_rules enable row level security;
alter table badges enable row level security;
alter table badge_awards enable row level security;
