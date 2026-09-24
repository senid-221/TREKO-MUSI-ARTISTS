import { randomUUID } from "crypto";

const baseUrl = process.env.MTN_MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com";
const targetEnvironment = process.env.MTN_MOMO_TARGET_ENVIRONMENT || "sandbox";
const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
const apiUser = process.env.MTN_MOMO_API_USER;
const apiKey = process.env.MTN_MOMO_API_KEY;
const currency = process.env.MTN_MOMO_CURRENCY || (targetEnvironment === "sandbox" ? "EUR" : "RWF");

function requireConfig() {
  if (!subscriptionKey || !apiUser || !apiKey) {
    throw new Error("MTN_MOMO_NOT_CONFIGURED");
  }
}

async function getAccessToken() {
  requireConfig();
  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
  const response = await fetch(`${baseUrl}/collection/token/`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey || "",
      "X-Target-Environment": targetEnvironment,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`MTN_TOKEN_FAILED:${response.status}:${body.slice(0, 300)}`);
  }

  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("MTN_TOKEN_MISSING");
  return data.access_token;
}

export async function requestToPay(input: {
  amount: number;
  phone: string;
  externalId: string;
  payerMessage?: string;
  payeeNote?: string;
}) {
  const token = await getAccessToken();
  const referenceId = randomUUID();

  const callbackUrl = process.env.MTN_MOMO_CALLBACK_URL;
  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey!,
      "X-Target-Environment": targetEnvironment,
      "X-Reference-Id": referenceId,
      "Content-Type": "application/json",
      ...(callbackUrl ? { "X-Callback-Url": callbackUrl } : {}),
    },
    body: JSON.stringify({
      amount: String(input.amount),
      currency,
      externalId: input.externalId,
      payer: { partyIdType: "MSISDN", partyId: normalizeMsisdn(input.phone) },
      payerMessage: input.payerMessage || "Treko Music membership",
      payeeNote: input.payeeNote || "Treko Music",
    }),
    cache: "no-store",
  });

  if (response.status !== 202) {
    const body = await response.text();
    throw new Error(`MTN_REQUEST_FAILED:${response.status}:${body.slice(0, 300)}`);
  }

  return { referenceId, currency };
}

export async function getRequestToPayStatus(referenceId: string) {
  const token = await getAccessToken();
  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay/${encodeURIComponent(referenceId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey!,
      "X-Target-Environment": targetEnvironment,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`MTN_STATUS_FAILED:${response.status}:${body.slice(0, 300)}`);
  }

  return response.json() as Promise<{
    status?: "PENDING" | "SUCCESSFUL" | "FAILED" | string;
    financialTransactionId?: string;
    reason?: string;
  }>;
}

function normalizeMsisdn(phone: string) {
  const value = phone.trim().replace(/[\s-]/g, "");
  if (value.startsWith("+")) return value.slice(1);
  if (value.startsWith("250")) return value;
  if (value.startsWith("07")) return `250${value.slice(1)}`;
  return value;
}
