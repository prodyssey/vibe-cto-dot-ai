# How to Reorder Services

The service offerings across the site (navigation, index page, and adventure game) are now controlled by a single configuration file.

## Configuration Location
`src/config/services.ts`

## To Reorder Services

Simply change the `order` property for each service in the SERVICES array:

```typescript
// Example: To make Ignition appear first, Transformation second, Launch Control third:
{
  id: "ignition",
  // ... other properties
  order: 1,  // Change this number
},
{
  id: "transformation", 
  // ... other properties
  order: 2,  // Change this number
},
{
  id: "launch-control",
  // ... other properties  
  order: 3,  // Change this number
},
```

## Current Order
1. Transformation (order: 1)
2. Ignition (order: 2)
3. Launch Control (order: 3)

## Example: Swapping Ignition to First Position

To make Ignition appear first:
1. Open `src/config/services.ts`
2. Change Ignition's `order` to 1
3. Change Transformation's `order` to 2
4. Save the file

The change will automatically update:
- The Services dropdown in the navigation
- The "Choose Your Journey" section on the index page
- The portal selection in the adventure game

## Additional Customization

You can also modify other properties in the service configuration:
- `label`: The display name
- `description`: Short description for navigation
- `subtitle`: Longer subtitle for the paths section
- `features`: Array of feature bullet points
- `cta`: Call-to-action button text
- `color`: Gradient colors
- `link`: Where the service links to