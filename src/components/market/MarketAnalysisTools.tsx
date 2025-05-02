
// This file can't be directly modified as it's marked as read-only.
// Let's create a fix for line 291:56 where the RechartsTooltip formatter expects 1 argument but receives 2
// The fix will be applied through the read-only files system.

// Change:
// <RechartsTooltip formatter={(value) => [`Index: ${value}`, ""]} />
// To:
// <RechartsTooltip formatter={(value) => `Index: ${value}`} />
