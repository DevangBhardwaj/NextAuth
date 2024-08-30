import { getSession } from "next-auth/react";
import UserProfile from "../components/profile/user-profile";

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  // When using getSession on the client side, the context of the request is inherently available because the function is executed within the browser,
  // which has direct access to the session cookies and other client-side storage mechanisms.
  // This means that getSession can directly access the session data without needing additional context passed to it.

  // On the server side, however, the request context must be explicitly passed to functions like getSession
  // because the server does not automatically have access to the client’s session data.
  // This context includes details such as cookies, headers, and other request-specific information necessary to retrieve the session data.

  // Here’s a quick recap of the process:
  // 1. User Request: A user navigates to a page that uses getServerSideProps.
  // 2. Server-Side Rendering: Next.js sends an HTTP request to the server to fetch data.
  // 3. Session Management: getSession(context.req) is called to retrieve the user’s session based on the incoming request.
  // 4. Data Fetching: The server fetches the necessary data, possibly using the session information.
  // 5. Page Rendering: The server sends the pre-rendered HTML back to the client, including any personalized content based on the session.

  const session = await getSession({ req: context.req }); //some also do it as getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
