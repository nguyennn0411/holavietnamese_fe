// TODO(Member 4): replace adapter with the agreed scenario route and verified completion callback.
export const aiIntegrationService = {
  async start({ scenarioId, targetText }) {
    return {
      demo: true,
      message: targetText
        ? `Practice saying: “${targetText}”. Recording and scoring will be supplied by Member 4.`
        : `Scenario ${scenarioId || "preview"}: You are ordering lunch. Say “Tôi muốn một tô phở.” This is a demo, not an AI evaluation.`,
    };
  },
};
