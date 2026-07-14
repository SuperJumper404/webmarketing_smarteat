#!/bin/sh
set -eu

escape_js_string() {
  printf '%s' "$1" | sed "s/\\\\/\\\\\\\\/g; s/'/\\\\'/g"
}

SUPABASE_PUBLIC_URL="$(escape_js_string "${SUPABASE_URL:-${NUXT_PUBLIC_SUPABASE_URL:-}}")"
SUPABASE_PUBLIC_ANON_KEY="$(escape_js_string "${SUPABASE_ANON_KEY:-${NUXT_PUBLIC_SUPABASE_ANON_KEY:-}}")"

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__SMARTEAT_CONFIG__ = {
  supabaseUrl: '${SUPABASE_PUBLIC_URL}',
  supabaseAnonKey: '${SUPABASE_PUBLIC_ANON_KEY}'
};
EOF
