import React, { useState, useMemo, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import { FaCog, FaShareAlt, FaTwitter, FaFacebook, FaCopy } from 'react-icons/fa';

import MyNFT from '../components/mynfts';
import SaledNFTs from '../components/salednft';
import Acitivity from './Activity';
import Footer from '../menu/footer';
import { createGlobalStyle } from 'styled-components';
import Jazzicon from 'react-jazzicon';
import { useBlockchainContext } from '../../context';
import { copyToClipboard } from '../../utils';
import Pager from '../components/Pager';
import Action from '../../service';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: "#212428";
  }
`;

export default function Author() {
    const { address } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [state] = useBlockchainContext() as any;
    const [openMenu, setOpenMenu] = useState('forsale');
    const [openShare, setOpenShare] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Copy');
    const [ownFlag, setOwnFlag] = useState(false);
    const [nfts, setNfts] = useState<Array<NFTData>>([])
    const [status, setStatus] = useState({
        limit: 10,
		page: 0,
        total: 0
    })

    const onPage = (page: number) => {
		setStatus({...status, page})
	}

    const readNfts = async () => {
        const formData = new FormData();
        formData.append('p', String(status.page + 1));
        formData.append('address', state.auth.address);
        // formData.append('query', );

        const response = await Action.user_nfts(formData);
        if (response.success) {
            let _data = [] as Array<NFTData>
            if (response.data?.length > 0) {
                response.data.map((i: any ,k: any) => _data.push(i))
            }
            setNfts([..._data])
            setStatus({...status, total: response.meta.total})
        } else {
            console.log("readNftsError")
        }
        return
    }

    React.useEffect(() => {
        readNfts()
    }, [state.page])

    useLayoutEffect(() => {
        if (address === state.auth.address) setOwnFlag(true);
        else setOwnFlag(false);
    }, [address, state.auth.address]);

    const activitiesData = useMemo(() => {
        return state.activities.filter((item: any) => {
            if (item.userAddress === address) {
                return item;
            }
        });
    }, [address, state.activities]);

    const HandleCopy = () => {
        copyToClipboard(process.env.REACT_APP_DOMAIN + location.pathname)
            .then((res) => {
                console.log('copied');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const HandleAddressCopy = () => {
        copyToClipboard(address)
            .then((res) => {
                setCopyStatus('Copied');

                setTimeout(() => {
                    setCopyStatus('Copy');
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            {/* <GlobalStyles />

            <div className="profile_image">
                {state.usersInfo[address || '']?.bannerImage ? (
                    <img src={state.usersInfo[address || '']?.bannerImage} alt="" />
                ) : (
                    <>
                        <img
                            src="img/background/bg-shape-1.png"
                            alt=""
                            style={{
                                backgroundColor: `rgb(${
                                    Math.round(
                                        (Number(address || '') /
                                            Number(
                                                '0xffffffffffffffffffffffffffffffffffffffffff'
                                            )) *
                                            1000000
                                    ) % 255
                                }, ${
                                    Math.round(
                                        (Number(address || '') /
                                            Number(
                                                '0xffffffffffffffffffffffffffffffffffffffffff'
                                            )) *
                                            1000000
                                    ) % 200
                                }, ${
                                    Math.round(
                                        (Number(address || '') /
                                            Number(
                                                '0xffffffffffffffffffffffffffffffffffffffffff'
                                            )) *
                                            1000000
                                    ) % 150
                                })`
                            }}
                        />
                    </>
                )}
                <div>
                    {state.usersInfo[address || '']?.image ? (
                        <img src={state.usersInfo[address || '']?.image || ''} alt="" />
                    ) : (
                        <Jazzicon
                            diameter={100}
                            seed={Math.round(
                                (Number(address || '') /
                                    Number('0xffffffffffffffffffffffffffffffffffffffffff')) *
                                    10000000
                            )}
                        />
                    )}
                </div>
            </div>
            <div className="container">
                <div className="spacer-40"></div>
                <div className="profile_name">
                    <div>
                        <h2>{state.usersInfo[address || '']?.name || 'unknown'}</h2>
                        <div
                            onBlur={() =>
                                setTimeout(() => {
                                    setOpenShare(false);
                                }, 100)
                            }>
                            <button onClick={() => setOpenShare(!openShare)}>
                                <FaShareAlt />
                            </button>
                            {ownFlag && (
                                <button onClick={() => navigate('/account/profile')}>
                                    <FaCog />
                                </button>
                            )}
                            {openShare && (
                                <div>
                                    <span>
                                        <span onClick={HandleCopy}>
                                            <FaCopy />
                                            <p>Copy Link</p>
                                        </span>
                                        {state.usersInfo[address || '']?.link2 && (
                                            <a href={state.usersInfo[address || '']?.link2}>
                                                <FaFacebook />
                                                <p>Share on Facebook</p>
                                            </a>
                                        )}
                                        {state.usersInfo[address || '']?.link1 && (
                                            <a href={state.usersInfo[address || '']?.link1}>
                                                <FaTwitter />
                                                <p>Share on Twitter</p>
                                            </a>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="profile_wallet">
                        <div onClick={HandleAddressCopy}>
                            <span>{copyStatus}</span>
                            {(address || '').slice(0, 6) + '...' + (address || '').slice(-4)}
                        </div>
                    </span>
                    <span className="profile_username">
                        {state.usersInfo[address || '']?.bio === '' ? '' : state.usersInfo[address || '']?.bio}
                    </span>
                </div>
                <div className="spacer-20"></div>
            </div>

            <section className="container no-top">
                <Tabs
                    activeKey={openMenu}
                    onSelect={(k) => {
                        setOpenMenu(k || '');
                    }}
                    className="mb-3">
                    <Tab eventKey="forsale" title="For sale">
                        <div className="spacer-20"></div>
                        <div id="zero0" className="onStep fadeIn">
                            <SaledNFTs address={address || ''} />
                        </div>
                    </Tab>
                    <Tab eventKey="collected" title="Collected">
                        <div className="spacer-20"></div>
                        <div id="zero1" className="onStep fadeIn">
                            <MyNFT address={address || ''} />
                        </div>
                    </Tab>
                    <Tab eventKey="activity" title="Activity">
                        <div className="spacer-20"></div>
                        <div id="zero2" className="onStep fadeIn">
                            {activitiesData.length > 0 ? (
                                <Acitivity activitiesData={activitiesData} />
                            ) : (
                                <h1 style={{ textAlign: 'center', padding: '73px' }}>No Data</h1>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </section> */}
            
            <section className="page-content-area">
                <div className="container">
                    <div className="rt-spacer-40"></div>
                    <div className="row align-items-center justify-content-center">
                        <div className="col-10">
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade-in-bottom show active" id="rt-tab-1" role="tabpanel"
                                    aria-labelledby="rt-tab-1-tab">
                                    <div className="table-responsive">
                                        {
                                            nfts.length!==0? (
                                                <table className="table domain-table">
                                                    <thead>
                                                        <tr className="rt-light-gray">
                                                            <th className="text-323639 rt-strong f-size-18">Domain</th>
                                                            <th className="text-323639 rt-strong f-size-18">Price</th>
                                                            <th className="text-323639 rt-strong f-size-18">Expire Date</th>
                                                            <th className="text-323639 rt-strong f-size-18 text-right"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            nfts.map((i: NFTData, k) => (
                                                                <tr onClick={()=>navigate(`/domain/${i.name}`)}>
                                                                    <th className="f-size-18 f-size-md-18 rt-semiblod text-234">{i.name}</th>
                                                                    <td className="f-size-18 f-size-md-18 rt-semiblod text-605">{i.attributes?.cost}</td>
                                                                    <td className="f-size-18 f-size-md-18 rt-semiblod text-338">{new Date((i.attributes?.expiryDate || 0) * 1000).toLocaleDateString()}</td>
                                                                    <td className="text-right"><a href="#" className="rt-btn rt-gradient2 rt-sm4 pill">List it now!</a></td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className='text-323639 rt-strong f-size-30'>No domains</div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    status.total > 1 && (
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '2em'}}>
                            <Pager page={status.page} total={status.total} onChange={page=>onPage(page)} />
                        </div>
                    )
                }
            </section>
        </div>
    );
}
