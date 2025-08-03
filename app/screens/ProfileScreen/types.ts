// User data types
export interface UserData {
  name: string;
  email: string;
  bloodType: string;
  mobileNumber: string;
  donationBadge: "BRONZE" | "SILVER" | "GOLD" | "HERO";
  imageUri: string;
  membershipType: string;
}

// Menu item types
export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  showArrow?: boolean;
  roleRequired?: string[];
}

// Modal types
export interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

// Props types
export interface ProfileScreenProps {
  navigation?: any;
}

// Profile header props
export interface ProfileHeaderProps {
  userData: UserData;
  onEditProfile: () => void;
}

// Menu section props
export interface MenuSectionProps {
  menuItems: MenuItem[];
  onItemPress: (item: MenuItem) => void;
}
