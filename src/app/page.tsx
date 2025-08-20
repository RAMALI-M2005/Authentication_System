import AuthButtons from "@/components/auth/auth-buttons";
import { getCurrentUser } from "@/lib/server";



export default async function Home() {

  const user  =await getCurrentUser();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f7f7f9",
        padding: "2rem",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 900,
          height:"70px",
          background: "#fff",
          padding: "1rem 1.5rem",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Auth System</h1>
        <AuthButtons user={user}/>
      </header>
    </main>
  );
}