# Constants Folder

This folder contains all the reusable constants for the Drops of Hope mobile application.

## Structure

### `tabIcons.tsx`
Contains all the tab bar icon components with consistent styling and active/inactive states.

**Available Icons:**
- `DropIcon` - Donation/blood drop icon
- `SearchIcon` - Explore/search icon  
- `HomeIcon` - Home screen icon
- `HeartIcon` - Activities/favorite icon
- `PersonIcon` - Account/profile icon

**Usage:**
```tsx
import { DropIcon } from '../../constants';

// Basic usage
<DropIcon isActive={false} />

// Active state
<DropIcon isActive={true} />
```

### `tabItems.tsx`
Contains tab item configurations and helper functions for creating consistent tab bars across screens.

**Key Exports:**
- `TabItem` - TypeScript interface for tab items
- `TAB_CONFIG` - Base configuration for all tab types
- `createTabItem()` - Helper function to create individual tab items
- `createProfileScreenTabs()` - Pre-configured tabs for profile screen
- `createHomeScreenTabs()` - Pre-configured tabs for home screen

**Usage:**
```tsx
import { createProfileScreenTabs } from '../../constants';

const tabItems = createProfileScreenTabs({
  onDonate: () => console.log("Donate pressed"),
  onExplore: () => console.log("Explore pressed"),
  onHome: () => console.log("Home pressed"),
  onActivities: () => console.log("Activities pressed"),
  onAccount: () => console.log("Account pressed"),
});
```

### `theme.ts`
Contains color schemes, spacing, and other design tokens for consistent theming.

**Available Constants:**
- `COLORS` - Primary, secondary, background, text, and state colors
- `TAB_COLORS` - Specific colors for tab bar components
- `SPACING` - Standard spacing values (XS, SM, MD, LG, XL, XXL)
- `BORDER_RADIUS` - Standard border radius values

**Usage:**
```tsx
import { COLORS, TAB_COLORS, SPACING } from '../../constants';

// Using colors
style={{ backgroundColor: COLORS.PRIMARY }}

// Using tab colors
fill={isActive ? TAB_COLORS.ACTIVE : TAB_COLORS.INACTIVE}

// Using spacing
style={{ padding: SPACING.MD }}
```

### `index.ts`
Central export file that makes importing constants easier by re-exporting everything from other files.

## Benefits

1. **Consistency** - All tab bars across the app use the same icons and styling
2. **Maintainability** - Changes to icons or colors only need to be made in one place
3. **Reusability** - Easy to add new screens with consistent tab bars
4. **Type Safety** - TypeScript interfaces ensure proper usage
5. **Scalability** - Easy to add new constants as the app grows

## Adding New Constants

When adding new constants:

1. Create a new file in the `constants/` folder
2. Export your constants
3. Add the export to `index.ts`
4. Update this README with usage examples

## Example: Using BottomTabBar in Screens

The `BottomTabBar` component is now self-contained and doesn't require you to pass tab items manually. Simply specify which tab should be active:

```tsx
// In ProfileScreen
<BottomTabBar activeTab="account" />

// In HomeScreen  
<BottomTabBar activeTab="home" />

// In DonateScreen (when created)
<BottomTabBar activeTab="donate" />

// In ExploreScreen (when created)
<BottomTabBar activeTab="explore" />

// In ActivitiesScreen (when created)
<BottomTabBar activeTab="activities" />
```

The component automatically handles:
- Navigation between screens
- Active/inactive states
- Default tab configurations
- Consistent styling

### Custom Tabs (Advanced Usage)

If you need custom tabs for a specific screen, you can still override the default behavior:

```tsx
const customTabs = [
  createTabItem(TAB_CONFIG.HOME, () => navigation.navigate('Home'), true),
  // ... other custom tabs
];

<BottomTabBar customTabs={customTabs} />
```
