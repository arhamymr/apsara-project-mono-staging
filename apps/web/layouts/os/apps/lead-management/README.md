# Lead Management App - Convex Integration

## Overview
The Lead Management app has been successfully integrated with Convex for real-time data persistence and multi-user collaboration.

## Features
- ✅ Real-time lead pipeline management
- ✅ **Multiple pipelines** - Create and switch between different pipelines
- ✅ **Pipeline dropdown** - Quick access to all your pipelines
- ✅ **Rename pipelines** - Click the pencil icon to rename
- ✅ **Delete pipelines** - Remove pipelines you no longer need
- ✅ Drag-and-drop lead cards between columns
- ✅ Customizable pipeline stages with colors
- ✅ Pre-built sales funnel templates
- ✅ Multi-user support with organization sharing
- ✅ Persistent data storage in Convex
- ✅ Optimistic UI updates for smooth interactions

## Architecture

### Backend (Convex)
**File:** `apps/web/convex/leadManagement.ts`

**Tables:**
- `leadPipelines` - Pipeline containers
- `leadColumns` - Pipeline stages/columns
- `leads` - Individual lead records

**Key Functions:**
- `listPipelines` - Get all pipelines for current user
- `getPipeline` - Get pipeline with columns and leads
- `createPipeline` - Create new pipeline with optional template
- `createColumn` - Add new stage to pipeline
- `updateColumn` - Update stage properties
- `deleteColumn` - Remove stage and its leads
- `reorderColumns` - Reorder pipeline stages
- `createLead` - Add new lead to a column
- `updateLead` - Update lead information
- `deleteLead` - Remove lead
- `moveLead` - Move lead between columns

**Access Control:**
- Owner: Full access to their pipelines
- Shared: Access through organization membership
- Edit: Can modify pipeline, columns, and leads
- View: Read-only access

### Frontend

**Main Hook:** `hooks/useLeadManagement.ts`
- Manages Convex queries and mutations
- Provides optimistic UI updates
- Handles localStorage persistence for selected pipeline
- Converts Convex data to local state format

**Components:**
- `index.tsx` - Main app with drag-and-drop
- `LeadPipelineHeader.tsx` - Header with pipeline switcher
- `LeadCard.tsx` - Individual lead display
- `LeadColumn.tsx` - Pipeline stage column
- `LeadModal.tsx` - Lead creation/editing
- `PipelineModal.tsx` - Pipeline customization
- `TemplateModal.tsx` - Template selection

## Data Flow

1. **Initial Load:**
   - Query `listPipelines` to get user's pipelines
   - Auto-select first pipeline or restore from localStorage
   - Query `getPipeline` to get full pipeline data
   - Display pipeline switcher in header

2. **Pipeline Management:**
   - Click pipeline name to open dropdown
   - Select different pipeline to switch
   - Click pencil icon to rename current pipeline
   - Click trash icon to delete a pipeline
   - Click "Create from Template" to add new pipeline

3. **Drag & Drop:**
   - `onDragStart` - Set active lead/column
   - `onDragOver` - Optimistic UI update
   - `onDragEnd` - Call `moveLead` mutation

4. **CRUD Operations:**
   - All operations use Convex mutations
   - Optimistic updates for immediate feedback
   - Toast notifications for success/error

## Templates

Pre-built templates in `constants.ts`:
- Sales Funnel (7 stages)
- Simple Pipeline (5 stages)
- B2B Enterprise (7 stages)
- Real Estate (6 stages)
- Recruitment (7 stages)

## Organization Sharing

Pipelines can be shared with organizations through the `sharedResources` table:
- Resource type: `"leadPipeline"`
- Access levels based on organization role
- Shared pipelines appear in user's pipeline list

## Setup

1. **Run Convex Codegen:**
   ```bash
   cd apps/web
   pnpm convex dev
   ```

2. **Schema is already defined** in `apps/web/convex/schema.ts`

3. **Backend functions** are in `apps/web/convex/leadManagement.ts`

4. **The app will work** once Convex codegen completes

## Migration from Local State

The app previously used local React state (`usePipelineState.ts`). The new Convex integration:
- Maintains the same UI/UX
- Adds real-time persistence
- Enables multi-user collaboration
- Supports organization sharing
- Provides better data consistency

## Next Steps

- [ ] Add lead activity history
- [ ] Implement lead assignment to users
- [ ] Add email/phone integration
- [ ] Create lead import/export
- [ ] Add pipeline analytics
- [ ] Implement lead scoring
