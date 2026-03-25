"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    '/Pslide1.jpg',
    '/Pslide2.jpg',
    '/Pslide3.jpg',
    '/Pslide4.jpg'
];

export default function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    // Auto-play feature
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-8 mb-12 items-center justify-center group">
            <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl border border-neutral-200">
                {/* Image Container */}
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <img
                            key={index}
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-auto object-contain flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentIndex === index ? 'bg-premium-600' : 'bg-white/60 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
