import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL; 

export default function AdminMysteryBox() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const form = useRef();
    const [refresh, setRefresh] = useState(null);

    useEffect(() => {
        console.log("in"); 
        fetch(`${API_URL}/mystery/mystery_all`)
            .then(res => res.json())
            .then(res => {
                setData(res.result);
                console.log(res.result);    
            })
            .catch(err => console.error(err));
    }, [refresh]);

    const editArticle = (id) => {
        navigate("/mystery/edit/" + id);
    }

    const add = (e) => {
        e.preventDefault();
        const data = new FormData(form.current);
        fetch(`${API_URL}/mystery/mystery_new`, {
            method: "POST",
            body: data,
        })
            .then(res => res.json())
            .then(res => {
                setRefresh(Math.random()); 
            })
            .catch(err => console.error(err));

    };

    const deleteArticle = (id) => {
        fetch(`${API_URL}/article/delete/${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "ok") {
                    setRefresh(Math.random());
                }
            })
            .catch((err) => console.error(err));
    }
    const computePrice = (e) => {
        return Math.round(parseFloat(e.promo > 0 ? e.subsprice - (e.subsprice * e.promo / 100) : e.subsprice), 2);
    }

    if (data) {
        return (
            <div className="add_article">
                <div className="wrapper">
                 <fieldset  className="adress-section filter-border" style={{borderRadius : ".5rem"}}>
                     <legend>Ajouter une Mystery Box</legend>
                     <form encType="multipart/form-data" className="vertical-form wrap" ref={form} onSubmit={add}>
                        <label>Nom de l'article :</label>
                        <input name="name" type="text" required></input>
                        <label>Catégorie(s) :</label>
                        <input name="categories" type="text" placeholder="Catégorie 1, catégorie 2" minLength={0} maxLength={100}></input>
                        <label>Description : </label>
                        <textarea name="description" required></textarea>
                        <label>Prix Abonnement :</label>
                        <input required name="subscriptionprice" type="number"></input>

                        <div className="horizontal-flex wrap">
                            <div className="vertical-flex">
                                <label>Poids :</label>
                                <input name="weight" required type="text" ></input>
                            </div>
                            <div className="vertical-flex">
                                <label>Couleur :</label>
                                <input name="color" type="text" required></input>
                            </div>
                        </div>

                        <label>Photo(s) :</label>
                        <input name="photo" type="text" placeholder="http://url_de_votre_image" defaultValue={""}></input>

                        <div className="horizontal-flex wrap">
                            <div className="vertical-flex">
                                <label>Quantité :</label>
                                <input required name="quantity" type="number"></input>
                            </div>
                            <div className="vertical-flex">
                                <label>Price :</label>
                                <input required type="number" name="price"></input>
                            </div>
                            <div className="vertical-flex">
                                <label>Promo :</label>
                                <input required name="promo" type="number" min={0} max={100}></input>
                            </div>
                        </div>

                        <input type="submit" value="Ajouter cet article" className="marginAuto"></input>
                    </form>
                 </fieldset>
                </div>
                <div className="gallery">
                    {data.length > 0
                        ?
                        data.map((e) => {
                            return (
                                <div key={e.id} className="thumbnail">
                                    <div className="img-wrapper">
                                        {
                                            e.photo[0] && 
                                            <img alt="article" src={e.photo[0].image_link}></img>
                                        }
                                    </div>
                                    {e.new &&
                                        <span className="new">Nouveauté !</span>
                                    }
                                    {e.promo > 0
                                        ? <><span className="promo"> -{e.promo}%</span>
                                            <p className="firstPrice"><strike>{e.subprice} €</strike></p></>

                                        : <div className="noPromo"></div>
                                    }
                                    <div className="infos">
                                        <div className="sub-info">
                                            <p className="name">{e.name}</p>
                                            {e.promo > 0
                                                ? <div className="prices">
                                                    <p>{() => computePrice(e)} €</p>
                                                </div>
                                                : <p>{e.subprice} €</p>
                                            }
                                        </div>
                                        <p className="cat">{e.categoriesName}</p>
                                        {/* {e.data.quantity > 0
                                                ? <p>Etat du stock : {e.data.quantity}.</p>
                                                : <p>En rupture de stock</p>
                                            } */}
                                        < div >
                                            <button onClick={() => editArticle(e.id)}>Edit</button>
                                            <button onClick={() => deleteArticle(e.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div >
                            )
                        })
                        : <div>Pas de résultats</div>
                    }
                </div>
            </div >
        );
    }
    else {
        return (
            <p>Chargement en cours...</p>
        );
    }
}