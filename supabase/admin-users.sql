-- =========================================
-- FURKAN KAYA
-- ADMIN / PANEL YETKİ SİSTEMİ
-- Supabase SQL Editor'da bir kez çalıştırın.
-- =========================================

create table if not exists public.admin_users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text not null default '',
    is_super_admin boolean not null default false,
    active boolean not null default true,
    permissions jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists admin_users_active_idx
    on public.admin_users(active);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;

grant select on table public.admin_users to authenticated;
grant all on table public.admin_users to service_role;

drop policy if exists "admin_users_self_select" on public.admin_users;

create policy "admin_users_self_select"
on public.admin_users
for select
to authenticated
using ((select auth.uid()) = id);

-- Updated timestamp
create or replace function public.set_admin_users_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists admin_users_updated_at on public.admin_users;

create trigger admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_admin_users_updated_at();

revoke execute on function public.set_admin_users_updated_at() from public, anon, authenticated;
grant execute on function public.set_admin_users_updated_at() to service_role;

-- Not: portfolios/site_settings/storage için mevcut uygulama politikaları
-- bilinmeden burada değiştirilmez. Panel görünürlüğü Edge Function ile
-- kontrol edilir; ileride tablo bazlı RLS de ayrıca sıkılaştırılabilir.