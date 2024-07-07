const Notebooks = () => {
  return (
    <div>
      <div
        className="bg-local bg-cover bg-center h-screen w-full flex items-center justify-center"
        style={{ backgroundImage: "url(/images/background.jpg)" }}
      >
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
};

export default Notebooks;
