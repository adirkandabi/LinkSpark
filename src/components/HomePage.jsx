import React, { useState } from "react";

export default function HomePage({ user }) {
  return (
    <div className="container mt-5">
      <h1>Welcome to the Home Page</h1>
      <p>Hello, {user.username}!</p>
      <p>This is a protected route, accessible only after login.</p>
    </div>
  );
}
