/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as apiKeys from "../apiKeys.js";
import type * as auth from "../auth.js";
import type * as blogs from "../blogs.js";
import type * as chat from "../chat.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as kanban from "../kanban.js";
import type * as leadManagement from "../leadManagement.js";
import type * as notes from "../notes.js";
import type * as notifications from "../notifications.js";
import type * as organizationMembers from "../organizationMembers.js";
import type * as organizations from "../organizations.js";
import type * as sharedResources from "../sharedResources.js";
import type * as user from "../user.js";
import type * as vibeCoding from "../vibeCoding.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  apiKeys: typeof apiKeys;
  auth: typeof auth;
  blogs: typeof blogs;
  chat: typeof chat;
  http: typeof http;
  invitations: typeof invitations;
  kanban: typeof kanban;
  leadManagement: typeof leadManagement;
  notes: typeof notes;
  notifications: typeof notifications;
  organizationMembers: typeof organizationMembers;
  organizations: typeof organizations;
  sharedResources: typeof sharedResources;
  user: typeof user;
  vibeCoding: typeof vibeCoding;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
