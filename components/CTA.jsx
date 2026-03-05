import React from 'react';

const CTA = () => {
  return (
    <section className="bg-indigo-600 py-20 mt-20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to transform your fitness journey?
        </h2>
        <p className="mt-4 text-lg text-indigo-100">
          Join thousands of users who have achieved their goals with our personalized coaching platform.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/auth/register"
            className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            Start Free Trial
          </a>
          <a
            href="#how-it-works"
            className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;