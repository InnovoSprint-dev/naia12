"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Test() {
  const { data: session, status } = useSession();

  const login = async () => {
    await signIn("credentials", { email: "admin@example.com", password: "password" });
  };

  const logout = async () => {
    await signOut();
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h1>Test</h1>

      {session ? (
        <div>
          <p>Logged in as:</p>
          <p><strong>Name:</strong> {session.user?.name}</p>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <button onClick={login}>Login</button>
        </div>
      )}
    </div>
  );
}
