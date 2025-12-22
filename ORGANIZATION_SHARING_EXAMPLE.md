# Organization Sharing - Usage Example

## Quick Start Guide

### Step 1: Create an Organization

1. Open the Organizations app from your desktop
2. Click "Create Organization"
3. Enter organization name (e.g., "Marketing Team")
4. Add a description (optional)
5. Click "Create"

### Step 2: Invite Team Members

1. Open your organization
2. Click "Invite Member"
3. Enter team member's email
4. Select their role:
   - **Admin** - Can manage members and resources
   - **Editor** - Can edit shared resources
   - **Viewer** - Read-only access
5. Click "Send Invitation"

### Step 3: Share a Resource

#### Example: Sharing an E-commerce Shop

1. Open the E-commerce app
2. Your shop will display with a "Share with Organization" button
3. Click the "Share with Organization" button
4. Select the organization from the dropdown
5. Click the checkmark to confirm
6. Your shop is now shared!

#### Example: Sharing a Blog Post

1. Open the Blogs app
2. Click on a blog post to edit it
3. In the header, click "Share with Organization"
4. Select the organization
5. Click the checkmark
6. All organization members can now access the blog

### Step 4: View Shared Resources

Organization members can now:
- **Editors/Admins** - Edit the shared shop, add products, modify settings
- **Viewers** - View the shop and products (read-only)
- **All Members** - See the resource in their organization's shared resources list

### Step 5: Unshare a Resource

1. Click "Share with Organization" button again
2. Find the organization in the "Currently shared with" section
3. Click the X button next to the organization name
4. The resource is immediately unshared

## Real-World Scenarios

### Scenario 1: Marketing Team Blog

**Setup:**
- Create "Marketing Team" organization
- Invite content writers as Editors
- Invite reviewers as Viewers
- Share blog posts with the organization

**Result:**
- Writers can create and edit blog posts
- Reviewers can read and provide feedback
- All changes are visible in real-time

### Scenario 2: E-commerce Store Management

**Setup:**
- Create "Store Operations" organization
- Invite product managers as Editors
- Invite inventory staff as Viewers
- Share the shop with the organization

**Result:**
- Product managers can add/edit products
- Inventory staff can view stock levels
- Everyone sees the same up-to-date information

### Scenario 3: Sales Pipeline Collaboration

**Setup:**
- Create "Sales Team" organization
- Invite sales reps as Editors
- Invite managers as Admins
- Share lead pipelines with the organization

**Result:**
- Sales reps can move leads through the pipeline
- Managers can oversee all activities
- Team collaboration on deals

## Tips & Best Practices

1. **Use Descriptive Names** - Name organizations clearly (e.g., "Q1 Marketing Campaign" vs "Team 1")

2. **Assign Appropriate Roles** - Give users the minimum permissions they need
   - Use Viewer for stakeholders who just need visibility
   - Use Editor for active contributors
   - Use Admin for team leads

3. **Regular Cleanup** - Unshare resources when projects are complete

4. **Multiple Organizations** - You can share the same resource with multiple organizations

5. **Owner Control** - Remember, as the resource owner, you always maintain full control

## Troubleshooting

**Q: I don't see the "Share with Organization" button**
- A: You must be the resource owner to share it
- A: You need to be a member of at least one organization

**Q: I can't edit a shared resource**
- A: Check your role - Viewers have read-only access
- A: Contact the organization admin to upgrade your role

**Q: A shared resource disappeared**
- A: The owner may have unshared it
- A: The organization may have been deleted
- A: Check your notifications for details

**Q: Can I share someone else's resource?**
- A: No, only resource owners can share their resources

## API Integration

For developers integrating with the API, the sharing feature is also available:

```typescript
// Check if user can access a resource
const accessLevel = await convex.query(api.sharedResources.canAccessResource, {
  resourceType: "shop",
  resourceId: shopId,
});

// Returns: "owner" | "edit" | "view" | "none"
```

This ensures your API respects organization permissions automatically!
