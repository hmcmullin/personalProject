export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-green-950 font-sans p-4">
      <main className="flex w-full max-w-2xl flex-col items-center text-center gap-8 rounded-2xl bg-green-900 py-16 px-8 md:px-16 text-white shadow-xl">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            Welcome to this Mapping Application!
          </h1>
          <p className="text-lg text-white/90">
            Navigate to the map page to interact with your map, or head to your
            account to manage your profile and settings.
          </p>
        </div>
        <nav className="flex justify-center gap-4 w-full">
          <a
            href="/map"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Map
          </a>
          <a
            href="/account"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Account
          </a>
        </nav>
      </main>
    </div>
  );
}
