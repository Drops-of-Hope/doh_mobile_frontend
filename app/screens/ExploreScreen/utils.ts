import { Campaign } from "./types";

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

// Search text parsing utilities
export interface ParsedSearchCriteria {
  generalSearch: string;
  location: string;
  startDate: string;
  endDate: string;
}

export const parseSearchText = (searchText: string): ParsedSearchCriteria => {
  const result: ParsedSearchCriteria = {
    generalSearch: '',
    location: '',
    startDate: '',
    endDate: ''
  };

  // Sanitize input to prevent malicious searches
  const sanitizedText = sanitizeSearchInput(searchText);
  
  // Extract prefixed searches
  const locationMatch = sanitizedText.match(/Location:\s*([^,\n]+)/i);
  const startDateMatch = sanitizedText.match(/Start:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
  const endDateMatch = sanitizedText.match(/End:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);

  if (locationMatch) {
    result.location = locationMatch[1].trim();
  }

  if (startDateMatch) {
    result.startDate = startDateMatch[1].trim();
  }

  if (endDateMatch) {
    result.endDate = endDateMatch[1].trim();
  }

  // Extract general search text (everything that's not a prefixed search)
  let generalText = sanitizedText;
  if (locationMatch) generalText = generalText.replace(locationMatch[0], '');
  if (startDateMatch) generalText = generalText.replace(startDateMatch[0], '');
  if (endDateMatch) generalText = generalText.replace(endDateMatch[0], '');
  
  result.generalSearch = generalText.trim();

  return result;
};

const sanitizeSearchInput = (input: string): string => {
  // Remove potentially malicious characters and patterns
  return input
    .replace(/[<>\"']/g, '') // Remove HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .slice(0, 500); // Limit length
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  if (startDate && endDate) {
    return `Start: ${startDate} - End: ${endDate}`;
  } else if (startDate) {
    return `Start: ${startDate}`;
  } else if (endDate) {
    return `End: ${endDate}`;
  }
  return '';
};
