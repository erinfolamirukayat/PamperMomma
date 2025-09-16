import Image from "next/image";
import { FilledButton, OutlinedButton } from "@/components/buttons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { AppLogo } from "@/components/logo";
import { cookies } from "next/headers";


export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('access_token');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-neutral-100 to-primary-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 bg-neutral-100 px-4 py-6 flex justify-between items-center mx-auto">
        <AppLogo />
        <div className="relative">
          <input type="checkbox" id="menu-toggle" className="peer hidden" />
          <div className={`
            fixed lg:static
            z-30
            top-0 
            right-0 
            flex 
            lg:flex-row 
            lg:items-center
            gap-8
            text-center
            peer-checked:flex
            peer-checked:flex-col lg:peer-checked:flex-row
            transition
            translate-x-full lg:translate-x-0
            peer-checked:translate-x-0
            w-full 
            max-w-sm lg:max-w-none
            h-full lg:h-auto
            bg-white lg:bg-transparent
            p-4 lg:p-0
            shadow-md lg:shadow-none
            `}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end mb-4 py-3">
              <label htmlFor="menu-toggle" className="cursor-pointer">
                <Icon icon="material-symbols:close" className="text-3xl text-neutral-700" />
              </label>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <a href="#features" className="text-neutral-700 hover:text-primary-600 transition-colors">Features</a>
              <a href="#services" className="text-neutral-700 hover:text-primary-600 transition-colors">Services</a>
              <a href="#about" className="text-neutral-700 hover:text-primary-600 transition-colors">About</a>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col lg:flex-row gap-4">
                <Link href="/mom/registries" className="bg-primary-500 text-neutral-100 rounded-full px-6 py-4 hover:bg-primary-600 transition-colors">Go to Dashboard</Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-4">
                <Link href="/onboarding/login" className="border border-primary-500 text-primary-500 rounded-full px-6 py-4 hover:bg-primary-100 transition-colors">Sign In</Link>
                <Link href="/onboarding" className="bg-primary-500 text-neutral-100 rounded-full px-6 py-4 hover:bg-primary-600 transition-colors">Get Started</Link>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <label htmlFor="menu-toggle" className="cursor-pointer">
              <Icon icon="material-symbols:menu" className="text-3xl text-neutral-700" />
            </label>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-tight mb-6">
              Every Mom Deserves to be
              <span className="text-primary-600"> Pampered</span>
            </h1>
            <p className="text-xl text-neutral-700 mb-8 leading-relaxed">
              Connect with trusted caregivers and services designed specifically for mothers.
              From childcare to wellness services, we help you find the support you need.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/onboarding" className="bg-primary-500 text-neutral-100 rounded-full hover:bg-primary-600 transition-colors text-lg px-8 py-4">Start Your Journey</Link>
              <Link href="/faq" className="border border-primary-500 text-primary-500 rounded-full hover:bg-primary-100 transition-colors text-lg px-8 py-4">Learn More</Link>

            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:child-care" className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Trusted Childcare</h3>
                    <p className="text-neutral-600 text-sm">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:spa" className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Wellness Services</h3>
                    <p className="text-neutral-600 text-sm">Self-care made easy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:group" className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Mom Community</h3>
                    <p className="text-neutral-600 text-sm">Connect & support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-white">
        <div className=" mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Moms Choose PamperMomma
            </h2>
            <p className="text-xl text-neutral-600 mx-auto">
              We understand the unique challenges mothers face. Our platform is built to provide
              reliable, safe, and convenient solutions for busy moms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="material-symbols:verified-user" className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Verified Caregivers</h3>
              <p className="text-neutral-700">
                All our caregivers are thoroughly vetted with background checks and references.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="material-symbols:schedule" className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Flexible Scheduling</h3>
              <p className="text-neutral-700">
                Book services when you need them, from last-minute requests to regular appointments.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-100 to-red-200">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="material-symbols:favorite" className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Made for Moms</h3>
              <p className="text-neutral-700">
                Every feature is designed with mothers' needs in mind, by mothers who understand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 py-20 bg-gradient-to-br from-primary-50 to-neutral-100">
        <div className="mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Services That Support You
            </h2>
            <p className="text-xl text-neutral-600">
              From childcare to personal wellness, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "material-symbols:child-care", title: "Childcare", desc: "Trusted babysitters and nannies" },
              { icon: "material-symbols:spa", title: "Wellness", desc: "Massage, yoga, and relaxation" },
              { icon: "material-symbols:cleaning-services", title: "House Help", desc: "Cleaning and organizing services" },
              { icon: "material-symbols:restaurant", title: "Meal Prep", desc: "Healthy meal planning and prep" },
              { icon: "material-symbols:psychology", title: "Mental Health", desc: "Counseling and support groups" },
              { icon: "material-symbols:fitness-center", title: "Fitness", desc: "Personal training and classes" },
              { icon: "material-symbols:local-laundry-service", title: "Errands", desc: "Shopping and daily tasks" },
              { icon: "material-symbols:school", title: "Tutoring", desc: "Educational support for kids" }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Icon icon={service.icon} className="text-primary-500 text-3xl mb-4" />
                <h3 className="font-semibold text-neutral-900 mb-2">{service.title}</h3>
                <p className="text-neutral-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your PamperMomma Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of moms who have found the support they deserve.
            Sign up today and get your first service at 20% off.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/onboarding" className="rounded-full transition-colors bg-white text-primary-600 hover:bg-yellow-100! text-lg px-8 py-4">Get Started Free</Link>
            <Link href="" className="border rounded-full transition-colors border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">Watch Demo</Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-neutral-900">
        <div className="mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Icon icon="material-symbols:favorite" className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold text-white">PamperMomma</span>
              </div>
              <p className="text-neutral-400">
                Supporting mothers with trusted services and community connections.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>Childcare</li>
                <li>Wellness</li>
                <li>House Help</li>
                <li>Meal Prep</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Community Guidelines</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2025 PamperMomma. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
