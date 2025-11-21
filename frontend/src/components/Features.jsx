import React from "react";
import { BookOpen, Users, Brain, HeartPulse } from "lucide-react";

const featuresList = [
  {
    icon: <BookOpen size={32} className="text-primary-DEFAULT" />,
    title: "Vast Health Library",
    description:
      "Access a rich library of articles on nutrition, first aid, mental health, and more.",
  },
  {
    icon: <Users size={32} className="text-primary-DEFAULT" />,
    title: "Book Professionals",
    description:
      "Connect with certified doctors, nutritionists, and fitness coaches.",
  },
  {
    icon: <Brain size={32} className="text-primary-DEFAULT" />,
    title: "AI Health Helper",
    description:
      "Get instant, intelligent answers to your health questions 24/7.",
  },
  {
    icon: <HeartPulse size={32} className="text-primary-DEFAULT" />,
    title: "Community & Writers",
    description:
      "Join a community and read blogs from passionate health writers.",
  },
];

const Features = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8 text-text-primary dark:text-dark-text-primary">
        What We Offer
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuresList.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start p-6 bg-white dark:bg-dark-card rounded-lg shadow-md"
          >
            <div className="mr-4 flex-shrink-0 p-3 bg-primary-light rounded-full">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary dark:text-dark-text-primary">
                {feature.title}
              </h3>
              <p className="text-neutral-dark dark:text-neutral-light">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
