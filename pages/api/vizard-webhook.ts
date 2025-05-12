import type { NextApiRequest, NextApiResponse } from "next";
import { handleProjectCompletion } from "../../lib/analyzeClips";

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("[vizard-webhook] Incoming webhook:", {
    method: req.method,
    url: req.url,
  });

  if (req.method !== "POST") {
    console.warn("[vizard-webhook] Invalid method:", req.method);
    return res.status(405).end();
  }

  const { projectId, code, videos } = req.body as {
    projectId?: number;
    code?: number;
    videos?: any[];
  };
  console.log(
    `[vizard-webhook] projectId=${projectId}, code=${code}, clipsCount=${
      videos?.length ?? 0
    }`,
  );

  if (code !== 2000 || !projectsDefined(projectId)) {
    console.error("[vizard-webhook] Clips not ready or invalid payload");
    return res.status(400).json({ received: false });
  }

  try {
    await handleProjectCompletion(projectId!);
    console.log("[vizard-webhook] handleProjectCompletion triggered");
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("[vizard-webhook] Error in completion handler:", err);
    return res.status(500).json({ received: false });
  }
}

function projectsDefined(id?: number): id is number {
  return typeof id === "number";
}
