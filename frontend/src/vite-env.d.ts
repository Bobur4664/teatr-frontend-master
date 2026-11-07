/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Django REST API. */
  readonly VITE_API_URL?: string;
  /** Theater (tenant) slug sent as the `Theater` header on every API request. */
  readonly VITE_THEATER_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
