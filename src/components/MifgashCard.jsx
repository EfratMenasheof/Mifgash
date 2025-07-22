import '../AppStyles.css';

function MifgashCard({ onClick }) {
  return (
    <div className="section-box text-center">
      <h2 className="section-title">Create a New Mifgash</h2>
      <p className="mifgash-details">
        Create a language learning experience powered by AI!
        <br />
        Let us help you create a fun and personalized Mifgash plan based on your connection's interests or any topic you choose.
        <br />
        Go on and try it✨ 
      </p>
      <button className="btn-orange small-mifgash-button mt-2" onClick={onClick}>
        Create a New Mifgash
      </button>
    </div>
  );
}

export default MifgashCard;
