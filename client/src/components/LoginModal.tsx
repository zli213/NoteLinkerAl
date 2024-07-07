import logo from "../../public/images/logo.svg";

const LoginModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="w-16 h-16 mr-1" />
          <h2 className="text-2xl font-bold mb-2">Login to NoteLinkerAl</h2>
          <p className="text-gray-600 text-center">
            AI-powered notes app for everyone
          </p>
        </div>

        <button className="btn bg-blue-500 w-full text-gray-100 py-2 px-4 rounded-md mb-3 flex items-center justify-center">
          <img
            src="https://banner2.cleanpng.com/20180423/gkw/kisspng-google-logo-logo-logo-5ade7dc753b015.9317679115245306313428.jpg"
            alt="Google logo"
            className="mr-2 w-5"
          />
          Continue with Google
        </button>

        <button className="btn bg-blue-500 w-full text-gray-100 py-2 px-4 rounded-md mb-6 flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            alt="GitHub logo"
            className="mr-2 w-5"
          />
          Continue with Github
        </button>
        <button className="btn bg-blue-500 w-full text-gray-100 py-2 px-4 rounded-md mb-6 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png"
            alt="Facebook logo"
            className="mr-2 w-5"
          />
          Continue with Microsoft
        </button>
        {/* <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border border-gray-300 rounded-md py-2 px-4 mb-3"
        />
        
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center">
          <Mail className="mr-2" size={20} />
          Continue with Email
        </button> */}
      </div>
    </div>
  );
};

export default LoginModal;
