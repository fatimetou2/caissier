-- بيانات اختبار لدفتر الصندوق
-- نفّذ بعد schema.sql

insert into public.cash_entries (date, type, amount)
values
  ('2026-08-01', 'in', 100000),
  ('2026-08-03', 'out', 20000),
  ('2026-08-05', 'in', 50000);
