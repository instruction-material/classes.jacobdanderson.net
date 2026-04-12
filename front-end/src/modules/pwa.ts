import type { UserModule } from "~/types";

// vite-plugin-pwa does not currently ship a Vite 8-compatible release.
// Keep the module in place so the auto-registration pattern still compiles.
export const install: UserModule = () => {};
