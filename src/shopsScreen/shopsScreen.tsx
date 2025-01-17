import AppState from "mocks/appState";
import Shop from "models/shop";
import { useState,useEffect } from "react";
import { Col, Container, Row,Form, Table, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection,doc, setDoc, addDoc, getDocs, DocumentReference, getDoc, deleteDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import './shopsScreen.css';

function ShopsScreen() {
    let [shopsSnapshot, loadingCollection, error] = useCollection(
        collection(AppState.fireStore, 'shops'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    useEffect(() => {
        const shops = shopsSnapshot?.docs.map((shopDoc)=>{
            const shop = (shopDoc.data() as Shop);
            shop.id = shopDoc.id;
            return shop;
            });
        setShops(shops as Shop[]);
    }, [shopsSnapshot])
    
    const [shops, setShops] = useState<Shop[]>([]);
    const navigate = useNavigate();

    function onDeleteShop(id:string)
    {
        deleteDoc(doc(AppState.fireStore, 'shops',id));  
    }

    function onEditShop(id:string)
    {
        navigate(`/editShop/${id}`);
    }


    function shopsTable()
    {
        if(!shops || shops.length == 0)
        {
            return (<>
                <h3>Their are no shops found</h3>
            </>);
        }
        const shopRows = shops.map(
            (item,index) =>    
            <tr key={index+1}>
                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.delivery} EGP</td>
                <td>{item.vatPercentage} %</td>
                <td>{item.menu?.length||-1+1} </td>
                <td className="d-flex justify-content-center">
                    <Button variant="primary" onClick={()=>{onEditShop(item.id as string)}}>Edit</Button>
                    <div className="mx-1"></div>
                    <Button variant="danger" onClick={()=>{onDeleteShop(item.id as string)}}>Delete</Button>
                </td>
            </tr> 
            );
        return <Table striped bordered hover variant="dark" responsive>
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Delivery</th>
                <th>Vat</th>
                <th>Menu Items</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {shopRows}
            </tbody>
        </Table>
    }

    function body()
    {
        return ( 
            <>
            <div id="page">
                <Container>
                    <Row>
                        <Col className="mt-4">
                            <h1 className="text-center">All Shops</h1>
                            <div className="text-end">
                            <Button><Link to="/createShop">+ Create new shop</Link></Button>
                            </div>
                            <hr />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {loadingCollection ?"Loading...":shopsTable()}
                        </Col>
                    </Row>
                </Container>
            </div>
            </> 
            );
    }

    return ( body() );
}

export default ShopsScreen;