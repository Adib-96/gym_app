"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData, // send FormData directly
    });

    const result = await res.json();
    if (result.status === 200) {
      console.log(result);
      setTimeout(() => router.push("/auth/signin"), 1000);
    } else {
      console.log(result.error);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <Image
              width={100}
              height={100}
              className="w-8 h-8 mr-2"
              src="/images/dumbbell-svgrepo-com.svg"
              alt="logo"
            />
            GymTracker
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                {/* Role based */}
                <div className="mb-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="block mb-2 text-sm text-center font-medium text-gray-900 dark:text-white">
                    Select Role
                  </p>
                  <div className="flex justify-around items-start">
                    <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="client"
                      name="role"
                      value="client"
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <label
                      htmlFor="client"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Client
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="coach"
                      name="role"
                      value="coach"
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="coach"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Coach
                    </label>
                  </div>
                  </div>
                  
                </div>

                <button
                  type="submit"
                  className="w-full  bg-indigo-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="signin"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
