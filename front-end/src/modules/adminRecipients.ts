export interface AdminRecipient {
	name: string;
	emails: string[];
}

export const ADMIN_RECIPIENTS: AdminRecipient[] = [
	{ name: "Abby", emails: ["shihchungchou2014@gmail.com"] },
	{ name: "Saba", emails: ["ana82g@gmail.com", "saba13g@gmail.com"] },
	{ name: "Jinen", emails: ["jinengandhi10@gmail.com"] },
	{ name: "Devin", emails: ["terminatordrake@gmail.com"] },
	{ name: "Parmer", emails: ["parmarsfl@gmail.com"] },
	{ name: "Jayden", emails: ["jaydenpfl@gmail.com"] },
	{
		name: "Test",
		emails: ["classes@jacobdanderson.net", "classes@jacobdanderson.net"]
	}
];

export const ADMIN_RECIPIENT_NAMES = ADMIN_RECIPIENTS.map(
	recipient => recipient.name
);
