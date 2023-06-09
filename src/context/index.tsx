import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { ethers } from 'ethers';
// import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import {
    // getNFTContract,
    // getTokenContract,
    // marketplaceContract,
    // storeFontContract,
    provider
} from '../contracts';
import { toBigNum } from '../utils';
// import {
//     GET_ALLNFTS,
//     GET_USERSINFO,
//     GET_COLLECTIONNFTS,
//     GET_ORDER,
//     GET_ACTIVITIES
// } from '../components/gql';
import addresses from '../contracts/contracts/addresses.json';
import Action from '../service';

import { translations } from '../components/language/translate';
import { useWallet } from '../use-wallet/src';

const BlockchainContext = createContext({});

export function useBlockchainContext() {
    return useContext(BlockchainContext);
}

function reducer(state: any, { type, payload }: {type: any, payload: any}) {
    return {
        ...state,
        [type]: payload
    };
}

// const Currency = [
//     {
//         label: 'ETH',
//         value: addresses.WETH
//     },
//     {
//         label: 'USDT',
//         value: addresses.TestToken
//     }
// ];

const INIT_STATE = {
    allNFT: [],
    collectionNFT: [],
    orderList: [],
    activities: [],
    usersInfo: {},
    provider: provider,
    auth: {
        isAuth: false,
        user: '',
        address: '',
        bio: '',
        image: '',
        bannerImage: ''
    },
    lang: 'en',
    // currencies: Currency,
    addresses: addresses,
    search: '',
    loading: ''
};

export default function Provider({ children }: {children: any}) {
    // const location = useLocation();
    const [state, dispatch] = useReducer(reducer, INIT_STATE);
    const wallet = useWallet();

    useEffect(() => {
        (async () => {
            if (wallet.status === 'connected') {
                const provider = new ethers.providers.Web3Provider(wallet.ethereum);
                const signer = provider.getSigner();
                dispatch({
                    type: 'signer',
                    payload: signer
                });
                dispatch({
                    type: 'address',
                    payload: wallet.account
                });
                dispatch({
                    type: 'provider',
                    payload: provider
                });

                // const result = await Action.user_login(wallet.account);
                // updateAuth(result);
            } else if (wallet.status === 'error') {
                dispatch({
                    type: 'signer',
                    payload: null
                });
            } else {
                dispatch({
                    type: 'auth',
                    payload: {
                        isAuth: false,
                        name: '',
                        email: '',
                        bio: '',
                        address: '',
                        image: '',
                        bannerImage: '',
                        link1: '',
                        link2: ''
                    }
                });

                dispatch({
                    type: 'signer',
                    payload: null
                });
            }
        })();
    }, [wallet.status]);

    /** Begin GraphQL Query */
    // const {
    //     data: nftsData,
    //     loading: nftsLoading,
    //     error: nftsError
    // } = useQuery(GET_ALLNFTS, {
    //     pollInterval: 1000
    // });

    // const {
    //     data: nftsCollectionData,
    //     loading: nftsCollectionLoading,
    //     error: nftsCollectionError
    // } = useQuery(GET_COLLECTIONNFTS, {
    //     pollInterval: 1000
    // });

    // const {
    //     data: usersData,
    //     loading: usersLoading,
    //     error: usersError
    // } = useQuery(GET_USERSINFO, {
    //     pollInterval: 1000
    // });

    // const {
    //     data: orderData,
    //     loading: orderLoading,
    //     error: orderError
    // } = useQuery(GET_ORDER, {
    //     pollInterval: 1000
    // });

    // const {
    //     data: activityData,
    //     loading: activityLoading,
    //     error: activityError
    // } = useQuery(GET_ACTIVITIES, {
    //     pollInterval: 1000
    // });
    /** End GraphQL Query */

    // useEffect(() => {
    //     if (nftsLoading || nftsError) {
    //         return;
    //     }
    //     dispatch({
    //         type: 'allNFT',
    //         payload: nftsData.getAllNFTs
    //     });
    // }, [nftsData, nftsLoading, nftsError]);

    // useEffect(() => {
    //     if (nftsCollectionLoading || nftsCollectionError) {
    //         return;
    //     }
    //     dispatch({
    //         type: 'collectionNFT',
    //         payload: nftsCollectionData.getCollectionNFTs
    //     });
    // }, [nftsCollectionData, nftsCollectionLoading, nftsCollectionError]);

    // useEffect(() => {
    //     if (usersLoading || usersError) {
    //         return;
    //     }
    //     let bump = {};
    //     for (let i = 0; i < usersData?.getUsersInfo?.length; i++) {
    //         bump = {
    //             ...bump,
    //             [usersData.getUsersInfo[i].address]: usersData.getUsersInfo[i]
    //         };
    //     }
    //     dispatch({
    //         type: 'usersInfo',
    //         payload: bump
    //     });
    // }, [usersData, usersLoading, usersError]);

    // useEffect(() => {
    //     if (orderLoading || orderError) {
    //         return;
    //     }
    //     dispatch({
    //         type: 'orderList',
    //         payload: orderData.getOrder
    //     });
    // }, [orderData, orderLoading, orderError]);

    // useEffect(() => {
    //     if (activityLoading || activityError) {
    //         return;
    //     }

    //     dispatch({
    //         type: 'activities',
    //         payload: activityData.getActivity
    //     });
    // }, [activityData, activityLoading, activityError]);

    // set language
    const setLanguage = (props: any) => {
        const { newLang } = props;
        dispatch({
            type: 'lang',
            payload: newLang
        });

        localStorage.setItem('lang', newLang);
    };

    const setSearch = (props: any) => {
        const {search} = props as {search: string}
        dispatch({
            type: 'search',
            payload: {
                search
            }
        })
        localStorage.setItem('search', search);
    }
    
    const setLoading = (props: any) => {
        
        const {loading} = props as {loading: string}
        dispatch({
            type: 'loading',
            payload: loading ? {loading} : null
        })
        localStorage.setItem('loading', loading);
    }

    const translateLang = (txt: any) => {
        return (translations as any)[state.lang][txt];
    };

    // auth
    const updateAuth = (data: any) => {
        dispatch({
            type: 'auth',
            payload: {
                isAuth: true,
                name: data.name,
                email: data.email,
                bio: data.bio,
                address: wallet.account,
                image: data.image,
                bannerImage: data.bannerImage,
                link1: data.link1,
                link2: data.link2
            }
        });

        // const origin = location.state?.from?.pathname || '/';
        // navigate(origin);
    };

    // show method
    // const getCurrency = (tokenaddress = '') => {
    //     try {
    //         let currency = state.currencies.filter(
    //             (c: any) => c.value.toLowerCase() === tokenaddress.toLowerCase()
    //         );
    //         if (currency.length === 0) {
    //             throw new Error('unsupported currency');
    //         }
    //         return currency[0];
    //     } catch (err) {
    //         return {
    //             label: 'Invalid Currency',
    //             value: 'Unknown'
    //         };
    //     }
    // };

    // /* ------------ NFT Section ------------- */
    // const mintNFT = async (url: any, collection: any) => {
    //    try {
    //         const NFTContract1 = getNFTContract(collection);
    //         // const provider = new ethers.providers.Web3Provider(window.ethereum)
    //         // const signer = provider.getSigner();
    //         const signedNFTContract1 = NFTContract1.connect(state.signer);
    //         const tx = await signedNFTContract1.mint(url);
    //         await tx.wait();
    //         const _tx = await signedNFTContract1.getMetadatas()
    //         await _tx.wait()
    //         console.log("tokenuri tx", _tx)
    //    } catch (err) {
    //         console.log("mintNFT", err)
    //    }
    // };

    // // NFT on sale
    // const onsaleNFT = async (props: any) => {
    //     try {
    //         const { nftAddress, assetId, name, currency, price, expiresAt } = props;

    //         // const signedMarketplaceContract = marketplaceContract.connect(state.signer);
    //         // const provider = new ethers.providers.Web3Provider(window.ethereum)
    //         // const signer = provider.getSigner();
    //         const tx = await marketplaceContract.createOrder(
    //             nftAddress,
    //             state.auth.address,
    //             assetId,
    //             currency,
    //             toBigNum(price, 18),
    //             expiresAt
    //         );
    //         await tx.wait();

    //         return true;
    //     } catch (err) {
    //         console.log(err);
    //         return false;
    //     }
    // };

    // const approveNFT = async (props: any) => {
    //     try {
    //         const { assetId, nftAddress } = props;


    //         const NFTContract = getNFTContract(nftAddress);
    //         // const signedNFTContract1 = NFTContract.connect(wallet.account || '');
    //         // console.log("approve", wallet.account)
    //         // const args = [addresses.Marketplace, assetId]
    //         // const estimatedGas = await signedNFTContract1.estimateGas.method(args)
    //         const tx = await NFTContract.approve(addresses.Marketplace, assetId/* , { gasLimit: Number(estimatedGas) * 1.5 } */)
    //         await tx.wait();

    //         return true;
    //     } catch (err) {
    //         console.log(err);
    //         return false;
    //     }
    // };

    // const checkNFTApprove = async (props: any) => {
    //     try {
    //         const { assetId, nftAddress } = props;

    //         const NFTContract = getNFTContract(nftAddress);
    //         const signedNFTContract1 = NFTContract.connect(state.signer);

    //         const owner = await signedNFTContract1.getApproved(assetId);

    //         if (addresses.Marketplace === owner) return true;
    //         else return false;
    //     } catch (err) {
    //         console.log(err);
    //         return false;
    //     }
    // };

    // // on sale lazy nfts
    // const onsaleLazyNFT = async (props: any) => {
    //     const { tokenId, priceGwei, currency, expiresAt, singature } = props;
    //     const signedLazyContract = storeFontContract.connect(state.signer);

    //     const tx = await signedLazyContract.mintAndOnsale(
    //         tokenId,
    //         addresses.Marketplace,
    //         currency,
    //         priceGwei,
    //         expiresAt,
    //         singature
    //     );
    //     await tx.wait();

    //     return true;
    // };

    // const cancelOrder = async (props: any) => {
    //     const { nftAddress, assetId } = props;

    //     const signedMarketplaceContract = marketplaceContract.connect(state.signer);
    //     const tx = await signedMarketplaceContract.cancelOrder(nftAddress, assetId);
    //     await tx.wait();
    // };

    // // NFT buy and bid
    // const buyNFT = async (props: any) => {
    //     const { nftAddress, assetId, price, acceptedToken } = props;

    //     const signedMarketplaceContract = marketplaceContract.connect(state.signer);
    //     if (acceptedToken.toLowerCase() === state.currencies[0].value.toLowerCase()) {
    //         //native coin
    //         const tx = await signedMarketplaceContract.ExecuteOrder(
    //             nftAddress,
    //             assetId,
    //             toBigNum(price, 18),
    //             { value: toBigNum(price, 18) }
    //         );
    //         await tx.wait();
    //     } else {
    //         //ERC20
    //         var token = getTokenContract(acceptedToken);
    //         const signedTokenContract = token.connect(state.signer);
    //         const tx1 = await signedTokenContract.approve(
    //             addresses.Marketplace,
    //             toBigNum(price, 18)
    //         );
    //         await tx1.wait();

    //         const tx = await signedMarketplaceContract.ExecuteOrder(
    //             nftAddress,
    //             assetId,
    //             toBigNum(price, 18)
    //         );
    //         await tx.wait();
    //     }
    // };

    // const bidNFT = async (props: any) => {
    //     const { nftAddress, assetId, price, expiresAt, acceptedToken } = props;

    //     const signedMarketplaceContract = marketplaceContract.connect(state.signer);
    //     if (acceptedToken.toLowerCase() === state.currencies[0].value.toLowerCase()) {
    //         //native coin
    //         const tx = await signedMarketplaceContract.createOffer(
    //             nftAddress,
    //             assetId,
    //             toBigNum(price, 18),
    //             expiresAt,
    //             { value: toBigNum(price, 18) }
    //         );
    //         await tx.wait();
    //     } else {
    //         //ERC20
    //         var token = getTokenContract(acceptedToken);
    //         const signedTokenContract = token.connect(state.signer);
    //         const tx1 = await signedTokenContract.approve(
    //             addresses.Marketplace,
    //             toBigNum(price, 18)
    //         );
    //         await tx1.wait();

    //         const tx = await signedMarketplaceContract.createOffer(
    //             nftAddress,
    //             assetId,
    //             toBigNum(price, 18),
    //             expiresAt
    //         );
    //         await tx.wait();
    //     }
    // };

    // const bidApprove = async (props: any) => {
    //     const { address, id, price } = props;

    //     const signedMarketplaceContract = marketplaceContract.connect(state.signer);
    //     const tx = await signedMarketplaceContract.acceptOffer(address, id, toBigNum(price, 18));
    //     await tx.wait();

    //     return true;
    // };

    return (
        <BlockchainContext.Provider
            value={useMemo(
                () => [
                    state,
                    {
                        dispatch,
                        // mintNFT,
                        // onsaleNFT,
                        // onsaleLazyNFT,
                        // cancelOrder,
                        // buyNFT,
                        // bidNFT,
                        // bidApprove,
                        // updateAuth,
                        setLanguage,
                        translateLang,
                        setSearch,
                        setLoading,
                        // approveNFT,
                        // getCurrency,
                        // checkNFTApprove
                    }
                ],
                [
                    state,
                    dispatch,
                    // mintNFT,
                    // onsaleNFT,
                    // onsaleLazyNFT,
                    // cancelOrder,
                    // buyNFT,
                    // bidNFT,
                    // bidApprove,
                    // updateAuth,
                    setLanguage,
                    translateLang,
                    // approveNFT,
                    // getCurrency,
                    // checkNFTApprove
                ]
            )}>
            {children}
        </BlockchainContext.Provider>
    );
}
