import { createClient } from "@supabase/supabase-js";

const bancoDados = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export default bancoDados;
