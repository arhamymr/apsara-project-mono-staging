# Organization Sharing - Quick Reference Card

## 🚀 Quick Start (3 Steps)

1. **Create Organization** → Organizations App → "Create Organization"
2. **Invite Members** → Select Organization → "Invite Member" → Enter email + role
3. **Share Resource** → Open any resource → Click "Share with Organization" → Select org

## 📋 Resource Types Supported

✅ Blogs | ✅ Notes | ✅ Kanban Boards | ✅ Chat Sessions | ✅ Lead Pipelines | ✅ E-commerce Shops

## 👥 Roles & Permissions

| Role | Create Org | Invite Members | Share Resources | Edit Shared | View Shared |
|------|-----------|----------------|-----------------|-------------|-------------|
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Editor** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🔑 Key Features

- **Owner Control** - Original owners always maintain full control
- **Instant Sharing** - Resources shared immediately with all members
- **Real-time Updates** - Changes visible to all members instantly
- **Easy Unsharing** - One-click to remove organization access
- **Multiple Orgs** - Share same resource with multiple organizations

## 📍 Where to Find It

### In Each App:
- **Blogs** - Edit screen header
- **Notes** - Notes header (when note selected)
- **Kanban** - Board header
- **Chat** - Chat header
- **Leads** - Pipeline header
- **E-commerce** - Shop header (when shop exists)

### Button Location:
Look for the "Share with Organization" button with a share icon (🔗)

## 🎯 Common Use Cases

### Team Blog
```
1. Create "Content Team" org
2. Invite writers as Editors
3. Share blog posts
→ Writers can edit, publish together
```

### Sales Pipeline
```
1. Create "Sales Team" org
2. Invite reps as Editors, managers as Admins
3. Share pipeline
→ Team collaborates on leads
```

### E-commerce Store
```
1. Create "Store Operations" org
2. Invite product managers as Editors
3. Share shop
→ Team manages products together
```

## 🔧 Implementation (For Developers)

### Add to New Resource:
```tsx
import { ShareWithOrgButton } from '../organizations/components/share-with-org-button';

<ShareWithOrgButton
  resourceType="yourResourceType"  // Add to schema first
  resourceId={resource._id}
  resourceName={resource.name}
  variant="outline"
  size="sm"
/>
```

### Check Access Level:
```tsx
const accessLevel = useQuery(api.sharedResources.canAccessResource, {
  resourceType: "blog",
  resourceId: blogId,
});
// Returns: "owner" | "edit" | "view" | "none"
```

## ⚠️ Important Notes

- Only resource **owners** can share
- **Viewers** cannot share resources (read-only)
- Unsharing is **immediate** (no delay)
- Deleting org **unshares all** resources
- Original owner **always** has full control

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No share button visible | You must own the resource |
| Can't edit shared resource | Check your role (Viewer = read-only) |
| Shared resource disappeared | Owner unshared it or org was deleted |
| Can't share with org | Check you're not a Viewer in that org |

## 📚 Full Documentation

- **Complete Guide** - See `ORGANIZATION_SHARING_GUIDE.md`
- **Examples** - See `ORGANIZATION_SHARING_EXAMPLE.md`
- **Status** - See `ORGANIZATION_FEATURE_STATUS.md`

## 🎉 Status

**✅ FULLY IMPLEMENTED** - Ready to use across all resource types!

---

*Quick Reference v1.0 | Last Updated: December 22, 2025*
