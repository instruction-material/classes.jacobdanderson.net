import { api } from "@/api";

export type OAuthProvider = "apple" | "google";

export interface OAuthProviderAvailability {
	apple: boolean;
	google: boolean;
}

export const emptyOAuthProviderAvailability: OAuthProviderAvailability = {
	apple: false,
	google: false
};

export const oauthErrorMessages: Record<string, string> = {
	account_not_found:
		"No Classes account uses that provider email yet. Log in with your existing email and password first.",
	cancelled: "Google or Apple login was cancelled.",
	email_unverified:
		"The provider did not confirm a verified email address for this login.",
	expired:
		"That login attempt expired or was already used. Please try again.",
	identity_conflict:
		"That provider login could not be linked safely. Use your existing email and password, then contact an administrator if the problem continues.",
	provider_error:
		"Google or Apple could not complete the login. Please try again.",
	provider_unavailable: "That login provider is not currently available."
};

export async function fetchOAuthProviderAvailability() {
	const { data } = await api.get<OAuthProviderAvailability>(
		"/accounts/oauth/providers"
	);
	return {
		apple: data.apple === true,
		google: data.google === true
	};
}

function currentReturnTo() {
	if (typeof window === "undefined") return "/";

	const current = new URL(window.location.href);
	current.searchParams.delete("oauthError");
	current.searchParams.delete("oauthStatus");
	return `${current.pathname}${current.search}${current.hash}`;
}

export function oauthLoginHref(provider: OAuthProvider, remember: boolean) {
	const parameters = new URLSearchParams({
		remember: String(remember),
		returnTo: currentReturnTo()
	});
	return `/api/accounts/oauth/${provider}/start?${parameters.toString()}`;
}
