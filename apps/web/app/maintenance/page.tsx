
//apps/web/app/maintenance/page.tsx

export default function MaintenancePage() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1>Site Under Maintenance</h1>
      <p>We'll be back shortly.</p>
    </main>
  );
}