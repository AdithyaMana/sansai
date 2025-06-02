"use client"

import type React from "react"

import { useState } from "react"
import styles from "./contact.module.css"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("Sending...")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("Message sent successfully!")
        setFormData({ name: "", email: "", message: "" })
      } else {
        setStatus("Error sending message. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setStatus("Error sending message. Please try again.")
    }
  }

  return (
    <div className={styles.contact}>
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <div className={styles.content}>
          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Send Message
              </button>
              {status && <p className={styles.status}>{status}</p>}
            </form>
          </div>
          <div className={styles.contactInfo}>
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Feel free to reach out with any questions or inquiries.</p>
            <ul>
              <li>Email: info@sansai.com</li>
              <li>Phone: +91 123 456 7890</li>
              <li>Address: 123 Spice Street, Chennai, India</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
