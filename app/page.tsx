import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to whatever this app is gonna be</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Navigate to the map page to interact with your map, or head to your account to manage your profile and settings.
        </p>
        <a href="/map" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Map
        </a>
        <a href="/account" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Go to Account
        </a>
      </main>
    </div>
  );
}
