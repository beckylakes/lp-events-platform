import { useNavigate, useLocation } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  const goBack = () => navigate("/home");

  const location = useLocation();
  const { error, errorMessage, errorCode } = location.state || {};

  return (
    <>
      {!error ? (
        <article>
          <h1>Oops!</h1>
          <p>Error 404: There's nothing here...</p>

          <button onClick={goBack}>Go Home?</button>
        </article>
      ) : (
        <article>
          <h1>Oops!</h1>
          <p>
            Error {errorCode}: {errorMessage}
          </p>
          <button onClick={goBack}>Go Home?</button>
        </article>
      )}
    </>
  );
};

export default Error;
