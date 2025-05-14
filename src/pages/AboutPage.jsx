import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-wrapper">
      <h1 className="about-title">ABOUT MIFGASH</h1>
      <p className="about-subtitle">
        Founded in 2025, Mifgash was born from a simple yet powerful idea: that real language learning happens through human connection.
        In a world filled with language apps, we chose to focus on people. Our platform connects Jews around the world for friendly, 
        meaningful conversations that help both sides grow.
      </p>

      <div className="about-section">
        <img src="/public/AboutUs-pics/zoom-call.png" alt="Happy Zoom Call" />
        <div className="about-text">
          <h3>Online-Only, Always Together</h3>
          <p>
            Whether you're in Tel Aviv or New York, you can meet new people, practice your Hebrew or English, and feel part of something bigger –
            all from the comfort of your home.
          </p>
        </div>
      </div>

      <div className="about-section reverse">
        <div className="about-text">
          <h3>Learn with a Friend</h3>
          <p>
            Language becomes easier, faster, and way more fun when you're talking to someone who cares. Our goal is to build bridges, not just vocab.
          </p>
        </div>
        <img src="/public/AboutUs-pics/girl-computer.png" alt="Friendly video chat" />
      </div>

      <div className="testimonials">
        <h2>User Testimonials</h2>
        <div className="quote-block">
          <p>“I’ve never felt so connected to someone across the world. We laugh, we learn, and now I finally remember the word for ‘weekend’.”</p>
          <span>– Rachel from Chicago</span>
        </div>
        <div className="quote-block">
          <p>“My partner helps me improve my English, and I help her with Hebrew. It’s like a language exchange but way more personal.”</p>
          <span>– Noa from Haifa</span>
        </div>
        <div className="quote-block">
          <p>“I was tired of using language apps. Talking to an actual person? That’s how you learn.”</p>
          <span>– Eli from Boston</span>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
