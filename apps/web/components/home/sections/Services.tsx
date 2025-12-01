import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    id: 'item-1',
    title: 'Full-Stack Web Development',
    description:
      'Custom web applications built with modern frameworks. From concept to scalable deployment. We utilize React, Laravel, Node.js, and TypeScript to build robust solutions.',
  },
  {
    id: 'item-2',
    title: 'Mobile App Development',
    description:
      'Native and cross-platform apps that deliver exceptional user experiences. Leveraging React Native and Flutter for seamless performance across iOS and Android.',
  },
  {
    id: 'item-3',
    title: 'API Development',
    description:
      'Robust RESTful and GraphQL APIs with seamless integrations. Designed for scalability, security, and high performance to power your digital ecosystem.',
  },
  {
    id: 'item-4',
    title: 'AI & Automation',
    description:
      'Intelligent automation and AI-powered features to enhance productivity. Integrating OpenAI, LangChain, and vector databases for next-gen capabilities.',
  },
];

export function Services() {
  const fadeUp = useFadeUp();

  return (
    <Section id="services" className="mb-24">
      <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          Professional Development Services
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Bringing your ideas to life with cutting-edge technology and proven
          expertise
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="mx-auto max-w-3xl"
        transition={{ delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {SERVICES.map((service) => (
            <AccordionItem key={service.id} value={service.id}>
              <AccordionTrigger className="text-xl font-medium hover:no-underline">
                {service.title}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {service.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="mt-20 text-center"
        transition={{ delay: 0.3 }}
      >
        <p className="mx-auto mb-8 max-w-xl text-3xl font-medium tracking-tight md:text-4xl">
          Ready to start your next project?
        </p>
        <Button size="lg" className="h-12 px-8 text-base">
          Get in Touch
        </Button>
      </motion.div>
    </Section>
  );
}
