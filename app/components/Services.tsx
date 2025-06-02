import Image from "next/image"
import styles from "./Services.module.css"

const Services = () => {
  const services = [
    {
      title: "Global Export",
      description:
        "We export high-quality South Indian products to over 30 countries worldwide, ensuring authentic flavors reach global markets.",
      icon: "export-placeholder.svg",
    },
    {
      title: "Quality Assurance",
      description:
        "Our rigorous quality control processes ensure that every product meets international standards before reaching our customers.",
      icon: "quality-placeholder.svg",
    },
    {
      title: "Custom Solutions",
      description:
        "We provide tailored export solutions to meet your specific requirements, from packaging to private labeling and bulk orders.",
      icon: "custom-placeholder.svg",
    },
  ]

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
              <Image
                src={`/icons/${service.icon}`}
                alt={service.title}
                width={60}
                height={60}
                className={styles.serviceIcon}
              />
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
