-- DBW community feature setup
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default '匿名',
  category text not null check (
    category in ('攻略', '小ネタ', 'デッキ', 'ファンアート', 'その他')
  ),
  title text not null check (char_length(title) between 1 and 80),
  body text not null check (char_length(body) between 1 and 2000),
  image_url text,
  rights_confirmed boolean not null default false,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected')
  ),
  featured_date date,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.admin_users enable row level security;
alter table public.community_posts enable row level security;

create or replace function public.is_dbw_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_dbw_admin() from public;
grant execute on function public.is_dbw_admin() to authenticated;

-- Public users may only read approved posts.
create policy "public read approved community posts"
on public.community_posts
for select
using (
  status = 'approved'
  or public.is_dbw_admin()
);

-- Anonymous visitors may submit only pending posts with rights confirmed.
create policy "public submit pending community posts"
on public.community_posts
for insert
with check (
  status = 'pending'
  and featured_date is null
  and approved_at is null
  and rights_confirmed = true
);

-- Only registered admins may moderate posts.
create policy "admins update community posts"
on public.community_posts
for update
to authenticated
using (public.is_dbw_admin())
with check (public.is_dbw_admin());

create policy "admins delete community posts"
on public.community_posts
for delete
to authenticated
using (public.is_dbw_admin());

create policy "admins read admin list"
on public.admin_users
for select
to authenticated
using (public.is_dbw_admin());

-- Prevent more than one featured post per day.
create unique index if not exists one_featured_post_per_day
on public.community_posts(featured_date)
where featured_date is not null and status = 'approved';

-- Image bucket for fan art and other submitted images.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'community-images',
  'community-images',
  true,
  8388608,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anonymous uploads are accepted only under pending/.
create policy "public upload pending community images"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'community-images'
  and (storage.foldername(name))[1] = 'pending'
);

-- Public bucket means approved pages can display image URLs.
create policy "public read community images"
on storage.objects
for select
to public
using (bucket_id = 'community-images');

-- Admins may manage submitted images.
create policy "admins manage community images"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'community-images'
  and public.is_dbw_admin()
)
with check (
  bucket_id = 'community-images'
  and public.is_dbw_admin()
);

-- After creating your own Auth user, register it as an admin with:
-- insert into public.admin_users(user_id)
-- values ('YOUR_AUTH_USER_UUID');
