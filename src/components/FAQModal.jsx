import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { faqData } from '../data/demoData'

export default function FAQModal({ onClose }) {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal faq-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h3>Frequently Asked Questions</h3>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 20 }}>Find answers to common questions</p>

        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <span>{item.question}</span>
              {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {openIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}

        <div className="contact-support-link">
          <p>Didn't find what you're looking for?</p>
          <button>Contact Support</button>
        </div>

        <div className="close-link" onClick={onClose} style={{ marginTop: 16 }}>
          <X size={14} /> CLOSE
        </div>
      </div>
    </div>
  )
}
