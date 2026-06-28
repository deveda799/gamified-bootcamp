-- Supabase-specific grants are isolated from the portable business schema.
revoke all on function provision_app_user(text, text, text, text, text)
from public, anon, authenticated;
revoke all on function check_in_today(uuid, timestamptz, text)
from public, anon, authenticated;
revoke all on function complete_lesson(uuid, uuid, timestamptz)
from public, anon, authenticated;
revoke all on function submit_assignment(uuid, uuid, text, text, timestamptz)
from public, anon, authenticated;
revoke all on function award_eligible_badges(uuid, uuid, uuid, uuid, text)
from public, anon, authenticated;

grant execute on function provision_app_user(text, text, text, text, text)
to service_role;
grant execute on function check_in_today(uuid, timestamptz, text)
to service_role;
grant execute on function complete_lesson(uuid, uuid, timestamptz)
to service_role;
grant execute on function submit_assignment(uuid, uuid, text, text, timestamptz)
to service_role;
grant execute on function award_eligible_badges(uuid, uuid, uuid, uuid, text)
to service_role;
