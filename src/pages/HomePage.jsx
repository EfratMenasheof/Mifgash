import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';

function HomePage() {
  return (
    <div className="homepage">
      <MifgashCard
        name="Danielle S."
        date="July 17th, 4pm"
        location="Zoom call"
        topic="You’ll learn English!"
      />
      <FriendsSection />
    </div>
  );
}

export default HomePage;
