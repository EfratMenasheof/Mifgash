import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Opening Section */}
      <div className="container text-center my-2">
        <h1 className="about-title">ABOUT MIFGASH</h1>
        <p className="lead about-lead">
          Mifgash was born from a powerful idea: that meaningful connections between Jews around the world can spark both personal and cultural growth.
          Through shared language learning, we help people bond across distance and difference – making Hebrew and English more than just school subjects.
        </p>
      </div>

      {/* Section 1 – Zoom Call (blue background) */}
      <div className="about-section bg-blue">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img src="/AboutUs-pics/zoom-call.png" alt="Zoom Call" className="img-fluid rounded shadow" />
            </div>
            <div className="col-md-6">
              <h2 className="section-heading text-orange">Online-Only, Always Together</h2>
              <p className="section-text">
                Whether you're in Tel Aviv or New York, you can meet new people, practice your Hebrew or English,
                and feel part of something bigger – all from the comfort of your home.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 – Girl with Laptop (white background, reversed) */}
      <div className="about-section bg-white">
        <div className="container py-5">
          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-md-6 mb-4 mb-md-0">
              <img src="/AboutUs-pics/girl-computer.png" alt="Girl at laptop" className="img-fluid rounded shadow" />
            </div>
            <div className="col-md-6">
              <h2 className="section-heading">Learn with a Friend</h2>
              <p className="section-text black-text">
                Language becomes easier, faster, and way more fun when you're talking to someone who cares.
                Our goal is to build bridges, not just vocab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials (blue background) */}
      <div className="about-section bg-blue text-center py-5">
        <h2 className="section-heading text-orange">Hear from our users:</h2>
        <div className="container">
          <p className="testimonial">
            <em>
              “I've never felt so connected to someone across the world. We laugh, we learn, and now I finally remember the word for ‘weekend’.”
              <br /><span className="author">– Rachel from Chicago</span>
            </em>
          </p>
          <p className="testimonial">
            <em>
              “My partner helps me improve my English, and I help her with Hebrew. It’s like a language exchange but way more personal.”
              <br /><span className="author">– Noa from Haifa</span>
            </em>
          </p>
          <p className="testimonial">
            <em>
              “I think this is a beautiful way to not only learn a language from one another, but also share our lived experiences, culture, and values.”
              <br /><span className="author">– Daniel from Baltimore</span>
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
