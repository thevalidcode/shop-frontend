"use client";

import { motion } from "framer-motion";
import { Truck, Shield, Clock, Zap, TrendingUp, Star } from "lucide-react";

export function BannerSection() {
  const features = [
    {
      icon: Truck,
      title: "Fast Website",
      description: "Quick placing of orders",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% encrypted & protected",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always ready to help you",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Premium products guaranteed",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing everyday",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-muted/30 to-background border-t border-border/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Shop With Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with
            quality products and excellent service
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center p-8 rounded-xl bg-card border border-border/30 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 lg:mt-20 pt-12 lg:pt-16 border-t border-border/30 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Top Rated", "Secured Payment"].map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
