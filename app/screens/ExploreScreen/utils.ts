import { Campaign } from "./types";

export const getMockCampaigns = (): Campaign[] => {
  return [
    {
      id: "1",
      title: "Emergency Blood Drive - General Hospital",
      description:
        "Critical blood shortage at General Hospital. All blood types needed urgently.",
      participants: 156,
      location: "General Hospital, Colombo",
      date: "2025-07-15",
      time: "9:00 AM - 4:00 PM",
    },
    {
      id: "2",
      title: "Community Health Campaign - University",
      description: "Monthly blood donation drive at the university campus.",
      participants: 89,
      location: "University of Colombo",
      date: "2025-07-20",
      time: "10:00 AM - 3:00 PM",
    },
    {
      id: "3",
      title: "Mobile Blood Unit - Shopping Mall",
      description:
        "Convenient blood donation at the city center shopping mall.",
      participants: 45,
      location: "One Galle Face Mall",
      date: "2025-07-25",
      time: "11:00 AM - 6:00 PM",
    },
  ];
};

export const filterCampaigns = (
  campaigns: Campaign[],
  searchText: string,
  filterLocation: string,
  filterDate: string,
): Campaign[] => {
  let filtered = campaigns;

  // Filter by search text
  if (searchText.trim()) {
    filtered = filtered.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(searchText.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchText.toLowerCase()) ||
        campaign.location?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }

  // Filter by location
  if (filterLocation.trim()) {
    filtered = filtered.filter((campaign) =>
      campaign.location?.toLowerCase().includes(filterLocation.toLowerCase()),
    );
  }

  // Filter by date
  if (filterDate.trim()) {
    filtered = filtered.filter((campaign) =>
      campaign.date?.includes(filterDate),
    );
  }

  return filtered;
};
