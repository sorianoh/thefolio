import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import moodCoffee from '../assets/images/moodcoffee.jpeg';

const Home = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="hero">
          <h1>WELCOME, have a brewtiful day</h1>
          <h2><strong>Hi, I'm Hazel Soriano</strong></h2>
          <p className="hero-subtext">Feel free to explore this to learn more.</p>
          <div className="hero-image-container">
            <img src={moodCoffee} alt="Featured Coffee" className="featured-img" />
          </div>
        </section>

        <section className="highlights">
          <h2>Why I Love Coffee</h2>
          <ul>
            <li>The variability depending on the weather</li>
            <li>Boosts energy levels</li>
            <li>It's my stress reliever</li>
            <li>Provides a unique social experience</li>
          </ul>
        </section>

        <section className="previews">
          <div className="card">
            <h3>About the Coffee's</h3>
            <p>Discover about the coffee.</p>
            <a href="/about">Read More &rarr;</a>
          </div>
          <div className="card">
            <h3>Join the Community</h3>
            <p>Register today to get my coffee updates.</p>
            <a href="/register">Sign Up &rarr;</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;