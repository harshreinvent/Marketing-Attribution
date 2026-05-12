export async function sendAdminAlert(message: string) {
  const promises = [];

  if (process.env.SLACK_WEBHOOK_URL) {
    promises.push(
      fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({ text: message }),
        headers: { "Content-Type": "application/json" },
      }).catch(() => {})
    );
  }

  // Email via any transactional email service — implement as needed
  console.warn("[ALERT]", message);

  await Promise.allSettled(promises);
}
