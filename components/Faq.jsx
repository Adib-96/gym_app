"use client"
import { useState } from "react"

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqsData = [
        {
            question: 'How do I track my workouts?',
            answer: 'Easily log your exercises, sets, reps, and weights. Track your progress over time with clear charts and stats.'
        },
        {
            question: 'Can I follow a custom training plan?',
            answer: 'Yes! Your coach can create personalized workout plans tailored to your goals and fitness level.'
        },
        {
            question: 'Is there guidance on proper exercise form?',
            answer: 'Absolutely. Each exercise comes with detailed instructions, images, and video demonstrations to ensure you perform them safely.'
        },
        {
            question: 'How do I monitor my progress?',
            answer: 'Track metrics like strength improvements, endurance, body measurements, and overall performance to stay motivated.'
        },
        {
            question: 'Does the app support diet and nutrition tracking?',
            answer: 'Yes! Log meals, track calories, and follow nutrition guidance from your coach to complement your workout plan.'
        }
    ]

    return (
        <div className='flex flex-col items-center text-center text-slate-800 px-6 md:px-16 lg:px-24 text-sm max-w-6xl mx-auto mt-20'>
            <p className='text-base font-medium text-slate-600'>FAQ</p>
            <h1 className='text-3xl md:text-4xl font-semibold mt-2'>Frequently Asked Questions</h1>
            <p className='text-sm text-slate-500 mt-4 max-w-sm'>
                Find answers to common questions about using our gym app, tracking workouts, and following your coach’s plans.
            </p>
            <div className='max-w-xl w-full mt-6 flex flex-col gap-4 items-start text-left'>
                {faqsData.map((faq, index) => (
                    <div key={index} className='flex flex-col items-start w-full'>
                        <div className='flex items-center justify-between w-full cursor-pointer bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-4 rounded' onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            <h2 className='text-sm'>{faq.question}</h2>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}>
                                <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FAQ
