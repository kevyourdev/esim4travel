export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent via-accent to-primary-dark text-white py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-tertiary rounded-full opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 hidden lg:block" style={{borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'}}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">About <span className="text-tertiary">eSIM4Travel</span></h1>
          <p className="text-xl text-white/90 font-body">
            Connecting travelers worldwide with affordable, instant mobile data
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="space-y-16">
          {/* Our Mission */}
          <section className="bg-card rounded-xl border-2 border-foreground shadow-hard p-8 lg:p-12">
            <h2 className="text-3xl font-heading font-extrabold text-foreground mb-4">Our Mission</h2>
            <p className="text-foreground leading-relaxed text-lg font-body">
              At eSIM4Travel, we believe staying connected while traveling should be simple, affordable, and
              hassle-free. Our mission is to eliminate the frustration of expensive roaming charges, hunting for
              local SIM cards, and dealing with complicated mobile plans.
            </p>
          </section>

          {/* The eSIM Revolution */}
          <section className="bg-card rounded-xl border-2 border-foreground shadow-hard-secondary p-8 lg:p-12">
            <h2 className="text-3xl font-heading font-extrabold text-foreground mb-4">The eSIM Revolution</h2>
            <p className="text-foreground leading-relaxed mb-4 font-body">
              Traditional physical SIM cards are becoming a thing of the past. With eSIM technology, you can
              activate a data plan instantly - no need to find a store, wait in line, or swap tiny cards. Just
              scan a QR code and you're connected.
            </p>
            <p className="text-foreground leading-relaxed font-body">
              We've partnered with over 200 mobile network operators worldwide to bring you reliable coverage
              in 190+ destinations, all delivered digitally to your email within seconds of purchase.
            </p>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-center mb-12 text-foreground">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border-2 border-foreground shadow-hard p-6 hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent border-2 border-foreground flex items-center justify-center mr-4 shadow-hard">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Instant Delivery</h3>
                </div>
                <p className="text-mutedForeground font-body font-medium">
                  Receive your eSIM QR code via email within minutes. No shipping, no waiting, no delays.
                </p>
              </div>

              <div className="bg-card rounded-xl border-2 border-foreground shadow-hard p-6 hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center mr-4 shadow-hard">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Transparent Pricing</h3>
                </div>
                <p className="text-mutedForeground font-body font-medium">
                  No hidden fees, no surprise charges. Pay once and know exactly what you're getting.
                </p>
              </div>

              <div className="bg-card rounded-xl border-2 border-foreground shadow-hard p-6 hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center mr-4 shadow-hard">
                    <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Global Coverage</h3>
                </div>
                <p className="text-mutedForeground font-body font-medium">
                  Stay connected in 190+ countries with reliable 4G/5G networks. One solution for all your travels.
                </p>
              </div>

              <div className="bg-card rounded-xl border-2 border-foreground shadow-hard p-6 hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mr-4 shadow-hard">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">24/7 Support</h3>
                </div>
                <p className="text-mutedForeground font-body font-medium">
                  Our customer support team is always available to help, no matter where you are in the world.
                </p>
              </div>
            </div>
          </section>

          {/* Squiggle Divider */}
          <div className="relative h-16 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
              <path d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round"/>
              <path d="M0,50 Q150,70 300,50 T600,50 T900,50 T1200,50" fill="none" stroke="#F472B6" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Our Story */}
          <section className="bg-card rounded-xl border-2 border-foreground shadow-hard-tertiary p-8 lg:p-12">
            <h2 className="text-3xl font-heading font-extrabold text-foreground mb-4">Our Story</h2>
            <p className="text-foreground leading-relaxed mb-4 font-body">
              Founded in 2020, eSIM4Travel was born from the frustrations our founders experienced while traveling.
              Exorbitant roaming charges, unreliable tourist SIMs, and the constant worry about staying connected
              inspired us to create a better solution.
            </p>
            <p className="text-foreground leading-relaxed mb-4 font-body">
              What started as a small team of travel enthusiasts and tech innovators has grown into a trusted
              platform serving over 2 million travelers worldwide. We've helped adventurers, business travelers,
              and digital nomads stay connected across every continent.
            </p>
            <p className="text-foreground leading-relaxed font-body">
              Today, we continue to expand our coverage, improve our technology, and lower our prices - all while
              maintaining the personal touch and customer service that sets us apart.
            </p>
          </section>

          {/* Our Values */}
          <section className="bg-card rounded-xl border-2 border-foreground shadow-hard p-8 lg:p-12">
            <h2 className="text-3xl font-heading font-extrabold text-foreground mb-6">Our Values</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-accent border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-hard">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">Customer First</h3>
                  <p className="text-mutedForeground leading-relaxed font-body font-medium">
                    Every decision we make starts with asking: "How does this benefit our customers?" Your
                    satisfaction and connectivity are our top priorities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-hard">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">Transparency</h3>
                  <p className="text-mutedForeground leading-relaxed font-body font-medium">
                    No fine print, no gotchas. We believe in clear pricing, honest communication, and building
                    trust through transparency.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-hard">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">Innovation</h3>
                  <p className="text-mutedForeground leading-relaxed font-body font-medium">
                    We're constantly exploring new technologies and partnerships to bring you better coverage,
                    faster speeds, and more affordable plans.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-hard">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">Sustainability</h3>
                  <p className="text-mutedForeground leading-relaxed font-body font-medium">
                    By eliminating physical SIM cards and their packaging, we're reducing waste and our
                    environmental impact, one digital eSIM at a time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Join Our Journey CTA */}
          <section className="bg-gradient-to-br from-accent to-secondary rounded-2xl border-2 border-foreground shadow-hard-xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-quaternary/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-heading font-extrabold mb-4">Join Our Journey</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto font-body text-lg">
                Whether you're planning your next vacation, managing a global business, or living the digital nomad
                lifestyle, we're here to keep you connected.
              </p>
              <a
                href="/destinations"
                className="inline-flex items-center gap-2 bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-8 py-4 rounded-full font-heading font-bold shadow-hard transition-all duration-300 ease-bouncy text-lg"
              >
                <span>Browse Destinations</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </a>
            </div>
          </section>

          {/* Contact Us */}
          <section className="bg-muted rounded-xl border-2 border-border p-8 lg:p-12">
            <h2 className="text-2xl font-heading font-extrabold text-foreground mb-6 text-center">Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-accent border-2 border-foreground flex items-center justify-center mx-auto mb-3 shadow-hard">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="font-heading font-bold text-foreground mb-1">Email</div>
                <div className="text-mutedForeground font-body text-sm">hello@esim4travel.com</div>
              </div>

              <div>
                <div className="w-12 h-12 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center mx-auto mb-3 shadow-hard">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="font-heading font-bold text-foreground mb-1">Support</div>
                <div className="text-mutedForeground font-body text-sm">support@esim4travel.com</div>
              </div>

              <div>
                <div className="w-12 h-12 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center mx-auto mb-3 shadow-hard">
                  <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-heading font-bold text-foreground mb-1">Hours</div>
                <div className="text-mutedForeground font-body text-sm">24/7 Customer Support</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
