import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://nmiacvpokjpzuzhjoyor.supabase.co',       // substitua com seu URL do projeto Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taWFjdnBva2pwenV6aGpveW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MTM5NjUsImV4cCI6MjA2NTA4OTk2NX0.c2mUPPj1MFXHA8_B-BiWurVo9OrjNrn5VAvhD3R3J_0'                       // substitua com sua chave pública
);
