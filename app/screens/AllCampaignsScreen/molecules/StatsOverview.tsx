import React from "react";
import { StatRow, StatTile } from "../../../design";
import { CampaignStats } from "../types";

interface StatsOverviewProps {
  stats: CampaignStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <StatRow>
      <StatTile value={stats.totalCampaigns} label="Total" />
      <StatTile value={stats.criticalCount} label="Critical" />
      <StatTile value={stats.moderateCount} label="Moderate" />
      <StatTile value={stats.availableSlots} label="Available" />
    </StatRow>
  );
}
