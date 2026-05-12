export const crmIntegration = {
  async fetchOpportunities(clientId: string, since: Date): Promise<unknown> {
    // TODO: poll GHL /opportunities?updated_at_gt=since
    return { opportunities: [], meta: {} };
  },
};
