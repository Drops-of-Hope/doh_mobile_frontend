import { useAuth } from '../context/AuthContext';
import { RoleBasedAccess } from '../utils/roleBasedAccess';

export const useRoleBasedAccess = () => {
  const { userRole, userType, hasRole } = useAuth();
  const currentRole = userRole || userType;

  return {
    // Check if user has access to a specific feature
    hasFeatureAccess: (feature: string) => RoleBasedAccess.hasFeatureAccess(currentRole, feature),
    
    // Get navigation items for current user
    getNavigationItems: () => RoleBasedAccess.getNavigationItems(currentRole),
    
    // Get role-specific colors
    getRoleColors: () => RoleBasedAccess.getRoleColors(currentRole),
    
    // Check specific role
    hasRole,
    
    // Get current role
    currentRole,
    
    // Get role-based features
    getAvailableFeatures: () => {
      const features = RoleBasedAccess.features[currentRole as keyof typeof RoleBasedAccess.features];
      return features || [];
    },
    
    // Check if user can access admin features
    isAdmin: () => hasRole('admin'),
    
    // Check if user can make donations
    canDonate: () => hasRole('donor') || hasRole('admin'),
    
    // Check if user can volunteer
    canVolunteer: () => hasRole('volunteer') || hasRole('admin'),
    
    // Check if user can manage campaigns
    canManageCampaigns: () => hasRole('organization') || hasRole('admin'),
    
    // Check if user can access support services
    canAccessSupport: () => hasRole('beneficiary') || hasRole('admin'),
  };
};
