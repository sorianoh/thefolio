import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import moodCoffee from '../assets/images/moodcoffee.jpeg';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleReactionUpdate = (postId, newReactions) => {
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, reactions: newReactions } : post
    ));
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* HERO SECTION - visible sa lahat */}
        <section className="hero">
          <h1>WELCOME, have a brewtiful day</h1>
          <h2><strong>Hi, I'm Hazel Soriano</strong></h2>
          <p className="hero-subtext">Feel free to explore this to learn more.</p>
          <div className="hero-image-container">
            <img src={moodCoffee} alt="Featured Coffee" className="featured-img" style={{ width: '250px', borderRadius: '15px', marginTop: '20px' }} />
          </div>
        </section>

        {/* WHY I LOVE COFFEE SECTION - visible sa lahat */}
        <section className="highlights">
          <h2>Why I Love Coffee</h2>
          <ul>
            <li>The variability depending on the weather</li>
            <li>Boosts energy levels</li>
            <li>It's my stress reliever</li>
            <li>Provides a unique social experience</li>
          </ul>
        </section>

        {/* LATEST POSTS SECTION - visible sa lahat (admin, member, guest) */}
        <section className="latest-posts-section">
          <h2>Latest Posts</h2>
          {loading ? (
            <p className="loading-posts">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="no-posts-message">
              <p>No posts yet. Be the first to write one!</p>
              <Link to="/create-post" className="create-first-btn">Create Your First Post →</Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handleDeletePost}
                  onReactionUpdate={handleReactionUpdate}
                />
              ))}
            </div>
          )}
        </section>

        {/* PREVIEW CARDS SECTION - visible sa lahat */}
        <section className="previews">
          <div className="card">
            <h3>About the Coffee's</h3>
            <p>Discover about the coffee.</p>
            <Link to="/about">Read More &rarr;</Link>
          </div>
          <div className="card">
            <h3>Join the Community</h3>
            <p>Register today to get my coffee updates.</p>
            <Link to="/register">Sign Up &rarr;</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;