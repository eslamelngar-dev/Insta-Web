interface AdminIdentity {
  id?: string | null;
  email?: string | null;
}

function parseEnvList(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAdminUserIds(): string[] {
  return parseEnvList(process.env.ADMIN_USER_IDS);
}

export function getAdminEmails(): string[] {
  return parseEnvList(process.env.ADMIN_EMAILS).map((email) =>
    email.toLowerCase(),
  );
}

export function isAdminIdentity(identity: AdminIdentity): boolean {
  const userIds = getAdminUserIds();
  const emails = getAdminEmails();
  const email = identity.email?.toLowerCase();

  return (
    (!!identity.id && userIds.includes(identity.id)) ||
    (!!email && emails.includes(email))
  );
}
