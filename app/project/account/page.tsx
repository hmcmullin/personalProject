export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-green-950 font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center text-center gap-6 py-32 px-32 bg-green-900 sm:items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold m-5">
            Welcome to your Account Page!
          </h1>
          <p className="text-lg text-white">
            Here you can manage your profile, settings, and preferences for the
            application, or view your account details and activity. You can also
            navigate to the map page to interact with your map and explore its
            features.
          </p>
        </div>
        <nav className="flex justify-center gap-4 mt-4">
          <a
            href="/project/map"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Map
          </a>
        </nav>
        <h1>Map Shapes:</h1>
        <p>15</p>
        <h1>Map Lines:</h1>
        <p>20</p>
        <h1>Map Markers:</h1>
        <p>25</p>
        <h1>Map Activities:</h1>
        <p>30</p>
      </main>
    </div>
  );
}
