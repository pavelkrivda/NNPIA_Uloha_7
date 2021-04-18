import './App.css';
import Product from "./product";
import {useEffect, useState} from "react";
import ProductForm from "./product-form";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";

function App() {

    const [cart, setCart] = useState([])
    const [data, setData] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState()

    const onNewProductHandler = (product) => {
        const newData = [...data];
        newData.push(product);
        console.log(newData);
        setData(newData)
    }

    useEffect(() => {
        setTimeout(() => {
                fetch('http://localhost:3001/products')
                    .then(response => {
                        if (response.ok) {
                            return response.json()
                        }
                        throw new Error(`Unable to get data: ${response.statusText}`)
                    })
                    .then(json => setData(json))
                    .catch((err) => setError(err.message))
                    .finally(() => setIsPending(false))
            }
            , 1000)

    }, [])

    const addToCartHandler = function (product) {
        const newCart = [...cart];
        newCart.push(product);
        console.log(newCart);
        setCart(newCart)
    }

    const removeFromCartHandler = function (product) {
        const newCart = [...cart];
        const productIndex = newCart.findIndex(item => item.id === product.id)
        newCart.splice(productIndex, 1)
        setCart(newCart)
    }


    return (
        <Router>
            <div className="App">

                <nav>
                    <ul style={{
                        listStyleType: "none",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        width: "300px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "50px",
                        marginBottom: "50px"
                    }}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/edit-product">Edit product</Link>
                        </li>
                        <li>
                            <Link to="/cart">Cart</Link>
                        </li>
                    </ul>
                </nav>


                <Switch>
                    <Route path="/cart">
                        <h1>Shopping cart</h1>
                        {cart.map(item => <div style={{width: "300px", marginLeft: "auto", marginRight:"auto", marginBottom:"20px", display:"flex", justifyContent: "space-around"}}>
                            {item.name}
                            <button onClick={() => removeFromCartHandler(item)}>-</button>
                        </div>)}
                    </Route>
                    <Route path="/edit-product">
                        <ProductForm onNewProduct={onNewProductHandler}/>
                    </Route>
                    <Route path="/">
                        {<div>Items count: {cart.length}</div>}
                        {isPending && "Loading data..."}
                        {error && <div>{error}</div>}

                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            {data.map(item => <Product key={item.id} product={item}
                                                       onClickHandler={addToCartHandler}/>)}
                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}


export default App;
