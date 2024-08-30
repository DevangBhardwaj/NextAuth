import { memo } from "react";
import { SessionProvider } from "next-auth/react";

// Version 4 makes using the SessionProvider mandatory.
// This means that you will have to wrap any part of your application using useSession in this provider,if you were not doing so already.

const SessionsProvider = ({ children, session }) => {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0.5 * 60} // Re-fetch session every  30 seconds
      refetchOnWindowFocus={true} // Re-fetches session when window is focused
    >
      {children}
    </SessionProvider>
  );
};

export default memo(SessionsProvider);
