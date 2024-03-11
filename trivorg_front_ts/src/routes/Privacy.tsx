import { useParams } from 'react-router-dom';

const Privacy = () => {
    let { id } = useParams();

    return (
        <>Privacy {id}</>
    );
}

export default Privacy;
