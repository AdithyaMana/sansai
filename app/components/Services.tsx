import { Globe, ShieldCheck, Settings } from "lucide-react"
import styles from "./Services.module.css"

const services = [
  {
    title: "Global Export",
    description:
      "We export high-quality South Indian products to over 30 countries worldwide, ensuring authentic flavors reach global markets.",
    Icon: Globe,
  },
  {
    title: "Quality Assurance",
    description:
      "Our rigorous quality control processes ensure that every product meets international standards before reaching our customers.",
    Icon: ShieldCheck,
  },
  {
    title: "Custom Solutions",
    description:
      "We provide tailored export solutions to meet your specific requirements, from packaging to private labeling and bulk orders.",
    Icon: Settings,
  },
]

const Services = () => {
  return (
    <section className={styles.services}>
      <div className="container">
        <h2 className="section-title animate-slideUp">Our Services</h2>
        <p className={`${styles.intro} animate-slideUp`} style={{ animationDelay: "0.2s" }}>
          At Sansai, we offer comprehensive export services designed to bring authentic South Indian products to global
          markets with efficiency and excellence.
        </p>
        <div className={styles.serviceGrid}>
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`${styles.serviceCard} animate-fadeIn`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={styles.serviceIconWrapper}>
                <service.Icon size={32} strokeWidth={1.5} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
