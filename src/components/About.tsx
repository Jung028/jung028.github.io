import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const About = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="py-12 md:py-24 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">About Me</h2>
        <motion.div
          className="max-w-4xl"
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="text-subdued leading-relaxed text-sm md:text-base mb-6">
            Backend engineer currently pursuing an M.S. (Hons) in Computer Science (Advanced Entry) at the University of Sydney, specializing in Data Science and AI. Experienced in chargeback automation, distributed systems, and event-driven architectures across multiple regions. Proficient in Java, Python, REST APIs, microservices, and message brokers to design and deliver scalable, high-availability systems.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-subdued leading-relaxed text-sm md:text-base">
            Proven track record in implementing automated risk workflows, anomaly detection pipelines, and cross-entity NDF projects, while managing live incident resolution and performing root-cause analysis in multi-region deployments. Skilled at collaborating with multi-national teams, producing clear technical documentation, and delivering production-grade systems that integrate seamlessly across platforms.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
