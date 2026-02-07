"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, Clock, Users, Zap } from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/typography";

const faqs = [
  {
    category: "Orders & Delivery",
    icon: HelpCircle,
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "Browse our products, select the item you want, and click 'Add to cart' an icon will be shown at the bottom left click it and click on proceed to checkout. You'll be guided through a simple checkout process where you can review your order details and complete payment securely.",
      },
      {
        question: "How do I track my order?",
        answer:
          "After placing an order, you can track its status in your dashboard under 'My Orders'. You'll receive email notifications for important updates about your order.",
      },
    ],
  },
  {
    category: "Payment",
    icon: Shield,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods including credit/debit cards, manual payments and other secure payment gateways. All transactions are encrypted and secure.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No! The price you see is the price you pay. We believe in transparent pricing with no hidden fees or surprise charges.",
      },
    ],
  },
  {
    category: "Account & Security",
    icon: Users,
    questions: [
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we take security seriously. All personal data is encrypted and stored securely. We never share your information with third parties without your consent. Read our privacy policy for more details.",
      },
      {
        question: "Do I need an account to make a purchase?",
        answer:
          "Yes, you'll need to create an account to place orders. This allows you to track your orders, access your purchase history, and manage your profile easily.",
      },
      {
        question: "Can I change my account information?",
        answer:
          "Absolutely! You can update your profile, email, password, and other account details anytime from your dashboard settings.",
      },
    ],
  },
  {
    category: "Support",
    icon: Zap,
    questions: [
      {
        question: "How do I contact customer support?",
        answer:
          "You can reach our support team through the Support page, or if you're logged in, visit the Support section in your dashboard. We typically respond within 24 hours.",
      },
      {
        question: "What if I have an issue with my order?",
        answer:
          "Contact our support team immediately with your order details. We're committed to resolving any issues quickly and ensuring you're satisfied with your purchase.",
      },
    ],
  },
];

export function FaqSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <TypographyH2 className="mb-6">
            Got Questions?
            <br />
            <span className="text-primary">We've Got Answers</span>
          </TypographyH2>
          <TypographyP className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to the most common questions about our services,
            pricing, and how to get started.
          </TypographyP>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold">{category.category}</h3>
              </div>

              {/* FAQ Items */}
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border border-border/50 rounded-lg px-6 bg-background/50"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-background border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you 24/7. Get in touch and we'll
              answer any questions you have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/client/support"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/client/faq"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
              >
                View All FAQs
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
