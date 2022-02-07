import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../CartSlice";
import Filter from "./Filter";
const API_URL = process.env.REACT_APP_API_URL;


export default function ArticleListing(props) {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [categories, setCategories] = useState(null);
    const cart = useSelector((state) => state.cart.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const elementsByPage = 12;

    useEffect(() => {
        fetch(`${API_URL}/article/all`)
            .then(res => res.json())
            .then(res => {
                const updatedData = computeUpdatedPrices(res);
                console.log(updatedData); 
                setData(updatedData);
                setFilteredData(updatedData);
            })
            .catch(err => console.error(err));
        getCategories();
    }, [props]);

    const computeUpdatedPrices = (data) => {
        data.forEach((e)=> e.data.updatedPrice = e.data.promo > 0 ? Number(e.data.price - e.data.price * e.data.promo / 100).toFixed(2) : e.data.price);
        return data; 
    }

    const addToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        let cartTemp = [...cart];
        // let cartTemp = JSON.parse(localStorage.getItem("cart")) || [];
        let obj = { ...product.data };
        obj.selectedQuantity = Number(document.getElementById(product.data.id).value);
        obj.price = computePrice(obj);
        for (let i = cart.length - 1; i >= 0; i--) {
            if (cart[i].id === obj.id) {
                obj.selectedQuantity = Number(cart[i].selectedQuantity) + Number(obj.selectedQuantity);
                cartTemp.splice(i, 1);
            }
        }
        cartTemp.push(obj);
        dispatch(updateCart(cartTemp));
        sessionStorage.setItem("cart", JSON.stringify(cartTemp));
    }

    const computePrice = (e) => {
        return e.promo > 0 ? e.price - (e.price * e.promo / 100).toFixed(2) : e.price.toFixed(2);
    }

    const getCategories = () => {
        fetch(`${API_URL}/category/all`)
            .then((res) => res.json())
            .then(res => {
                setCategories(res);
            })
            .catch(err => console.error(err));
    }

    // const paginate = (data) => {
    //     const pages = [];
    //     const elementsByPage = 10
    //     const numberOfPages = Math.ceil(data.length / elementsByPage);
    //     for (let i = 0; i < data.length; i += elementsByPage) {
    //         pages.push(data.slice(i, i + 10));
    //     }
    //     setPages([...Array(numberOfPages).keys()]);
    //     return pages;
    // }

    if (filteredData) {
        return (
            <div className="articles-wrapper">
                {(categories) &&
                    <div className="filters-wrapper">
                        <Filter data={data}
                            onFilter={(d) => { setFilteredData(d) }}
                            categories={categories}
                            new={props.new !== undefined ? true : false}
                            promo={props.promo !== undefined ? true : false}
                            graines={props.graines ? true : false}
                            accessoires={props.accessoires ? true : false}
                        />
                    </div>
                }
                <div className="gallery-wrapper">
                    <div className="gallery">
                        {
                            filteredData.slice(0, pageNumber * elementsByPage).map((e) => {
                                return (
                                    <div key={e.data.id} onClick={(ev) => {
                                        if (!ev.target.classList.contains("buttonShop") && !ev.target.classList.contains("number")) {
                                            navigate("/article/" + e.data.id)
                                        }
                                    }} className="thumbnail">
                                        <div className="img-wrapper">
                                            {e.data.photos[0] &&
                                                <img alt="main" src={e.data.photos[0].imgLink} />
                                            }
                                        </div>
                                        {e.data.new &&
                                            <span className="new">Nouveauté !</span>
                                        }

                                        {e.data.promo > 0
                                            ? <><span className="promo"> -{e.data.promo}%</span>
                                                <p className="firstPrice"><strike>{e.data.price} €</strike></p></>

                                            : <div className="noPromo"></div>

                                        }
                                        <div className="infos">
                                            <div className="sub-info">
                                                <p className="name">{e.data.name}</p>
                                                {e.data.promo > 0
                                                    ? <div className="prices">
                                                        <p>{computePrice(e.data)} €</p>
                                                    </div>
                                                    : <p>{e.data.price} €</p>
                                                }
                                            </div>
                                            {/* <p className="cat">{e.data.categ    oriesName}</p> */}
                                            <form onSubmit={(event) => addToCart(event, e)} className="horizontale-flex center-flex marginAuto">
                                                <input type="number" min={1} id={e.data.id} defaultValue={1} className="number"></input>
                                                <input type="submit" value="Ajouter au panier" className="buttonShop" />
                                            </form>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className="horizontal-flex center-flex">
                        {pageNumber * elementsByPage < filteredData.length
                            ? <button onClick={() => setPageNumber(pageNumber + 1)}>Plus de produits</button>
                            : filteredData.length > elementsByPage ? <button onClick={() => window.scroll(0, -100)}>Haut de page</button> : null
                        }
                    </div>
                </div>

            </div>
        );
    }
    else {
        return (
            <p>Chargement en cours...</p>
        );
    }
}
