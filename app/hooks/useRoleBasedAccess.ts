import { useAuth } from '../context/AuthContext';
import { RoleBasedAccess } from '../utils/roleBasedAccess';
import { USER_ROLES, isDonorType, hasDonorPrivileges } from '../context/AuthContext';

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
    isAdmin: () => hasRole(USER_ROLES.ADMIN),
    
    // Check if user can make donations - using the helper function from AuthContext
    canDonate: () => hasDonorPrivileges(currentRole),
    
    // Check if user can volunteer - volunteers, camp organizers, and admin can volunteer
    canVolunteer: () => hasRole(USER_ROLES.VOLUNTEER) || hasRole(USER_ROLES.CAMP_ORGANIZER) || hasRole(USER_ROLES.ADMIN),
    
    // Check if user can manage campaigns - organizations, camp organizers, and admin
    canManageCampaigns: () => hasRole(USER_ROLES.ORGANIZATION) || hasRole(USER_ROLES.CAMP_ORGANIZER) || hasRole(USER_ROLES.ADMIN),
    
    // Check if user can access support services
    canAccessSupport: () => hasRole(USER_ROLES.BENEFICIARY) || hasRole(USER_ROLES.ADMIN),
  };
};
