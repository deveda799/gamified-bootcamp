-- 先使用邮箱注册并完成一次登录，再从 app_users 查询内部用户 ID。
-- 将下方占位符替换为该内部用户 ID 后，只执行一次。

insert into organization_members (organization_id, user_id, role)
select
  o.id,
  '<OWNER_INTERNAL_USER_ID>'::uuid,
  'owner'
from organizations o
where o.slug = 'jenny-growth'
on conflict (organization_id, user_id) do update
set role = 'owner';
