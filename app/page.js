'use client';
import axios from "axios";

const Page = () => {
    const handle = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('/api/');
            console.log(response.data.messgae); // Handle the response data as needed
        } catch (err) {
            console.error(err); // Log the error or handle it accordingly
        }
    };

    return (
        <div>
            <button onClick={handle}>Connect</button>
        </div>
    );
};

export default Page;
