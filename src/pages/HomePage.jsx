import MifgashCard from '../components/MifgashCard';
import FriendsSection from '../components/FriendsSection';

function HomePage() {
  return (
    <div className="homepage">
      <MifgashCard
        name="Daniel Radcliffe"
        date="July 17th, 4pm"
        location="Zoom call"
        topic="You’ll teach Hebrew!"
      />
      <FriendsSection />
    </div>
  );
}

export default HomePage;
