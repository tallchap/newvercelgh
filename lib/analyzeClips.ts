interface VizardVideo {
  videoId?: number;
  transcript?: string;
  title?: string;
  [key: string]: any;
}

export async function handleProjectCompletion(projectId: number) {
  const VIZARD_API_KEY = process.env.VIZARDAI_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  // Fetch all clips
  const queryRes = await fetch(
    `https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/query/${projectId}`,
    { headers: { VIZARDAI_API_KEY: VIZARD_API_KEY } },
  );
  const { videos: allClips }: { videos: VizardVideo[] } = await queryRes.json();

  // Analyze each transcript
  const question = "Is John Stamos mentioned in this transcript?";
  const results = await Promise.all(
    allClips.map(async (clip) => {
      const transcript = clip.transcript || "";
      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "user",
              content: `${question}
Transcript:
${transcript}`,
            },
          ],
          temperature: 0,
          max_tokens: 10,
        }),
      });
      const aiJson = await aiRes.json();
      const answer =
        aiJson.choices?.[0]?.message?.content?.trim() || "No response";

      return { videoId: clip.videoId, title: clip.title, analysis: answer };
    }),
  );

  console.log(
    `[analyzeClips] Completed analysis for project ${projectId}:`,
    results,
  );
  // TODO: persist or forward results as needed
}
