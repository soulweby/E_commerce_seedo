import { useRef, useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export default function AdminShipping() {
    const weightForm = useRef();
    const distanceForm = useRef();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/shipping/all`)
            .then(res => res.json())
            .then(res => { setData(res); console.log(res) })
            .catch(err => console.error(err));
    }, []);

    const editDistance = (e) => {
        e.preventDefault();
        const formData = new FormData(distanceForm.current);
        fetch(`${API_URL}/shipping/edit/distance`, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.result === "ok") {
                    const temp = { ...data };
                    temp.distance = formData.get("distance");
                    setData(temp)
                }
            })
            .catch(err => console.error(err));
    };
    const editWeight = (e) => {
        e.preventDefault();
        const formData = new FormData(weightForm.current);
        fetch(`${API_URL}/shipping/edit/kg`, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                if (res.result === "ok") {
                    const temp = { ...data };
                    temp.kg = formData.get("kg");
                    setData(temp)
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <fieldset   className="adress-section filter-border">
            <legend>Frais de livraison</legend>
            <form ref={distanceForm} onSubmit={editDistance}>
                <label>Prix pour 100km : </label>
                {data &&
                    <input style={{border:"2px solid darkgreen", borderRadius:"2rem", height:"1.17rem"}} type="number" name="km" defaultValue={data.distance} min="0" step="any"></input>
                }
                <input className="submit-price-km-poid hover-save" style={{position:"absolute",borderTopRightRadius:"50px",borderBottomRightRadius:"50px",border:"none",  transform:"translate(-45px, -0.2px)", height:"2.69rem"}} type="submit" value="Changer"></input>
            </form>
            <form ref={weightForm} onSubmit={editWeight}>
                <label>Prix pour 1kg : </label>
                {data &&
                    <input style={{border:"2px solid darkgreen", borderRadius:"2rem", height:"1.17rem"}} type="number" name="kg" defaultValue={data.weight} min="0" step="any"></input>
                }
                <input className="submit-price-km-poid hover-save" style={{position:"absolute", borderTopRightRadius:"50px",borderBottomRightRadius:"50px",border:"none"}} type="submit" value="Changer"></input>
            </form>
            </fieldset>
        </div>
    );

}