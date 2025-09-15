'use client'

import { Icon } from "@iconify/react";
import React, { useState } from 'react'

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

interface FAQAccordionProps {
    item: FAQItem;
}

interface SupportSectionProps {
    title: string;
    description: string;
    buttons: {
        primary: { text: string; onClick?: () => void };
        secondary: { text: string; onClick?: () => void };
    };
}

interface QuickLinkCardProps {
    icon: string;
    title: string;
    description: string;
    onClick?: () => void;
}

interface EmptyStateProps {
    icon: string;
    message: string;
}

const faqData: FAQItem[] = [
    {
        category: "Getting Started",
        question: "What is PamperMomma?",
        answer: "PamperMomma is a platform that helps expecting and new mothers create service registries where friends and family can contribute to professional services like cleaning, meal prep, childcare, and more. Instead of traditional gifts, supporters can fund meaningful services that truly help during this important time."
    },
    {
        category: "Getting Started",
        question: "How do I create my first registry?",
        answer: "After signing up and completing onboarding, navigate to 'My Registries' and click 'Create New Pamper Registry'. You'll be guided through adding services, setting goals, and sharing your registry with loved ones."
    },
    {
        category: "Getting Started",
        question: "Is PamperMomma free to use?",
        answer: "Creating an account and setting up registries is free. We take a small processing fee from contributions to cover payment processing and platform maintenance costs."
    },
    {
        category: "Registries",
        question: "What types of services can I add to my registry?",
        answer: "You can add various services including house cleaning, meal preparation, grocery delivery, childcare, postpartum doula services, lawn care, pet care, and many other services that would help during your pregnancy or after your baby arrives."
    },
    {
        category: "Registries",
        question: "Can I have multiple registries?",
        answer: "Yes! You can create multiple registries for different occasions or time periods. For example, you might have one for pregnancy support and another for postpartum care."
    },
    {
        category: "Registries",
        question: "How do I share my registry with others?",
        answer: "Each registry has a unique shareable link that you can send via email, text message, or share on social media. Contributors don't need to create an account to make contributions."
    },
    {
        category: "Services",
        question: "How do I find service providers?",
        answer: "You can browse our network of verified service providers, or add your own trusted providers. Each provider's profile includes ratings, reviews, and service details to help you make informed choices."
    },
    {
        category: "Services",
        question: "What if a service provider isn't available when I need them?",
        answer: "We recommend booking services in advance when possible. If your preferred provider isn't available, we can help you find alternative providers with similar services and ratings."
    },
    {
        category: "Services",
        question: "Can I customize service details and pricing?",
        answer: "Yes! You can set specific service requirements, preferred dates, and work with providers to customize pricing based on your needs and location."
    },
    {
        category: "Contributions",
        question: "How do contributions work?",
        answer: "Contributors can fund partial or full services from your registry. Funds are held securely until you're ready to book the service. You'll receive notifications when contributions are made."
    },
    {
        category: "Contributions",
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards, debit cards, and digital payment methods. All transactions are processed securely through our encrypted payment system."
    },
    {
        category: "Contributions",
        question: "Can contributors see who else has contributed?",
        answer: "Contributors can see the total amount raised and progress toward the goal, but individual contribution amounts and contributor names are kept private unless the contributor chooses to leave a public message."
    },
    {
        category: "Contributions",
        question: "How do I receive the funds contributed to my registry?",
        answer: `<p>Getting your funds is a simple and secure process, powered by our trusted payment partner, Stripe. We've chosen Stripe, a global leader in online payments used by millions of businesses, to ensure your financial information is handled with the highest level of security and privacy.</p>
        <p class="font-bold mt-4">Here's how it works:</p>
        <ol class="list-decimal list-inside space-y-2 mt-2">
            <li><strong>One-Time Payout Setup:</strong> Before your first withdrawal, you'll find a "Set Up Payouts" button in your dashboard. Clicking this will take you to a secure onboarding form hosted directly by Stripe.</li>
            <li><strong>Secure Information Collection:</strong> You will provide your personal and bank account details directly to Stripe on their secure form. <strong>PamperMomma's servers never see, handle, or store this sensitive data.</strong> Stripe uses this information to verify your identity and securely link your bank account for transfers, in compliance with global financial regulations.</li>
            <li><strong>Withdrawing Your Funds:</strong> Once your payout account is set up, you can withdraw your available balance at any time from your registry dashboard. When you initiate a withdrawal, Stripe securely processes the transfer, and the funds will typically arrive in your bank account within a few business days.</li>
        </ol>
        <p class="mt-4">By using Stripe Connect, you can be confident that your transactions are safe and your privacy is protected, allowing you to focus on what matters most—preparing for your new baby.</p>
        `
    },
    {
        category: "Account",
        question: "How do I update my account information?",
        answer: "Go to Settings from your account menu to update your personal information, change your password, and manage your notification preferences."
    },
    {
        category: "Account",
        question: "Can I deactivate my account?",
        answer: "Yes, you can deactivate your account at any time from the Settings page. Note that this will make your registries inaccessible, but any pending service bookings will still be honored."
    },
    {
        category: "Support",
        question: "What if I have issues with a service provider?",
        answer: "We have a resolution process for service issues. Contact our support team immediately, and we'll work with you and the provider to resolve any problems or find alternative solutions."
    },
    {
        category: "Support",
        question: "How can I contact customer support?",
        answer: "You can reach our support team through the help section in your account, email us directly, or use our live chat feature during business hours."
    }
];

function EmptyState({ icon, message }: EmptyStateProps) {
    return (
        <div className="p-12 text-center">
            <Icon icon={icon} className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-body-desktop text-neutral-600">{message}</p>
        </div>
    );
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-label-desktop transition-colors ${
                            selectedCategory === category
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

function FAQAccordion({ item }: FAQAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-neutral-200">
            <button
                className="w-full py-4 px-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-title-desktop-small text-neutral-900 pr-4">{item.question}</h3>
                <Icon 
                    icon={isOpen ? "material-symbols:expand-less" : "material-symbols:expand-more"} 
                    className="h-6 w-6 text-neutral-600 flex-shrink-0"
                />
            </button>
            {isOpen && (
                <div className="px-6 pb-4">
                    <div className="prose max-w-none text-body-desktop text-neutral-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
            )}
        </div>
    );
}

function SupportSection({ title, description, buttons }: SupportSectionProps) {
    return (
        <div className="mt-12 bg-orange-100 rounded-2xl p-8 text-center">
            <Icon icon="material-symbols:support-agent" className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-title-desktop text-neutral-900 mb-3">
                {title}
            </h2>
            <p className="text-body-desktop text-neutral-700 mb-6 max-w-lg mx-auto">
                {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={buttons.primary.onClick}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-label-desktop font-medium"
                >
                    {buttons.primary.text}
                </button>
                <button 
                    onClick={buttons.secondary.onClick}
                    className="px-6 py-3 bg-white text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 transition-colors text-label-desktop font-medium"
                >
                    {buttons.secondary.text}
                </button>
            </div>
        </div>
    );
}

function QuickLinkCard({ icon, title, description, onClick }: QuickLinkCardProps) {
    return (
        <div 
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <Icon icon={icon} className="h-8 w-8 text-primary-500 mb-3" />
            <h3 className="text-title-desktop-small text-neutral-900 mb-2">{title}</h3>
            <p className="text-body-desktop-small text-neutral-600">
                {description}
            </p>
        </div>
    );
}

function HeaderSection() {
    return (
        <div className="text-center mb-12">
            <h1 className="text-headline-desktop text-neutral-900 mb-4">
                Frequently Asked Questions
            </h1>
            <p className="text-body-desktop-large text-neutral-700 max-w-2xl mx-auto">
                Find answers to common questions about using PamperMomma to create service registries 
                and get the support you need during this special time.
            </p>
        </div>
    );
}

function Page() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    
    const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))];
    
    const filteredFAQs = selectedCategory === "All" 
        ? faqData 
        : faqData.filter(item => item.category === selectedCategory);

    const handleSupportClick = () => {
        // Handle contact support logic
        console.log('Contact support clicked');
    };

    const handleLiveChatClick = () => {
        // Handle live chat logic
        console.log('Live chat clicked');
    };

    const quickLinks = [
        {
            icon: "material-symbols:book-outline",
            title: "User Guide",
            description: "Detailed instructions on using all features",
            onClick: () => console.log('User guide clicked')
        },
        {
            icon: "material-symbols:video-library-outline",
            title: "Video Tutorials", 
            description: "Step-by-step video guides for common tasks",
            onClick: () => console.log('Video tutorials clicked')
        },
        {
            icon: "material-symbols:forum-outline",
            title: "Community Forum",
            description: "Connect with other moms and share experiences",
            onClick: () => console.log('Community forum clicked')
        }
    ];

    return (
        <main className="min-h-screen bg-neutral-100">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <HeaderSection />

                <CategoryFilter 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                {/* FAQ Accordion */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((item, index) => (
                            <FAQAccordion key={index} item={item} />
                        ))
                    ) : (
                        <EmptyState 
                            icon="material-symbols:search-off"
                            message="No questions found for this category."
                        />
                    )}
                </div>

                <SupportSection 
                    title="Still need help?"
                    description="Our support team is here to help you make the most of your PamperMomma experience."
                    buttons={{
                        primary: { text: "Contact Support", onClick: handleSupportClick },
                        secondary: { text: "Live Chat", onClick: handleLiveChatClick }
                    }}
                />

                {/* Quick Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickLinks.map((link, index) => (
                        <QuickLinkCard key={index} {...link} />
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Page