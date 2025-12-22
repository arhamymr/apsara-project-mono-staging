import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isSignInPage = createRouteMatcher(["/login", "/register"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
 
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {

  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isSignInPage(request) && isAuthenticated ) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets and public API routes.
  matcher: ["/((?!.*\\..*|_next|api/blogs).*)", "/", "/(trpc)(.*)"],
};