import { useNavigate } from "react-router-dom";

const Unauthorised = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1)


    return (
        <section>
            <h1>Unauthorised</h1>
            <br/>
            <p>You do not have access to the requested page</p>
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    );
}

export default Unauthorised;
