import { useNavigate, useLocation } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  const goBack = () => navigate('/home');

  const location = useLocation();
  const { error, errorMessage, errorCode } = location.state || {};

  return (
    <div>
      {!error ? (
        <div>
          <h1>Oops!</h1>
          <p>Error 404: There's nothing here...</p>
          <div className="flexGrow">
            <button onClick={goBack}>Go Home?</button>
          </div>
        </div>
      ) : (
        <div>
            <h1>Oops!</h1>
          <p>
            Error {errorCode}: {errorMessage}
          </p>
          <div className="flexGrow">
            <button onClick={goBack}>Go Home?</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Error;
