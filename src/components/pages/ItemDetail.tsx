import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { useBlockchainContext } from '../../context';
import BuyModal from '../components/BuyModal';
import { currentTime, styledAddress } from '../../utils';
import { useWallet } from '../../use-wallet/src';
import Action from '../../service';
import Jazzicon from 'react-jazzicon';
import { toast } from 'react-toastify';
import config from '../../config.json'
import Dialog from '../components/Dialog';
import { getEnsDomainByName, makeTokenId } from '../../thegraph';
import { storefront, tokens } from '../../contracts';
import { ethers } from 'ethers';

// const ownerAddress = "0x124d95e702ddb23547e83e53ecbfbd76e051f840"

interface BidItem {
    id:         number
    assetId: 	string
    bidder:     string
    token:      string
    price:      string
    expires:    number
    timestamp:  number
}
export default function ItemDetail() {
    const location = useLocation()
    const wallet = useWallet();
    const { name } = useParams();
    const navigate = useNavigate();
    const [state, { buyNFT, cancelOrder, translateLang, bidApprove, getCurrency }] =
        useBlockchainContext() as any;
    const [correctCollection, setCorrectCollection] = useState<any>(null);
    const [pageFlag, setPageFlag] = useState(1); // 1 = mine, 2 = sale mine, 3 = others, 4 = sale others
    const [modalShow, setModalShow] = useState(false);
    const [expireTime, setExpireTime] = useState([]);
    const [timeFlag, setTimeFlag] = useState(true);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<OrderData>({
        id: 0,
        label: '',
        seller: '',
        assetId: '',
        collection: '',
        token: '',
        price: 0,
        expires: 0,
        timestamp: 0,
        bidder: '',
        bidPrice: 0,
        dealPrice: 0,
    })
    const [bids, setBids] = useState<BidItem[]>([])
    const [itemData, setItemData] = useState<NFTData>({
        collection:	'',
        tokenId:	'',
        creator: 	'',
        owner: 		'',
        name: 		'',
        expires:    0
        // marketData: {}
    });
    const [status, setStatus] = useState({
        remainTime: "",
        showEdit: false,
        bidPrice: 0
    })

    // React.useEffect(() => {
    //     let flag = 0
    //     if (order.assetId===itemData.tokenId) {
    //         // flag = itemData.marketData?.seller===state.auth.address ? 2 : 4
    //     } else {
    //         flag = itemData.owner===state.auth.address ? 1 : 3
    //     }
    //     setPageFlag(flag)
    // }, [itemData, wallet.status])

    const readData = async () => {
        try {
            if (name) {
                const json = await getEnsDomainByName(name)
                setItemData(json as any)
                const label = name.slice(0, -4);
                const _tokenId = makeTokenId(label);
                const order = await storefront.getOrderByTokenId(_tokenId) as OrderData
                if (order.label==='') return
                setOrder({
                    id: Number(order.id),
                    label: order.assetId,
                    seller: order.seller,
                    assetId: order.assetId.toString(),
                    collection: order.collection,
                    token: order.token,
                    price: Number(ethers.utils.formatEther(order.price)),
                    expires: Number(order.expires),
                    timestamp: Number(order.timestamp),
                    bidder: order.bidder,
                    bidPrice: Number(ethers.utils.formatEther(order.bidPrice)),
                    dealPrice: Number(ethers.utils.formatEther(order.dealPrice)),
                })
                // const _orderId = Number(order.id)
                // // console.log("order", order)
                // if (_orderId) {
                //     setOrder(order)
                //     const bids = await storefront.getBidsByOrderId(_orderId, 0, 100) as BidData[]
                //     console.log("bids", bids[0])
                //     setBids(bids.map(i=>({
                //         id:         Number(i.id),
                //         assetId: 	i.assetId.toString(),
                //         bidder:     i.bidder,
                //         token:      tokens[i.token],
                //         price:      ethers.utils.formatEther(i.price),
                //         expires:    Number(i.expires),
                //         timestamp:  Number(i.timestamp)
                //     })).filter(i=>i.id!==0))
                // }
            }
        } catch (error) {
            console.log('readData', error)
        }
    }

    useEffect(() => {
        // const timer = setTimeout(getRemainTime, 1000 * 60 * 60)
        // return () => clearTimeout(timer)
        getRemainTime()
    }, [location.pathname])

    const getRemainTime = () => {
        if (!!order) {
            const countDownDate = order.expires * 1000;
            const now = new Date().getTime();
            const distance = countDownDate - now;
            if (distance < 0) {
                setStatus({...state, remainTime: 'End'})
                return
            }
            const day = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            // const minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            // const second = Math.floor((distance % (1000 * 60)) / 1000);
            setStatus({...status, remainTime: `${day} day, ${hour} hours`})
        }
	}

    useEffect(() => {
        readData()
    }, [])

    // useEffect(() => {
    //     if (order.name !== "")
    //         const now = currentTime()
    //         if (order.expiresAt > now)
    //             setInterval(() => {
    //                 // let endTime = moment(Number(order.expiresAt));
    //                 // let nowTime = moment(new Date());
    //                 // // test
    //                 // if (endTime < nowTime) setTimeFlag(true);
    //                 // else {
    //                 //     let ms = moment(endTime.diff(nowTime));
    //                 //     let bump = [] as any;
    //                 //     bump.push(Math.floor(moment.duration(ms as any).asHours() / 24));
    //                 //     bump.push(Math.floor(moment.duration(ms as any).asHours()) % 24);
    //                 //     bump.push(moment.utc(ms).format('mm'));
    //                 //     bump.push(moment.utc(ms).format('ss'));
    //                 //     setExpireTime(bump);
    //                 //     setTimeFlag(false);
    //                 // }
    //                 const remainTime = new Date(order.expiresAt * )
    //             }, 1000);
    // }, [itemData]);


    const handleBuy = async () => {
        // if (order.assetId!==itemData.tokenId) return
        // if (!state.signer) {
        //     wallet.connect();
        //     // navigate('/signPage');
        //     return;
        // }
        // try {
        //     setLoading(true);
        //     await buyNFT({
        //         nftAddress: order.collection,
        //         assetId: order.assetId,
        //         price: order.price,
        //         acceptedToken: order.token
        //     });
        //     // NotificationManager.success(translateLang('buynft_success'));
        //     toast(translateLang('buynft_success'), {position: "top-right", autoClose: 2000})
        //     setLoading(false);
        // } catch (err: any) {
        //     console.log(err.message);
        //     // NotificationManager.error(translateLang('buynft_error'));
        //     toast(translateLang('buynft_error'), {position: "top-right", autoClose: 2000})
        //     setLoading(false);
        // }
    };

    const handleApproveBid = async () => {
        // if (order.assetId!==itemData.tokenId) return
        // try {
        //     if (itemData !== null) {
        //         setLoading(true);

        //         await bidApprove({
        //             address: order.collection,
        //             id: order.assetId,
        //             price: order.price
        //         });
        //         // NotificationManager.success(translateLang('approve_succeess'));
        //         toast(translateLang('approve_succeess'), {position: "top-right", autoClose: 2000})
        //         setLoading(false);
        //     }
        // } catch (err: any) {
        //     console.log(err.message);
        //     setLoading(false);
        //     // NotificationManager.error(translateLang('approve_error'));
        //     toast(translateLang('approve_error'), {position: "top-right", autoClose: 2000})
        // }
    };

    const toAuction = () => {
        navigate(`/auction/${itemData.name}`);
    };

    const handleCancel = async () => {
        if (itemData !== null) {
            setLoading(true);
            try {
                await cancelOrder({
                    nftAddress: itemData.collection,
                    assetId: itemData.tokenId
                });
                // NotificationManager.success(translateLang('cancelorder_success'));
                toast(translateLang('cancelorder_success'), {position: "top-right", autoClose: 2000})

                setLoading(false);
            } catch (err: any) {
                console.log(err.message);
                // NotificationManager.error(translateLang('cancelorder_error'));
                toast(translateLang('cancelorder_error'), {position: "top-right", autoClose: 2000})
                setLoading(false);
            }
        }
    };

    const HandleLike = async () => {
        try {
            if (!state.auth.isAuth) {
                navigate('/');
                return;
            }
            const res = await Action.nft_like({
                collection: itemData.collection,
                tokenId: itemData.tokenId,
                currentAddress: state.auth.address
            })
            if (res) {
                console.log(res);
            }
        } catch (error) {
            console.log("HandleLike", error);
        }
    };

    return (
        <div>
            <section className="container domain-detail">
                {itemData === null ? (
                    'Loading...'
                ) : (
                    <>
                        <section className="page-content-area">
                            <div className="container">
                                {!!itemData.tokenId ? (
                                    <>
                                        <div className="row">
                                            <div className="col-lg-7">
                                                    <div className="imil-box rt-mb-30">
                                                        <div className="rt-box-style-2">
                                                            <h4 className="f-size-36 f-size-xs-30 rt-semiblod text-422">{itemData.name}</h4>  
                                                            <div onClick={HandleLike} className="like">
                                                                <i className="fa fa-heart"></i>
                                                                {'  '}
                                                                {itemData.likes?.length || 0}
                                                            </div> 
                                                            {/* <h5 className="f-size-18 rt-light3">is for sale</h5> */}
                                                        
                                                            <div>Network: Ethereum</div>
                                                            <div className="row rt-mt-50">
                                                                <div className="domain-border col-lg-4">
                                                                    <span className="d-block f-size-24 rt-semiblod">2 Months</span>
                                                                    <span className="d-block f-size-16 rt-light3">Age</span>
                                                                </div>
                                                                <div className="domain-border col-lg-4">
                                                                    <span className="d-block f-size-24 rt-semiblod">ENS Service</span>
                                                                    <span className="d-block f-size-16 rt-light3">Provider</span>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <span className="d-block f-size-24 rt-semiblod">{new Date((itemData.expires || 0) * 1000).toLocaleDateString()}</span>
                                                                    <span className="d-block f-size-16 rt-light3">Expires</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                
                                                    </div>
                                                    <div className="rt-box-style-2 rt-mb-30 rt-dorder-off">
                                                        <span className="f-size-18"><span className="rt-strong">Ads: </span>Do you want to post your advertisement here? Contact us!</span>
                                                    </div>
                                                    <div className="rt-box-style-2 rt-mb-30">
                                                        <div className="f-size-18 rt-light3 line-height-34" style={{display: 'flex', gap: '1em'}}>
                                                            <div>Seller:</div>
                                                            <div style={{display: 'flex', gap: '0.5em'}}>
                                                                {state.usersInfo[itemData.owner]?.image ? (
                                                                    <img
                                                                        className="lazy"
                                                                        src={state.usersInfo[itemData.owner].image}
                                                                        alt=""
                                                                        style={{width: 32, height: 32, borderRadius: '50%'}}
                                                                    />
                                                                ) : (
                                                                    <Jazzicon
                                                                        diameter={32}
                                                                        seed={Math.round(
                                                                            (Number(itemData.owner) /
                                                                                Number(
                                                                                    '0xffffffffffffffffffffffffffffffffffffffffff'
                                                                                )) *
                                                                                10000000
                                                                        )}
                                                                    />
                                                                )}
                                                                <div className="author_list_info">
                                                                    <span>{styledAddress(itemData.owner)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="col-lg-5">
                                                <div className="rt-box-style-3">
                                                    <div className="rt-gradient-2 text-center text-white rt-light3 f-size-28 f-size-xs-24 rt-pt-25 rt-pb-25">
                                                        {(pageFlag===1 || pageFlag===2) ? 'This is your domain' : (order.assetId===itemData.tokenId ? 'This domain is in auction' : 'This domain is not listed')}
                                                    </div>
                                                    <div className="rt-p-30">
                                                        {order.assetId===itemData.tokenId && (
                                                            <>
                                                                <div className="d-flex justify-content-between rt-mb-20">
                                                                    <span className="f-size-20 rt-light3">Current price:</span>
                                                                    <span className="rt-light3 amount"><span className="f-size-40 text-422"><span className="rt-semiblod">{order.price}</span></span><span className="f-size-24"> ETH</span></span>
                                                                </div>
                                                                <div className="d-flex justify-content-between rt-mb-20">
                                                                <span className="f-size-20 rt-light3">CNS fee:(in fixed) </span>
                                                                    <span className="f-size-20 rt-light3 ">{Number(order.price) * config.fee / 100} ETH ({config.fee}%)</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between rt-mb-20">
                                                                <span className="f-size-20 rt-light3">Total payment:(in fixed) </span>
                                                                    <span className="f-size-20 rt-light3 ">{Number(order.price) * (1 + config.fee / 100)} ETH</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between rt-mb-20">
                                                                    <span className="f-size-20 rt-light3 text-338">Remaining time:</span>
                                                                    <span className="f-size-20 rt-light3 text-eb7">{status.remainTime}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                        <div className="rt-form ">
                                                            {/* <input type="text" className="form-control pill rt-mb-15" placeholder="$ Enter bid amount (or Send Offer in fixed mode)" /> */}
                                                            {/* <button className="rt-btn rt-gradient pill d-block rt-mb-15">Connect Wallet</button> */}
                                                            {pageFlag===1 && (
                                                                <>
                                                                    <button className="rt-btn rt-gradient pill d-block rt-mb-15" onClick={toAuction}>Sell Your Domain</button>
                                                                </>
                                                            )}
                                                            {pageFlag===2 && (
                                                                <>
                                                                    <button className="rt-btn rt-gradient pill d-block rt-mb-15" onClick={toAuction}>Edit Your Listing</button>
                                                                    <button className="rt-btn rt-gradient pill d-block rt-mb-15" onClick={()=>setStatus({...state, showEdit: true})}>Cancel Your Listing</button>
                                                                </>
                                                            )}
                                                            {pageFlag===3 && (
                                                                <>
                                                                    <button disabled className="rt-btn rt-outline-gradientL pill d-block rt-mb-15">Edit/Cancel Your Listing</button>
                                                                    <button disabled className="rt-btn rt-outline-gradientL pill d-block rt-mb-15">Place Bid (in auction mode)</button>
                                                                    <button disabled className="rt-btn rt-outline-gradientL pill d-block rt-mb-15">Sell Your Domain</button>
                                                                </>
                                                            )}
                                                            {pageFlag===4 && (
                                                                <>
                                                                    <input type="number" className="form-control pill rt-mb-15" placeholder="$ Enter bid amount" value={status.bidPrice} onChange={e=>setStatus({...status, bidPrice: Number(e.target.value)})} />
                                                                    <button className="rt-btn rt-gradient pill d-block rt-mb-15" onClick={handleApproveBid}>Place Bid (in auction mode)</button>
                                                                    {/* <button className="rt-btn rt-gradient pill d-block rt-mb-15">Buy it now for 1.575 ETH (in fixed mode)</button> */}
                                                                    {/* <button className="rt-btn rt-outline-gradientL pill d-block rt-mb-15">Send offer (in fixed mode)</button> */}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="spacer-10"></div>
                                        <p style={{ fontSize: '20px' }}>Bid</p>
                                        <hr />
                                        <div className='rt-box-style-2 rt-mb-30'>
                                            <div>{order.bidder}</div>
                                            <div>{order.bidPrice}</div>
                                            <div>{order.bidder}</div>
                                        </div>
                                        {/* <div className="spacer-20"></div>
                                            <div className="de_tab_content">
                                                <div className="tab-1 onStep fadeIn">
                                                    {[order.bi].map((i: any, index: any) => (
                                                            <>
                                                                <div className="p_list">
                                                                    <div className="p_list_pp">
                                                                        <span>
                                                                            {state.usersInfo[i.bidder]?.image ? (
                                                                                <img className="lazy" src={state.usersInfo[i.bidder]?.image} alt="" />
                                                                            ) : (
                                                                                <Jazzicon diameter={100}
                                                                                    seed={Math.round((Number(i.bidder) / Number('0xffffffffffffffffffffffffffffffffffffffffff')) *10000000)}
                                                                                />
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div className="p_list_info">
                                                                        <b>
                                                                            {index}
                                                                        </b>{' '}
                                                                        {translateLang(
                                                                            'bid'
                                                                        )}
                                                                        {translateLang(
                                                                            'by'
                                                                        )}{' '}
                                                                        <b>
                                                                            {styledAddress(i.bidder)}
                                                                        </b>{' '}
                                                                        {translateLang(
                                                                            'at'
                                                                        )}{' '}
                                                                        <b>
                                                                            {i.timestamp? moment(Number(i.timestamp)).format('lll'): ''}
                                                                        </b>
                                                                    </div>
                                                                    {index === 0 /* && itemData.marketData?.seller === state.auth.address ? (
                                                                        loading ? (
                                                                            <button className="btn-main round-button">
                                                                                <span
                                                                                    className="spinner-border spinner-border-sm"
                                                                                    aria-hidden="true"></span>
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn-main round-button"
                                                                                onClick={
                                                                                    handleApproveBid
                                                                                }>
                                                                                {translateLang(
                                                                                    'btn_approvebid'
                                                                                )}
                                                                            </button>
                                                                        )
                                                                    ) : null}
                                                                </div>
                                                                <div className="spacer-10"></div>
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div> */}
                                    </>
                                ) : (
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-8 mx-auto text-center wow fade-in-bottom" data-wow-duration="1s">
                                            <h2 className="rt-section-title">
                                                Not Found
                                            </h2>
                                            <p className="rt-mb-0 rt-light3 line-height-34 section-paragraph">
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                            {/* <div>
                                {itemData === null ? (
                                    'Loading...'
                                ) : (
                                    <div className="mainside">
                                        {pageFlag === 1 ? (
                                            <div className="attribute">
                                                <button
                                                    className="btn-main round-button"
                                                    onClick={handleSell}>
                                                    {translateLang('btn_sell')}
                                                </button>
                                            </div>
                                        ) : pageFlag === 2 ? (
                                            <div>
                                                {loading ? (
                                                    <button className="btn-main round-button">
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            aria-hidden="true"></span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-main round-button"
                                                        onClick={handleCancel}>
                                                        {translateLang('btn_cancel')}
                                                    </button>
                                                )}
                                            </div>
                                        ) : pageFlag === 3 ? null : (
                                            <div>
                                                {loading ? (
                                                    <button className="btn-main round-button">
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            aria-hidden="true"></span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-main round-button"
                                                        onClick={handleBuy}>
                                                        {translateLang('btn_buynow')}
                                                    </button>
                                                )}
                                                {loading ? (
                                                    <button className="btn-main round-button">
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            aria-hidden="true"></span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-main round-button"
                                                        onClick={() => setModalShow(true)}>
                                                        {translateLang('btn_makeoffer')}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div> */}
                        </div>
                            {/* <BuyModal show={modalShow} setShow={setModalShow} correctItem={itemData} /> */}
                            {status.showEdit && (
                                <Dialog onClose={()=>setStatus({...state, showEdit: false})}>
                                    <div className='d column gap'>
                                        <div style={{fontSize: '20px',textAlign: 'center'}}>Are you sure you want to cancel this transaction?</div>
                                        <div className='d center middle gap'>
                                            <button className="rt-btn rt-gradient pill d-block rt-mb-15" onClick={()=>setStatus({...state, showEdit: false})}>Cancel</button>
                                            <button className="rt-btn rt-gradient pill d-block rt-mb-15" onClick={handleCancel}>OK</button>
                                        </div>
                                    </div>
                                </Dialog>
                            )}
                        </section>
                    </>
                )}
            </section>
        </div>
    );
}
