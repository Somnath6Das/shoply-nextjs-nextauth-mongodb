import Image from "next/image";

export default function Fbui() {
  return (
    <div className="bg-gray-100 h-screen">
      <div className=" flex mx-auto items-center justify-center">
        <div className="flex flex-col w-xl">
          <Image src="/fb.svg" width={350} height={200} alt="logo" />
          <p className="text-black mx-8 text-2xl font-medium">
            Facebook helps you connect and share with the people in your life.
          </p>
        </div>
        <div className="flex flex-col bg-white p-4 rounded-lg  items-center mt-36 drop-shadow-lg">
          <input
            type="text"
            placeholder="Email address or Phone number"
            className="border border-gray-200 focus:border-gray-[#0a66ff] rounded-md px-4 h-14 mb-4 w-96"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-200 focus:border-gray-[#0a66ff] rounded-md px-4 h-14  mb-4 w-96"
          />
          <button className="bg-[#0a66ff] rounded-md px-4 h-12  mb-4 w-96 text-white font-bold text-xl">
            Log In
          </button>
          <span className="text-[#0a66ff] font-bold">Forgotten password?</span>
          <hr className="text-gray-300 w-72 h-0.5 my-5" />
          <button className="bg-[#42b729] rounded-md px-4 h-12  mb-4 w-56 text-white font-bold text-md">
            Create new Account
          </button>
        </div>
      </div>
    </div>
  );
}
